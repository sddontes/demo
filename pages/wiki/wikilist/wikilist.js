const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [],
    page: 1,
    size: 10,
    total:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.setNavigationBarTitle({
        title: options.title
      });
    if (options.id) {
      this.setData({
        topicId: options.id,
      });
      this.getTopicList();
    }
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let total = that.data.total;
    let page = that.data.page;
    let size = that.data.size;
    if (Math.ceil(total / size) > page){
      that.setData({
        page: page+1
      })
      that.getTopicList();
    }
  },
  getTopicList() {
    let that = this;
    util.request(api.TopicList, { wikiType: that.data.topicId,page: that.data.page,size: that.data.size}).then(function (res) {
      if (res.errno === 0) {
        if (res.data) {
          let msg = that.data.msgList;
          res.data.data.map(v => {
            msg.push(v);
          });
          that.setData({
            msgList: msg,
            total: res.data.count
          });
        }
      }
    });
  },
})