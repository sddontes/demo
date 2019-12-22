const util = require('../../../utils/util.js')
const api = require('../../../config/api.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    day: '',
    userImg: '',
    comeDays: 0,
    weather:'',
    location: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      date: util.formatTimeToNum(new Date()),
      userImg: wx.getStorageSync('userInfo').avatarUrl,
      day: util.getDates(new Date())
    })
  },
  onShow: function(){
    if (wx.getStorageSync('pubLocation')){
      this.setData({
        location: wx.getStorageSync('pubLocation')
      })
      this.getWeather(this.data.location)
    }else{
      this.handleLocation();
    }
    
    this.getUserInfo();
  },
  handleLocation: function () {
    let that = this;
    // 实例化API核心类
    var qqmapsdk = new QQMapWX({
      key: 'YQXBZ-TNUWX-EXH4X-TSRST-QOLAE-OXB2E'
    });
    wx.getLocation({
      type: 'gcj02',
      success: function (result) {
        //2、根据坐标获取当前位置名称
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: result.latitude,
            longitude: result.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.address_component;
            that.setData({
              locationSuccess: true,
              location: address.province,
            });
            that.getWeather(that.data.location)
            try {
              wx.setStorageSync('pubLocation', address.province);
            } catch (e) {
            }
  
          }
        });
      }
    })
  },
  getWeather:function(location) {
    console.log(location)
    let that= this;
    var url = "https://api.seniverse.com/v3/weather/now.json?key=ovxploexi7nj7kcy&location=" + location+"&language=zh-Hans&unit=c";
    wx.request({
      url: url,
      success: function (res) {
        if (res.data.results[0]){
          let data = res.data.results[0];
          that.setData({
            weather: data.now.text + ', ' + data.now.temperature + '°C'
          })
        }
      }
    });
  },
  choosePhoto: function(){
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        var tmpFiles = res.tempFiles;
        tmpFiles.map(v => {
          v.percent = 0;
          v.uploadFail = false;
        });
        wx.redirectTo({url: '/pages/publish/pictures/pictures?files=' + JSON.stringify(tmpFiles),})
      }
    })
  },
  pubArcticle: function(){
    var that = this;
    if (wx.getStorageSync('arcticle')){
      wx.showModal({
        title: '提示',
        content: '上次有未完成的编辑，是否继续？',
        success(res){
          if (res.confirm) {
            wx.navigateTo({
              url: '../arcticle/arcticle',
            })
          } else if (res.cancel) {
            try {
              wx.removeStorageSync('arcticle')
            } catch (e) {
              // Do something when catch error
            }
            wx.navigateTo({
              url: '../arcticle/arcticle',
            })
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '../arcticle/arcticle',
      })
    }
  },
  getUserInfo: function () {
    let that = this;
    util.request(api.UserComeDays).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          comeDays: res.data.comeDays
        })
      }
    });
  },
})