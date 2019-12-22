var app = getApp();
var util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: '点击登录',
      avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    myBeUpvote:0,
    myfansCount:0,
    myfavCount:0,
    hidddenvcon: false,
    userId:0
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
  onShow:function () {
    //获取用户的登录信息
    if (wx.getStorageSync('userInfo')) {
      let userInfo = wx.getStorageSync('userInfo');
      this.getUserInfo();
      this.setData({
        userInfo: userInfo,
        userId: wx.getStorageSync('userId')
      });
    }
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
    this.getUserInfo();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
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
  
  },
  getUserInfo: function(){
    let that = this;
    util.request(api.UserIndex).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          myBeUpvote: res.data.myBeUpvote,
          myfansCount: res.data.myfansCount,
          myfavCount: res.data.myfavCount
        })
      }
    });
  },
  goLogin() {
    // console.log(app.globalData.hasLogin)
    if (!app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  gomessage(){
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/mine/message/message"
      });
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  goattention(){
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/mine/myattention/myattention?user=" + this.data.userId
      });
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  gomyfans(){
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/mine/myfans/myfans?user=" + this.data.userId
      });
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  gosupport(){
    if(app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/mine/support/support"
      });
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  gohome(){
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/mine/myhome/myhome"
      });
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  goCollect() {
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/mine/collectarc/collectarc"
      });
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  goOrder() {
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/order/order/order"
      });
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  goAddress() {
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/mine/address/address"
      });
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    };
  }

})