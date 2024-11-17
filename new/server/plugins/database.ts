import { DatabaseService } from '~~/server/services/databaseService';

export default defineNitroPlugin(async () => {
    const db = DatabaseService.getInstance();
    await db.initialise();
});