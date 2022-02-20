import mongoose from 'mongoose'

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '缺少歌單名稱']

  },
  description: {
    type: String
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  songs: {
    type: [{
      song: {
        type: mongoose.ObjectId,
        ref: 'tracks'
      }
    }]
  },
  owner: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少創建者ID']
  },
  // type for admin
  type: {
    type: String,
    enum: ['festival', 'vibe', 'normal'],
    default: 'normal'
  },
  // 0 normal user
  // 1 admin
  role: {
    type: Number,
    default: 0
  },
  cover: {
    type: String
  }
}, { versionKey: false })

export default mongoose.model('playlists', playlistSchema)
