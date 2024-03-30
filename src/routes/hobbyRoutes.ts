import express from 'express'
import {
  addHobby,
  editHobby,
  getHobbies,
  getHobby,
} from '../controllers/hobbyController'

const router = express.Router()

router
  .get('/hobbies', getHobbies)
  .get('/hobby/:id', getHobby)
  .post('/hobby', addHobby)
  .put('/hobby/:id', editHobby)

export default router
