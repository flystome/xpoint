// pages/exchange/exchange.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    products: [],
    product: {},
    num: 1,
    showDialog: false,
    currencies: [{
      currency: "全部",
      logo: null
    }],
    curData: {
      currency: "全部", 
      logo: null
    },
    diaData: {},
    showChoose: false,
    product_id: 0
  },

  getInit (id, page) {
    var self = this
    wx.request({
      url: app.globalData.url + '/qpay_vns/products',
      method: "POST",
      data: {
        session: app.globalData.session,
        currency: id,
        page: page || this.data.page
      },
      success(res) {
        var data = res.data
        if (data.code == 200) {
          wx.hideLoading()
          self.setData({
            products: data.list,
            product: (data.list && data.list[0]) || {},
            currencies: self.data.currencies.concat(data.assets)
          })
        }
        console.log(self.data.currencies)
      },
      fail(err) {
        console.error(err)
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  showInfo: function (e) {
    let item = e.currentTarget.dataset.item
    let curCoin = item.currency

    this.setData({
      product: item,
      showDialog: true,
      product_id: item.id,
      diaData: this.data.currencies.filter(e =>  e.currency == curCoin)[0]
    })
    console.log(this.data.diaData)
  },

  closeDialog: function () {
    this.setData({
      product: {},
      showDialog: false,
      diaData: []
    })
  },

  bindChange: function (e) {
    const val = e.detail.value
    const coin = this.data.currencies[val][0]
    
    if (coin == "全部") {
      this.getInit()
      this.setData({
        curData: ['全部', null],
        showChoose: false
      })
    } else {
      this.getInit(this.data.currencies[val].currency)
      this.setData({
        curData: this.data.currencies[val],
        showChoose: false
      })
    }
  },

  showChoose: function () {
    this.setData({
      showChoose: true
    })
  },

  changeNum: function (e) {
    let step = +e.currentTarget.dataset.step
    if (this.data.num + step < 1) {
      this.setData({
        num: 1
      })
    } else if (this.data.num + step > this.data.product.quantity) {
      this.setData({
        num: this.data.product.quantity
      })
    } else {
      this.setData({
        num: this.data.num + step
      })
    }
  },

  exchange: function () {
    let total = this.data.product.price * this.data.num
    console.log(this.data.diaData)
    if (total > this.data.diaData.total) {
      wx.showModal({
        title: `${this.diaData.currency}积分不够`,
        content: '请根据已有积分调整数量',
      })
    }
    wx.showLoading({
      title: '正在兑换...',
    })
    wx.request({
      url: app.globalData.url + '/qpay_vns/product/buy',
      method: "POST",
      data: {
        session: app.globalData.session,
        product_id: this.data.product_id,
        count: this.data.num
      },
      success(res) {
        console.log(res)
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
    this.getInit()
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