import pg from 'pg';
// import { SQL_SCHEMA } from './database.schema';

export class DatabaseService {
    private static instance: DatabaseService;
    private pool: pg.Pool | null = null;

    private constructor() {} // Private constructor for singleton

    static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }

        return DatabaseService.instance;
    }

    private getPool(): pg.Pool {
        if (!this.pool) {
            const config = useRuntimeConfig();
            this.pool = new pg.Pool({
                connectionString: config.databaseConnectionString,
                ssl: {
                    rejectUnauthorized: false
                }
            });
        }
        return this.pool;
    }

    async initialise(): Promise<void> {
        try {
            await this.testConnection();
            await this.createTablesIfNotExist();
        }
        catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    async testConnection(): Promise<void> {
        const client = await this.getPool().connect();

        try {
            console.log('Connected to the database');
        }
        finally {
            client.release();
        }
    }

    async query(sql: string, params?: any[]) {
        const client = await this.getPool().connect();
        try {
            return await client.query(sql, params);
        }
        finally {
            client.release();
        }
    }

    async transaction<T>(callback: (client: pg.PoolClient) => Promise<T>): Promise<T> {
        const client = await this.getPool().connect();

        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }

    private async createTablesIfNotExist(): Promise<void> {
        await this.transaction(async (client) => {
        // Create UUID extension
            await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

            // Create UUID v7 function
            await client.query(SQL_SCHEMA.UUID_V7_FUNCTION);

            // Create tables
            await client.query(SQL_SCHEMA.CREATE_TABLES);

            console.log('Tables created or already exist');
        });
    }
}

export const SQL_SCHEMA = {
    UUID_V7_FUNCTION: `
        create or replace function uuid_generate_v7()
        returns uuid
        as $$
        begin
            return encode(
            set_bit(
                set_bit(
                    overlay(uuid_send(gen_random_uuid())
                        placing substring(int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint) from 3)
                        from 1 for 6
                    ),
                    52, 1
                ),
                53, 1
            ),
            'hex')::uuid;
        end
        $$
        language plpgsql
        volatile;
    `,
  
    CREATE_TABLES: `
        CREATE TABLE IF NOT EXISTS private.users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
            username TEXT NOT NULL,
            picture TEXT,
            current_session_version UUID DEFAULT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            CONSTRAINT users_username_key
                UNIQUE (username)
        );
            
        CREATE TABLE IF NOT EXISTS private.user_providers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
            user_id UUID NOT NULL,
            provider TEXT NOT NULL,
            provider_id TEXT DEFAULT NULL,
            provider_email TEXT NOT NULL,
            password TEXT DEFAULT NULL,
            provider_verified BOOLEAN DEFAULT FALSE,
            is_primary BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            CONSTRAINT fk_user
                FOREIGN KEY (user_id)
                REFERENCES private.users(id)
                ON DELETE CASCADE,
            CONSTRAINT user_providers_provider_provider_id_key
                UNIQUE (provider, provider_id),
            -- Ensure only one primary provider per user
            CONSTRAINT one_primary_per_user
                EXCLUDE USING btree (user_id WITH =)
                WHERE (is_primary = true)
        );

        CREATE TABLE IF NOT EXISTS private.otp_tokens (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
            email TEXT NOT NULL,
            otp TEXT NOT NULL,
            purpose TEXT NOT NULL,
            verification_attempts INT DEFAULT 0,
            last_verification_attempt TIMESTAMP WITH TIME ZONE,
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
            used_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

            CONSTRAINT unique_email_purpose 
                UNIQUE (email, purpose),
            
            CONSTRAINT not_expired
                CHECK (expires_at > created_at)
        );

        CREATE TABLE IF NOT EXISTS private.otp_rate_limits (
            id BIGSERIAL PRIMARY KEY,
            email TEXT NOT NULL,
            limit_type TEXT NOT NULL,
            attempt_count INT DEFAULT 0,
            window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            cooldown_until TIMESTAMP WITH TIME ZONE,
            
            CONSTRAINT unique_email_rate_limit
                UNIQUE (email, limit_type)
        );


        CREATE TABLE IF NOT EXISTS private.applications (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
            owner_id UUID NOT NULL REFERENCES private.users(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            client_id TEXT NOT NULL,
            client_secret TEXT NOT NULL,
            scopes TEXT[] NOT NULL,
            type TEXT NOT NULL DEFAULT 'third-party',
            redirect_uris TEXT[] NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            CONSTRAINT applications_client_id_key
                UNIQUE (client_id)
        );

        CREATE TABLE IF NOT EXISTS private.application_access_tokens (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            token VARCHAR(255) NOT NULL UNIQUE,
            application_id UUID NOT NULL REFERENCES private.applications(id) ON DELETE CASCADE,
            scope TEXT[] NOT NULL DEFAULT '{}',
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            user_id UUID REFERENCES private.users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS private.application_refresh_tokens (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
            token VARCHAR(255) NOT NULL UNIQUE,
            application_id UUID NOT NULL REFERENCES private.applications(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES private.users(id) ON DELETE CASCADE,
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            revoked_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
        );
    `
};