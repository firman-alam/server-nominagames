import { Request, Response } from 'express'
import client from '../config/dbConfig'

const handleError = (err: any, res: Response) => {
  res.status(500).json({ error: 'Internal server error' })
}

export const getHobbies = async (req: Request, res: Response) => {
  try {
    let query = req.query.search as string

    let queryString = 'SELECT * FROM hobbies'
    let queryParams: any[] = []

    if (query && query.trim() !== '') {
      queryString += ' WHERE hobby_name ILIKE $1'
      queryParams.push(`%${query.trim()}%`)
    }

    const result = await client.query(queryString, queryParams)

    res.status(200).json({
      message: 'Success get hobbies',
      status: true,
      data: result.rows,
    })
  } catch (err) {
    handleError(err, res)
  }
}

export const getHobby = async (req: Request, res: Response) => {
  try {
    const hobbyId = req.params.id

    const queryString = 'SELECT * FROM hobbies WHERE hobby_id = $1'
    const queryParams = [hobbyId]

    const result = await client.query(queryString, queryParams)

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Hobby not found',
        status: false,
        data: null,
      })
    }

    res.status(200).json({
      message: 'Success get hobby by ID',
      status: true,
      data: result.rows[0],
    })
  } catch (err) {
    handleError(err, res)
  }
}

export const addHobby = async (req: Request, res: Response) => {
  const { hobby_name, is_active } = req.body
  try {
    const existingHobby = await client.query(
      'SELECT * FROM hobbies WHERE hobby_name = $1',
      [hobby_name]
    )
    if (existingHobby.rows.length > 0) {
      return res
        .status(400)
        .json({ message: 'Hobby name already exists', status: false })
    }

    const result = await client.query(
      'INSERT INTO hobbies (hobby_name, is_active) VALUES ($1, $2)',
      [hobby_name, is_active]
    )

    res.status(201).json({ message: 'Hobby added successfully', status: true })
  } catch (err) {
    handleError(err, res)
  }
}

export const editHobby = async (req: Request, res: Response) => {
  const hobbyId = req.params.id
  const { hobby_name, is_active } = req.body
  try {
    const result = await client.query(
      'UPDATE hobbies SET hobby_name = $1, is_active = $2 WHERE hobby_id = $3',
      [hobby_name, is_active, hobbyId]
    )

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Hobby not found', status: false })
    } else {
      res
        .status(200)
        .json({ message: 'Hobby updated successfully', status: true })
    }
  } catch (err) {
    handleError(err, res)
  }
}
