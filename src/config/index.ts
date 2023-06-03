import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') }) // ekhane current directory theke .env file ta kuje nibe .

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  defaultPassword: process.env.DEFAULT_PASSWORD,
}
