import { H3Event } from "h3";
import { UserSession } from "#auth-utils";
import { VerifiedLinkableData, LinkableData, LinkableUserProviderData, UnregisteredUser, SecureSessionDataType } from "~~/types/user"

export async function createVerifiedLinkableSession(event: H3Event, userSession: UserSession) {
    try {
        const linkableData: LinkableData = userSession.linkable_data as LinkableData
        const secureLinkableData = userSession.secure as SecureSessionDataType
    
        const temporaryVerifiedLinkableUser: UnregisteredUser = userSession.user as UnregisteredUser
        const secureLinkableProviderData = userSession.secure?.linkable_data as LinkableUserProviderData[]
    
        if (!linkableData || !secureLinkableProviderData || !secureLinkableData) {
            throw new Error('Invalid linkable data')
        }
    
        if (!temporaryVerifiedLinkableUser) {
            throw new Error('Invalid user session')
        }
    
        const verifiedLinkableData: VerifiedLinkableData = {
            ...linkableData,
            linkable_providers: secureLinkableProviderData
        }
    
        await replaceUserSession(event, {
            user: temporaryVerifiedLinkableUser,
            linkable_data: verifiedLinkableData,
            secure: {
                linkable_data: secureLinkableProviderData,
                provider_email: secureLinkableData.provider_email,
                provider_verified: secureLinkableData.provider_verified
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