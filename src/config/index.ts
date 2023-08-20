import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
  },
  token: {
    secret: process.env.JWT_SECRET || 'secret',
  },
  mail: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_TOKEN,
  },
};
