import nodemailer from 'nodemailer'
import 'dotenv/config';
import { config } from './config'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.dev.user,
    pass: config.dev.pass,
  },

  tls: {
    rejectUnauthorized: false,
  },
})
