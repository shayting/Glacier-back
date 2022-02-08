//  multer 讓express讀取user上傳的檔案
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
// 將上傳的檔案套件跟上傳的雲端平台綁再一起
import { CloudinaryStorage } from 'multer-storage-cloudinary'
// nodejs內建處理檔案系統用的(file system)
// import fs from 'fs'
// nodejs內建處理路徑用的
// import path from 'path'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

// 上傳設定
const upload = multer({
  // 存在雲端
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      resource_type (req, file) {
        return file.fieldname === 'cover' ? 'image' : 'video'
      }
    }
  }),
  // 過濾檔案類型，因為內建的limits 沒有所以要自己寫
  fileFilter (req, file, callback) {
    // 檢查檔案是不是圖片 mimetype:網路媒體形式
    if (file.fieldname === 'file' && !file.mimetype.includes('audio')) {
      // 觸發自訂的 LIMIT_FORMAT 錯誤
      callback(new multer.MulterError('LIMIT_FILE_FORMAT'), false)
    } else if (file.fieldname === 'cover' && !file.mimetype.includes('image')) {
      // 觸發自訂的 LIMIT_FORMAT 錯誤
      callback(new multer.MulterError('LIMIT_FILE_FORMAT'), false)
    } else {
      callback(null, true)
    }
  },
  // 限制條件參照 npm multer
  limits: {
    // 限制檔案 5MB
    // fileSize單位是 byte
    fileSize: 1024 * 1024 * 5
  }
})

export default async (req, res, next) => {
  // 設定只能上傳單檔案 (也有上傳多檔案的寫法)
  // single('值對應到form-data key')
  upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'file', maxCount: 1 }])(req, res, async (error) => {
    // 檢查是不是上傳錯誤
    console.log(error)
    if (error instanceof multer.MulterError) {
      let message = '上傳錯誤'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else if (error.code === 'LIMIT_FILE_FORMAT') {
        message = '格式不符!'
      }
      res.status(400).send({ success: false, message })
    } else if (error) {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      console.log(req.file)
      next()
    }
  })
}
