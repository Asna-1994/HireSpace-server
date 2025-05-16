import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from './Infrastructure2/config/database';
import userRoutes from './Interface2/routes/userRoutes'
import companyRoutes from './Interface2/routes/companyRoutes'
import adminRoutes from './Interface2/routes/adminRoutes'
import connectionRoutes from './Interface2/routes/connectionRequestRoutes'
import plantRoutes from './Interface2/routes/planRoutes'
import paymentRoutes from './Interface2/routes/paymentRoutes'
import cors from 'cors';
import morgan from 'morgan';
import { errorMiddleware } from './Interface2/middleware/errorMiddleware'
import cookieParser from 'cookie-parser';
import authRoutes from './Interface2/routes/authRoutes'

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
