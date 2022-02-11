import mongoose from 'mongoose'
import md5 from 'md5'
import validator from 'validator'

const userSchema = new mongoose.Schema({
  account: {
    type: String,
    minlength: [4, '帳號必須4個字以上'],
    maxlength: [20, '帳號不能超過20字'],
    unique: true,
    required: [true, '帳號不能為空']
  },
  password: {
    type: String,
    required: [true, '密碼不能為空']
  },
  email: {
    type: String,
    required: [true, '信箱不能為空'],
    unique: true,
    validate: {
      validator (email) {
        return validator.isEmail(email)
      },
      message: '信箱格式不正確'
    }
  },
  userName: {
    type: String,
    minlength: [1, '名稱最少2個字'],
    maxlength: [20, '名稱最多20個字'],
    default: '預設'
  },
  tokens: {
    type: [String]
  },
  avatar: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: ''
  },
  // user上傳的音樂
  tracks: {
    type: [{
      track: {
        type: mongoose.ObjectId,
        ref: 'tracks',
        required: [true, '缺少音樂ID']
      }
    }]
  },
  // user儲存的活動
  events: {
    type: [{
      event: {
        type: mongoose.ObjectId,
        ref: 'events',
        required: [true, '缺少活動ID']
      }
    }]
  },
  // user喜歡的音樂
  likes: {
    type: [{
      music: {
        type: mongoose.ObjectId,
        ref: 'tracks',
        required: [true, '缺少音樂ID']
      }
    }]
  },
  // user建立的歌單
  playlists: {
    type: [{
      playlists: {
        type: mongoose.ObjectId,
        ref: 'playlists',
        required: [true, '缺少歌單ID']
      }
    }]
  },
  // user追蹤的人
  following: {
    type: [{
      users: {
        type: mongoose.ObjectId,
        ref: 'users',
        required: [true, '缺少追蹤者ID']
      }
    }]
  },
  // user粉絲
  followers: {
    type: [{
      users: {
        type: mongoose.ObjectId,
        ref: 'users',
        required: [true, '缺少粉絲ID']
      }
    }]
  },
  role: {
    // 0 會員 1 管理員
    type: Number,
    default: 0
  }
}, { versionKey: false })

// 存進資料庫前的字數判斷與加密
userSchema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = md5(user.password)
    } else {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

userSchema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = md5(user.password)
    } else {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

export default mongoose.model('users', userSchema)
