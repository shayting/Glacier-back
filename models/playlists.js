import mongoose, { Mongoose } from 'mongoose'

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '缺少歌單名稱']

  },
  description: {
    type: String
  },
  cover: {
    type: String,
    required: [true, '缺少歌單封面']
  },
  createDate: {
    type: Date
  },
  songs: {
    type: [{
      song: {
        type: Mongoose.ObjectId,
        ref: 'tracks'
      }
    }]
  },
  owner: {
    type: [{
      user: {
        type: mongoose.ObjectId,
        ref: 'users',
        required: [true, '缺少建立者ID']
      }
    }]
  }
}, { versionKey: false })

export default mongoose.model('playlists', playlistSchema)
