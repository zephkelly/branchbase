export default defineNuxtConfig({
    future: {
        compatibilityVersion: 4,
    },

    compatibilityDate: '2024-04-03',
    devtools: { enabled: false },
    devServer: {
        host: '127.0.0.1',
    },

    typescript: {
        strict: true,
    },

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
        },
    },

    modules: ['nuxt-auth-utils'],
    runtimeConfig: {
        session: {
            maxAge: 60 * 60 * 24 * 7
        },
        databaseConnectionString: process.env.POSTGRES_CONNECTION_STRING,
        oauth: {
            google: {
                clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
                clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
                redirectURL: process.env.NUXT_OAUTH_GOOGLE_REDIRECT_URL
            },
            github: {
                clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
                clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
                redirectURL: process.env.NUXT_OAUTH_GITHUB_REDIRECT_URL
            },
            discord: {
                clientId: process.env.NUXT_OAUTH_DISCORD_CLIENT_ID,
                clientSecret: process.env.NUXT_OAUTH_DISCORD_CLIENT_SECRET,
                redirectURL: process.env.NUXT_OAUTH_DISCORD_REDIRECT_URL
            }
        }
    },

    nitro: {
        routeRules: {
            '/api/**': { cors: true, headers: { 'access-control-allow-methods': 'GET,POST' } },

            '/static/avatars/**': { 
                cache: { 
                    maxAge: 60 * 60 * 24 * 30,
                    swr: true
                },
                headers: {
                    'Cache-Control': 'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=3600, immutable',
                    'CDN-Cache-Control': 'public, max-age=2592000, s-maxage=2592000',
                    'Surrogate-Control': 'public, max-age=2592000, s-maxage=2592000',
                },
            },

            '/register/**': { static: true },
        },
    },
})