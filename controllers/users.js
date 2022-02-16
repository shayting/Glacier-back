import md5 from 'md5'
import users from '../models/users.js'
import tracks from '../models/tracks.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: ' ' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const login = async (req, res) => {
  try {
    const user = await users.findOne({ account: req.body.account, password: md5(req.body.password) }, '-password')
    if (user) {
      const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET, { expiresIn: '7 days' })
      user.tokens.push(token)
      await user.save()
      // 要傳回前台的物件
      const result = user.toObject()
      delete result.tokens
      result.token = token
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: false, message: '帳號或密碼錯誤' })
    }
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id.toString() }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    req.user.markModified('tokens')
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: { token } })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 取得自己資料
export const getUserInfo = (req, res) => {
  try {
    const result = req.user.toObject()
    delete result.tokens
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 使用者編輯自己的資訊
export const editUserById = async (req, res) => {
  const data = {
    userName: req.body.userName,
    description: req.body.description
  }
  if (JSON.stringify(req.files) !== '{}') {
    data.avatar = req.files.cover[0].path
  }
  try {
    const result = await users.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    }
  }
}

// 管理員取得所有會員資料
export const getAllUsers = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
  }
  try {
    const result = await users.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 管理員修改使用者資料
export const editUsers = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
  }
  try {
    const data = {
      account: req.body.account,
      email: req.body.email,
      userName: req.body.userName,
      active: req.body.active
    }
    const result = await users.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
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

// 一般使用者取得他人資料
// .populate(路徑,欄位)
export const getUserById = async (req, res) => {
  try {
    const result = await users.findById(req.params.id).populate('likes.tracks', 'title cover file artist')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError') {
      res.status(400).send({ success: false, message: '查無使用者' })
    }
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 取得user tracks
export const getUserTracks = async (req, res) => {
  try {
    const { tracks } = await users.findById(req.params.id, 'tracks').populate('tracks.track')
    res.status(200).send({ success: true, message: '', result: tracks })
  } catch (error) {
    console.log('getUserTracks錯誤')
    res.status(500).send({ sucess: false, message: '伺服器錯誤' })
  }
}

// 取得user follow
export const getUserFollow = async (req, res) => {
  try {
    const result = await users.findById(req.params.id, 'followers following').populate('followers.users').populate('following.users')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log('getUserFollow錯誤')
    res.status(500).send({ sucess: false, message: '伺服器錯誤' })
  }
}

// 喜歡
export const like = async (req, res) => {
  try {
    // 檢查是不是已經喜歡
    // 儲存了此人按讚的所有歌曲id
    const user = await users.findById(req.user.id, 'likes')
    // 儲存了這首歌曲所有按讚人id
    const track = await tracks.findById(req.body._id, 'likes')
    // 判斷此人按讚的陣列裡是否已包含傳出的這首歌id
    const data = user.likes.map(l => l.tracks).toString().includes(req.body._id)
    // 如果user likes陣列裡已經有這個track id 就移除
    if (data === true) {
      await users.findByIdAndUpdate(
        req.user.id,
        {
          // 刪除陣列元素
          $pull: {
            // 欄位名稱
            likes: {
              // 刪除條件
              tracks: req.body._id
            }
          }
        }
      )
      await tracks.findByIdAndUpdate(
        req.body._id,
        {
          $pull: {
            likes: {
              users: req.user.id
            }
          }
        }
      )
      res.status(200).send({ success: true, message: '取消喜歡' })
    } else {
      // 尚未喜歡 就將歌曲push到user likes 並將此人的id 也push進trash likes 中
      user.likes.push({ tracks: req.body._id })
      track.likes.push({ users: req.user.id })
      user.save({ validateBeforeSave: false })
      track.save({ validateBeforeSave: false })
      res.status(200).send({ success: true, message: '加入喜歡' })
    }
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

// 追蹤
export const follow = async (req, res) => {
  try {
    // 如果使用者ID 不等於此頁面用戶ID
    if (req.user.id.toString() !== req.body._id.toString()) {
      // 當前使用者追蹤人與此頁面用戶的粉絲名單比對
      const user = await users.findById(req.user.id, 'following')
      const userFollow = await users.findById(req.body._id, 'followers')
      const idx = user.following.map(f => f.users).toString().includes(req.body._id)
      // 有找到->使用者取消追蹤&頁面者移除粉絲
      if (idx === true) {
        await users.findByIdAndUpdate(
          req.user.id,
          {
            $pull: {
              following: {
                users: req.body._id
              }
            }
          }
        )
        await users.findByIdAndUpdate(
          req.body._id,
          {
            $pull: {
              followers: {
                users: req.user.id
              }
            }
          }
        )
        res.status(200).send({ success: true, message: '取消追蹤' })
      } else {
        // 尚未追蹤
        // 沒找到->使用者加入追蹤名單&頁面用戶加入粉絲
        user.following.push({ users: req.body._id })
        userFollow.followers.push({ users: req.user.id })
        user.save({ validateBeforeSave: false })
        userFollow.save({ validateBeforeSave: false })
        res.status(200).send({ success: true, message: '加入追蹤' })
      }
    }
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
