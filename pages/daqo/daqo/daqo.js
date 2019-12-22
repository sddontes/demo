var util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '全部',
    daqoId:"",
    type:0,
    daqoList:[1,2,3,4,5,6,7,8,9,10]
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
    let daqo = wx.getStorageSync('daqoId')
    if (daqo){
      this.setData({
        type: daqo.type,
        daqoId: daqo.key,
        name: daqo.name
      });
    }
    this.getDaqoList();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getDaqoList: function(){
    let that = this;
    util.request(api.WikiList, {
      type: that.data.type,
      key: that.data.daqoId
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.setData({
          daqoList:res.data
        });
      }
    });
  }
})