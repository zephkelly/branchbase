import { H3Event } from 'h3'
import { IUnregisteredUser } from "#auth-utils"
import { ProviderData } from '~/types/auth/user/provider'

import { UserService } from '~~/server/services/userService'

import { createUnverifiedLinkableSession } from '~~/server/utils/user/session/unregistered/createUnverifedLinkableSession'
import { createUnregisteredSession } from '~~/server/utils/user/session/unregistered/createUnregisteredSession'
import { createRegisteredSession } from '~~/server/utils/user/session/registered/createRegisteredSession'

export async function handleOAuthLogin(
    event: H3Event, 
    providerData: ProviderData
) {
    const userService = UserService.getInstance();
    const { provider, provider_id, provider_email, provider_verified } = providerData;

    try {
        const existingUser = await userService.getProviderUser(
            provider,
            provider_id
        );

        // Existing user, update email if necessary
        if (existingUser) {
            if (existingUser.provider_email !== provider_email) {
                await userService.updateProviderEmail(
                    existingUser.provider,
                    existingUser.provider_id as string,
                    provider_email,
                    provider_verified
                );
            }

            await createRegisteredSession(event, existingUser);
            return sendRedirect(event, '/');
        }

        // Check for existing accounts with same email
        const linkableUsersAndProviders = await userService.getUsersProvidersByEmail(
            provider_email
        );

        const temporaryUser: IUnregisteredUser = {
            id: null,
            username: null,
            provider,
            provider_id,
            provider_email,
            provider_verified,
            picture: 'picture here',
        };

        if (linkableUsersAndProviders) {
            await createUnverifiedLinkableSession(
                event,
                temporaryUser,
                linkableUsersAndProviders
            );
        }
        else {
            await createUnregisteredSession(event, temporaryUser);
        }

        return sendRedirect(event, '/register/oauth');
    }
    catch (error) {
        console.error(`Error logging in with ${provider}:`, error);
        return sendRedirect(event, '/');
    }
}