// pages/qrInfo/qrInfo.js
import QR from '../../utils/qrcode.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode: {},
    logo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
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
    let self = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('qrcode', function (data) {
      console.log(data)
      let coin = data.data.coin_code
      let item = app.globalData.assets && app.globalData.assets.filter(e => e.currency == coin)[0]
      let logo = item && item.logo
      self.setData({
        qrcode: data.data,
        logo
      })
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