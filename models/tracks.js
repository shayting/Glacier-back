import mongoose from 'mongoose'

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '歌名不得為空']
  },
  private: {
    type: Boolean,
    required: [true, '音樂狀態不可為空']
  },
  type: {
    type: String,
    enum: ['Rock', 'Hip hop / Rap', 'Electronic', 'Pop', 'Folk', 'Alternative', 'Post rock', 'Metal', 'Punk', 'Reggae / Funk', 'R&B / Soul', 'Classic', 'Blues', 'Jazz'],
    required: [true, '缺少音樂類型']
  },
  artist: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少作者ID']
  },
  description: {
    type: String
  },
  lyric: {
    type: String
  },
  cover: {
    type: String
  },
  playsCount: {
    type: Number,
    default: 0
  },
  likes: {
    type: [
      {
        users: {
          type: mongoose.ObjectId,
          ref: 'users',
          required: [true, '缺少按讚人ID']
        }
      }
    ]
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  file: {
    type: String
  },
  comments: {
    type: [
      {
        users: {
          type: mongoose.ObjectId,
          ref: 'users',
          required: [true, '缺少留言者ID']
        },
        message: {
          type: String,
          maxlength: [100, '留言最多100字'],
          minlength: [1, '沒有留言內容'],
          required: [true, '缺少留言內容']
        },
        date: {
          type: Date,
          required: [true, '缺少留言日期']
        }
      }
    ]
  }
}, { versionKey: false })

export default mongoose.model('tracks', trackSchema)
