import pg from 'pg'

let pool: pg.Pool | null = null

export function getPool() {
    if (!pool) {
        const config = useRuntimeConfig()
        pool = new pg.Pool({
            connectionString: config.databaseConnectionString,
            ssl: {
                rejectUnauthorized: false
            }
        })
    }
    return pool
}

export async function testConnection() {
    const client = await getPool().connect()
    try {
        console.log('Connected to the database')
    } finally {
        client.release()
    }
}

export async function createTablesIfNotExist() {
    const client = await getPool().connect()
    try {
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)

        await client.query(`
            create or replace function uuid_generate_v7()
            returns uuid
            as $$
            begin
                return encode(
                    set_bit(
                        set_bit(
                            overlay(uuid_send(gen_random_uuid())
                                placing substring(int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint) from 3)
                                from 1 for 6
                            ),
                            52, 1
                        ),
                        53, 1
                    ),
                'hex')::uuid;
            end
            $$
            language plpgsql
            volatile;
        `)

        await client.query(`
            CREATE TABLE IF NOT EXISTS private.users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
                username TEXT NOT NULL,
                picture TEXT,
                current_session_version UUID DEFAULT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                CONSTRAINT users_username_key
                    UNIQUE (username)
            );
                
            CREATE TABLE IF NOT EXISTS private.user_providers (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
                user_id UUID NOT NULL,
                provider TEXT NOT NULL,
                provider_id TEXT DEFAULT NULL,
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
                id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
                email TEXT NOT NULL,
                otp TEXT NOT NULL,
                purpose TEXT NOT NULL,
                verification_attempts INT DEFAULT 0,
                last_verification_attempt TIMESTAMP WITH TIME ZONE,
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                used_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

                CONSTRAINT unique_email_purpose 
                    UNIQUE (email, purpose),
                
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
    } finally {
        client.release()
    }
}