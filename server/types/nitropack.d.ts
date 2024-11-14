import pg from 'pg'
import nodemailer from 'nodemailer'
import { CustomMailer } from './nodemailer'

declare module 'nitropack' {
    interface NitroApp {
        database: pg.Pool
        mailer: CustomMailer
    }
}
