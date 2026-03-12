import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { IError } from './types/error.type';
import { connectPrisma } from './services/prisma.service';
import errorHandler from './middleware/errorHandler.middleware';
import authRoutes from './routes/index';

dotenv.config();

const app: Application = express();

const PORT = process.env.PORT;

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

app.use('/api', authRoutes)

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


app.listen(PORT, async () => {
  await connectPrisma().then(() => {
    console.clear();
    console.log(`Server running on port ${PORT}`);
  });
});
export default app;