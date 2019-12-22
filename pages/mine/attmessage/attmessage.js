var util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    size:10,
    total:0,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({ page: 1 });
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getList();
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
      that.getList();
    }
  },
  getList: function () {
    let that = this;
    util.request(api.Noticelist, {
      page: that.data.page,
      limit: that.data.size}).then(function (res) {
      if (res.errno === 0) {
        let msg = that.data.list;
        res.data.items.map(v => {
          msg.push(v);
        });
        if (that.data.page > 1) {
          that.setData({
            list: msg,
            total: res.data.count
          });
        } else {
          that.setData({
            list: res.data.items,
            total: res.data.total
          });
        }
      }
    });
  },
})