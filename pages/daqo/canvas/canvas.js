const app = getApp()
import { _canvas } from '../../../utils/canvas.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: wx.getSystemInfoSync().windowHeight,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    if (!wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '../../login/login',
      })
    }
    _this.setData({
      userInfo: wx.getStorageSync('userInfo')
    });
    this.drawImage();
  },
   //canvas画所分享的图片
  drawImage(cb) {
    var that = this
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(0, 0, 375, 667);
    let userInfo = wx.getStorageSync('userInfo');
    let bgPath = '/images/header.png'
    let portraitPath = userInfo.avatarUrl
    let qrPath = userInfo.avatarUrl
    let title = '鱼片的植物'
    let userName = userInfo.nickName
    let origin = '来自花兮小程序'
    // 大图
    _canvas.drawPic({ ctx: ctx, dWidth: 335, dHeight: 335, dx: 20, dy: 30, path: bgPath })
    // // 二维码
    // _canvas.drawPic({ ctx: ctx, type: 'avatar', dWidth: 149, dHeight: 149, dx: 220, dy: 376, path: qrPath })

    _canvas.writeText({ ctx: ctx, color: '#212121', font: 20, dx: 20, dy: 389, baseLine: 'top', txt: (title) });
    _canvas.writeText({ ctx: ctx, font: 15, color: '#222222', dx: 74, dy: 474, baseLine: 'top', txt: (userName) });
    _canvas.writeText({ ctx: ctx, font: 10, color: '#747474', dx: 74, dy: 495, baseLine: 'top', txt: (origin) });
    wx.downloadFile({
      url: userInfo.avatarUrl,
      header: {},
      success: function (res) {
        _canvas.drawPic({ ctx: ctx, type: 'avatar', dWidth: 40, dHeight: 40, dx: 20, dy: 471, path: res.tempFilePath })
        ctx.draw(false, cb);
      }
    });
  },
  // 点击分享朋友圈按钮
  creatSharePic: function () {
    let that = this;
    that.hideModal();
    if (!wx.getStorageSync('userInfo') || !app.globalData.hasLogin) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return;
    }
    if (that.data.canImgurl) {
      wx.previewImage({
        urls: [that.data.canImgurl]
      })
      return;
    }

    that.drawImage(function (e) {
      wx.showLoading({
        title: '图片正在生成中...'
      });
      setTimeout(function () {  //这里要加定时器，转成图片需要一定的时间，不然是不出来图片的哦
        // canvas画布转成图片
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 375,
          height: 557,
          destWidth: 1125, //1125，1500
          destHeight: 1671, //1671，2228
          quality: 1,
          canvasId: 'myCanvas',
          fileType: 'jpg',  //这里为图片格式，最好改为jpg，如果png的话，图片存到手机可能有黑色背景部分
          success: function (res) {
            console.log(res);
            that.setData({
              canImgurl: res.tempFilePath,
            });
            wx.previewImage({
              urls: [res.tempFilePath],
            })
            wx.hideLoading()
          },
          fail: function () {
            console.log("保存失败......")
          }
        })
      }, 1000)
    });
  }











})