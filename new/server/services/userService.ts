import { H3Event } from 'h3';

import { Provider } from '~/types/auth/user/provider';
import { DatabaseService } from '~~/server/services/databaseService';
import { IRegisteredUser, ISecureSessionData, ILinkableUserProviderData} from '#auth-utils';

import { useTypeValidator } from '~/app/composables/useTypeValidator';

export class UserService {
    private db: DatabaseService;
    private static instance: UserService;
    private validator = useTypeValidator();

    private constructor() {
        this.db = DatabaseService.getInstance();
    }

    static getInstance(): UserService {
        if (!UserService.instance) {
        UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    private queries = {
        getProviderUser: {
        byEmail: `
            SELECT 
            u.id,
            u.username,
            u.picture,
            up.provider_email,
            up.provider_verified
            FROM private.users u
            INNER JOIN private.user_providers up ON u.id = up.user_id
            WHERE up.provider = $1 
            AND up.provider_email = $2;
        `,
        byProviderId: `
            SELECT 
            u.id,
            u.username,
            u.picture,
            up.provider_email,
            up.provider_verified
            FROM private.users u
            INNER JOIN private.user_providers up ON u.id = up.user_id
            WHERE up.provider = $1 
            AND up.provider_id = $2;
        `
        },
        getUsersProvidersByEmail: `
            WITH user_provider_counts AS (
                SELECT 
                u.username,
                u.picture,
                up.user_id,
                COUNT(*) as provider_count,
                array_agg(jsonb_build_object(
                    'provider', up.provider,
                    'provider_id', up.provider_id
                )) as providers
                FROM private.user_providers up
                JOIN private.users u ON u.id = up.user_id
                WHERE up.user_id IN (
                SELECT DISTINCT user_id
                FROM private.user_providers
                WHERE provider_email = $1
                )
                GROUP BY up.user_id, u.username, u.picture
            )
            SELECT 
                username,
                picture,
                provider_count,
                providers
            FROM user_provider_counts
            ORDER BY username
        `,
        updateProviderEmail: `
            UPDATE private.user_providers
            SET provider_email = $1,
                provider_verified = $2
            WHERE provider = $3
            AND provider_id = $4
        `
    };

    async getProviderUser(
        provider: Provider,
        provider_id: string | null,
        provider_email?: string
    ): Promise<IRegisteredUser & ISecureSessionData | null> {
        if (!provider || (!provider_id && !provider_email)) {
            throw createError({
                statusCode: 400,
                message: 'Provider and either provider_id or provider_email are required'
            });
        }

        if (!Object.values(Provider).includes(provider)) {
            throw createError({
                statusCode: 400,
                message: `Invalid provider: ${provider}`
            });
        }

        try {
            const query = provider_email || provider_id === null
                ? this.queries.getProviderUser.byEmail
                : this.queries.getProviderUser.byProviderId;

            const values = provider_email || provider_id === null
                ? [provider, provider_email]
                : [provider, provider_id];

            const result = await this.db.query(query, values);

            if (result.rows.length === 0) {
                throw createError({
                    statusCode: 404,
                    message: 'User not found'
                });
            }

            return this.mapToRegisteredUser(result.rows[0], provider, provider_id);
        }
        catch (error: any) {
            if (error.statusCode) throw error;
            
            throw createError({
                statusCode: 500,
                message: 'Failed to get provider user'
            });
        }
    }

    async getUsersProvidersByEmail(
        email: string
    ): Promise<ILinkableUserProviderData[] | null> {
        try {
            const result = await this.db.query(
                this.queries.getUsersProvidersByEmail,
                [email]
            );

            if (result.rows.length === 0) return null;

            return this.mapToLinkableUserProviderData(result.rows);
        }
        catch (error) {
            throw createError({
                statusCode: 500,
                message: 'Failed to get users providers by email'
            });
        }
    }

    async updateProviderEmail(
        provider: Provider,
        provider_id: string,
        new_email: string,
        new_provider_verified_status: boolean
    ): Promise<boolean> {
        this.validateUpdateProviderEmailInput(provider, provider_id, new_email);

        try {
            await this.db.query(
                this.queries.updateProviderEmail,
                [new_email, new_provider_verified_status, provider, provider_id]
            );

            return true;
        }
        catch (error) {
            throw createError({
                statusCode: 500,
                message: 'Failed to update provider email'
            });
        }
    }

    private mapToRegisteredUser(
        row: any,
        provider: Provider,
        provider_id: string | null
    ): IRegisteredUser & ISecureSessionData {
        return {
            id: row.id,
            username: row.username,
            provider: provider,
            provider_id: provider_id,
            provider_email: row.provider_email,
            picture: row.picture,
            provider_verified: row.provider_verified
        };
    }

    private mapToLinkableUserProviderData(rows: any[]): ILinkableUserProviderData[] {
        const validUsers: ILinkableUserProviderData[] = [];
        
        for (const row of rows) {
            if (row.provider_count === 1 || row.provider_count === '1') {
                validUsers.push({
                    username: row.username,
                    picture: row.picture,
                    user_id: row.user_id,
                    providers: row.providers.map((p: any) => ({
                        provider: p.provider as Provider,
                        provider_id: p.provider_id
                    }))
                });
            }
        }

        return validUsers.length > 0 ? validUsers : [];
    }

    private validateUpdateProviderEmailInput(
        provider: Provider,
        provider_id: string,
        new_email: string
      ): void {
        try {
            this.validator.validateString(provider, 'provider');
            if (!Object.values(Provider).includes(provider as Provider)) {
                throw createError({
                    statusCode: 400,
                    message: `Invalid provider type: ${provider}`
                });
            }

            this.validator.validateString(provider_id, 'provider_id');

            const email = this.validator.validateString(new_email, 'email');
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw createError({
                    statusCode: 400,
                    message: 'Invalid email format'
                });
            }
        }
        catch (error: any) {
            if (error.statusCode) throw error;
            
            throw createError({
                statusCode: 400,
                message: 'Validation failed'
            });
        }
    }
}