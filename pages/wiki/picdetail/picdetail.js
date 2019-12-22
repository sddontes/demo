const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    commentfocus: false,
    myuserId:0,
    shareItem:{},
    share: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        topicId: options.id,
      });
    }
    if(options.share){
      this.setData({
        share: true
      })
    }
  },

  onReady: function () {
    this.comment = this.selectComponent("#comment");
    this.shares = this.selectComponent("#shares");
  },
  previewPic: function (e) {
    let temp = [];
    for (let index in e.currentTarget.dataset.images) {
      temp.push(e.currentTarget.dataset.images[index]);
    }
    wx.previewImage({
      current: e.currentTarget.dataset.currentimg,
      urls: temp,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.getTopicDetail();
    if (wx.getStorageSync('userId')) {
      that.setData({
        myuserId: wx.getStorageSync('userId')
      })
    }
    // setTimeout(function(){
    //   that.setData({
    //       share: app.globalData.share
    //     })
    // },1000)
  },
  onPageScroll: function (e) {
  },
  getTopicDetail() {
    let that = this;
    util.request(api.TopicDetail, { id: that.data.topicId }).then(function (res) {
      if (res.errno === 0) {
        if (res.data) {
          if (res.data.topic.userId == that.data.myuserId) {
            that.setData({
              showdelete: true
            })
          } else {
            that.setData({
              showreport: true
            })
          }
          res.data.topic.content = res.data.topic.content.split(',')
          that.setData({
            item: res.data.topic
          })
        }
      }
    });
  },
  // 点击评论
  handleComment: function (e) {
    let that = this;
    let userId = e.currentTarget.dataset.userId;
    let id = e.currentTarget.dataset.id;
    that.setData({
      comentvalueId: id,
      comentatUserId: userId,
      commentfocus: true
    })
    that.comment.showPopup();
  },
  _success: function (e) {
    let that = this;
    let valueId = that.data.comentvalueId;
    let atUserId = that.data.comentatUserId;
    let list = that.data.item;
    let content = e.detail;
    
    util.request(api.CommentPost, { type: '1', valueId: valueId, atuserid: atUserId, content: content }, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.comment.hidePopup();
        list.commentVoList.unshift(res.data);
        that.setData({
          item: list
        })
        // wx.showToast({ icon: 'none', title: '评论成功' })
      }
    });
  },
  //关注MomentsaddWatch
  handleAttention: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let userId = e.currentTarget.dataset.userid;
    let list = that.data.item;
    util.request(api.MomentsaddWatch, { fUserId: userId }, 'POST').then(function (res) {
      if (res.errno === 0) {
        if (list.userId == userId) {
          list.watched = !list.watched;
        }
        if (list.watched) {
          wx.showToast({ title: '已关注', duration: 1000 })
        }
        if (!list.watched) {
          wx.showToast({ title: '已取消关注', duration: 1000 })
        }
        that.setData({
          item: list
        })
      }
    });
  },
  handleUpvotes: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let userId = e.currentTarget.dataset.userId;
    let id = e.currentTarget.dataset.id;
    let list = that.data.item;
    util.request(api.MomentsUpvote, { fUserId: userId, relId: id }, 'POST').then(function (res) {
      if (res.errno === 0) {
        let heade_icon = wx.getStorageSync('userInfo').avatarUrl;
        let userId = wx.getStorageSync('userId');
        let userName = wx.getStorageSync('userInfo').nickName;
        list.up = !list.up;
        if (list.up) {   //点赞
          list.upvotes.push({ headPic: heade_icon, userId: userId, userName: userName });
        } else {     //取消点赞
          list.upvotes.map((v, k) => {
            if (v.userId == userId) {
              list.upvotes.splice(k, 1);
            }
          });
        }
        that.setData({
          item: list
        })
      }
    });
  },
  // 跳转到某人主页
  goHomePage: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mine/homepage/homepage?id=' + id
    })
  },
  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {
    this.setData({ page: 1 })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getTopicDetail();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  // 分享
  handleShare: function (e) {
    let that = this;
    let item = e.currentTarget.dataset.items;
    that.setData({
      shareItem: item
    })
    that.shares.showModal()
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
    if (_this.data.shareItem.channel == 'pic') {
      sharePath = '/pages/wiki/picdetail/picdetail?id=' + _this.data.shareItem.id+'&share=1'
      shareIcon = _this.data.shareItem.content[0]
    } else {
      sharePath = '/pages/wiki/wikidetail/wikidetail?id=' + _this.data.shareItem.id + '&share=1'
      shareIcon = _this.data.shareItem.picUrl
    }
    if (res.from === "button") {
      return {
        title: _this.data.shareItem.title,
        path: sharePath,
        imageUrl: shareIcon,
        success: function (res) {
          _this.shares.hideModal();
        }
      }
    }
  },
  goZanList: function (e) {
    let upvotes = JSON.stringify(e.currentTarget.dataset.upvotes);
    let userName = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/publish/receivezan/receivezan?upvotes=' + upvotes + '&userName=' + userName,
    })
  },
  //收藏文章
  handleCollect: function (e) {
    let that = this;
    let userId = e.currentTarget.dataset.userId;
    let id = e.currentTarget.dataset.id;
    let list = that.data.item;
    util.request(api.CollectAddOrDelete, { type: '1', valueId: id }, 'POST').then(function (res) {
      if (res.errno === 0) {
        list.collected = !list.collected;
        that.setData({
          item: list
        })
        if (res.data.type == 'add') {
          wx.showToast({ title: '收藏成功' })
        } else if (res.data.type == 'delete') {
          wx.showToast({ title: '取消收藏成功' })
        }

      }
    });
  },
  _report: function () {
    let that = this;
    let shareItem = that.data.shareItem; //1文章图片
    wx.navigateTo({
      url: "/pages/daqo/report/report?feedType=1&valueId=" + shareItem.id,
      success: function () {
        that.shares.hideModal();
      }
    })
  },
  _delete: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该内容？',
      success(res) {
        if (res.confirm) {
          util.request(api.sharedelete, { id: that.data.shareItem.id }, 'POST').then(function (res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '已删除',
              })
              that.shares.hideModal();
              setTimeout(function () { wx.navigateBack() }, 200)

            }
          });
        } else if (res.cancel) {
          that.shares.hideModal();
        }
      }
    })
  },
  goIndex: function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})