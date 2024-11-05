export default defineEventHandler((event) => {
    const segments = event.path.split('/').filter(Boolean);

    if (segments[0] === 'api' && segments.length > 1) {
        return createError({
            statusCode: 404,
            statusMessage: 'API route not found',
        });
    }
});
