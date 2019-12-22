const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share: false,
    fWiki:{},
    goodsList:[],
    litemallTopics:[],
    tmpData:[],   //赞
    users:[],
    favorites:0,
    shareItem: {},
    myuserId: 0,
    top: 0,
    height: wx.getSystemInfoSync().windowHeight,    //可用窗口高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (wx.getStorageSync('userId')) {
      this.setData({
        myuserId: wx.getStorageSync('userId'),
      })
    }
    if (options.id) {
      this.setData({
        topicId: options.id,
        title: options.title
      });
    }
    if (options.share) {
      this.setData({
        share: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.shares = this.selectComponent("#shares");
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let height = (this.data.height-281-100)/2
    this.setData({
      top: height
    })
    this.getDaqoDetail();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getDaqoDetail: function(){
    let that = this;
    util.request(api.WiKiDetail, { key: that.data.topicId, title: that.data.title}).then(function (res) {
      if (res.errno === 0) {
        if (res.data) {
          that.setData({
            fWiki: res.data.fWiki,
            goodsList: res.data.goodsList,
            litemallTopics: res.data.litemallTopics,
            favorites: res.data.favorites,
            users: res.data.users
          })
        }
      }
    });
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (res) {
    var _this = this;
    _this.setData({
      shareItem: res.target.dataset.items
    })
    console.log(_this.data.shareItem)
    if (res.from === "button") {
      return {
        title: _this.data.shareItem.title,
        path: '/pages/daqo/daqodetail/daqodetail?id=' + _this.data.shareItem.id + '&title=' + _this.data.shareItem.title+'&share=1',
        imageUrl: _this.data.shareItem.thumbnail,
        success: function (res) {
          _this.shares.hideModal();
        }
      }
    }
  },
  //收藏文章
  handleCollect: function (e) {
    let that = this;
    let userId = e.currentTarget.dataset.userId;
    let id = e.currentTarget.dataset.id;
    let list = that.data.fWiki;
    let user = that.data.users;
    util.request(api.CollectAddOrDelete, { type: '2', valueId: id }, 'POST').then(function (res) {
      if (res.errno === 0) {
        let heade_icon = wx.getStorageSync('userInfo').avatarUrl;
        let userId = wx.getStorageSync('userId');
        let userName = wx.getStorageSync('userInfo').nickName;
        list.isMyFavorites = !list.isMyFavorites;

        if (list.isMyFavorites) {   //收藏
          user.push({ headPic: heade_icon, userId: userId, userName: userName });
        } else {     //取消收藏
          user.map((v, k) => {
            if (v.userId == userId) {
              user.splice(k, 1);
            }
          });
        }
        that.setData({
          fWiki: list,
          users: user
        })
        if (res.data.type == 'add') {
          wx.showToast({ title: '收藏成功' })
        } else if (res.data.type == 'delete') {
          wx.showToast({title: '取消收藏成功' })
        }

      }
    });
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(this.data.height).step()
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
  ontouchstart: function(e){
    // console.log(e);

    this.firstTouchY = e.touches[0].clientY;
  },
  ontouchmove: function(e){
    // console.log(e);
    var moveY = e.touches[0].clientY - this.firstTouchY;
  },
  ontouchend: function(e){
    // console.log(e)
  },
  goZanList: function (e) {
    let upvotes = JSON.stringify(e.currentTarget.dataset.upvotes);
    let userName = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/publish/receivezan/receivezan?upvotes=' + upvotes + '&userName=' + userName,
    })
  },
  // 跳转到某人主页
  goHomePage: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mine/homepage/homepage?id=' + id
    })
  },
  goIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})