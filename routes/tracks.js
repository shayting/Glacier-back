import express from 'express'
// 驗證資料格式的middleware
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import admin from '../middleware/admin.js'

import {
  create,
  getTracks,
  getAllTracks,
  getTrackById,
  updateTrackById,
  deleteTrack,
  editTracks
} from '../controllers/tracks.js'
const router = express.Router()

router.post('/', auth, content('multipart/form-data'), upload, create)
router.get('/', getTracks)
router.get('/all', auth, admin, getAllTracks)
router.get('/:id', getTrackById)
router.patch('/:id', auth, content('multipart/form-data'), upload, updateTrackById)
// 管理員修改使用者資料
router.patch('/admin/:id', auth, editTracks)
router.delete('/:id', auth, deleteTrack)

export default router
