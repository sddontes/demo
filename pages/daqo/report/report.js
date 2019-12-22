var util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex:0,
    reportlist: [{ text: "广告、导购" }, { text: "不实、虚假、欺骗" }, { text: "暴露别人隐私、恶意及不雅言论" }, { text: "违反国家相关规定" }],
    valueId:0,
    feedtype:0,
    reason:'',
    textvalue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.valueId && options.valueId!=0){
      this.setData({
        valueId: options.valueId,
        feedtype: options.feedType
      })
    }
  },
  handleTap: function(e){
    this.setData({
      activeIndex: e.currentTarget.dataset.index+1,
      reason: e.currentTarget.dataset.reason
    })
  },
  handleInput: function(e){
    this.setData({
      textvalue: e.detail.value
    })
  },
  submit: function(){
    let that = this;
    let _reason = '';
    if (that.data.reason == '' && that.data.textvalue == ''){
      wx.showToast({
        icon:'none',title: '请选择或填写原因',
      })
      return
    }
    if (that.data.reason != '' && that.data.textvalue == ''){
      _reason = that.data.reason;
    }
    if (that.data.reason == '' && that.data.textvalue != '') {
      _reason = that.data.textvalue
    }
    if (that.data.reason != '' && that.data.textvalue != '') {
      _reason = that.data.reason+'|'+that.data.textvalue
    }
    util.request(api.FeedbackAdd,{
      feedType: that.data.feedtype,
      valueId: that.data.valueId,
      reason: _reason,
    },'POST').then(function (res) {
      if (res.errno === 0) {
        wx.showToast({title: '已提交'})
        setTimeout(function(){
          wx.navigateBack()
        },1000)
      }
    });
  }
})