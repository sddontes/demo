const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../../wxParse/wxParse.js');
import { _canvas } from '../../../utils/canvas.js';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    productId:0,
    info: {},
    checkedSpecPrice: 0,  //商品价格
    specificationList: [],
    productList:[],
    activeIndex: '',
    selectNumber: 0, //当前选中规格库存量
    number:1,
    shareUrl: '',
    showDetail: false,
    shareItem:{},
    share: false,
    wikiInfo:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.id=1181049;
    if (options.id && options.id != 0) {
      this.setData({
        id: options.id
      });
      this.getGoodsInfo();
    }
    if (options.share) {
      this.setData({
        share: true
      })
    }
  },
  onUnload: function(){
    
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {

  },
  onReady: function () {
  },
  getWiKiTital: function(title){
    let that = this;
    util.request(api.GetWiKiTital, { title:title},'POST').then(function (res) {
      if (res.errno === 0) {
        that.setData({
          wikiInfo: res.data
        })
      }
    })
  },
  goWiki: function(){
    let that = this;
    if(that.data.wikiInfo.length > 0){
      wx.navigateTo({
        url: '/pages/daqo/daqodetail/daqodetail?id=' + that.data.wikiInfo[0].id + '&title=' + that.data.wikiInfo[0].title,
      })
    }
  },
  // 获取商品信息
  getGoodsInfo: function () {
    let that = this;
    util.request(api.GoodsDetail, {id: that.data.id}).then(function (res) {
      if (res.errno === 0) {
        WxParse.wxParse('content', 'html', res.data.info.detail, that, 5);
        let temp = []
        res.data.info.gallery.map(v=>{
          if(v.substr(v.length - 3) == 'mp4'){
            temp.push({
              url:v,
              typw:2
            })
          }else{
            temp.push({
              url: v,
              typw: 1
            })
          }
        })
        res.data.info.gallery = temp;
        temp.map(v=>{
          if (v.typw == 1){
            that.setData({
              poster: v.url
            })
            return;
          }
        });
        that.setData({
          info: res.data.info,
          checkedSpecPrice: res.data.info.retailPrice,
          specificationList: res.data.specificationList,
          productList: res.data.productList,
          selectNumber: res.data.totalPro,
          // shareUrl: res.data.info.shareUrl
        })
        that.getWiKiTital(that.data.info.name)
      }
    })
  },
  cutNumber: function(){
    let that = this;
    if(that.data.number <= 1){
      return;
    }
    that.setData({
      number: that.data.number - 1
    })
  },
  addNumber: function(){
    let that = this;
    if (that.data.number >= parseInt(that.data.selectNumber)){  //不大于库存量
      return;
    }
    that.setData({
      number: that.data.number + 1
    })
  },
  handleInput: function(e){
    let that = this;
    let number = parseInt(e.detail.value);
    if (parseInt(e.detail.value) > parseInt(that.data.selectNumber)){   //输入值大于库存量
      number = parseInt(that.data.selectNumber);
    }
    if(number < 1){
      number = 1;
    }
    that.setData({
      number: number
    });
  },
  //选规格,只适用于一个规格
  selectSpec: function(e){
    let that = this;
    let tempTxt = e.currentTarget.dataset.name;
    that.setData({
      activeIndex: e.currentTarget.dataset.index
    })
    // 改变选中规格的价格，库存等信息
    that.data.productList.map(v => {
      if(v.specifications.toString() == tempTxt.toString()){
        if(that.data.number > v.number){
          that.setData({
            number: v.number
          })
        }
        that.setData({
          productId: v.id,
          checkedSpecPrice: v.price,
          selectNumber: v.number
        })
      }
    })
  },

  addCart: function(){
    let that = this;
    if(that.data.specificationList.length>0&&that.data.productId ==0){
      wx.showToast({ icon: 'none', title: '请先选择商品规格' });
      return;
    }
    //添加到购物车
    util.request(api.CartAdd, {
      goodsId: that.data.id,
      number: that.data.number,
      productId: that.data.productId
    }, "POST")
      .then(function (res) {
        let _res = res;
        if (_res.errno == 0) {
          wx.showToast({ icon: 'none', title: '添加成功'});
          that.hideModal();
        } else {
          wx.showToast({ icon: 'none', title: _res.errmsg});
        }
      });
  },
  // 显示商品详情弹框
  showDetail: function () {
    let _this = this;
    if (!wx.getStorageSync('userInfo') || !app.globalData.hasLogin) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return;
    }
    this.setData({
      showDetail: true
    })
    this.showModal();
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (res) {
    var _this = this;
    _this.setData({
      shareItem: res.target.dataset.items
    })
    let sharePath = '', shareIcon = ''
    sharePath = '/pages/market/goods/goods?id=' + _this.data.shareItem.id + '&share=1'
    shareIcon = _this.data.shareItem.picUrl
    if (res.from === "button") {
      return {
        title: _this.data.shareItem.name,
        path: sharePath,
        // imageUrl: shareIcon,
        success: function (res) {
        }
      }
    }
  },
  goIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  play: function () {
    let that = this;
    let video = wx.createVideoContext('myVideo');
    this.setData({
      isPlay: true
    })
    video.play();
  },
  bindpause: function(){
    this.setData({
      isPlay: false
    })
  },
  bindended: function () {
    this.setData({
      isPlay: false
    })
  }
})