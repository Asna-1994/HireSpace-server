import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from './Infrastructure/config/database';
import userRoutes from './Infrastructure/routes/userRoutes';
import companyRoutes from './Infrastructure/routes/companyRoutes';
import adminRoutes from './Infrastructure/routes/adminRoutes';
import connectionRoutes from './Infrastructure/routes/connectionRequestRoutes';
import plantRoutes from './Infrastructure/routes/planRoutes';
import paymentRoutes from './Infrastructure/routes/paymentRoutes';
import cors from 'cors';
import morgan from 'morgan';
import { errorMiddleware } from './Infrastructure/middleware/errorMiddleware';
import cookieParser from 'cookie-parser';
import authRoutes from './Infrastructure/routes/authRoutes'

dotenv.config();

const app: Application = express();

//middlewares
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(cookieParser());

(async () => {
  await connectDB();
})();

//routes
app.use('/api/user', userRoutes);
app.use('/api/auth' ,  authRoutes)
app.use('/api/company', companyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/connection-request', connectionRoutes);
app.use('/api/plans', plantRoutes);
app.use('/api/payments', paymentRoutes);

app.use(
  errorMiddleware as (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
);

export default app;
