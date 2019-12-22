var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    totalWeight:0,
    handleOption:{},
    poptxt: '',
    hanldeType: 0,  //1退款，2删除
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // options.id = 28
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得popup组件
    this.popup = this.selectComponent("#popup");
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getOrderDetail();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

  },
  getOrderDetail: function () {
    let that = this;
    util.request(api.OrderDetail, {
      orderId: that.data.orderId
    }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          orderInfo: res.data.orderInfo,
          orderGoods: res.data.orderGoods,
          totalWeight: res.data.totalWeight,
          handleOption: res.data.orderInfo.handleOption
        });
      }
    });
  },
  getOrderExpress: function () {
    let that = this;
    util.request(api.ExpressQuery, {
      expCode: that.data.orderInfo.expCode,
      expNo: that.data.orderInfo.expNo
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.setData({
          expressInfo: res.data
        });
      }
    });
  },
  handlePay: function(){
    const orderId = this.data.orderId;
    const price = this.data.orderInfo.actualPrice;
    wx.redirectTo({
      url: '/pages/cart/payconfirm/payconfirm?id=' + orderId + '&price=' + price,
    })
  },
  //取消事件
  _error() {
    console.log('你点击了取消');
    this.popup.hidePopup();
  },
  //确认事件
  _success() {
    this.popup.hidePopup();
    let that = this;
    let orderInfo = that.data.orderInfo;
    if(that.data.hanldeType == 1){   //退款
      util.request(api.OrderRefund, {
        orderId: orderInfo.id
      }, 'POST').then(function (res) {
        if (res.errno === 0) {
          wx.showToast({
            title: '已申请退款'
          });
          wx.navigateBack({
            delta: '1'
          })
        }
      });
    } else if (that.data.hanldeType == 2) { //删除
      util.request(api.OrderDelete, {
        orderId: orderInfo.id
      }, 'POST').then(function (res) {
        if (res.errno === 0) {
          wx.showToast({ title: '删除订单成功' });
          wx.navigateBack({
            delta: '1'
          })
        }
      });
    }  
  },
  deleteOrder: function(e){
    this.popup.showPopup();
    this.setData({
      poptxt: '确定要删除商品？',
      hanldeType: e.currentTarget.dataset.type
    });
  },
  // “取消订单并退款”点击效果
  refundOrder: function (e) {
    this.popup.showPopup();
    this.setData({
      poptxt: '确定要申请退款？',
      hanldeType: e.currentTarget.dataset.type
    });
  },
  goCheckWuliu: function(){
    wx.navigateTo({
      url: '/pages/order/detail/detailp',
    })
  } 
})