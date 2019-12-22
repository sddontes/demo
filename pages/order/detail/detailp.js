var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
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
    this.getOrderList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({orderList: [],page: 1});
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getOrderList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  getOrderList() {
    let that = this;
    util.request(api.Kuaidiniao, {
      expCode: 'YD',
      expNo: '3102128897820'    
    },'POST').then(function (res) {
      if (res.errno === 0) {
        let _data = JSON.parse(res.data);
        let _list = [];
        _data.Traces.map(v=>{
          v.AcceptTime = v.AcceptTime.split(' ');
          v.time1 = v.AcceptTime[0].split('-')[1] + '-' + v.AcceptTime[0].split('-')[2]
          v.time2 = v.AcceptTime[1].split(':')[0] + ':' + v.AcceptTime[1].split(':')[1]
          _list.unshift(v);
        })
        that.setData({
          orderList: _list,
          state: _data.State
        });
        // console.log(that.data.orderList,that.data.state)
      }
    });
  },
})