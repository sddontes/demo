const app = getApp();
const user = require('../../utils/user.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  getUserInfo: function(e){
    let _this = this;
    
    if (e.detail.userInfo == undefined) {
      app.globalData.hasLogin = false;
      wx.showToast({icon: 'none',title: '微信登录失败'})
      return;
    }
    // catch证明该用户未登录或登录已失效，故需重新登录
    user.checkLogin().catch(() => {
      // 微信登录处理
      user.loginByWeixin(e.detail.userInfo).then(res => {
        app.globalData.hasLogin = true;
        try {
          wx.setStorageSync('userId', res.data.userId);
        } catch (e) {
        }
        wx.navigateBack({
          delta: 1
        })
      }).catch((err) => {
        app.globalData.hasLogin = false;
        wx.showToast({ icon: 'none', title: '微信登录失败' })
      });
    });
  }
})