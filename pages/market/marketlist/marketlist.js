const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    page: 1,
    size: 10,
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id && options.id != 0) {
      wx.setNavigationBarTitle({
        title: options.tit
      });
      this.setData({
        id: options.id,
      });
      this.getGoodsList();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({ page: 1});
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getGoodsList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let total = that.data.total;
    let page = that.data.page;
    let size = that.data.size;
    if (Math.ceil(total / size) > page) {
      that.setData({
        page: page + 1
      })
      that.getGoodsList();
    }
  },
  getGoodsList: function () {
    let that = this;
    util.request(api.GoodsList, {
      page: that.data.page,
      size: that.data.size,
      isNew: true,
      isHot: true,
      brandId: '',
      keyword: '',
      categoryId: that.data.id
    }).then(function (res) {
      if (res.errno === 0) {
        let msg = that.data.goodsList;
        res.data.goodsList.map(v => {
          msg.push(v);
        });
        if (that.data.page > 1) {
          that.setData({
            goodsList: msg,
            total: res.data.count
          });
        } else {
          that.setData({
            goodsList: res.data.goodsList,
            total: res.data.count
          });
        }
      }
    });
  },
})