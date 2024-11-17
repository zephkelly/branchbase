import { H3Event } from "h3";

import { 
    IUnregisteredCredUser, 
    IUnregisteredUser, 
    IUnregisteredCredLinkableSession, 
    IUnregisteredOAuthLinkableSession, 
    ILinkableUserProviderData,
    UserSession
} from "#auth-utils";


export async function createUnverifiedLinkableSession(event: H3Event, user: IUnregisteredCredUser | IUnregisteredUser, linkableUsers: ILinkableUserProviderData[], password_hash?: string) {
    if (password_hash) {
        return createUnverifiedLinkableCredentialsSession(event, user as IUnregisteredCredUser, linkableUsers, password_hash)
    }

    return createUnverifiedLinkableOAuthSession(event, user as IUnregisteredUser, linkableUsers)
}


export async function createUnverifiedLinkableOAuthSession(event: H3Event, user: IUnregisteredUser, linkableUsers: ILinkableUserProviderData[]) {
    const session: IUnregisteredOAuthLinkableSession = {
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

    //@ts-expect-error
    await replaceUserSession(event, session, {
        maxAge: 60 * 60
    })
}


export async function createUnverifiedLinkableCredentialsSession(event: H3Event, user: IUnregisteredCredUser, linkableUsers: ILinkableUserProviderData[], password_hash: string) {
    const session: IUnregisteredCredLinkableSession = {
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

    //@ts-expect-error
    await replaceUserSession(event, session, {
        maxAge: 60 * 60
    })
}