# Module 13 ... Error handling , Zod , Pagination , Academic Semester
* [Fixed Some Previous Error and Fixed your code](#fixed-some-previous-error-and-fixed-your-code)
* [Unhandle Rejection and SIGTERM and uncaughtException](#unhandle-rejection-and-sigterm-and-uncaughtexception)
* [Zod error for Object field validation](#zod-error-for-object-field-validation)
  * [install zod](#install-zod)
* [create academic semiester interface and model and zodvalidation](#academic-semester-and-interface-and-model)
* [create academic sermister service controller and route ](#create-academic-semester-service-controller--route)
* [Handle same year and same samester validation](#handle-same-year-and-same-samester-validation)
* [Academic Semister title and code validation mapper](#academic-semister-title-and-code-violation-mapper)
* [Optimise Application routes and controller](#optimise-application-routes-and-controller)
* [Optimize you try catch block and Api Response](#optimize-you-try-catch-block-and-api-response)
  * [Handle response or succes responce](#handle-response-or-succes-response)




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

## Zod Error for Object field validation
jokhon amra data patabo user.cotroller e thokon Object field tik ache kina check korbe user.model
onek libray ache r zod install korte hbe

## install zod

```bash

yarn add zod

```
## usage of zod for validation

normally validation ta mongooes kore de 
kivabe moogooes kore  jokhon kono data App.ts theke jokon 
```js
//app.ts
app.use('/api/v1/users/', router)
```
jokon /api/v1/users/ asbe tokon user.route.ts e jabe 
```js
//user.route.ts
// ekhane validateRequest e jacche and oikahne check kore controller e jabe 
//validateRequest hocche ekta middleware 
// tapor check next() calll controller e jabe
// validateRequest() er parameter e jita jache oita zodscheme object . niche diya holo
router.post(
  '/create-user',
  validateRequest(UserValidation.createUserZodScheme),
  userController.createUser
)
```
jokon /api/v1/users/create-user eita full fill hbe thokon userController.createUser k call dibe
jokon controller jabe thokon model er madhome mongooes validation handle korbe 
but er age jodi amar moton validation check kori thahole route e zod validation ta korte hbe
ekhon file create korte hbe
* Module
  * user
    * user.validation.ts
in the file uesr.validation.ts
```js
// user.validation.js
import z from 'zod'
//ei object validateRequest nam name variabel k diye dibo
const createUserZodScheme = z.object({
  body: z.object({
    role: z.string({
      required_error: 'role is required',
    }),
    password: z.string().optional(),
  }),
})
//await createUserZodSchema.parseAsync(req)
export const UserValidation = {
  createUserZodScheme,
}
```
### ekhon middleware korbo . eita jodi error hoy tahole golobalErrorHandler e jabe r jodi 
error na hoy tahole controller e jabe 
ekhon middleware korbo
* src 
  * app
    * middlware
      * validateRequest
```js
//eita validateRequest.ts
import { NextFunction, Request, Response } from 'express'
import { AnyZodObject } from 'zod'
import { logger } from '../../shared/logger'
//import { logger } from '../../../shared/logger'
const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    logger.info('hello for validate request ekhan theke user.validation e jabe')
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      })
      return next()
    } catch (error) {
      next(error)
    }
  }
export default validateRequest
```
### Create handler for Zod
zod error link
#[https://zod.dev/?id=error-handling](https://zod.dev/?id=error-handling)
in globalErrorHandler.ts er moddhe

```js
import { ZodError } from 'zod';
 if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
  }
```
ekhon amader ekta handleZodError korte hbe
eikhane amra same error patern data dibo
* src
  * error
    * handdleZodError.ts
```js
import { IGenericErrorResponse } from '../interface/common';
import { IGenericErrorMessage } from '../interface/error';

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const statusCode = 400;
  return {
    statusCode,
    message: 'ZodValidation Error',
    errorMessage: errors,
  };
};
export default handleZodError;
```
## Academic semester and interface and model 
we will create for Academic semester interface model and schema and interface and validation
create a model 
* src
  * app
    * modules
      * academicSemister
        * academicSemester.model.ts
```js
import { Schema, model } from 'mongoose';
import {
  AcademicSemesterModel,
  IAcademicSemester,
} from './academicSemester.Interface';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const AcademicSemesterSchma = new Schema<IAcademicSemester>(
  {
    title: {
      type: String,
      enum: ['Autumn', 'Summer', 'Fall'],
      required: true,
      unique: true,
    },
    year: { type: Number, required: true },
    code: { type: String, required: true, enum: ['01', '02', '03'] },
    startMonth: { type: String, required: true, enum: monthNames },
    endMonth: { type: String, required: true, enum: monthNames },
  },
  {
    timestamps: true,
  }
);

export const User = model<IAcademicSemester, AcademicSemesterModel>(
  'AcademicSemester',
  AcademicSemesterSchma
);

```
create a interface 
* src
  * app
    * modules
      * academicSemester
        * academicSemester.interface.ts
```js
import { Model } from 'mongoose';

export type IAcademicSemester = {
  title: 'Autumn' | 'Summer' | 'Fall';
  year: number;
  code: '01' | '02' | '03';
  startMonth: string;
  endMonth: string;
};
export type AcademicSemesterModel = Model<IAcademicSemester>;
```
now create zodValidation for academicSemester
* src
  * app
    * modules
      * academicSemester
        * academicSemester.validation.ts
```js
import z from 'zod';

const createAcademicZodScheme = z.object({
  body: z.object({
    title: z.enum(['Autumn', 'Summer', 'Fall'], {
      required_error: 'role is required',
    }),
    year: z.number({ required_error: 'year is required' }),
    code: z.enum(['01', '02', '03'], { required_error: 'code is required' }),
    startMonth: z.enum(
      [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      { required_error: 'startMonth is required' }
    ),
    endMonth: z.enum(
      [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      { required_error: 'endMonth is required' }
    ),
  }),
});
//await createUserZodSchema.parseAsync(req)
export const AcademicSemesterValidation = {
  createAcademicZodScheme,
};

```
in 
* src
  * app
    * modules
      * academicSemester
        * academicSemester.route.ts

create academicSemester.route.ts 
```js

const router = express.Router()
router.post(
  '/create-user',
  validateRequest(UserValidation.createUserZodScheme),
  userController.createUser
)
export default router
```
## Create AcademicSemester constraint

<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap : 4px;">
  <div style = "width : 500px">
  
 * src
  * app
    * modules
      * academicSemester
        * academicSemester.constraint.ts
  

```js
import {
  IAcademicSemesterCodes,
  IAcademicSemesterMonths,
  IAcademicSemesterTitles,
} from './academicSemester.Interface';

export const academicSemesterMonths: IAcademicSemesterMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const academicSemesterTitles: IAcademicSemesterTitles[] = [
  'Autumn',
  'Summer',
  'Fall',
];
export const academicSemesterCodes: IAcademicSemesterCodes[] = [
  '01',
  '02',
  '03',
];


```
 </div>

 <div style = "width : 500px">
in academicSemester.interface.ts


```js
import { Model } from 'mongoose';

export type IAcademicSemesterMonths =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';
export type IAcademicSemesterTitles = 'Autumn' | 'Summer' | 'Fall';
export type IAcademicSemesterCodes = '01' | '02' | '03';

export type IAcademicSemester = {
  title: IAcademicSemesterTitles;
  year: number;
  code: IAcademicSemesterCodes;
  startMonth: IAcademicSemesterMonths;
  endMonth: IAcademicSemesterMonths;
};
export type AcademicSemesterModel = Model<IAcademicSemester>;


```
 </div>

</div>




<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
  <div style = "width : 500px">
in academicSemister.model.ts

```js

import { Schema, model } from 'mongoose';
import {
  AcademicSemesterModel,
  IAcademicSemester,
} from './academicSemester.Interface';
import {
  academicSemesterCodes,
  academicSemesterMonths,
  academicSemesterTitles,
} from './academicSemester.constant';

const AcademicSemesterSchma = new Schema<IAcademicSemester>(
  {
    title: {
      type: String,
      enum: academicSemesterTitles,
      required: true,
      unique: true,
    },
    year: { type: Number, required: true },
    code: { type: String, required: true, enum: academicSemesterCodes },
    startMonth: { type: String, required: true, enum: academicSemesterMonths },
    endMonth: { type: String, required: true, enum: academicSemesterMonths },
  },
  {
    timestamps: true,
  }
);

export const AcademicSemester = model<IAcademicSemester, AcademicSemesterModel>(
  'AcademicSemester',
  AcademicSemesterSchma
);
```

  </div>

  
 <div style = "width : 500px">
 
 in academicSemester.validation.ts 

 ```js

 import z from 'zod';
import {
  academicSemesterCodes,
  academicSemesterMonths,
  academicSemesterTitles,
} from './academicSemester.constant';

const createAcademicZodScheme = z.object({
  body: z.object({
    title: z.enum([...academicSemesterTitles] as [string, ...string[]], {
      required_error: 'role is required',
    }),
    year: z.number({ required_error: 'year is required' }),
    code: z.enum([...academicSemesterCodes] as [string, ...string[]], {
      required_error: 'code is required',
    }),
    startMonth: z.enum([...academicSemesterMonths] as [string, ...string[]], {
      required_error: 'startMonth is required',
    }),
    endMonth: z.enum([...academicSemesterMonths] as [string, ...string[]], {
      required_error: 'endMonth is required',
    }),
  }),
});
//await createUserZodSchema.parseAsync(req)
export const AcademicSemesterValidation = {
  createAcademicZodScheme,
};

```
 </div>
</div>    

## Create Academic Semester Service, controller ,  route

in app.ts . we have connected to academicSemester.router.ts


<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
  <div style = "width : 500px">

```js
// app.ts

app.use('/api/v1/academic-semesters', AcademicSemesterRoute);

```
</div>

<div style = "width : 500px">
called from app.ts

```js
//academicSemester.router.ts

const router = express.Router();

router.post(
  '/create-semester',
  validateRequest(AcademicSemesterValidation.createAcademicZodScheme),
  AcademicSemesterController.createSemester
);

export const AcademicSemesterRoute = router;
```
</div>
</div>

form router to controller 

```js

const createSemester: RequestHandler = async (req, res, next) => {
  try {
    const { ...academicSemesterData } = req.body;
    const result = await AcademicSemesterService.createSemester(
      academicSemesterData
    );
    res.status(200).json({
      success: true,
      message: 'academic semester created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const AcademicSemesterController = { createSemester };

```
form controller to servcie 

```js
const createSemester = async (
  payload: IAcademicSemester
): Promise<IAcademicSemester> => {
  const result = await AcademicSemester.create(payload);
  return result;
};

export const AcademicSemesterService = {
  createSemester,
};

``` 
## Handle same year and same samester validation

jokhon database data exits ache tahole insert korbo na . jodi thake allready exits bolte hbe
kothai ei condition use korbo
* src 
  * app
    * module
      * academicSemister
        * academicSemister.model.
ekhane amra chceck korchi save korar age
```js
AcademicSemesterSchma.pre('save', async function (next) {
  const isExits = await AcademicSemester.findOne({
    title: this.title,
    year: this.year,
  });
  if (isExits) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Academic semester is alreadey exits'
    );
  }
  next();
});
```
## Academic Semister title and code violation mapper
| Autumn | Summer | Fall |
| ------ | ------ |----  |
| 01     | 02     | 03   |
|  ---   |  ----  |  --  |

#### ekhane Autumn 01 and Summer 02 and Fall 03 and hole data insert hbe na . 
in the acadimicSemister.constant.ts
* src
  * app
    * module
      * academicSemester
        * academicSemester.constant.ts
```js
export const academicSemesterTitleCodeMapper: {
  [key: string]: string;
} = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};
```
* src
  * app
    * module
      * academicSemester
        * academicSemister.service.ts
```js

const createSemester = async (
  payload: IAcademicSemester
): Promise<IAcademicSemester> => {
  if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester code');
  }
  const result = await AcademicSemester.create(payload);
  return result;
};

export const AcademicSemesterService = {
  createSemester,
};

```
## Optimise application routes and controller
app.ts er moddhe jodi onek gula route hoy thahole dekhte osubidha eijonne ekta folder and file kulte hbe
for example 
app.use("/api/v1/user, router) eirokom onek gula hbe
amra app.ts er moddhe route name e ekta folder create korte pari
* src 
  * route
    * index.ts
   
```js
const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoute,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
```
in app.ts
```js
app.use('/api/v1', router);
```
## Optimize you try catch block and Api Response
amader user.controller.ts and academicSemister.controller.ts er moddhe try catch use korchi 
eita optize korte hbe
joto controller create korte hoy totobar try-catch create korte hbe
specific ekta higherOrderFunction use korte hbe jaita sobai catchAsync.ts file bole

create a spececific file
* src
  * shared
    * cacheAsync.ts
```js
const catchAsync =
  (fn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export default catchAsync;
```
so controller ekhane pass korbe and try catche handle korbe . and return korbe
now user.controller.ts
```js

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    const result = await userService.createUser(user);

    next();
    res.status(200).json({
      success: true,
      message: 'user created successfully',
      data: result,
    });
  }
);
export default { createUser };


```

## Handle response or succes response
amra jokon success response jate ekta patathe pari 
for example 

```js
  res.status(200).json({
      jamoniccaha : 'hhmm'
      success: true,
      message: 'user created successfully',
      data: result,
    });

// jemon amra ekhane jamonicca name r ekta property patate partechi 

```
amra jate specific response dite pari eijonno 
ekta folder and file create korte hbe
* src
  * shared
    * sendResponse.ts
```js

import { Response } from 'express';

type IApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  data: T;
};
const sendRespose = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    data: data.data || null,
  };
  res.status(data.statusCode).json({
    responseData,
  });
    };
  export default sendRespose;

```
in user.controller.ts er moddhe ekta common pattern response patalam
```js
import { NextFunction, Request, RequestHandler, Response } from 'express';
import userService from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendRespose from '../../../shared/sendResponse';
import httpStatus from 'http-status';

//import { logger } from '../../../shared/logger'

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    const result = await userService.createUser(user);

    next();
    res.status(200).json({});
    sendRespose(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user Created successfully',
      data: result,
    });
  }
);
export default { createUser };
```


