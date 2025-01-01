import express from 'express';
import morgan from 'morgan';
import db from './db/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRouter from './routes/user.routes.js';
import projectRouter from './routes/project.routes.js'

const app = express();

db();
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/user', userRouter);
app.use('/project',projectRouter);

export default app;
