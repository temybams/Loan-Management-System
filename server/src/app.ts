import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { IError } from './types/error.type';
import errorHandler from './middleware/errorHandler.middleware';
import { authRoutes, loanRoutes } from './routes/index';

import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { notificationQueue } from "./queues/notification.queue";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST'],
  })
);
// parsers option;
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Hello, TypeScript with Express!",
  })
})

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(notificationQueue)],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

app.use('/api', authRoutes)
app.use('/api', loanRoutes)

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: IError = new Error(
    `API Endpoint Not found - ${req.originalUrl}`,
  )
  error.status = 404
  next(error)
})


app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;