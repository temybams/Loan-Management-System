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

import rateLimit from "express-rate-limit";



dotenv.config();

const app: Application = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_ALT,
  ...(process.env.CLIENT_URLS?.split(",").map((origin) => origin.trim()) ?? []),
  "http://localhost:5000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean);



const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max 100 requests per IP
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);
// parsers option;
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "TemmyLoans API is running",
  })
})

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "temmyloans-api",
    timestamp: new Date().toISOString(),
  })
})

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(notificationQueue)],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

app.use(globalLimiter);

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
