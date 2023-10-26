import express, { NextFunction, Request, Response } from "express";
import mongoose, { Error } from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.route'
import authRouter from './routes/auth.route'
import listingRouter from './routes/listing.route'
import cookieParser from 'cookie-parser'

dotenv.config();

const mongoUri = process.env.MONGO || "mongodb://localhost:27017/mydb";

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json())

app.use(cookieParser())

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error'
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})