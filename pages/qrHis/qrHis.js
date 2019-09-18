// pages/qrHis/qrHis.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodes: []
  },

  goDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../qrInfo/qrInfo',
      success(res) {
        res.eventChannel.emit('qrcode', { data: item })
      }
    })
  },

  getCodes: function (page) {
    var self = this
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: app.globalData.url + '/qpay_vns/qrcodes',
      method: "POST",
      data: {
        session: app.globalData.session,
        page
      },
      success(res) {
        var data = res.data
        console.log(data)
        if (data.code == 200) {
          self.setData({
            qrcodes: data.qrcodes
          })
        }
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCodes()
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