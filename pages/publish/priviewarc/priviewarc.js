const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    title: '',
    header: '',
    name: '',
    date: '',
    location: '',
    type: '',
    contents: [],
    id:0
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
  onShow: function () {
    let that = this;
    let arcticle = wx.getStorageSync('arcticle');
    let userInfo = wx.getStorageSync('userInfo')
    let content = arcticle.content.join('')
    if(arcticle){
      WxParse.wxParse('content', 'html', content, that, 5);
    }
    that.setData({
      picUrl: arcticle.data.picUrl,
      contents: arcticle.content,
      location: arcticle.data.location,
      type: arcticle.data.type,
      title: arcticle.data.title,
      header: userInfo.avatarUrl,
      name: userInfo.nickName,
      date: util.formatTimeToNum(new Date()),
      id: arcticle.data.arcId
    })
    
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  subAcrticle: function(){
    let that = this;
    util.request(api.publistPic, {
      channel: 'article',
      title: that.data.title,
      content: that.data.contents.join(''),
      location: that.data.location,
      picUrl: that.data.picUrl,
      type: that.data.type,
      id: that.data.id
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        try {
          wx.removeStorageSync('arcticle')
        } catch (e) {
          // Do something when catch error
        }
        wx.showToast({ title: '发布成功！' })
        setTimeout(() => {
          // wx.navigateBack();
            wx.switchTab({
              url: '/pages/index/index',
            })
        }, 1000)
      }
    });
  },
  handleback: function(){
    wx.redirectTo({
      url: '../arcticle/arcticle',
    })
  }
})