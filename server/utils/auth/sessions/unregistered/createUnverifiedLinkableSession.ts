import { H3Event } from "h3";
import { UnregisteredCredUser, UnregisteredCredLinkableSession } from "~~/types/auth/user/session/credentials/unregistered";
import { UnregisteredOAuthLinkableSession } from "~~/types/auth/user/session/oauth/unregistered";
import { LinkableUserProviderData, UnregisteredUser } from "~~/types/auth/user/session/unregistered";

export async function createUnverifiedLinkableSession(event: H3Event, user: UnregisteredCredUser | UnregisteredUser, linkableUsers: LinkableUserProviderData[], password_hash?: string) {
    if (password_hash) {
        return createUnverifiedLinkableCredentialsSession(event, user as UnregisteredCredUser, linkableUsers, password_hash)
    }

    return createUnverifiedLinkableOAuthSession(event, user as UnregisteredUser, linkableUsers)
}

export async function createUnverifiedLinkableOAuthSession(event: H3Event, user: UnregisteredUser, linkableUsers: LinkableUserProviderData[]) {
    const session: UnregisteredOAuthLinkableSession = {
        user: user,
        linkable_data: {
            provider_email: user.provider_email,
            existing_users_count: linkableUsers.length,
        },
        secure: {
            provider_email: user.provider_email,
            provider_verified: user.provider_verified,
            linkable_users: linkableUsers
        },
        logged_in_at: Date.now()
    }

    await replaceUserSession(event, {
        ...session
    }, {
        maxAge: 60 * 60
    })
}

export async function createUnverifiedLinkableCredentialsSession(event: H3Event, user: UnregisteredCredUser, linkableUsers: LinkableUserProviderData[], password_hash: string) {
    const session: UnregisteredCredLinkableSession = {
        user: user,
        confirmed_password: true,
        linkable_data: {
            provider_email: user.provider_email,
            existing_users_count: linkableUsers.length,
        },
        secure: {
            provider_email: user.provider_email,
            provider_verified: false,
            password_hash: password_hash,
            linkable_users: linkableUsers
        },
        logged_in_at: Date.now()
    }

    await replaceUserSession(event, {
        ...session
    }, {
        maxAge: 60 * 60
    })
}