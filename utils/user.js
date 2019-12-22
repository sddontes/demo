/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * Promise封装wx.checkSession，检测当前用户登录态是否有效
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

/**
 * Promise封装wx.login,调微信登录接口，获取到code，则promise实例状态成功
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function getOpenId(){
  return new Promise(function (resolve, reject) {
    login().then((res) => {
      var wxUrl = "https://api.weixin.qq.com/sns/jscode2session?appid=wx3435d7ba4110871c&secret=96e2f9f8c9ba23b70f446fac991e2053&js_code="+res.code+"&grant_type=authorization_code";
      wx.request({
        url: wxUrl,
        data: {},
        method: "POST",
        header: {
          'Content-Type': 'application/json',
          'X-Litemall-Token': wx.getStorageSync('token')
        },
        success: function (res) {
          resolve(res);
        },
        fail: function (err) {
          reject(err)
        }
      })
    })


  });
}

/**
 * 调用微信登录
 */
function loginByWeixin(userInfo) {
  return new Promise(function (resolve, reject) {
    getOpenId().then(res => {
      //login()成功获取code,则调后台登录接口，进行微信登录，调用接口成功且res.errno===0，则执行promise成功方法，否则该promise状态改为失败
      util.request(api.AuthLoginByWeixin, { openId: res.data.openid}, 'POST').then(res => {
        console.log("hahah")
        if (res) {
          //存储用户信息
          wx.setStorageSync('userInfo', res.data.userUuid);
          // wx.setStorageSync('userInfo', res.data.userInfo);
          // wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('token', res.data.sessionId);
          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  });

}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    // 如果有userInfo和token,怎检验session的有效性，否则这个promise实例状态改为失败
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      // 检验session有效性，状态成功，执行resolve,失败情况执行reject
      checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    } else {
      reject(false);
    }
  });
}

module.exports = {
  loginByWeixin,
  checkLogin
};