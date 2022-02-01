import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: {},
  description: {},
  cover: {},
  date: {},
  performance: {},
  place: {}
}, { versionKey: false })

export default mongoose.model('events', eventSchema)
