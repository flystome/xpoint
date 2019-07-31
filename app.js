//app.js
App({
  globalData: {
    userInfo: null,
    url: "https://www.banbeikafei.com",
    uid: "",
    session: "",
    code: ''
  },
  onShow: function (options) {
    let arr = [1007, 1008, 1011, 1012, 1013]
    if (!(arr.includes(options.scene)) && options.path != "pages/index/index") {
      wx.redirectTo({
        url: '../../pages/index/index'
      })
    }
  },
  onLaunch: function (options) {
    var session = wx.getStorageSync("session")
    if (session) {
      this.globalData.session = session
    } else {
      this.globalData.session = ""
      wx.clearStorage("session")
      var self = this
      // 登录
      wx.login({
        success: res => {          
          self.globalData.code = res.code          
        }
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(res.userInfo)
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.navigateTo({
            url: '../../pages/login/login'
          })
        }
      }
    })
  },
  watch: function (method) {
    var obj = this.globalData;
    Object.defineProperty(obj, "session", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._name = value;
        method(value);
      },
      get: function () {
        return this._name
      }
    })
  },

  refreshSession: function () {
    var self = this
    wx.showLoading({
      title: '',
    })
    console.log(this.globalData.code)
    wx.request({
      url: self.globalData.url + '/qpay_vns/user/info',
      method: "POST",
      data: {
        code: self.globalData.code,        
      },

      success(res) {
        wx.hideLoading()
        var data = res.data
        if (data.code == 200) {
          self.globalData.session = data.session
          wx.setStorage({
            key: "session",
            data: data.session
          })          
        } else {
          wx.showModal({
            title: '授权失败',
            content: '请重新授权',
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
  
})