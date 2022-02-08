import tracks from '../models/tracks.js'
export const create = async (req, res) => {
  try {
    console.log(req)
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
    // console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 所有公開的音樂
export const getTracks = async (req, res) => {
  try {
    const result = await tracks.find({ private: false })
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
