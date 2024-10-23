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
                    primary_email VARCHAR(255) NOT NULL,
                    password VARCHAR(255),
                    verification_status VARCHAR(255) DEFAULT 'unverified',
                    username VARCHAR(255) NOT NULL,
                    picture VARCHAR(255),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS private.user_providers (
                    id BIGSERIAL PRIMARY KEY,
                    user_id BIGINT NOT NULL,
                    provider VARCHAR(255) NOT NULL,
                    provider_id NUMERIC NOT NULL,
                    provider_email VARCHAR(255) NOT NULL,
                    provider_verified BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    -- Foreign key constraint with cascade delete
                    CONSTRAINT fk_user
                        FOREIGN KEY (user_id)
                        REFERENCES private.users(id)
                        ON DELETE CASCADE,
                    -- Unique constraint on provider and provider_id combination
                    CONSTRAINT user_providers_provider_provider_id_key
                        UNIQUE (provider, provider_id)
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