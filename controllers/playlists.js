import playlists from '../models/playlists.js'

// 建立歌單
export const create = async (req, res) => {
  try {
    const result = await playlists.create({
      ...req.body,
      owner: req.user._id
    })
    // 創建歌單之後也存進創建者資料裡
    req.user.playlists.push({ playlists: result._id })
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

// 用UserId 去找playlist中 owner是此user 的歌單
export const getUserPlaylists = async (req, res) => {
  try {
    const result = await playlists.find({ owner: req.query.owner }).populate('songs.song', 'cover')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 修改歌單
export const editPlaylist = async (req, res) => {
  const data = {
    title: req.body.title,
    description: req.body.description
  }
  try {
    const result = await playlists.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
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

// 刪除歌單
export const deletePlaylist = async (req, res) => {
  try {
    await playlists.findByIdAndDelete(req.params.id)
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

// 用playlist id找playlist
export const getPlaylistById = async (req, res) => {
  try {
    const result = await playlists.findById(req.params.id).populate({
      path: 'songs.song',
      populate: {
        path: 'artist'
      }
    })
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

// 管理員新增歌單
export const createAdmin = async (req, res) => {
  try {
    const result = await playlists.create({
      ...req.body,
      owner: req.user._id,
      cover: req.files.cover[0].path
    })
    // 創建歌單之後也存進創建者資料裡
    req.user.playlists.push({ playlists: result._id })
    await req.user.save({ validateBeforeSave: false })
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

// 管理員編輯歌單
export const editAdmin = async (req, res) => {
  const data = {
    title: req.body.title,
    type: req.body.type,
    description: req.body.description
  }
  if (JSON.stringify(req.files) !== '{}') {
    data.cover = req.files.cover[0].path
  }
  try {
    const result = await playlists.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
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

// 新增歌曲至歌單
export const addPlaylistSong = async (req, res) => {
  try {
    // 找到要加入的歌單的歌曲欄位
    const playlist = await playlists.findById(req.params.id)
    playlist.songs.push({ song: req.body._id })
    playlist.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '成功加入歌單' })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const deletePlaylistSong = async (req, res) => {
  try {
    await playlists.findByIdAndUpdate(
      req.params.id,
      {
        // 刪除陣列元素
        $pull: {
          // 欄位名稱
          songs: {
            // 刪除條件
            song: req.body._id
          }
        }
      }
    )
    res.status(200).send({ success: true, message: '移除成功' })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
