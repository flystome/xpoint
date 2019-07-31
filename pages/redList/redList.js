// pages/redList/redList.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPick: false,
    isSend: true,
    value: 0,
    assets: [],
    sendList: [],
    receivelist: [],
    value: 0
  },

  chooseWay: function (e) {
    // console.log(e)
    let bool = e.target.dataset.bool
    if (bool == '1') {
      this.getHistory("2")
      this.setData({
        isSend: false
      })
    } else {
      this.setData({
        isSend: true
      })
    }
  },

  getHistory (role) {
    wx.showLoading({
      title: '正在加载...',
    })
    let self = this
    wx.request({
      url: `${app.globalData.url}/qpay_vns/envelopes`,
      method: "POST",
      data: {
        session: app.globalData.session,
        limit: '15',
        role: role
      },
      success(res) {
        // console.log(res)
        let data = res.data
        let code = data.code
        if (code == 200) {
          if (role == "1") {
            self.setData({
              sendList: data.records
            })
          } else if (role == '2') {
            self.setData({
              receivelist: data.records
            })
          }  
        } else {
          wx.showModal({
            title: '获取输据失败',
            cancelText: "取消",
            confirmText: "重新获取",
            success(res) {
              if (res.confirm) {
                self.getHistory(role)
              }
            }
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

  getAsset() {
    var self = this
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
            assets: data.assets
          })
        }
      },
      fail(err) {
        console.error(err)
      }
    })
  },

  pickChange(e) {
    let val = e.detail.value
    // console.log(val)
    this.setData({
      value: val[0]
    })
  },

  goRed() {
    let asset = this.data.assets[this.data.value].total
    if (!asset) {
      wx.showModal({
        title: '该积分为0',
        content: '清选择不为0的积分',
        showCancel: false,
        confirmText: '确定'
      })
      return
    } else {
      this.setData({
        showPick: false
      })
      wx.navigateTo({
        url: `../red/red?id=${this.data.assets[this.data.value].currency}&asset=${asset}`
      })
    }
  },

  showList() {
    this.setData({
      showPick: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHistory("1")
    this.getAsset()
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