var util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // activeIndex: ,
    list: [],
    parentId: 0,
    type: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function(){
    let daqo = wx.getStorageSync('daqoId')
    if (daqo) {
      this.setData({
        parentId: daqo.parentId,
        type: daqo.type
      });
    }
    this.getWikiTree();
  },
  getdaqokey: function (event){
    try {
      wx.setStorageSync('daqoId', { 'key': event.currentTarget.dataset.daqoId, 'type': event.currentTarget.dataset.type, 'name': event.currentTarget.dataset.name, 'parentId': event.currentTarget.dataset.parentId});
    } catch (e) {
    }
    wx.navigateBack();
  },

  toggleShow: function(e){
    let that = this;
    let _list = that.data.list;
    let index = e.currentTarget.dataset.index;
    let show = e.currentTarget.dataset.show;
    _list[index].show = !e.currentTarget.dataset.show;
    that.setData({
      list: _list
    })
  },
  getWikiTree: function(){
    let that = this;
    util.request(api.WikiTree).then(function (res) {
      if (res.errno === 0) {
        res.data.map(v => {
          v.show = false
          if (that.data.type == 1 && that.data.parentId == v.id){
            v.show = true
          }
        });
        that.setData({
          list: res.data
        });
      }
    });
  }
})