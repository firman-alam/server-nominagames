import express from 'express'
import {
  addUser,
  editUser,
  getUsers,
  getUser,
} from '../controllers/userController'

const router = express.Router()

router
  .get('/users', getUsers)
  .get('/user/:id', getUser)
  .post('/user', addUser)
  .put('/user/:id', editUser)

export default router
