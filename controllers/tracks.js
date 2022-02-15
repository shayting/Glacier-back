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

// 未登入使用者抓指定人公開的
export const getTracks = async (req, res) => {
  try {
    const result = await tracks.find({ artist: req.query.artist, private: false })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 使用者取自己所有的音樂
export const getPrivate = async (req, res) => {
  try {
    const result = await tracks.find({ artist: req.user.id })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 管理員取得所有音樂(包含不公開) 或個人的所有音樂
export const getAllTracks = async (req, res) => {
  try {
    const result = await tracks.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 用track id 取 track 持有人資料
export const getTrackById = async (req, res) => {
  try {
    const result = await tracks.findById(req.params.id).populate('artist', 'userName avatar account')
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

// 更改音樂資料
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

// 刪除track
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

// 管理員修改tracks資料
export const editTracks = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
  }
  try {
    const data = {
      private: req.body.private
    }
    const result = await tracks.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
