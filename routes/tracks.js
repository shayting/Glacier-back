import express from 'express'
// 驗證資料格式的middleware
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import admin from '../middleware/admin.js'

import {
  create,
  getAllTracks,
  getTrackById
} from '../controllers/tracks.js'
const router = express.Router()

router.post('/', auth, content('multipart/form-data'), upload, create)
router.get('/all', auth, admin, getAllTracks)
router.get('/:id', getTrackById)

export default router
