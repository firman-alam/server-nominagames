import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import client from '../config/dbConfig'
import JWT_SECRET_KEY from '../config/jwtSecret'

const handleError = (err: any, res: Response) => {
  console.error('Error:', err)
  res.status(500).json({ message: 'Internal server error', status: false })
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [
      email,
    ])
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }
    const user = result.rows[0]

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      res
        .status(401)
        .json({ message: 'Email or Password not match', status: false })
      return
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      JWT_SECRET_KEY,
      { expiresIn: '1h' }
    )

    res
      .status(200)
      .json({ message: 'User is authorized', token: token, status: true })
  } catch (err) {
    handleError(err, res)
  }
}

export const register = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, age } = req.body
  try {
    const emailExists = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    if (emailExists.rows.length > 0) {
      res
        .status(400)
        .json({ message: 'Email address already in use', status: false })
      return
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await client.query(
      'INSERT INTO users (first_name, last_name, email, password, age) VALUES ($1, $2, $3, $4, $5)',
      [first_name, last_name, email, hashedPassword, age]
    )

    res
      .status(201)
      .json({ message: 'User registered successfully', status: true })
  } catch (err) {
    handleError(err, res)
  }
}
