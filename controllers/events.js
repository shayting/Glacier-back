import events from '../models/events.js'

export const create = async (req, res) => {
  // console.log(req.files)
  try {
    const result = await events.create({
      ...req.body,
      cover: req.files.cover[0].path
    })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      console.log(error)
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getAllEvents = async (req, res) => {
  try {
    const result = await events.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const updateEventById = async (req, res) => {
  const data = {
    title: req.body.title,
    performer: req.body.performer,
    place: req.body.place,
    price: req.body.price,
    date: req.body.date,
    content: req.body.content
  }
  console.log(req.files)
  // 如果沒傳檔案會回傳{} 還是會呈現 true 這樣判斷會錯誤，所以改成判斷是不是{}
  if (JSON.stringify(req.files) !== '{}') {
    data.cover = req.files.cover[0].path
  }
  try {
    const result = await events.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    }
  }
}

export const deleteEvent = async (req, res) => {
  try {
    await events.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
