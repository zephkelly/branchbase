import nodemailer from 'nodemailer'
import { EmailPayload } from "./email"

export interface CustomMailer {
    sendMail(options: EmailPayload): Promise<nodemailer.SentMessageInfo>
    sendVerificationEmail(to: string, token: string): Promise<nodemailer.SentMessageInfo>
    sendPasswordResetEmail(to: string, token: string): Promise<nodemailer.SentMessageInfo>
    sendWelcomeEmail(to: string, username: string): Promise<nodemailer.SentMessageInfo>
}