var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [
      {
        orderSn: "11", orderStatusText: "zhuangtai1", goodsList: [{ picUrl: "http://images.huaxi0.com/imgs/MyUpload/house/E/B/8FD3EF709CA24B73ABB08E8C029271F2.jpeg", goodsName: "name", price: "20yuan", specifications: "type", number: "2ge"},{ picUrl: "http://images.huaxi0.com/imgs/MyUpload/house/E/B/8FD3EF709CA24B73ABB08E8C029271F2.jpeg", goodsName: "name", price: "20yuan", specifications: "type", number: "2ge"}]
        },
      {
        orderSn: "11", orderStatusText: "zhuangtai1", goodsList: [{ picUrl: "http://images.huaxi0.com/imgs/MyUpload/house/E/B/8FD3EF709CA24B73ABB08E8C029271F2.jpeg", goodsName: "name", price: "20yuan", specifications: "type", number: "2ge" }, { picUrl: "http://images.huaxi0.com/imgs/MyUpload/house/E/B/8FD3EF709CA24B73ABB08E8C029271F2.jpeg", goodsName: "name", price: "20yuan", specifications: "type", number: "2ge" }]
      }
      ],
    showType: 0,
    page: 1,
    size: 10,
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getOrderList();
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
    this.setData({
      orderList:[],
      page:1
    });
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getOrderList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let total = that.data.total;
    let page = that.data.page;
    let size = that.data.size;
    if (Math.ceil(total / size) > page) {
      that.setData({
        page: page + 1
      })
      that.getOrderList();
    }
  },
  getOrderList() {
    // let that = this;
    // util.request(api.OrderList, {
    //   showType: that.data.showType
    // }).then(function (res) {
    //   if (res.errno === 0) {
    //     console.log(res.data);
    //     that.setData({
    //       orderList: res.data.data
    //     });
    //   }
    // });
  },
})