import { H3Event } from "h3"

import { SessionService } from "~~/server/services/sessionService"
import { IRegisteredUser, ISecureSessionData } from "#auth-utils"

export async function createRegisteredSession(event: H3Event, user: IRegisteredUser & ISecureSessionData): Promise<void> {
    // Interact with a service as we require db checks for session validity
    const sessionService = new SessionService();
    return sessionService.createRegisteredSession(event, user);
}