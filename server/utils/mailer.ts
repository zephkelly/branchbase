import nodemailer from 'nodemailer'
import { EmailPayload } from '~~/server/types/email'
import { CustomMailer } from '~~/server/types/nodemailer'

let transporter: nodemailer.Transporter | null = null
let mailer: CustomMailer | null = null

export function createTransporter() {
    if (!transporter) {
        const config = useRuntimeConfig()
        transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: 465,
            secure: true,
            auth: {
                user: config.smtp.user,
                pass: config.smtp.password,
            },
            debug: true
        })
    }
    return transporter
}

export function getMailer(): CustomMailer {
    if (!mailer) {
        const config = useRuntimeConfig()
        const transport = createTransporter()
        
        mailer = {
            // Send a basic email
            async sendMail(options: EmailPayload) {
                try {
                    const result = await transport.sendMail(options)
                    return result
                } catch (error) {
                    console.error('Error sending email:', error)
                    throw error
                }
            },

            // Send verification email
            async sendVerificationEmail(to: string, token: string) {
                const options = {
                    from: config.smtp.from_noreply,
                    to,
                    subject: 'Verify Your Email',
                    html: `
                        <h1>Email Verification</h1>
                        <p>Please use the following code to verify your email: ${token}</p>
                        <p>This code will expire in 10 minutes.</p>
                    `
                }
                return await this.sendMail(options)
            },

            // Send password reset email
            async sendPasswordResetEmail(to: string, token: string) {
                const options = {
                    from: config.smtp.from_noreply,
                    to,
                    subject: 'Password Reset Request',
                    html: `
                        <h1>Password Reset</h1>
                        <p>Please use the following code to reset your password: ${token}</p>
                        <p>This code will expire in 10 minutes.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    `
                }
                return await this.sendMail(options)
            },

            // Send welcome email
            async sendWelcomeEmail(to: string, username: string) {
                const options = {
                    from: config.smtp.from_noreply,
                    to,
                    subject: 'Welcome!',
                    html: `
                        <h1>Welcome ${username}!</h1>
                        <p>Thank you for joining our platform.</p>
                        <p>We're excited to have you on board!</p>
                    `
                }
                return await this.sendMail(options)
            }
        }
    }
    return mailer
}

export async function verifyConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
        const transport = createTransporter()
        transport.verify((error) => {
            if (error) {
                console.error('Error verifying mail connection:', error)
                reject(error)
            } else {
                console.log('Mail server connection established')
                resolve()
            }
        })
    })
}