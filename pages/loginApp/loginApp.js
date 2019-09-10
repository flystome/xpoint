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
    password: '',
    disableCode: false,
    isLoading: false
  },

  modal: function (title, content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false
    })
  },

  getCode: function () {
    if (this.data.disableCode) {
      return
    }
    let isMobile = /^1[2-9]\d{9}$/.test(this.data.account)
    let isEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(this.data.account)
    if (!isMobile && !isEmail) {
      this.modal('发送短信失败', '请输入正确的手机号或邮箱')
      return
    }
    var self = this
    var time = 60
    this.setData({
      disableCode: true
    })
    let timer = setInterval(function () {
      if (time <= 0) {
        timer = null
      } else {
        self.setData({
          codeText: `${time}s`
        })
        time--
      }
    }, 1000)
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
          wx.showToast({
            title: '发送验证码成功',
          })
        } else if (data.code == 1002) {
          self.modal('发送短信失败', '该账号已经被绑定')
          clearInterval(timer)
          self.clearClock()
        } else if (data.code == 1003) {
          self.modal('发送短信失败', '请输入正确的手机号或邮箱')
          clearInterval(timer)
          self.clearClock(time)
        } else if (data.code == 1005) {
          self.modal('发送短信失败', '短信发送频率太快，请稍后再发')
          clearInterval(timer)
          self.clearClock()
        } else if (data.code == 1006) {
          self.modal('发送短信失败', '手机号已被使用')
          clearInterval(timer)
          self.clearClock()
        } else {
          self.modal('发送短信失败', '')
          clearInterval(timer)
          self.clearClock()
        }
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  clearClock: function(){
    this.setData({
      codeText: '重新获取验证码',
      disableCode: false
    })
  },

  bindApp: function() {
    let {account, code, password} = this.data
    let isMobile = /^1[2-9]\d{9}$/.test(account)
    let isEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(account)
    if (!isMobile && !isEmail) {
      this.modal('绑定账户失败', '请输入正确的手机号或邮箱')
      return
    }
    let isCode = /^\d{6}$/.test(code)
    
    if (!isCode) {
      this.modal('绑定账户失败', '请输入正确的验证码')
      return
    }
    let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,18}$/
    if (!(reg.test(password))) {
      this.modal('绑定账户失败', '请输入8到18位数字、字母组合密码')
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
        account: account,
        secret: code,
        password: password
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
          self.modal('绑定账户失败', '该账号已经被绑定')
        } else if (data.code == 1003) {
          self.modal('绑定账户失败', '请输入正确的手机号或邮箱')
        } else if (data.code == 1004) {
          self.modal('绑定账户失败', '短信验证码错误')
        } else {
          self.modal('绑定账户失败')
        }
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

  passwordChange: function (e) {
    this.setData({
      password: e.detail.value
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