import express, { Application, NextFunction, Request, Response } from 'express';

import cors from 'cors';
import globalErrorHandler from './app/middlewares/golobalErrorHandler';
import router from './routes';
import httpStatus from 'http-status';
//import ApiError from './error/ApiError'

const app: Application = express();
app.use(cors());
//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Application run

app.use('/api/v1', router);
// app.use('/api/v1/academic-semesters', AcademicSemesterRoute);

//by default node development e thake
//console.log(app.get('env'))

// app.get('/', (req: Request, res: Response, next: NextFunction) => {
//   //next('ore baba error')
//   throw new ApiError(404, 'calling')
// })
//app.get('/test', async (req: Request, res: Response, next: NextFunction) => {})

app.use(globalErrorHandler);
// this middleware handle the 404 uri

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessage: [
      {
        path: req.originalUrl,
        message: 'API not found',
      },
    ],
  });
  next();
});

export default app;
