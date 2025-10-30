import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

export const transport = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 2525,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})
