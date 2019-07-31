// pages/getRed/getRed.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasGet: false,
    gone: false,
    envelope_id: '',
    redData: {},
    usedVolume : 0,
    envelope: {},
    desc: "恭喜发财，大吉大利",
    button: "领取红包",
    volume: 0,
    open_log: {}
  },

  getUserInfo: function (e) {
    var self = this
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      // this.login()
    }
  },

  getUsedVolume: function(redData) {
    
    var total = 0;
    if(redData) {
      for(var key in redData) {        
        console.log("asdfasdf", redData[key].volume, total)
        total = total + parseFloat(redData[key].volume)
      }
    }
    this.setData({
      usedVolume : total
    })

    console.log(this)
  },

  openRed: function () {
    if (this.data.button == "领取红包") {
      this.getRed()
    } else if (this.data.button == "返回首页") {
      wx.navigateTo({
        url: '../index/index',
      })
    } else if (this.data.button == "红包详情") {
      this.setData({
        hasGet: true
      })
    }
  },

  getRed: function () {
    let self = this
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: `${app.globalData.url}/qpay_vns/envelope/open`,
      method: "POST",
      data: {
        session: app.globalData.session,
        envelope_id: self.data.envelope_id
      },
      success(res) {
        let data = res.data
        if (data.code == 200) {
          let details = data.details

          details && details.length && details.map(e => {
            if (e.nickname == app.globalData.userInfo.nickName) {
              e.avatar = app.globalData.userInfo.avatarUrl
            }
          })
          self.setData({
            hasGet: true,
            redData: details,
            open_log: data.open_log,            
          })
          self.getUsedVolume(details)
        } else if (data.code == 1003) {
          self.setData({
            desc: "红包已抢完",
            button: "红包详情"
          })
        } else if (data.code == 1004) {
          self.setData({
            desc: "红包已失效",
            button: "返回首页"
          })
        } else if (data.code == 1005) {
          self.setData({
            hasGet: true
          })
        }
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  initPage: function (id) {
    let self = this
    this.setData({
      envelope_id: id || "234"
    })
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: `${app.globalData.url}/qpay_vns/envelope/detail`,
      method: "POST",
      data: {
        envelope_id: id || "234",
        session: app.globalData.session
      },
      success(res) {
        var data = res.data
        if (data.code == 200) {
          if (data.envelope.state == 1) {
            self.setData({
              desc: "红包已抢完",
              button: "红包详情",
              envelope: data.envelope,
              redData: data.details,
              open_log: data.open_log,
            })
            self.getUsedVolume(data.details)
            return
          }
          if (data.take_part) {
            self.setData({
              envelope: data.envelope,
              redData: data.details,
              open_log: data.open_log,
              hasGet: true
            })
            self.getUsedVolume(data.details)
          } else {
            self.setData({
              envelope: data.envelope
            })
          }
        }
      },
      fail(err) {
        console.error(err)
      },
      complete(){
        wx.hideLoading()
      }
    })
  },

  goHome () {
    wx.redirectTo({
      url: '../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPage(options.id)
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