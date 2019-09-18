// pages/mine/mine.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    user: {}
  },

  goLogin: function () {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  bindApp: function () {
    if (app.globalData.user && app.globalData.user.bound) {
      wx.showToast({
        title: '您已经绑定账号了',
      })
      return ;
    }
    wx.navigateTo({
      url: '../loginApp/loginApp',
    })
  },

  mkCode: function () {
    wx.navigateTo({
      url: '../qrcode/qrcode'
    })
  },

  getScore: function () {
    if (!app.globalData.session) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {
      wx.navigateTo({
        url: '../showCode/showCode'
        // url: "../chooseCoin/chooseCoin"
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.getUserInfo({
      success(res) {
        self.setData({
          userInfo: res.userInfo
        })
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
    console.log(app.globalData.user)
    let self = this
    if (!this.data.userInfo.nickName) {
      wx.getUserInfo({
        success(res) {
          self.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
    this.setData({
      user: app.globalData.user
    })
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