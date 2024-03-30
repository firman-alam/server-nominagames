import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

if (!JWT_SECRET_KEY) {
  console.error('JWT secret key is not provided in the environment variables')
  process.exit(1)
}

export default JWT_SECRET_KEY!
