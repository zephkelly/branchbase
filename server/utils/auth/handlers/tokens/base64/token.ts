import { randomBytes } from 'crypto';

export async function generateSecureToken(length: number = 32): Promise<string> {
    return new Promise((resolve, reject) => {
        randomBytes(length, (err, buffer) => {
            if (err) reject(err);
            resolve(buffer.toString('base64url'));
        });
    });
}