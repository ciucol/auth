import nodemailer from 'nodemailer';
import config from '../config';

export const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});
