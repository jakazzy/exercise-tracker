import nodemailer from 'nodemailer'
import 'dotenv/config';
import { config } from './config'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.USER,
    pass: config.PASS,
  },
})
