import { testConnection, createTablesIfNotExist } from '../utils/database'

export default defineNitroPlugin(async () => {
    try {
        await testConnection()
        await createTablesIfNotExist()
    } catch (err) {
        console.error('Database initialization failed:', err)
        throw err
    }
})