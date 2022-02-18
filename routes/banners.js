import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'

import { uploadBanner, getBanner, deleteBanner } from '../controllers/banners.js'
const router = express.Router()
// 新增
router.post('/', auth, admin, content('multipart/form-data'), upload, uploadBanner)
// 拿取
router.get('/', getBanner)
// 刪除
router.delete('/:id', auth, admin, deleteBanner)
export default router
