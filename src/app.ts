import express, { Application } from 'express'
import cors from 'cors'
import router from './app/modules/users/user.route'
import globalErrorHandler from './app/middlewares/golobalErrorHandler'
//import ApiError from './error/ApiError'

const app: Application = express()
app.use(cors())
//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Application run

app.use('/api/v1/users/', router)

//by default node development e thake
//console.log(app.get('env'))

// app.get('/', (req: Request, res: Response, next: NextFunction) => {
//   //next('ore baba error')
//   throw new ApiError(404, 'calling')
// })
//app.get('/test', async (req: Request, res: Response, next: NextFunction) => {})

app.use(globalErrorHandler)

export default app
