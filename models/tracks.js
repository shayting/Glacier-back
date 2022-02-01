import mongoose from 'mongoose'

const trackSchema = new mongoose.Schema({
  title: {},
  type: {},
  artist: {},
  description: {},
  lyric: {},
  cover: {},
  playsCount: {},
  likesCount: {},
  uploadDate: {},
  file: {},
  message: {}
}, { versionKey: false })

export default mongoose.model('tracks', trackSchema)
