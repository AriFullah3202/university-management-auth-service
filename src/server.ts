import mongoose from 'mongoose'
import app from './app'
import config from './config/index'

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string)
    console.log('connect successful')

    app.listen(config.port, () => {
      console.log(`the application is running on port ${config.port}`)
    })
  } catch (error: any) {
    console.log(`failed to connect database ${error.message}`)
  }
}

bootstrap()
