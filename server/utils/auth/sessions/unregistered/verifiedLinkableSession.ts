import { H3Event } from "h3";
import { UserSession } from "#auth-utils";
// import { VerifiedLinkableData, LinkableData, LinkableUserProviderData, UnregisteredUser, SecureSessionDataType } from "~~/types/user"
import { UnregisteredUser, UnregisteredLinkableData, VerifiedUnregisteredLinkableData, SecureUnregisteredLinkableSessionData, LinkableUserProviderData } from "~~/types/auth/user/session/unregistered";
import { SecureUnregisteredCredSessionData } from "~~/types/auth/user/session/credentials/unregistered";

export async function createVerifiedLinkableSession(event: H3Event, userSession: UserSession) {
    try {
        const temporaryVerifiedLinkableUser: UnregisteredUser = userSession.user as UnregisteredUser

        const linkableData: UnregisteredLinkableData = userSession.linkable_data as UnregisteredLinkableData

        const secureData = userSession.secure as SecureUnregisteredLinkableSessionData
        const secureLinkableData = secureData.linkable_data as LinkableUserProviderData[]

        const credentialsPasswordHash = (userSession.secure as SecureUnregisteredCredSessionData).password_hash || undefined
    
        if (!linkableData || !secureLinkableData || !secureLinkableData) {
            throw new Error('Invalid linkable data')
        }
    
        if (!temporaryVerifiedLinkableUser) {
            throw new Error('Invalid user session')
        }
    
        const verifiedLinkableData: VerifiedUnregisteredLinkableData = {
            ...linkableData,
            linkable_data: secureLinkableData,
        }
    
        temporaryVerifiedLinkableUser.provider_verified = true
        
        await replaceUserSession(event, {
            user: temporaryVerifiedLinkableUser,
            linkable_data: verifiedLinkableData,
            confirmed_password: userSession.confirmed_password as boolean | undefined,
            secure: {
                linkable_data: secureLinkableData,
                provider_email: secureData.provider_email,
                provider_verified: true,
                password_hash: credentialsPasswordHash
            },
            loggedInAt: Date.now()
        }, {
            maxAge: 60 * 60
        })

        console.log('Verified linkable session created')
    }
    catch (error) {
        console.error('Error creating verified linkable session:', error)
    }
}