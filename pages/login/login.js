// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '授权',
    })
  },

  getUserInfo: function (e) {
    var self = this
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      if (!app.globalData.session) {
        this.login(e.detail.userInfo)
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    }
  },

  login: function (userInfo) {
    var self = this
    wx.showLoading({
      title: '',
    })
    // console.log(app.globalData.code)
    wx.request({
      url: app.globalData.url + '/qpay_vns/user/info',
      method: "POST",
      data: {
        code: app.globalData.code,
        nickname: userInfo.nickName,
        avatar: userInfo.avatarUrl
      },
      success(res) {
        wx.hideLoading()
        var data = res.data
        console.log(res.data)
        if (data.code == 200) {
          app.globalData.session = data.session
          app.globalData.sn = data.sn
          wx.setStorageSync("session", data.session)
          wx.setStorageSync("sn", data.sn)
          let {bound, gen_qrcode, recipient} = data
          let obj = {
            bound,
            gen_qrcode,
            recipient
          }
          app.globalData.user = obj
          let user = "" + JSON.stringify(obj)
          wx.setStorageSync('user', user)
          wx.navigateBack()
        } else {
          wx.showModal({
            title: '授权失败',
            content: '请重新授权',
            showCancel: false
          })
        }
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})