import { DatabaseService } from '~~/server/services/databaseService';

export function getDatabase() {
    return DatabaseService.getInstance();
}