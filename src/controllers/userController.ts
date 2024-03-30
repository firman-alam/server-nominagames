import { Request, Response } from 'express'
import client from '../config/dbConfig'

const handleError = (err: any, res: Response) => {
  res.status(500).json({ message: 'Internal server error', status: false })
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    let query = req.query.search as string

    let queryString = 'SELECT user_id, first_name, last_name, age FROM users'
    let queryParams: any[] = []

    if (query && query.trim() !== '') {
      queryString += ' WHERE first_name ILIKE $1 OR last_name ILIKE $1'
      queryParams.push(`%${query.trim()}%`)
    }

    const userDataQuery = queryString
    const userDataResult = await client.query(userDataQuery, queryParams)

    // Query to fetch count of users
    const countQuery = 'SELECT COUNT(*) FROM users'
    const countResult = await client.query(countQuery)

    const totalUsers = parseInt(countResult.rows[0].count, 10)

    res.status(200).json({
      data: userDataResult.rows,
      total: totalUsers,
      message: 'Success get data user',
      status: true,
    })
  } catch (err) {
    handleError(err, res)
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id

    const queryString = 'SELECT * FROM users WHERE user_id = $1'
    const queryParams = [userId]

    const result = await client.query(queryString, queryParams)

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found',
        status: false,
        data: null,
      })
    }

    res.status(200).json({
      message: 'Success get user by ID',
      status: true,
      data: result.rows[0],
    })
  } catch (err) {
    handleError(err, res)
  }
}

export const addUser = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, age, hobby_id } = req.body

  try {
    const emailExists = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    if (emailExists.rows.length > 0) {
      return res
        .status(400)
        .json({ message: 'Email address already in use', status: false })
    }

    const result = await client.query(
      'INSERT INTO users (first_name, last_name, email, password, age, hobby_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [first_name, last_name, email, password, age, hobby_id]
    )

    if (result.rowCount === 1) {
      res.status(201).json({ message: 'User added successfully', status: true })
    }
  } catch (err) {
    handleError(err, res)
  }
}

export const editUser = async (req: Request, res: Response) => {
  const userId = req.params.id
  const { first_name, last_name, email, age, hobby_id } = req.body

  try {
    const result = await client.query(
      'UPDATE users SET first_name = $1, last_name = $2, email = $3, age = $4, hobby_id = $5 WHERE user_id = $6',
      [first_name, last_name, email, age, hobby_id, userId]
    )

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'User not found', status: false })
    } else {
      res
        .status(200)
        .json({ message: 'User updated successfully', status: true })
    }
  } catch (err) {
    handleError(err, res)
  }
}
