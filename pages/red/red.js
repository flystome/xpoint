// pages/red/red.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    total: 0,
    perVal: 0,
    num: 0,
    isEqual: false,
    redId: 0,
    nickname: "",
    redVal: 0
  },

  changeWay: function(e) {
    let bool = e.target.dataset.bool
    if (bool == '1') {
      this.setData({
        isEqual: true
      })
    } else {
      this.setData({
        isEqual: false
      })
    }
  },

  totalChange: function(e) {
    this.setData({
      total: e.detail.value,
      perVal: 0,
      redVal: e.detail.value
    })
  },

  perValChange: function (e) {
    let num = this.data.num
    var redVal = 0
    if (num && !isNaN(num)) {
      redVal = +e.detail.value * +num
    }
    this.setData({
      perVal: e.detail.value,
      redVal: redVal
    })
  },

  numChange: function (e) {
    let perVal = this.data.perVal
    var redVal = 0
    if (perVal && !isNaN(perVal)) {
      redVal = +e.detail.value * +perVal
    } else {
      redVal = this.data.total
    }
    this.setData({
      num: e.detail.value,
      redVal: redVal
    })
  },

  send: function() {
    let amount = 0
    let share = 0
    let type = 0
    if (!this.data.num || isNaN(this.data.num)) {
      wx.showModal({
        title: '请输入正确的数值',
        content: '',
        showCancel: false
      })
      return 
    } else {
      share = this.data.num
    }
    if (this.data.isEqual) {
      if (!this.data.perVal || isNaN(this.data.perVal)) {
        wx.showModal({
          title: '请输入正确的数值',
          content: '',
          showCancel: false
        })
        return
      } else {
        amount = +this.data.num * +this.data.perVal + ""
        type = "1"
      }
    } else {
      if (!this.data.total || isNaN(this.data.total)) {
        wx.showModal({
          title: '请输入正确的数值',
          content: '',
          showCancel: false
        })
        return
      } else {
        amount = this.data.total
        type = "2"
      }
    }
    if (+this.data.redVal > +this.total) {
      wx.showModal({
        title: '积分不够',
        content: '',
        showCancel: false
      })
    }
    wx.showLoading({
      title: '正在发送...',
    })
    let self = this
    wx.request({
      url: app.globalData.url + '/qpay_vns/envelope/send',
      method: "POST",
      data: {
        session: app.globalData.session,
        currency: self.data.id,
        volume: amount,
        share: share,
        type: type
      },
      success(res) {
        var data = res.data
        if (data.code == 200) {
          wx.hideLoading()
          wx.navigateTo({
            url: `../share/share?id=${data.envelope.id}`,
          })
        } else if (data.code == 1003) {
          wx.showModal({
            title: '发红包失败',
            content: '红包总金额太小',
            showCancel: false
          })
        } else if (data.code == 1006) {
          wx.showModal({
            title: '发红包失败',
            content: '余额不足',
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '发红包失败',
            showCancel: false
          })
        }
      },
      fail(err) {
        console.error(err)
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
    // console.log(options)
    this.setData({
      id: options.id,
      asset: options.asset
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      return {
        title: '分享红包',
        path: "",
        imageUrl: "../index/img/red.png"
      }
    }
  }
})