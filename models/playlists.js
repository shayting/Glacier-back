import mongoose from 'mongoose'

const playlistSchema = new mongoose.Schema({
  title: {},
  description: {},
  cover: {},
  createDate: {},
  songs: {},
  owner: {}
}, { versionKey: false })

export default mongoose.model('playlists', playlistSchema)
