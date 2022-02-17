import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '缺少活動名稱']
  },
  content: {
    type: String,
    required: [true, '缺少活動內容']
  },
  cover: {
    type: String,
    required: [true, '缺少活動封面']
  },
  date: {
    type: Date,
    required: [true, '缺少活動日期']
  },
  performer: {
    type: String,
    required: [true, '缺少活動表演者']
  },
  place: {
    type: String,
    required: [true, '缺少活動地點']
  },
  price: {
    type: String,
    required: [true, '缺少活動票價']
  }
}, { versionKey: false })

export default mongoose.model('events', eventSchema)
