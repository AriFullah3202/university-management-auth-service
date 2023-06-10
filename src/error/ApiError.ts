import { logger } from '../shared/logger'

class ApiError extends Error {
  statusCode: number
  constructor(statusCode: number, message: string | undefined, stack = '') {
    logger.info('hello from error api')
    super(message)
    this.statusCode = statusCode
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
export default ApiError
