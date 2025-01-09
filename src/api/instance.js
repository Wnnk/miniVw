const request = (config) => {
  config.url = `127.0.0.1/api${config.url}`
  if(!config.data) {
    config.data = {}
  }
  if(!config.header) {
    config.header = {}
  }
  /* 处理请求头 */
  if(config.method === 'POST') {
    config.header['Content-Type'] = 'application/json'
  }
  /* 处理token */
  if(uni.getStorageSync('token')) {
    config.header['Authorization'] = `Bearer ${uni.getStorageSync('token')}`
  }
  return new Promise((resolve, reject) => {
   uni.request({
     ...config,
      success: (res) => {
        if(res.data.code === 2000) {
          resolve(res.data.data)
        } else {
          uni.clearStorageSync()
          switch(res.data.code) {
            case 4001:
              uni.showModal({
                title: '提示',
                content: '请先登录'
              })
              break;
            case 4002:
              uni.showModal({
                title: '提示',
                content: '权限不足'
              })
              break;
            case 4003:
              uni.showModal({
                title: '提示',
                content: '请求方式错误'
              })
            case 4004:
              uni.showModal({
                title: '提示',
                content: '页面不存在'
              })
              break;
          }
        }
      },
      fail: (err) => {
        console.log(err)
        if(err.errMsg.indexOf('request:fail') !== -1) {
          xw.showToast({
            title: '网络请求失败',
            icon: 'error',
            duration: 2000,
          })
        } else {
          wx.showToast({
            title: '未知错误',
            duration: 2000,
          })
        }
        reject(err)
      }
   })
  })
 
}
export default request