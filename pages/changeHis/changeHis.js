// pages/changeHis/changeHis.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    history: [],
    page: 1,
    curData: {
      currency: "全部",
      logo: null
    },
    showChoose: false,
    currencies: [{
      currency: "全部",
      logo: null
    }],
    curPage: "pages/changeHis/changeHis",
    allPages: [],
    value: 1,
    product: {},
    showDialog: false
  },

  showDialog: function(e) {
    let item = e.currentTarget.dataset.item
    this.setData({
      showDialog: true,
      product: item
    })
  },

  closeDialog: function() {
    this.setData({
      showDialog: false,
      product: {}
    })
  },

  goShop: function(){
    if (this.data.allPages.includes(this.data.curPage)) {
      let index = this.data.allPages.indexOf(this.data.curPage)
      let len = this.data.allPages.length
      // console.log(index)
      wx.navigateBack({
        delta: (len - index)
      })
    } else {
      wx.navigateTo({
        url: '../exchange/exchange',
      })
    }
  },

  showChoose: function () {
    this.setData({
      showChoose: true
    })
  },

  bindChange: function (e) {
    const val = e.detail.value
    const coin = this.data.currencies[val][0]

    if (coin == "全部") {
      this.getInit()
      this.setData({
        curData: ['全部', null],
        showChoose: false,
        value: val
      })
    } else {
      this.getOrders(this.data.currencies[val].currency)
      this.setData({
        curData: this.data.currencies[val],
        showChoose: false,
        value: val
      })
    }
  },

  getOrders: function (id, page) {
    let self = this
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: app.globalData.url + '/qpay_vns/orders',
      method: "POST",
      data: {
        session: app.globalData.session,
        currency: id,
        page: self.data.page
      },
      success(res) {
        wx.hideLoading()
        var data = res.data
        if (data.code == 200) {
          self.setData({
            history: data.list,
            currencies: [{
              currency: "全部",
              logo: null
            }].concat(data.assets)
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
    this.getOrders()
    let pages = getCurrentPages()
    this.setData({
      allPages: pages.map(e => e.route)
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
    this.setData({
      showChoose: false
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