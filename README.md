## Table 
* [project setup](#project-setup)
  * [create folder](#create-folder-for-project)
* [Module13 Project description](./Module13.md)
* [Module14 project description](./Module14.md)
* [Setup logger](#setup-logger-for-winston-and-winston-daily-rotate-file)
  * [File create](#file-create)
  * [useage](#useage)
* [Error handling setup](#error-handling-setup)
* [Error handling method in structure](#optimize-error-handling-method-structure)
* [Common error pattern for frontend Developer](#common-error-pattern-for-frontend-developer)
* [Create handleValidationError handler](#create-handlevalidationerror-handler)


## project setup
to setup typescript and express

```bash
yarn init
```
```bash
yarn add typescript --dev
```
```bash
yarn add mongoose express dotenv cors
```
```bash
yarn add -D typescript
```
```bash
tsc --init
```
## create folder for project
in tsconfig.json
for example :   "rootDir": "./src",
                 "outDir": "./dist",
create folder for .env and .gitignore
* .env
* .gitignore
in gitignore file
```js
node_modules
.env
```


## Setup logger for winston and winston-daily-rotate-file
---

```bash
yarn add winston winston-daily-rotate-file
```
## how do you create folder?

## File create

first src folder then shared folder then file 

* src
  * shared
    * logger.ts

## useage

useage in logger js

```js
// import winston from 'winston'
import path from 'path'
import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

// this for date format
const { combine, timestamp, label, printf, prettyPrint } = format
const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp)
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${date.toString()} ${hour} : ${minute} : ${second} [${label}] ${level}: ${message}`
})

// for create suceess file
const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'Arif' }),
    timestamp(),
    //myformat data above mentioned in line
    myFormat,
    //this for code beautify
    prettyPrint()
  ),
  transports: [
    new transports.Console(),
    //it is for using maxfile and maxsize . it will generate new file and remove previous file
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'success',
        '%DATE%-success.log'
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      //customize the maxSize and maxFile if you want 
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
    }),
  ],
})
// create for error file
const errorlogger = createLogger({
  format: combine(
    label({ label: 'Arif' }),
    timestamp(),
    myFormat,
    //this for code beautify
    prettyPrint()
  ),
  level: 'error',
  transports: [
    new transports.Console(),
    //it is for using maxfile and maxsize . it will generate new file and remove previous file
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'success',
        '%DATE%-success.log'
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      //customize the maxSize and maxFile if you want 
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
    }),
  ],
})
// Create a logger for errors

export { logger, errorlogger }
```
---
## Error handling setup

different ways to handle error

normally in express error handle bydefault kore de . jokhon NodeEnv : development e thake

one approch
```js
  throw new Error('hello world')

```
second approch
```js
class AppiError extends Error {
  statusCode: number
  constructor(statusCode: number, message: string | undefined, stack = '') {
    super(message)
    this.statusCode = statusCode
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

app.get('/hello', (req: Request, res: Response) => {
  throw new AppiError(404, 'hello world')
})

```
third approch
```js
 next('ore baba error')

app.use( (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    res.status(400).json({ error: '' })
  } else {
    res.status(500).json({ error: 'somthing went error' })
  }
})
//forth approch 
app.get('/hello', (req: Request, res: Response) => {
  throw new AppiError(404, 'error')
})

app.use( (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    res.status(400).json({ error: '' })
  } else {
    res.status(500).json({ error: 'somthing went error' })
  }
})

```
---
## Optimize error handling method structure
we will create ApiError, global error class in folder

* src
  * error
    * ApiError.ts
in this file write --
```js

class ApiError extends Error {
  statusCode: number
  constructor(statusCode: number, message: string | undefined, stack = '') {
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

```
Now in User.service.ts Call ApiError
```js

  if (!createUser) {
    throw new ApiError(404, `Failed new create user`)
  }

```
using midlleware folder er moddhe globalErrorHandle.ts e call kore controller theke
* src
  * app
    * middleware
      * golobalErrorHandler.ts

```js
// user.controller.ts
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req.body
    const result = await userService.createUser(user)
    res.status(200).json({
      success: true,
      message: 'user created successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
//globalErrorHandler.ts
const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({ error: error })
  logger.info('hello from global handle error')
  next()
}
export default globalErrorHandler
// app.ts
app.use(globalErrorHandler)

```
## Common Error pattern for frontend developer
amra jekono error asuk na ekoy pattern use korbo
jate developer er easy hoy and simplify kore globalErrorHandler theke
* src
  * interface
    * eror.ts

```js
//error.ts
export type IGenericErrorMessage = {
  path: string
  message: string
}

//globalErrorHandler.ts

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = 500
  const message = 'something went wrong'
  const errorMessage: IGenericErrorMessage[] = []

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
```
## Create handleValidationError handler
for handleValidationError in globalErrorHandlerError.ts
* src
  * error
    * handleValidationError.ts
  * interface
    * common.ts
    * error.ts


```js

// handle validation error in globalErrorHandlerError
  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessage = simplifiedError.errorMessage
    //eita ApiError hole
  } else if (error instanceof ApiError) {
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
      //eita sudho error hole
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

export default handleValidationError
================================================
//this file is common.ts
export type IGenericErrorResponse = {
  statusCode: number
  message: string
  errorMessage: {
    path: string
    message: string
  }[]
}
//this file is error.ts
export type IGenericErrorMessage = {
  path: string
  message: string
}
=====================================================
  //this is handleValidationError.ts
  
  
  import mongoose from 'mongoose'
  import { IGenericErrorMessage } from '../interface/error'
  import { IGenericErrorResponse } from '../interface/common'
  
  const handleValidationError = (
    error: mongoose.Error.ValidationError
  ): IGenericErrorResponse => {
    const errors: IGenericErrorMessage[] = Object.values(error.errors).map(
      (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
        return {
          path: el?.path,
          message: el?.message,
        }
      }
    )
    const statusCode = 400
    return {
      statusCode,
      message: 'Validation Error',
      errorMessage: errors,
    }
  }

```











