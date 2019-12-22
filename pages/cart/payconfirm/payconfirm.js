var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    actualPrice:0,
    disPay: false,  //是否可点支付按钮,
    format: ''
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    if (options.id && options.id != 0) {
      this.setData({
        id: options.id,
        actualPrice: options.price
      });
      this.getcanPayTime();
      
    }
  },
  countdowm(timestamp) {
    let that = this;
    let timer = setInterval(function () {
      let nowTime = new Date();
      let endTime = new Date(timestamp);
      // let t = endTime.getTime() - nowTime.getTime();
      let t = endTime.getTime();
      if (t > 0) {
        let hour = Math.floor((t / 3600000) % 24);
        let min = Math.floor((t / 60000) % 60);
        let sec = Math.floor((t / 1000) % 60);
        hour = hour < 10 ? "0" + hour : hour;
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        that.setData({
          format: hour + ':' + min + ':' + sec
        })
        timestamp = timestamp - 1000;
      } else {
        clearInterval(timer);
        that.setData({
          format: '00:00:00'
        })
      }
    }, 1000);
  },


  handlePay: function(){
    let that = this;
    if(!that.data.disPay){
      util.request(api.OrderPrepay, { orderId: that.data.id }, 'POST').then(function (res) {
        if (res.errno === 0) {
          const payParam = res.data;
          that.setData({
            disPay: true
          });
          wx.showLoading({
            title: '正在支付...',
          });
          wx.requestPayment({
            'timeStamp': payParam.timeStamp,
            'nonceStr': payParam.nonceStr,
            'package': payParam.packageValue,
            'signType': payParam.signType,
            'paySign': payParam.paySign,
            'success': function (res) {
              console.log("支付过程成功");
              wx.redirectTo({
                url: '/pages/cart/paysuccess/paysuccess'
              });
            },
            'fail': function (res) {
              that.setData({
                disPay: false
              });
              wx.hideLoading()
              wx.showToast({ icon: 'none', title: '支付失败，请稍后再试' })
            },
            'complete': function (res) {
              console.log("支付过程结束")
            }
          });
        }
      });
    }
  },
  getcanPayTime: function () {
    let that = this;
    util.request(api.OrdercanPayTime, { orderId: that.data.id}).then(function (res) {
      if (res.errno === 0) {
        that.countdowm(res.data.canPayTime)
      }
    });
  },
})