// pages/earnPoint/earnPoint.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    shoppingInfo: "",
    shoppingPoints: "",
    currency: "",
    currencyName: "",
    qrcode: "",
    text: "立即领取",
    text1: "恭喜您获得 ",
    session: ""
  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },

  getData: function() {
    var self = this
    if (!this.data.id) {
      wx.hideLoading()
      return
    }
    wx.request({
      url: app.globalData.url + '/qpay_vns/qrcode/info',
      method: "POST",
      data: {
        code: self.data.id
      },
      success(res) {
        wx.hideLoading()
        var data = res.data
        if (data.code == 200) {
          var result = data.qrcode
          self.setData({
            shoppingInfo: result.product_name,
            shoppingPoints: result.score,
            currency: `${result.coin_code.toUpperCase()}`,
            currencyName: `(${result.coin_name})`,
            qrcode: result.group_qrcode
          })
        } else if (data.code == 1002) {
          wx.showToast({
            title: '二维码无效',
            content: '奖励已经被领取',
            duration: 2000,
            complete() {
              self.setData({
                text: "回到首页",
                text1: "奖励已失效"
              })
            }
          })
        } else if (data.code == 1003) {
          wx.showToast({
            title: '二维码无效',
            content: '二维码已过期',
            duration: 2000,
            complete() {
              self.setData({
                text: "回到首页",
                text1: "奖励已失效"
              })
            }
          })
        }
      },
      fail(err) {
        wx.hideLoading()
        console.error(err)
      }
    })
  },

  getScore: function () {
    if (this.data.text == "回到首页") {
      wx.redirectTo({
        url: '../index/index',
      })
      return
    }
    var self = this
    wx.request({
      url: app.globalData.url + '/qpay_vns/qrcode/receive',
      method: "POST",
      data: {
        code: this.data.id,
        session: app.globalData.session
      },
      success(res) {
        var data = res.data
        if (data.code == 200) {
          wx.showModal({
            title: '领取成功',
            content: `获得${self.data.shoppingPoints}${self.data.currency.toUpperCase()}`,
            showCancel: false,
            complete() {
              wx.redirectTo({
                url: '../index/index',
              })
            }
          })
        } else if (data.code == 1003) {
          wx.showModal({
            title: '领取失败',
            content: '奖励已经被领取',
            confirmText: '去首页',
            showCancel: false,
            complete() {
              wx.redirectTo({
                url: '../index/index',
              })
            }
          })
        } else if (data.code == 1004) {
          wx.showModal({
            title: '领取失败',
            content: '二维码已过去',
            confirmText: '去首页',
            showCancel: false,
            complete() {
              wx.redirectTo({
                url: '../index/index',
              })
            }
          })
        }
      },
      fail(err) {
        console.error(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载...',
    })
    wx.setNavigationBarTitle({
      title: '领取积分',
    })
    var self = this
    var href = decodeURIComponent(options.q).split('?')[1] || ""
    var id = href.split("=")[1] || ""
    this.setData({
      id: id
    })
    if (app.globalData.session) {
      this.setData({
        session: app.globalData.session
      })
      this.getData()
    } else {
      app.watch(self.getData, "session")
    }
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
    wx.hideModal
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})