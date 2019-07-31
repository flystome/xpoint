// pages/loginApp/loginApp.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeText: "获取验证码",
    account: '',
    code: '',
    clock: null,
    disableCode: false,
    isLoading: false
  },

  getCode: function () {
    if (this.data.disableCode) {
      return
    }
    let isMobile = /^1[2-9]\d{9}$/.test(this.data.account)
    let isEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(this.data.account)
    if (!isMobile && !isEmail) {
      wx.showModal({
        title: '发送短信失败',
        content: '请输入正确的手机号或邮箱',
        showCancel: false
      })
      return
    }
    var self = this
    var time = 60
    this.setData({
      disableCode: true
    })
    wx.request({
      url: app.globalData.url + '/qpay_vns/user/send_code',
      method: "POST",
      data: {
        session: app.globalData.session,
        account: this.data.account
      },
      success(res) {
        var data = res.data
        if (data.code == 200) {
          self.data.clock = self.setClock(time)
        } else if (data.code == 1002) {
          wx.showModal({
            title: '发送短信失败',
            content: '该账号已经被绑定',
            showCancel: false
          })
          self.clearClock()
        } else if (data.code == 1003) {
          wx.showModal({
            title: '发送短信失败',
            content: '请输入正确的手机号或邮箱',
            showCancel: false
          })
          self.clearClock()
        } else if (data.code == 1005) {
          wx.showModal({
            title: '发送短信失败',
            content: '短信发送频率太快，请稍后再发',
            showCancel: false
          })
          self.clearClock()
        } else if (data.code == 1006) {
          wx.showModal({
            title: '发送短信失败',
            content: '手机号已被使用',
            showCancel: false
          })
          self.clearClock()
        }
      },
      fail(err) {
        console.error(err)
        this.setData({
          disableCode: false
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  setClock: function(time) {
    var self = this
    return setInterval(function () {
      if (time <= 0) {
        self.clearClock()
      } else {
        self.setData({
          codeText: `${time}s`
        })
        time--
      }
    }, 1000)
  },

  clearClock: function(){
    this.setData({
      clock: null,
      codeText: '重新获取验证码',
      disableCode: false
    })
  },

  bindApp: function() {
    let isMobile = /^1[2-9]\d{9}$/.test(this.data.account)
    let isEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(this.data.account)
    if (!isMobile && !isEmail) {
      wx.showModal({
        title: '绑定账户失败',
        content: '请输入正确的手机号或邮箱',
        showCancel: false
      })
      return
    }
    let isCode = /^\d{6}$/.test(this.data.code)
    console.log(isCode, this.data.code)
    if (!isCode) {
      wx.showModal({
        title: '绑定账户失败',
        content: '请输入正确的验证码',
        showCancel: false
      })
      return
    }
    let self = this
    self.setData({
      isLoading: true
    })
    wx.request({
      url: app.globalData.url + '/qpay_vns/user/bind',
      method: "POST",
      data: {
        session: app.globalData.session,
        account: this.data.account,
        secret: this.data.code
      },
      success(res) {
        var data = res.data
        if (data.code == 200) {
          wx.showModal({
            title: '绑定账户成功',
            showCancel: false,
            complete() {
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];  //上一个页面
              prevPage.setData({
                bound: true
              });
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else if (data.code == 1002) {
          wx.showModal({
            title: '绑定账户失败',
            content: '该账号已经被绑定',
            showCancel: false
          })
        } else if (data.code == 1003) {
          wx.showModal({
            title: '绑定账户失败',
            content: '请输入正确的手机号或邮箱',
            showCancel: false
          })
        } else if (data.code == 1004) {
          wx.showModal({
            title: '绑定账户失败',
            content: '短信验证码错误',
            showCancel: false
          })
        }
      },
      fail(err) {
        console.error(err)
      },
      complete() {
        self.clearClock()
        self.setData({
          isLoading: false
        })
      }
    })
  },

  accountChange: function(e) {
    this.setData({
      account: e.detail.value
    })
  },

  codeChange: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setClock(10)
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
    this.clearClock()
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
// only caught isolate erupt desert flash furnace wage era shiver gown one