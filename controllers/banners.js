import banners from '../models/banners.js'

// 新增輪播圖圖片
export const uploadBanner = async (req, res) => {
  try {
    console.log(req.body)
    const result = await banners.create({ bannerImage: req.files.cover[0].path })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      // 資料錯誤
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ sucess: false, message: error.errors[key].name })
    } else {
      // 其他錯誤
      res.status(500).send({ sucess: false, message: '伺服器錯誤' })
    }
  }
}

// 拿取
export const getBanner = async (req, res) => {
  try {
    const result = await banners.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      // 資料錯誤
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ sucess: false, message: error.errors[key].name })
    } else {
      // 其他錯誤
      res.status(500).send({ sucess: false, message: '伺服器錯誤' })
    }
  }
}

// 刪除輪播圖圖片
export const deleteBanner = async (req, res) => {
  try {
    await banners.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log('deleteBanner錯誤')
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到商品' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
