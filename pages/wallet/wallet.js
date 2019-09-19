
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currency: "",
    total: 0,
    bound: false,
    userInfo: {},
    assets: [
      
    ]
  },

  goDetail(e) {
    wx.navigateTo({
      url: `../history/history?id=${e.currentTarget.dataset.id}`
    })
  },

  goLogin() {
    wx.navigateTo({
      url: `../login/login`
    })
  },

  exchange() {
    wx.navigateTo({
      url: `../exchange/exchange`
    })
    // wx.showModal({
    //   title: '',
    //   content: '敬请期待！',
    //   showCancel: false,
    //   confirmText: '确定'
    // })
  },

  showList () {
    if (!this.data.total) {
      wx.showModal({
        title: '',
        content: '没有用于发红包的积分',
        showCancel: false,
        confirmText: '确定'
      })
      return
    } else {
      wx.navigateTo({
        url: `../redList/redList`,
      })
    }
    
  },
 
  getData () {
    var self = this
    wx.request({
      url: app.globalData.url + '/qpay_vns/assets',
      method: "POST",
      data: {
        session: app.globalData.session,
        nickname: app.globalData.userInfo && app.globalData.userInfo.nickName,
        avatar: app.globalData.userInfo && app.globalData.userInfo.avatarUrl,
      },
      success(res) {
        var data = res.data
        if (data.code == 200) {
          wx.hideLoading()
          self.setData({
            assets: data.assets,
            total: data.total_equals_vns,
            currency: data.assets[0] && data.assets[0].currency || 0,
            bound: data.bound
          })
        }
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  bindApp: function () {
    wx.navigateTo({
      url: '../loginApp/loginApp'
    })
  },

  goRed: function (e) {
    // console.log(e)
    let id = e.currentTarget.dataset.id
    let asset = e.currentTarget.dataset.total
    wx.navigateTo({
      url: `../red/red?id=${id}&asset=${asset}`
    })
  },

  exchange1: function (e) {
    let id = e.currentTarget.dataset.id
    console.log(e)
    wx.navigateTo({
      url: `../exchange/exchange?id=${id}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    wx.getUserInfo({
      success(res){
        self.setData({
          userInfo: res.userInfo
        })
      }
    })
    
    wx.showLoading({
      title: '正在加载',
    })
    if (app.globalData.session) {
      // console.log("has session")
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
    this.getData()
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    // console.log(this.data.userInfo)
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