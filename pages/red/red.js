// pages/red/red.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    total: '',
    perVal: '',
    num: '',
    isEqual: false,
    redId: 0,
    nickname: "",
    redVal: 0,
    bless: ''
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
    let val = e.detail.value
    let reg = /^\d+(\.\d{1,2})?$/
    let reg2 = /^\d+\.?$/
    if (/^0{1,}\d/.test(val)) {
      val = parseInt(val)
    }
    if (!reg.test(val) && !reg2.test(val)) { 
      val = parseInt(val * 100) / 100
    }
    this.setData({
      total: val,
      perVal: '',
      redVal: val
    })
  },

  perValChange: function (e) {
    let num = this.data.num
    var redVal = ''
    let val = e.detail.value
    let reg = /^\d+(\.\d{1,2})?$/
    let reg2 = /^\d+\.?$/
    if (/^0{1,}\d/.test(val)) {
      val = parseInt(val)
    }
    if (!reg.test(val) && !reg2.test(val)) {
      val = parseInt(val * 100) / 100
    }
    
    if (num && !isNaN(num)) {
      redVal = +val * +num
    }
    this.setData({
      perVal: val,
      redVal: redVal
    })
  },

  numChange: function (e) {
    let perVal = this.data.perVal
    var redVal = ''
    let val = parseInt(e.detail.value)
    if (perVal && !isNaN(perVal)) {
      redVal = val * +perVal
    } else {
      redVal = this.data.total
    }
    this.setData({
      num: val,
      redVal: redVal
    })
  },

  blessChange: function (e) {
    this.setData({
      bless: e.detail.value
    })
  },

  formSubmit: function(e) {
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
        share: ''+share,
        type: type,
        formId: e.detail.formId,
        bless: self.data.bless || '恭喜发财，大吉大利！'
      },
      success(res) {
        var data = res.data
        if (data.code == 200) {
          wx.hideLoading()
          wx.navigateTo({
            url: `../share/share?id=${data.envelope.id}&bless=${data.envelope.bless}`,
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