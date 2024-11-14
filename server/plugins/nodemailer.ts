import nodemailer from 'nodemailer'
import { EmailPayload } from '~~/server/types/email'
import { CustomMailer } from '~~/server/types/nodemailer'

export default defineNitroPlugin((nitroApp) => {
    const config = useRuntimeConfig()

    // Create reusable transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: 465,
        secure: true,
        auth: {
            user: config.smtp.user,
            pass: config.smtp.password,
        },
        debug: true
    })

    // Verify connection configuration
    try {
        transporter.verify((error) => {
            if (error) {
                console.error('Error verifying mail connection:', error)
                throw error
            } else {
                console.log('Mail server connection established')
            }
        })
    } catch (err) {
        console.error('Failed to create mail transport:', err)
        throw err
    }

    // Create mailer object with common email functions
    const mailer: CustomMailer = {
        // Send a basic email
        async sendMail(options: EmailPayload) {
            try {
                const result = await transporter.sendMail(options)
                return result
            } catch (error) {
                console.error('Error sending email:', error)
                throw error
            }
        },

        // Send verification email
        async sendVerificationEmail(to: string, token: string) {
            const options = {
                from: config.smtp.from_no_reply,
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
                from: config.smtp.from_no_reply,
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
                from: config.smtp.from_no_reply,
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

    // Extend nitro app with mailer
    nitroApp.mailer = mailer
})