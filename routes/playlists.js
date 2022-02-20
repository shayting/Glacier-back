import express from 'express'
// 驗證資料格式的middleware
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { create, getUserPlaylists, editPlaylist, deletePlaylist, getPlaylistById, createAdmin, editAdmin, addPlaylistSong, deletePlaylistSong } from '../controllers/playlists.js'

const router = express.Router()
router.post('/admin', auth, admin, content('multipart/form-data'), upload, createAdmin)
router.post('/', auth, content('application/json'), create)
router.get('/:id', getPlaylistById)
// 用userId 找到playlist owner欄位是此userId的歌單
router.get('/', getUserPlaylists)
router.patch('/admin/:id', auth, admin, content('multipart/form-data'), upload, editAdmin)
router.patch('/addsong/:id', auth, addPlaylistSong)
router.patch('/deletesong/:id', auth, deletePlaylistSong)
router.patch('/:id', auth, content('application/json'), editPlaylist)
router.delete('/:id', auth, deletePlaylist)

export default router
