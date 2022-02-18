import mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema({
  bannerImage: {
    type: String
  }
}, { versionKey: false })

export default mongoose.model('banners', bannerSchema)
