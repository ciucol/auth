import express, { Express } from 'express';
import cors from 'cors';
import { mongoConnect } from './db';
import { router } from './router';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoConnect();

router(app);

export default app;
