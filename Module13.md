# Module 13 ... Error handling , Zod , Pagination , Academic Semester
* [Fixed Some Previous Error and Fixed your code](#fixed-some-previous-error-and-fixed-your-code)
* [Unhandle Rejection and SIGTERM and uncaughtException](#unhandle-rejection-and-sigterm-and-uncaughtexception)


<div style="border: 3px solid green; padding: 10px;">

## Fixed some previous Error and Fixed your code
---
in globalErrorHandler.ts change the type 
because type declare time waste . 
for example

```js

// previous code 
const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {}
// now will change type declaration just express theke ErrorRequestHandler niye asa
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {}

```

In controller 

```js
// we used to do like this
const createUser = async (req : Request, res : Response, next : NextFunction) => {
  try {}
}
// now we are using RequestHandler 
const createUser: RequestHandler = async (req, res, next) => {
  try {}
}

```

In .Eslintrc change the some essue
index.ts er moddhe kichu view problem ache 
tai .eslintrc file change korlam
[https://eslint.org/docs/latest/use/configure/language-options](https://eslint.org/docs/latest/use/configure/language-options)

```js

 "env": {
    "browser": true,
    "es2021": true,
     "node" : true
  },
   "globals": {
    "process" : "readonly"
   }

``` 
r amra code joto gulo type and interface ache sob interface e thake 
eijonno user.model theke user.interface.ts e niye aschi
```js
// Create a new Model type that knows about IUserMethods .
// eita staic method use korle dite hoy
type UserModel = Model<IUser, object>

// user.interface.ts er moddhe 
// Create a new Model type that knows about IUserMethods .
// eita staic method use korle dite hoy
export type UserModel = Model<IUser, object>

```
ekhon amra export default er poriborte export const UserController{} use korbo
```js

export default { createUser }
// ekhon use korbo 
export default UserController {
  createUser 
  //eivabe likhbo
}

```
ekhon error and ApiError jekan theke error hok na keno same error pattern 
and same pattern respose dibe

```js

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  //next('ore baba error')
  throw new ApiError(404, 'calling')
})
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
  throw new Error('Testing Error logger')
})

app.use(globalErrorHandler)
// ekhane ApiError or Error maddhome globalErrorHandler e jabe
const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

```

</div>

<div>

## Unhandle Rejection and SIGTERM and uncaughtException
jokon development environment e thakbo tokon console.log hbe 
abar jokhon production environment e thakbo thokon orthath live hbe thokon 
in globalErrorHandler.ts
```js
  // eslint-disable-next-line no-unused-expressions
  config.env === 'development'
    ? // eslint-disable-next-line no-console
      console.log('globalErrorHandler', error)
    : errorlogger.error('globalErrorHandler', error)
```
jokhon unhandle exception hoy thokon project stop hoye jay server stop hoye jay
eita k handle korte 
```js

//in app.ts
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
  Promise.reject(new Error('Unhandle promise Rejection '))
})
eita hit kortle exception de
Error: Unhandle promise Rejection 

// to overcome korte 
// in server.

import mongoose from 'mongoose'
import app from './app'
import config from './config/index'
import { errorlogger, logger } from './shared/logger'
import { Server } from 'http'
// handling uncaughtException 
process.on('uncaughtException', error => {
  errorlogger.error('Uncaught Exception:', error)
  process.exit(1)
})
let server: Server

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string)
    logger.info('connect successful')

    server = app.listen(config.port, () => {
      logger.info(`the application is running on port ${config.port}`)
    })
  } catch (error: any) {
    errorlogger.error(`failed to connect database ${error.message}`)
  }
  //handle unhandledRejection
  process.on('unhandledRejection', error => {
    console.log('unhandle rejection')
    if (server) {
      server.close(() => {
        errorlogger.error(error)
        process.exit(1)
      })
    } else {
      process.exit(1)
    }
  })
}

bootstrap()
//handle SIGTERM exception
process.on('SIGTERM', () => {
  logger.info('SIGTERM is received')
  if (server) {
    server.close()
  }
})
```

</div>






