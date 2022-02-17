import express from 'express'
// 驗證資料格式的middleware
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import admin from '../middleware/admin.js'

import {
  create,
  getAllEvents,
  updateEventById,
  deleteEvent
} from '../controllers/events.js'
const router = express.Router()

router.post('/', auth, content('multipart/form-data'), upload, create)
router.get('/all', getAllEvents)
router.patch('/:id', auth, admin, content('multipart/form-data'), upload, updateEventById)
router.delete('/:id', auth, admin, deleteEvent)

export default router
