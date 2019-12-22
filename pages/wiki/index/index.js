const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wikiList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTopicType();
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

  },
  getTopicType() {
    let that = this;
    util.request(api.TopicType).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          wikiList: res.data.data
        });
      }
    });
  },
})