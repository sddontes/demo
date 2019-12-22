var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicId:0,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      topicId: wx.getStorageSync('userId')
    })
    this.getmyfansList();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getmyfansList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  getmyfansList: function () {
    let that = this;
    util.request(api.Usermyfans, { byUserId: that.data.topicId }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          list: res.data
        });
      }
    });
  },
  goHomePage: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mine/homepage/homepage?id=' + id
    })
  },
})