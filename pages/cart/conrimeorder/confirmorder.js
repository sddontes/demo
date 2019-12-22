var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actualPrice: 0,  //总付款金额
    checkedGoodsList: [],  //商品列表
    checkedAddress:{}, //地址信息
    freightPrice: 0.00,    //快递费
    totalWeight: 0.00,   //总重量
    goodsTotalPrice: 0.00,     //实际需要支付的总价
    remark: '',   //备注
    cartId: 0,
    addressId: 0,
    couponId: 0,  //下边这两个ID没用
    grouponLinkId: 0,  //参与的团购，如果是发起则为0
    grouponRulesId: 0 //团购规则ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    });
    // this.getAddressList();
    try {
      var cartId = wx.getStorageSync('cartId');
      if (cartId) {
        this.setData({
          'cartId': cartId
        });
      }
      var addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }
    } catch (e) {
      // Do something when catch error
      console.log(e);
    }

    this.getCheckoutInfo();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  addAddress: function(){
    wx.navigateTo({
      url: '/pages/mine/newaddress/newaddress',
    })
  },
  selectAddress: function(){
    wx.navigateTo({
      url: '/pages/mine/address/address',
    })
  },
  //获取checkou信息
  getCheckoutInfo: function () {
    let that = this;
    
    util.request(api.CartCheckout, {
      cartId: that.data.cartId,
      addressId: that.data.addressId,
      couponId: that.data.couponId,
      grouponRulesId: that.data.grouponRulesId
    }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          actualPrice: res.data.actualPrice,
          totalWeight: res.data.totalWeight,
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          goodsTotalPrice: res.data.goodsTotalPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice,
          addressId: res.data.addressId,
          couponId: res.data.couponId,
          grouponRulesId: res.data.grouponRulesId,
        });
      }
      wx.hideLoading();
    });
  },
  handleInput: function(e){
    let that = this;
    that.setData({
      remark: e.detail.value
    })
  },
  submitOrder: function () {
    let that = this;
    if (that.data.addressId <= 0) {
      wx.showToast({ icon: 'none', title: '请选择收货地址' })
      return false;
    }
    util.request(api.OrderSubmit, {
      cartId: that.data.cartId,
      addressId: that.data.addressId,
      remark: that.data.remark,
      couponId: that.data.couponId,
      grouponRulesId: that.data.grouponRulesId,
      grouponLinkId: that.data.grouponLinkId
    }, 'POST').then(res => {
      if (res.errno === 0) {
        const orderId = res.data.orderId;
        const actualPrice = that.data.actualPrice;
        wx.redirectTo({
          url: '../payconfirm/payconfirm?id=' + orderId + '&price=' + actualPrice
        })
      }
    });
  }
  
})