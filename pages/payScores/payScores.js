// pages/payScores/payScores.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    volume: '',
    currency: 'vns',
    sn: '',
    assets: [],
    item: null,
    avatar: '',
    nickname: ''
  },

  chooseCoin: function () {
    wx.navigateTo({
      url: '../chooseCoin/chooseCoin',
    })
  },

  modal: function (title, content) {
    wx.showModal({
      title: title,
      content: content
    })
  },

  inputChange: function (e) {
    this.setData({
      volume: e.detail.value
    })
  },



  pay: function () {
    let { item, volume, currency, nickname} = this.data
    if (!item) {
      this.modal('支付失败', '积分不存在，请切换积分种类')
    }
    if (item.total < volume) {
      this.modal('支付失败', '积分不足，请修改支付金额')
    }
    let self = this
    wx.showModal({
      title: '确认支付',
      content: `确认支付${volume}${currency.toUpperCase()}给${nickname}`,
      success(res) {
        if (res.confirm) {
          self.payConfirm()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  payConfirm: function () {
    let { item, volume, sn, currency } = this.data
    let self = this
    wx.request({
      url: app.globalData.url + '/qpay_vns/pay',
      method: "POST",
      data: {
        session: app.globalData.session,
        sn,
        volume: '' + volume,
        currency
      },
      success(res) {
        var data = res.data
        if (data.code == 200) {
          wx.showToast({
            title: '付款成功',
            duration: 1500,
            complete() {
              wx.switchTab({
                url: '../index/index'
              })
            }
          })
        } else if (data.code == 1005) {
          self.modal('支付失败', '付款人不存在')
        } else if (data.code == 1006) {
          self.modal('支付失败', '资产不足')
        } else {
          self.modal('支付失败', '')
        }
      }
    })
  },

  getInfo(sn) {
    wx.showLoading({
      title: '正在加载...',
    })
    let self = this
    wx.request({
      url: app.globalData.url + '/qpay_vns/wechat_user/info',
      method: "POST",
      data: {
        sn: self.data.sn
      },
      success(res) {
        var data = res.data
        if (data.code == 200) {
          self.setData({
            avatar: data.avatar,
            nickname: data.nickname
          })
        }
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  getAsset() {
    let self = this
    wx.request({
      url: app.globalData.url + '/qpay_vns/assets',
      method: "POST",
      data: {
        session: app.globalData.session
      },
      success(res) {
        var data = res.data
        if (data.code == 200) {
          self.setData({
            assets: data.assets,
            item: data.assets.filter(e => e.currency == self.data.currency)[0]
          })
          app.globalData.assets = data.assets
          app.globalData.total = data.total_equals_vns
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let q = decodeURIComponent(options.q).split('?')[1]
    let sn = q.split('=')[1]
    if (!sn) {
      this.modal('二维码无效', '请扫描Xpoint小程序的付款码')
      return
    }
    this.setData({
      sn: sn
    })
    if (!app.globalData.session) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    this.getInfo()
    this.getAsset()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      assets: app.globalData.assets,
      item: app.globalData.assets.filter(e => e.currency == this.data.currency)[0]
    })
    // console.log(this.data.assets, this.data.item)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!app.globalData.session) {
      wx.navigateTo({
        url: '../login/login'
      })
      return
    }
    if (!this.data.assets.length) {
      this.getAsset()
    }
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