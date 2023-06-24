import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') }); // ekhane current directory theke .env file ta kuje nibe .

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  defaultPassword: process.env.DEFAULT_PASSWORD,
  bycrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_rEFRESH_EXPIRES,
  },
};
