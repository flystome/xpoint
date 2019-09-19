// pages/history/history.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currency: "",
    total: "",
    page: 1,
    id: "",
    shoppings: []
  },

  goDetail: function(e) {
    let item = e.currentTarget.dataset.item
    if (item.business_type == 'envelope') {
      wx.navigateTo({
        url: `../getRed/getRed?id=${item.id}`,
      })
    } else if (item.business_type == 'vns_order') {
      wx.showModal({
        title: '暂无详情',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '暂无详情',
        showCancel: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this    
    this.setData({
      id: options.id
    })
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: app.globalData.url +'/qpay_vns/asset/history',
      method: "POST",
      data: {
        currency: options.id,
        session: app.globalData.session,
        limit: 15
      },
      success(res) {
        var data = res.data
        // console.log(data)
        if (data.code == 200) {
         self.setData({
           shoppings: data.histories,
           total: data.amount,
           currency: data.currency
         })
        }
      },
      complete() {
        wx.hideLoading()
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
  onShow: function (options) {
    if (this.data.id && options && this.data.id != options.id) {
      this.setData({
        shoppings: []
      })
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
    wx.showLoading({
      title: '正在加载',
    })
    var self = this
    this.setData({
      page: this.data.page+1
    })
    wx.request({
      url: app.globalData.url + '/qpay_vns/asset/history',
      method: "POST",
      data: {
        currency: this.data.id,
        session: app.globalData.session,
        page: `${this.data.page}`
      },
      success(res) {
        var data = res.data
        // console.log(data)
        if (data.code == 200) {
          self.setData({
            shoppings: self.data.shoppings.concat(data.histories)
          })
        }
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})