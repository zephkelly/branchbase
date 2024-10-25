import pg from 'pg'

declare module 'nitropack' {
    interface NitroApp {
        database: pg.Pool
    }
}

export default defineNitroPlugin(async (nitroApp) => {
    const config = useRuntimeConfig()

    const pool = new pg.Pool({
        connectionString: config.databaseConnectionString,
        ssl: {
            rejectUnauthorized: false
        }
    })

    // Test connection
    try {
        const client = await pool.connect()
        console.log('Connected to the database')
        client.release()
    }
    catch (err) {
        console.error('Error connecting to the database', err)
        throw err
    }

    async function createTablesIfNotExist() {
        const client = await pool.connect()
        try {
            await client.query(`
                CREATE TABLE IF NOT EXISTS private.users (
                    id BIGSERIAL PRIMARY KEY,
                    username TEXT NOT NULL,
                    picture TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    CONSTRAINT users_username_key
                    UNIQUE (username)
                );
                    
                CREATE TABLE IF NOT EXISTS private.user_providers (
                    id BIGSERIAL PRIMARY KEY,
                    user_id BIGINT NOT NULL,
                    provider TEXT NOT NULL,
                    provider_id NUMERIC NOT NULL,
                    provider_email TEXT NOT NULL,
                    password TEXT DEFAULT NULL,
                    provider_verified BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    CONSTRAINT fk_user
                        FOREIGN KEY (user_id)
                        REFERENCES private.users(id)
                        ON DELETE CASCADE,
                    CONSTRAINT user_providers_provider_provider_id_key
                        UNIQUE (provider, provider_id)
                );

                CREATE TABLE IF NOT EXISTS private.auth_tokens (
                    id BIGSERIAL PRIMARY KEY,
                    user_id BIGINT NOT NULL,
                    token_type TEXT NOT NULL,
                    token TEXT NOT NULL,
                    purpose TEXT NOT NULL,
                    provider TEXT,
                    provider_email TEXT,
                    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                    used_at TIMESTAMP WITH TIME ZONE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    
                    CONSTRAINT fk_user
                        FOREIGN KEY (user_id)
                        REFERENCES private.users(id)
                        ON DELETE CASCADE,
                        
                    -- Ensure token uniqueness
                    CONSTRAINT auth_tokens_token_key
                        UNIQUE (token),
                        
                    -- Token type validation
                    CONSTRAINT valid_token_type
                        CHECK (token_type IN ('otp', 'access_token', 'verification_link')),
                        
                    -- Ensure tokens haven't expired
                    CONSTRAINT not_expired
                        CHECK (expires_at > created_at)
                );
            `)

            console.log('Tables created or already exist')
        }
        catch (err) {
            console.error('Error creating tables', err)
            throw err
        }
        finally {
            client.release()
        }
    }

    await createTablesIfNotExist()

    nitroApp.database = pool
})