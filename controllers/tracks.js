import tracks from '../models/tracks.js'
export const create = async (req, res) => {
  try {
    const result = await tracks.create({
      ...req.body,
      cover: req.files.cover[0].path,
      file: req.files.file[0].path,
      artist: req.user._id
    })
    req.user.tracks.push({ track: result._id })
    await req.user.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      console.log(error)
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 所有公開的音樂
export const getTracks = async (req, res) => {
  try {
    const result = await tracks.find({})
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllTracks = async (req, res) => {
  try {
    const result = await tracks.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getTrackById = async (req, res) => {
  try {
    const result = await tracks.findById(req.params.id)
    if (result) {
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: false, message: '找不到' })
    }
  } catch (error) {
    // id格式錯誤
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    }
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const updateTrackById = async (req, res) => {
  const data = {
    title: req.body.title,
    private: req.body.private,
    type: req.body.type,
    description: req.body.description,
    lyric: req.body.lyric
  }
  console.log(req.files)
  // 如果沒傳檔案會回傳{} 還是會呈現 true 這樣判斷會錯誤，所以改成判斷是不是{}
  if (JSON.stringify(req.files) !== '{}') {
    data.cover = req.files.cover[0].path
    data.file = req.files.file[0].path
  }
  console.log(data)
  try {
    const result = await tracks.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
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

export const deleteTrack = async (req, res) => {
  try {
    await tracks.findByIdAndDelete(req.params.id)
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
