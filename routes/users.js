import express from 'express'
// 驗證資料格式的middleware
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import { register, login, logout, extend, getUserInfo, editUserById, getAllUsers, editUsers, getUserById, getUserTracks, like, follow, getUserFollow } from '../controllers/users.js'

const router = express.Router()

// 註冊
router.post('/', content('application/json'), register)
// 登入
router.post('/login', content('application/json'), login)
// 登出
router.delete('/logout', auth, logout)
// token舊換新
router.post('/extend', auth, extend)
// 取得個人資料
router.get('/me', auth, getUserInfo)
// 管理員取得所有user資料
router.get('/all', auth, getAllUsers)
// 取得個別user資料
router.get('/:id', getUserById)
// 取得個別user tracks
router.get('/:id/tracks', getUserTracks)
// 取得個別的user follow
router.get('/:id/follow', getUserFollow)
router.get('/:id/Myfollow', getUserFollow)
// 使用者修改喜歡
router.patch('/likes/:id', auth, content('application/json'), like)
// 使用者改追蹤狀態
router.patch('/follow/:id', auth, content('application/json'), follow)
// 修改使用者資料
router.patch('/:id', auth, content('multipart/form-data'), upload, editUserById)
// 管理員修改使用者資料
router.patch('/admin/:id', auth, editUsers)
export default router
