import mongoose, { Mongoose } from 'mongoose'

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '歌名不得為空']
  },
  private: {
    type: Boolean,
    default: false,
    required: [true, '音樂狀態不可為空']
  },
  type: {
    type: String,
    enum: ['Rock', 'Hip hop / Rap', 'Electronic', 'Pop', 'Folk', 'Alternative', 'Post rock', 'Metal', 'Punk', 'Reggae / Funk', 'R&B / Soul', 'Classic', 'Blues', 'Jazz'],
    required: [true, '缺少音樂類型']
  },
  artist: {
    type: Mongoose.ObjectId,
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
    type: Number
  },
  likes: {
    type: [
      {
        users: {
          type: Mongoose.ObjectId,
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
    type: String,
    required: [true, '缺少音樂檔案']
  },
  comments: {
    type: [
      {
        users: {
          type: Mongoose.ObjectId,
          ref: 'users',
          required: [true, '缺少留言者ID']
        },
        message: {
          type: String,
          maxlength: [100, '留言最多10字'],
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
