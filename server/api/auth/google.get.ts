export default defineOAuthGoogleEventHandler({
    config: {
        authorizationParams: {
            access_type: 'offline',
            prompt: 'consent',
        },
    },
    async onSuccess(event, { user }) {
        await setUserSession(event, {
            user: {
               email: user.email,
            },
            loggedInAt: Date.now(),
        })
        
        console.log('User logged in with Google:', user.email)
        return sendRedirect(event, '/')
    },
    onError(event, error) {
        console.error('Error logging in with Google:', error)
        return sendRedirect(event, '/login')
    }
})