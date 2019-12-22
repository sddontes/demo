const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    channel:[],
    newGoodsList:[],
    itemLists: [{"name": "类别一" }, { "name": "类别二" }, { "name": "类别三" }, { "name": "类别四" }],
    hotGoodsList:[],
    banner: [],
    date: '',
    day: '',
    market_tap: 0,
    market_chilid_tap: 1,
    inputHighValue: '',
    inputLowValue: '',
    focus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      date: util.formatTimeToNum(new Date()),
      day: util.getDates(new Date())
    });
    _this.getIndexData();
    setTimeout(function(){
      _this.setData({
        itemLists: [{ "name": "类别一" }, { "name": "类别二" }, { "name": "类别三" }, { "name": "类别四" }, { "name": "类别二" }, { "name": "类别三" }, { "name": "类别四" }]
      });
    },4000)
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getIndexData();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  // 获取商品列表
  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.errno === 0) {
        // that.setData({
        //   newGoodsList: res.data.newGoodsList,
        //   hotGoodsList: res.data.hotGoodsList,
        //   banner: res.data.banner,
        //   channel: res.data.channel
        // });
      }
    });
  },
  // 选择顶部筛选条件
  filterTap:function(e){
    var that = this;
    that.setData({
      market_tap: e.currentTarget.dataset.market_tap
    });
    console.log(e.currentTarget.dataset.market_tap)
  },

  bindKeyInput1(e) {
    this.setData({
      inputLowValue: e.detail.value,
      focus: false
    })
    console.log(e.detail.value)
  },
  bindKeyInput2(e) {
    this.setData({
      inputHighValue: e.detail.value,
      focus: true
    })
  },
  filterChildTap(e){
    var that = this;
    that.setData({
      market_chilid_tap: e.currentTarget.dataset.market_chilid_tap
    });
  },
  jumptoUrl(e) {
    console.log(e);
  }
})
