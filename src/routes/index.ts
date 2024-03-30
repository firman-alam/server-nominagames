import express from 'express'
import authRoutes from './authRoutes'
import hobbyRoutes from './hobbyRoutes'
import userRoutes from './userRoutes'
import { verifyToken } from '../middleware/verifyToken'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/api', hobbyRoutes)
router.use('/api', userRoutes)

export default router
