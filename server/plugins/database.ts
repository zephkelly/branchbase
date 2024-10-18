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
                CREATE TABLE IF NOT EXISTS users (
                    id BIGSERIAL PRIMARY KEY,
                    email VARCHAR(255) NOT NULL,
                    password VARCHAR(255) DEFAULT NULL,
                    provider VARCHAR(255),
                    verified BOOLEAN DEFAULT FALSE,
                    display_name VARCHAR(255) NOT NULL,
                    picture VARCHAR(255) DEFAULT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS branches (
                    id BIGSERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    type VARCHAR(255) NOT NULL,
                    description VARCHAR(255) NOT NULL,
                    pages JSONB,
                    user_id VARCHAR(255) NOT NULL,
                    owner_user_id VARCHAR(255) NOT NULL,
                    background_image_url VARCHAR(255) NOT NULL,
                    icon_image_url VARCHAR(255) NOT NULL,
                    tags VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS posts (
                    id BIGSERIAL PRIMARY KEY,
                    branch_id INTEGER REFERENCES branches(id),
                    user_id INTEGER REFERENCES users(id),
                    post_title VARCHAR(255) NOT NULL,
                    content_type VARCHAR(255) NOT NULL,
                    content JSONB NOT NULL,
                    post_status VARCHAR(255) NOT NULL,
                    post_flairs VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS comments (
                    id BIGSERIAL PRIMARY KEY,
                    post_id INTEGER REFERENCES posts(id),
                    user_id INTEGER REFERENCES users(id),
                    content TEXT NOT NULL,
                    parent_id INTEGER REFERENCES comments(id),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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