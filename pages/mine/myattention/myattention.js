var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.user) {
      this.setData({
        topicId: options.user,
      });
      this.getmyWatchList();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.topicId != wx.getStorageSync('userId')) {
      wx.setNavigationBarTitle({
        title: 'Ta关注的人',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '我的关注',
      })
    }
  },
  getmyWatchList: function () {
    let that = this;
    util.request(api.UsermyWatch, { byUserId: that.data.topicId}).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          list: res.data
        });
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getmyWatchList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  goHomePage: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mine/homepage/homepage?id=' + id
    })
  },
})