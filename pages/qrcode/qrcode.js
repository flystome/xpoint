// pages/qrcode/qrcode.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currency: 'vns',
    expired_at: '',
    years: '',
    months: '',
    days: '',
    value: [],
    volume: '',
    times: '',
    showPick: false
  },

  chooseCoin: function () {
    wx.navigateTo({
      url: '../chooseCoin/chooseCoin',
    })
  },

  goQr: function () {
    wx.navigateTo({
      url: '../qrHis/qrHis'
    })
  },

  showPicker: function () {
    this.setData({
      showPick: true
    })
  },

  changeVolume: function (e) {
    const val = e.detail.value
    this.setData({
      volume: val
    })
  },

  changeTimes: function (e) {
    const val = e.detail.value
    this.setData({
      times: val
    })
  },

  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      expired_at: `${this.data.years[val[0]]}-${this.data.months[val[1]]}-${this.data.days[val[2]]}`
    })
  },

  modal: function (title, content) {
    wx.showModal({
      title: title,
      content: content,
    })
  },

  qrcode: function () {
    let { expired_at, currency, times, volume } = this.data
    if (!volume) {
      this.modal('生成积分失败', '请输入单个码积分数量')
    }
    if (!times) {
      this.modal('生成积分失败', '请输入可领取次数')
    }
    let self = this
    wx.request({
      url: app.globalData.url + '/qpay_vns/gen_qrcode',
      method: "POST",
      data: {
        session: app.globalData.session,
        currency,
        score: ''+volume,
        count: times,
        expired_at: `${expired_at} 00:00:00`
      },
      success(res) {
        var data = res.data
        if (data.code == 200) {
          wx.navigateTo({
            url: '../qrInfo/qrInfo',
            success (res) {
              res.eventChannel.emit('qrcode', { data: data.qrcode })
            }
          })
        } else if (data.code == 1002) {
          self.modal("生成码失败", "您没有生成码的权限")
        } else if (data.code == 1005) {
          self.modal("生成码失败", "积分余额不足")
        } else {
          wx.showModal({
            title: '生成码失败',
            showCancel: false
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let d = new Date()
    let years = []
    let months = []
    let days = []
    for (let i = d.getFullYear(); i <= 2030; i++) {
      years.push(i)
    }

    for (let i = 1; i <= 12; i++) {
      months.push(i)
    }

    for (let i = 1; i <= 31; i++) {
      days.push(i)
    }
    let value = [0]
    value.push(d.getMonth())
    value.push(d.getDate()-1)
    this.setData({
      expired_at: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
      years,
      months,
      days,
      value
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