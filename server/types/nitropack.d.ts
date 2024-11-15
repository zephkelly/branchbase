import pg from 'pg'
import { CustomMailer } from './nodemailer'

declare module 'nitropack' {
    interface NitroApp {
        database: pg.Pool
        mailer: CustomMailer
    }
}
