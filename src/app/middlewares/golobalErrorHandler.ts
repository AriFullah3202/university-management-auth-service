import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'
import { errorlogger, logger } from '../../shared/logger'
import { IGenericErrorMessage } from '../../interface/error'
import config from '../../config'
import handleValidationError from '../../error/handleValidationError'
import ApiError from '../../error/ApiError'

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // eslint-disable-next-line no-unused-expressions
  config.env === 'development'
    ? // eslint-disable-next-line no-console
      console.log('globalErrorHandler', error)
    : errorlogger.error('globalErrorHandler', error)

  let statusCode = 500
  let message = 'something went wrong'
  let errorMessage: IGenericErrorMessage[] = []
  //handle validation error
  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessage = simplifiedError.errorMessage
  } else if (error instanceof ApiError) {
    // eslint-disable-next-line no-console
    console.log('hello from global')
    statusCode = error?.statusCode
    message = error?.message
    errorMessage = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : []
  } else if (error instanceof Error) {
    message = error?.message
    errorMessage = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : []
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    stack: config.env !== 'production' ? error?.stack : undefined,
  })

  logger.info('hello from global handle error')
  next()
}
export default globalErrorHandler
