import dotenv from 'dotenv'
dotenv.config() // Load environment variables from .env file

// Configuration object for AWS S3 storage.
const S3_CONFIG = {
  STORAGE_S3_KEY: process.env.STORAGE_S3_KEY,
  STORAGE_S3_SECRET: process.env.STORAGE_S3_SECRET,
  S3_REGION: process.env.STORAGE_S3_REGION,
  S3_BUCKET: process.env.STORAGE_S3_BUCKET
}

// JWT token for authentication.
const TOKEN = process.env.TOKEN

// Object representing accountability information.
const ACCOUNTABILITY = {
  ip: '127.0.0.1',
  admin: true,
  user: process?.env?.BOT_USER_ID,
  role: process?.env?.BOT_ROLE,
  app: true
}

// Secret key for JWT token.
const SECRET = process.env.SECRET

//  Public URL for accessing resources.
const PUBLIC_URL = process.env.PUBLIC_URL
const TELVUE_URL = process.env.TELVUE_URL

export { S3_CONFIG, TOKEN, ACCOUNTABILITY, SECRET, PUBLIC_URL, TELVUE_URL }
