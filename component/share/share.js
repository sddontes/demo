import { _canvas } from '../../utils/canvas.js';
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showModalStatus: false,
    canImgurl: '',
    userInfo: {}

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal: function () {
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },
    hideModal: function () {
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }.bind(this), 200)
    },
    // 点击分享朋友圈按钮
    creatSharePic: function () {
      
      let that = this;
      that.hideModal();
      if (!wx.getStorageSync('userInfo')) {
        wx.navigateTo({
          url: '../../login/login',
        })
        return;
      }
      that.setData({
        userInfo: wx.getStorageSync('userInfo').userInfo
      });
      if (that.data.canImgurl) {
        wx.previewImage({
          urls: [that.data.canImgurl]
        })
        return;
      }
      that.drawImage();
    },
    //canvas画所分享的图片
    drawImage() {
      var that = this
      const ctx = wx.createCanvasContext('myCanvas')
      ctx.setFillStyle('#ffffff');
      ctx.fillRect(0, 0, 375, 667);
      let bgPath = '/images/header.png'
      let portraitPath = that.data.userInfo.avatarUrl
      let qrPath = that.data.userInfo.avatarUrl
      let title = '鱼片的植物'
      let userName = that.data.userInfo.nickName
      let origin = '来自花兮小程序'
      
      // 大图
      _canvas.drawPic({ ctx: ctx, dWidth: 335, dHeight: 335, dx: 20, dy: 30, path: bgPath })
      // // 二维码
      // _canvas.drawPic({ ctx: ctx, type: 'avatar', dWidth: 149, dHeight: 149, dx: 220, dy: 376, path: qrPath })

      _canvas.writeText({ ctx: ctx, color: '#212121', font: 20, dx: 20, dy: 389, baseLine: 'top', txt: (title) });
      _canvas.writeText({ ctx: ctx, font: 15, color: '#222222', dx: 74, dy: 474, baseLine: 'top', txt: (userName) });
      _canvas.writeText({ ctx: ctx, font: 10, color: '#747474', dx: 74, dy: 495, baseLine: 'top', txt: (origin) });
      wx.downloadFile({
        url: that.data.userInfo.avatarUrl,
        header: {},
        success: function (res) {
          _canvas.drawPic({ ctx: ctx, type: 'avatar', dWidth: 40, dHeight: 40, dx: 20, dy: 471, path: res.tempFilePath })
          //绘制图片
          ctx.draw();
          // ctx.draw(false, (e) => {
          //   console.log('执行不')
            wx.showLoading({
              title: '图片正在生成中...'
            });
            setTimeout(function () {  //这里要加定时器，转成图片需要一定的时间，不然是不出来图片的哦
              // canvas画布转成图片
              console.log('eeee')
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
            // });
          }
      });
    }

  }
  
})
