// pages/showCode/showCode.js
// import QR from '../../utils/qrcode.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: ''
  },

  // createQrCode: function (content, canvasId, cavW, cavH) {
  //   //调用插件中的draw方法，绘制二维码图片
  //   QR.api.draw(content, canvasId, cavW, cavH);
  //   this.canvasToTempImage(canvasId);
  // },

  // //获取临时缓存图片路径，存入data中
  // canvasToTempImage: function (canvasId) {
  //   let that = this;
  //   wx.canvasToTempFilePath({
  //     canvasId,   // 这里canvasId即之前创建的canvas-id
  //     success: function (res) {
  //       let tempFilePath = res.tempFilePath;
  //       console.log(tempFilePath);
  //       that.setData({       // 如果采用mpvue,即 this.imagePath = tempFilePath
  //         imagePath: tempFilePath,
  //       });
  //     },
  //     fail: function (res) {
  //       console.log(res);
  //     }
  //   });
  // },

  setScores: function () {
    wx.navigateTo({
      url: '../setScores/setScores',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      address: app.globalData.user && app.globalData.user.paycode
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
    // this.createQrCode(this.data.address, 'mycanvas', 300, 300)
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