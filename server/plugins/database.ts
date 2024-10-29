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
                    provider_id TEXT NOT NULL,
                    provider_email TEXT NOT NULL,
                    password TEXT DEFAULT NULL,
                    provider_verified BOOLEAN DEFAULT FALSE,
                    is_primary BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    
                    CONSTRAINT fk_user
                        FOREIGN KEY (user_id)
                        REFERENCES private.users(id)
                        ON DELETE CASCADE,
                    CONSTRAINT user_providers_provider_provider_id_key
                        UNIQUE (provider, provider_id),
                    -- Ensure only one primary provider per user
                    CONSTRAINT one_primary_per_user
                        EXCLUDE USING btree (user_id WITH =)
                        WHERE (is_primary = true)
                );

                CREATE TABLE IF NOT EXISTS private.otp_tokens (
                    id BIGSERIAL PRIMARY KEY,
                    email TEXT NOT NULL,
                    otp TEXT NOT NULL,
                    purpose TEXT NOT NULL,
                    verification_attempts INT DEFAULT 0,
                    last_verification_attempt TIMESTAMP WITH TIME ZONE,
                    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                    used_at TIMESTAMP WITH TIME ZONE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    
                    CONSTRAINT not_expired
                        CHECK (expires_at > created_at)
                );

                CREATE TABLE IF NOT EXISTS private.otp_rate_limits (
                    id BIGSERIAL PRIMARY KEY,
                    email TEXT NOT NULL,
                    limit_type TEXT NOT NULL,
                    attempt_count INT DEFAULT 0,
                    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    cooldown_until TIMESTAMP WITH TIME ZONE,
                    
                    CONSTRAINT unique_email_rate_limit
                        UNIQUE (email, limit_type)
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