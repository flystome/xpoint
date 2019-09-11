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
    product_id: 0,
    value: 1,
    address: '',
    name: '',
    phone: '',
    showAddress: false,
    addressText: '新地址',
    curPic: null
  },

  goHis() {
    if (!app.globalData.userInfo) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../changeHis/changeHis',
      })
    }
  },

  addressChange: function (e) {
    this.setData({
      address: e.detail.value
    })
  },

  nameChange: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  phoneChange: function (e) {
    this.setData({
      phone: e.detail.value
    })
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
          let showAddress  = false
          if (data.recipient.name) {
            showAddress = true 
          }
          let value = data.assets.map(e => e.currency).indexOf(id)
          
          self.setData({
            products: data.list,
            product: (data.list && data.list[0]) || {},
            address: data.recipient.address,
            name: data.recipient.name,
            phone: data.recipient.phone,
            showAddress: showAddress,
            currencies: [{
              currency: "全部",
              logo: null
            }].concat(data.assets)
          })
          self.setData({
            value: value+1,
            curData: self.data.currencies[value+1],
          })
        }
        // console.log(self.data.currencies)
      },
      fail(err) {
        console.error(err)
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  showPic: function (e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    this.setData({
      curPic: item
    })
  },

  closeDialog1: function() {
    this.setData({
      curPic: null
    })
  },

  showInfo: function (e) {
    if (!app.globalData.userInfo) {
      wx.navigateTo({
        url: '../login/login',
      })
      return 
    }
    let item = e.currentTarget.dataset.item
    let curCoin = item.currency

    this.setData({
      product: item,
      showDialog: true,
      product_id: item.id,
      diaData: this.data.currencies.filter(e =>  e.currency == curCoin)[0] || null
    })
    // console.log(this.data.diaData)
  },

  closeDialog: function () {
    this.setData({
      product: {},
      showDialog: false,
      diaData: {}
    })
  },

  editAddress: function () {
    console.log(111)
    this.setData({
      showAddress: false
    })
  },

  bindChange: function (e) {
    const val = e.detail.value
    const coin = this.data.currencies[val].currency
    if (coin == "全部") {
      this.getInit()
      this.setData({
        curData: ['全部', null],
        showChoose: false,
        value: val
      })
    } else {
      this.getInit(this.data.currencies[val].currency)
      this.setData({
        curData: this.data.currencies[val],
        showChoose: false,
        value: val
      })
    }
  },

  showChoose: function () {
    // console.log(this.data.value, 111)
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

  formSubmit: function (e) {
    let total = this.data.product.price * this.data.num
    if (!this.data.diaData || total > this.data.diaData.total) {
      wx.showModal({
        title: `积分不够`,
        content: '请确认有足够的该积分',
      })
      return
    }
    if (!this.data.address || !this.data.name || !this.data.phone) {
      wx.showModal({
        title: '兑换失败',
        content: '请完善收货地址',
      })
    }
    let isMobile = /^1[2-9]\d{9}$/.test(this.data.phone)
    if (!isMobile) {
      wx.showModal({
        title: '兑换失败',
        content: '联系电话无效',
      })
    }
    wx.showLoading({
      title: '正在兑换...',
    })
    let product = this.data.product
    let self = this
    wx.request({
      url: app.globalData.url + '/qpay_vns/product/buy',
      method: "POST",
      data: {
        session: app.globalData.session,
        product_id: this.data.product_id,
        count: this.data.num,
        name: this.data.name,
        address: this.data.address,
        phone: this.data.phone,
        formId: e.detail.formId
      },
      success(res) {
        // console.log(res)
        let data = res.data
        if (data.code == 200) {
          let products = self.data.products
          products = products.map(e => {
            if (e.id == self.data.product_id) {
              e.quantity = e.quantity - data.order.quantity
            }
            // console.log(e)
            return e
          })
          self.setData({
            products: products,
            showAddress: true
          })
          wx.navigateTo({
            url: `../sucChange/sucChange`,
            success (res) {
              // 通过eventChannel向被打开页面传送数据
              data.order.productImg = product.logo
              data.order.logo = self.data.diaData.logo
              data.order.total = total
              res.eventChannel.emit('orderData', { data: data.order })
            }
          })
        } else if (data.code == 1004) {
          wx.showModal({
            title: '下单失败',
            content: '库存不足，请重新下单',
            showCancel: false
          })
        } else if (data.code == 1005) {
          wx.showModal({
            title: '下单失败',
            content: '您的积分不够',
            showCancel: false
          })
        } else if (data.code == 1008) {
          wx.showModal({
            title: '下单失败',
            content: '收货人信息无效',
            showCancel: false
          })
        } else if (data.code == 1009) {
          wx.showModal({
            title: '下单失败',
            content: '联系电话无效',
            showCancel: false
          })
        } else if (data.code == 1010) {
          wx.showModal({
            title: '下单失败',
            content: '收货地址无效',
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '下单失败',
            showCancel: false
          })
        }
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
    let id = options.id
    this.getInit(id)
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
      showDialog: false,
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