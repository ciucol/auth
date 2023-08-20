import { Express } from 'express';
import authController from '../controllers/auth.controller';

export const router = (app: Express) => {
  app.use('/auth', authController);
  app.use('*', (req, res) => {
    res.status(404).json({ status: 'error', error: 'Not found' });
  });
};
