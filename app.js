
var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./utils/user.js');

App({
  onLaunch: function (options) {
  },
  onShow: function (options) {
    user.checkLogin().then(res => {
      this.globalData.hasLogin = true;
    }).catch(() => {
      this.globalData.hasLogin = false;
    });
    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    }

  },
  onHide: function () { },

  

  globalData: {
    share: false,
    hasLogin: false, 
    netError: "请求数据失败，请检测网络",
    serverError: "服务器繁忙，请稍后重试",
    paramError: "信息丢失，请稍后重试",
    loginTimeout: "未登录或登录超时，请重新登录"
  }
})