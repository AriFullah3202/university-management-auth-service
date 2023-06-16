## Table 
* [project setup](#project-setup)
  * [create folder](#create-folder-for-project)
  * [deploy to vercel](#deploy-to-vercel)
* [Error handling bangla ducument](#)
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
yarn add mongoose express dotenv cors http-status
yarn add ts-node-dev --dev
```
```bash
yarn add -D typescript @types/express @types/cors
```
```bash
tsc --init
```
## create folder for project
in tsconfig.json
for example :   "rootDir": "./src",
                 "outDir": "./dist",
create folder for .env and .gitignore
* src
  * config -> folder
    * index.ts  -> file
  * app.ts
  * server.ts
* .env
* .gitignore
in gitignore file
```js
node_modules
.env
```
in .env file
```bash
PORT = 5000
DATABASE_URL=mongodb://127.0.0.1:27017/university-managemet
DEFAULT_PASSWORD = Admin3202
```
## deploy to vercel
* first 
* yarn build
* create vercel.jeson
```bash
vercel --version //if vercel 
// not install
yarn i -g vercel@latest
vercel --version
vercel login
//then
vercel
#then answer the question
y
# then 
enter
# then
no 
# then 
no
# then 
./
#then 
if you change project build again
#then 
yarn buil
vercel --prod
```
in package.json
```json

 "scripts": {
    "dev": "tsnd --respawn src/server.ts",
    "start": "node dist/server.js",
    "build" : "tsc",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  
  in vercel.json
  {
    "version": 2,
    "builds": [
      {
        "src": "dist/server.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "dist/server.js"
      }
    ]
  }

```

## Setup logger for winston and winston-daily-rotate-file
---

```bash
yarn add winston winston-daily-rotate-file
```

## Error handling bangla ducumen
All about Express Error Handling
WHY ERROR HANDLING IS IMPORTANT
আমরা জানি Node একটি All Time Running সার্ভার।সুতরাং, কোন অ্যাপ্লিকেশান যদি প্রোডাকশনে ডিপ্লয় হওয়ার পর ক্লায়েন্ট এর কোন একশন এর কারনে ক্র্যাশ করে বা অন্য কোন ডেভেলপার এর বাগ এর কারনে ক্র্যাশ করে তাহলে যেই হিজিবিজি স্পেসিফিক এরর টা ক্লায়েন্ট সাইডে এ যাবে টা কখনো ইউজার এর বোধগম্য হবে না।
আবার বিভিন্ন ধরনের এরর বিভিন্ন রকম মেসেজ দিবে এবং বিভিন্ন প্যাটার্নে যাবে যা ফ্রন্টেন্ড থেকে হ্যান্ডেল করা করা কষ্টসাধ্য এবং ইফিসিয়েন্ট না । সুতরাং সকল প্রকার এরর কে একটি কমন প্যাটার্নে পাঠাতে পারলে ব্যাপারটা সুন্দর এবং গোছানো হবে। আর এই সকল প্রকার এরর কে আমরা গ্লোবাল একটি এরর হ্যান্ডেলার দিয়ে এক জায়গা থেকে কন্ট্রোল করতে পারি। সুতরাং, যেকোনো এপ্লিকেশনের জন্য এরর হ্যান্ডলিং অত্যন্ত গুরুত্বপূর্ণ একটি বিষয়।
SYNCHRONOUS ERROR HANDLING BY EXPRESS
Express Application এ synchronous & asynchronous দুই ধরনের কোডের জন্য আলাদাভাবে এরর handle করতে পারি । কিন্তু মজার ব্যাপার হল Synchronous কোডের জন্য Express ডিফল্ট ভাবেই আমাদের জন্য এরর টা হ্যান্ডেল করে দেয়। যেমনঃ
```js
app.get('/',(req,res)=>{
throw new Error(' Thamun! Ami Synchronous Error')
})
```
এক্ষেত্রে আমাদের সার্ভার ক্র্যাশ করবে না এবং ইউজার রেস্পন্স পাবে পাবে।তবে রেস্পন্স হিসেবে ইউজার একটি HTML Error Tempalete পাবে নিচের মতঃ
```html
<body>
<pre>Error:  Thamun! Ami Synchronous Error<br>    at F:\\ACC\\myMVC\\mvc\\index.js:13:11<br>    at Layer.handle [as handle_request] ……..</pre>
</body>
```

এক্সপ্রেস এই এরর হ্যান্ডেলিং কিভাবে করে ? এক্সপ্রেস এর বিল্ট ইন এরর হ্যান্ডেলার এর কারণে ! এক্সপ্রেস এর বিল্ট ইন এরর হ্যন্ডেলিং মিডলওয়ার এর মাধ্যমে সে এপ্লিকেশনের Synchronous কোডের এরর এররগুলো হ্যান্ডেল করে রেস্পন্স হিসেবে এররের একটি HTML Template সেন্ড করে দেয় ।
কিন্তু আমরা যদি এররটাকে নিজেদের পছন্দ মত এরর মেসেজ দিয়ে হ্যান্ডেল করতে চাই তাহলে আমাদেরকে Express এর সেই বিল্ট ইন এরর হ্যান্ডেলারকে ওভাররাইট করতে হবে আমাদের বানানো globalErrorHandler মিডলওয়্যার ব্যবহার করার মাধ্যমে । এই মিডলওয়্যার প্যারামিটার হিসেবে ৪ টি প্যারামিটার নিবে , যেখানে প্রথমটি হবে error ! রিকুয়েস্ট হ্যান্ডেলার এর সাথে পার্থক্য কিন্তু এখানেই। রিকুয়েস্ট হ্যান্ডেলার ৩ টি প্যারামিটার রিসিভ করে , আর এরর হ্যান্ডেলার ৪ টি ! নিচে একটি সিম্পল এরর হ্যান্ডেলার এর ফরম্যাট দেয়া হলঃ
```js
app.use((err,req,res,next)=>{
 if(err){
  res.send(err.message)
 }else{
  res.send('my error')
 }
})
```
খেয়াল করলে দেখতে পাবেন । আমরা শুধু এরর মেসেজ দিতে পারি । আমরা নিজেদের মত কোন স্ট্যাটাস কোড কিন্তু দিতে পারিনা !এখন আমরা যদি নিজেদের মত error status code দিতে চাই তাহলে কিন্তু আমরা পারব না কারন জাভাস্ক্রিপ্ট এর Error class শুধুমাত্র একটি প্যারামিটার নেই । সেটি হল এরর মেসেজ।
তবে আমরা চাইলে নিচের কোড দ্বারা ApiError নামের একটি class তৈরি করে error message এর পাশাপাশি status code পাঠতে পারি।
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
এই কোডটি ApiError নামক একটি class তৈরি করে। এটি Error class থেকে এক্সটেন্ড করা হয়েছে। এটি একটি কাস্টম এরর class হিসাবে কাজ করে এবং এররের বিভিন্ন বৈশিষ্ট্য ধারণ করে।
এই ক্লাসের মধ্যে আমরা প্রধানত দুইটি জিনিস দেখতে পাই:
statusCode: এটি এররের স্ট্যাটাস কোড সংরক্ষণ করে।
constructor(): এটি ক্লাসের কনস্ট্রাক্টর মেথড। এটি এররের স্ট্যাটাস কোড, মেসেজ এবং স্ট্যাক (যদি থাকে) গ্রহণ করে। যদি স্ট্যাক না থাকে, তবে Error.captureStackTrace() ব্যবহার করে এটি সেট করে দেয়।
এই কোড দ্বারা আমরা একটি কাস্টম এরর class ব্যাবহার করে সহজেই Status Code এবং Error Message দুইটি Parameter নিয়ে Client Side এ একটি এরর throw করতে পারি।
```js
app.get('/',(req,res)=>{
throw new ApiError(400,'thamun! ami error amar ekon status code o ase ! huh !')
})
throw new Error(“ error message ”) // Class Only receive message
Throw new ApiError( 404 , ”error messages” ) // Class receive message along with status code
ASYNCHRONOUS ERROR HANDLING BY EXPRESS

```
Express Application ব্যবহার করার সময়, Promise এর সাথে সম্পর্কিত কাজগুলি চালানোর সময় এরর ঘটতে পারে। এটিকে বলা হয় Asynchronous এরর ! এক্সপ্রেস কিন্তু বাই ডিফল্ট এই এরর হ্যান্ডেল করে না ! যদি এই এরর ঠিকমত না হ্যান্ডেল করা হয়, তাহলে আপনার অ্যাপ্লিকেশন ক্র্যাশ করতে পারে ! আমরা Promise ব্যবহার এসিনক্রোনাস ফাংশনে এরর হ্যান্ডেল করতে, প্রথমে এররকে ধরতে হবে। এর জন্য আমরা try/catch ব্যবহার করতে পারি বা .then() /.catch() ব্যাভার করতে পারি । তবে কোড সুন্দর রিডেবল করার জন্য আমরা Try- Catch ব্যবহার করব।
THROW ERROR USING BUILT IN ERROR CLASS
আমরা এক্সপ্রেস এর throw new Error() এর মাধ্যমে এরর থ্রো করতে পারি।
```js
app.get('/example', async (req, res, next) => {
  try {
   const result = await someAsyncOperation();
    res.json(result); 
}catch (error) {
   throw new Eror(‘Error Message’)
 }
});
```
উপরের উদাহরণে, যদি এসিনক্রোনাস কোডে এরর হয় সেটি catch ব্লক ধরে নিয়ে ডিরেক্ট এরর থ্রো করে দেই।
THOW ERROR USING OUR CUSTOM API ERROR CLASS
আমরা এক্সপ্রেস এর throw new ApiError() এর মাধ্যমে এরর থ্রো করতে পারি।
```js
app.get('/example', async (req, res, next) => {
try {
 const result = await someAsyncOperation();
 res.json(result); 
}catch (error) {
  throw new ApiEror( 400 , ‘Error Message )
 }
})
```
উপরের উদাহরণে, যদি এসিনক্রোনাস কোডে এরর হয় সেটি catch ব্লক ধরে নিয়ে ডিরেক্ট এরর থ্রো করে দেই। এক্ষেত্রে কিন্তু আমরা আমাদের কাস্টম ক্লাসের মাধ্যমে স্ট্যাটাস কোড অ এরর মেসেজ দুইটাই থ্রো করতে পারছি ।
PASSING ERROR TO GLOBAL ERROR HANDLER USING NEXT()
আমরা যখন next() ব্যবহার করি তাহলে সে তার পরের মিডলওয়ার ফাংশনকে কল করে । কিন্তু আমরা যখন এরর এর মধ্য দিয়ে কোন আর্গুমেন্ট পাস করব এক্সপ্রেস আর কোন কিছু তোয়াক্কা না করে ডিরেক্ট গ্লোবালেরর হ্যান্ডেলার এর কাছে পাঠিয়ে দেই । মানে গাড়ি করে জেলখানায় পাঠিয়ে দেয় । এই গাড়িকে আমরা কাজে লাগিয়ে সব এরর এক জায়গায় যেন হ্যান্ডেল করতে পারি তাই আমরা রিকুয়েস্ট হ্যান্ডেলারে কোন এরর cartch ব্লক এর মধ্যে ধরে throw Error() / throw new ApiError() না করে আমরা গাড়ি করে পাঠিয়ে দেই গ্লোবাল এরর হ্যান্ডেলার এর কাছে
```js
app.get('/example', (req, res, next) => {
try {
  const result = await someAsyncOperation();
  res.json(result); 
}} catch (error) {
   next(error);
 }
});
```
গ্লোবাল এরর হ্যান্ডলার মিডলওয়্যার তারপর এই এররটি হ্যান্ডল করে স্ট্যাটাস কোড , মেসেজসহ একটি কমন প্যাটার্নে রেসপন্স পাঠায়।
এইবার আমরা একটি গ্লোবাল এরর হ্যান্ডলার সম্পর্কে বিশদভাবে জানব।গ্লোবাল এরর হ্যান্ডলার একটি মিডলওয়্যার হিসাবে এক্সপ্রেস এপ্লিকেশনে ব্যাবহার করা হয় যা সব এররগুলো স্পেসিফিকভাবে হ্যান্ডেলার দিয়ে একে একে ধরে তাদের এরর ফরম্যাট থেকে আমাদের কমন এরর প্যাটার্নে কনভার্ট করে রেসপন্স করে পাঠানো হয় ! আর যদি স্পেসিফিকভাবে ধরা না হয় তাহলে আমরা একটা সিম্পল কমন এরর রেস্পন্স পাঠিয়ে দেই যেমনঃ statusCode=500 , message= ‘Something went wrog !
আবার আমরা গ্লোবাল এরর হ্যান্ডলার ফাংশনের ভিতর এরর এর নির্দিষ্ট টাইপগুলো চেক করার মাধ্যমে স্পেসিফিক এরর রেসপন্স পাঠাই আর কোন টাইপ না মিললে জেনেরিক এরর মেসেজ “Something went wrong” তো আছেই ”
ZODERROR HANDLING
Zod একটি ডাটা ভ্যালিডেশন লাইব্রেরি যা ব্যবহার করে ডাটা ভ্যালিডেশন করতে পারি আমরা। তবে আমরা চাইলে আরো সহজ ভাবে মঙ্গোস দিয়ে করে ফেলতে পারতাম। এখানে zod ইউস করা হয়েছে ।এক্সট্রা সিকিউরিটি লেয়ার অ্যাড করার জন্য। যা ডাটা গুলিকে রাউট থেকেই ভ্যালিডেশন করে ফেলে, কন্ট্রোলারে আর যেতে দেয় না। Zod ব্যবহার করার কারণ এটি কমপ্লেক্স ভ্যালিডেশন রুল দেওয়ার জন্য।
CASTERROR HANDLING
ধরেন আমাদের একটি স্কিমা আছে যেখানে একটি ফিল্ড নাম্বার হওয়ার কথা , কিন্তু ভেলুটি আসলো একটি স্ট্রিং, তাহলে একটি CastError হবে। CastError হ্যান্ডল করে আমরা ইউজার জানাতে পারি যে ঐ ফিল্ডের জন্য ভেলুটি সঠিক না।এবং প্রয়োজনবোধক একটি এরর মেসেজ সেন্ড করতে পারি।
MONGOOSE ERROR HANDLING
ValidationError হলো Mongoose এর একটি বিল্ট-ইন এরর ক্লাস যা ভ্যালিডেশন ত্রুটি হ্যান্ডল করতে ব্যবহার করা হয়। যখন আমরা কোনো Mongoose মডেলের ডেটা ভ্যালিডেশন চেক করি তখন মঙ্গুস ভ্যালিডেশন ক্লাসের ইনস্ট্যান্স ValidationError তৈরি হয়। এর মাধ্যমে আমরা ডেটা ভ্যালিডেশন এররের সমস্যা সম্পর্কে বিস্তারিত তথ্য সেন্ড করতে পারি।
API ERROR INSTANCE → CLASS :
একটি এক্সপ্রেস সার্ভারে API তৈরি করার সময়, এরর হ্যান্ডেল করা খুবই গুরুত্বপূর্ণ । এবং এই এরর হ্যান্ডল করার একটি অন্যতম উপায় হলো জাভাস্ক্রিপ্টের built in class “Error” কে extend করে আমাদের নিজেদের মত করে আরও বেশি হিউম্যান রিডেবল ভাবে সার্ভারের এরর কে দেখানো । অর্থাৎ আমরা নিজেরা একটি class তৈরি করতে পারি যেটা Error class কে extend করে এবং Error class এর সব প্রোপার্টি এবং মেথড নিজের মধ্যে নিয়ে আসবে এবং পাশাপাশি আমরা এক্সট্রা কিছু প্রোপার্টি বা মেথড আমাদের প্রয়োজন অনুসারে যোগ করতে পারব । এখন আমরা যদি আমাদের এপ্লিকেশনের এই throw new APIError() করা এররকে ধরতে চাই তাহলে আমাকে instanceof অপারেটরের মাধ্যমে এরর এই ApiError ক্লাসের instance কিনা চেক করতে পারি ।
JAVASCRIPT ERROR CLASS → CLASS
আমরা জানি Javascript আমাদের কিছু built in দিয়ে থাকে। যেমন Date class এর ব্যাপারে কিন্তু আমরা সবাই জানি। এটা দিয়ে আমরা আমাদের এপ্লিকেশনে ডেট রিলেটেড সব কিছু হ্যান্ডেল করি তাইনা? ঠিক তেমনি একটি Javascript Application এর সব রকম এরর হ্যান্ডেল করার জন্য জাভাস্ক্রিপ্ট আমাদের যে ক্লাস টি দিয়েছে সেটা হচ্ছে Error Class । একটি জাভাস্ক্রিপ্ট এপ্লিকেশনে যত রকম এরর আছে সবই এই Error ক্লাস এর অন্তর্ভুক্ত। এখন আমরা যদি আমাদের এপ্লিকেশনের এই throw new Error() কর এররকে ধরতে চাই তাহলে আমাকে instanceof অপারেটরের মাধ্যমে এরর এই Error ক্লাসের instance কিনা চেক করতে পারি ।
একজন ডেভেলপার হিসেবে আমাদের প্রতিনিয়তই বিভিন্ন প্রকার এরর ফেইস করা লাগে। একটা এপ্লিকেশন ডেভেলপ করার সময় আপনি এরর খাবেন না এটা হতেই পারে না। কিন্তু এই সমস্ত এরর খেয়ে ভয়ে গর্তে চলে যাওয়া যাবে না। বরং আমাদের শক্ত হাতে এই এরর গুলো কে হ্যান্ডেল করতে হবে। তাই আমাদের কে সমস্ত সম্ভাব্য synchronous এবং asynchronous এরর গুলো সম্পর্কে জানা জরুরী। একটা এপ্লিকেশনের ডিবাগিং এর জন্য আমাদের এরর সম্বন্ধে ভালো ধারণা রাখতে হবে।
আপনি যখন প্রফেশনাল ভাবে একটি প্রোডাকশন এপ্লিকেশনে এরর হ্যান্ডেল করা শিখে যাবেন তখন আপনার নেক্সট লেভেল ডেভেলপার হওয়ার পথে আপনি আরও একধাপ এগিয়ে যাবেন। আপনার জন্য শুভকামনা রইল।







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











