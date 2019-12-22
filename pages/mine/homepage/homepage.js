var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: 10,
    list: [],
    myfavCount:0,
    myfansCount:0,
    myBeUpvote:0,
    userId:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        topicId: options.id,

      });
      // this.getmyHomeInfo();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.comment = this.selectComponent("#comment");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userId:wx.getStorageSync('userId')
    })
    this.getmyHomeInfo();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({ page: 1 })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getmyHomeInfo();
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
      that.getmyHomeInfo();
    }
  },
  //获取推荐列表
  getmyHomeInfo: function () {
    let that = this;
    util.request(api.UsermyMoment, {
      fuserId: that.data.topicId,
      page: that.data.page,
      size: that.data.size,
    }).then(function (res) {
      if (res.errno === 0) {
        let msg = that.data.list;
        res.data.data.map(v => {
          if (v.channel == 'pic') {
            v.content = v.content.split(',')
          }
          msg.push(v);
        });
        if (that.data.page > 1) {
          that.setData({
            list: msg,
            total: res.data.count
          });
        } else {
          that.setData({
            list: res.data.data,
            total: res.data.count
          });
        }
        that.setData({
          myBeUpvote: res.data.myBeUpvote,
          myfansCount: res.data.myfansCount,
          myfavCount: res.data.myfavCount
        })
      }
    });
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
  goHomePage: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mine/homepage/homepage?id=' + id
    })
  },
  // 点击评论
  handleComment: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let userId = e.currentTarget.dataset.userId;
    let id = e.currentTarget.dataset.id;
    that.setData({
      comentvalueId: id,
      comentatUserId: 0,
      comentIndex: index,
      commentfocus: true
    })
    that.comment.showPopup();
  },
  _success: function (e) {
    let that = this;
    let valueId = that.data.comentvalueId;
    let atUserId = that.data.comentatUserId;
    let list = that.data.list;
    let content = e.detail;

    util.request(api.CommentPost, { type: '1', valueId: valueId, atuserid: atUserId, content: content }, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.comment.hidePopup();
        list[that.data.comentIndex]['commentVoList'].unshift(res.data);
        list[that.data.comentIndex]['commentcount'] = list[that.data.comentIndex]['commentcount'] + 1;
        that.setData({
          list: list
        })
        // wx.showToast({ icon: 'none', title: '评论成功' })
      }
    });
  },
  handleUpvotes: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let userId = e.currentTarget.dataset.userId;
    let id = e.currentTarget.dataset.id;
    let list = that.data.list;
    util.request(api.MomentsUpvote, { fUserId: userId, relId: id }, 'POST').then(function (res) {
      if (res.errno === 0) {
        let heade_icon = wx.getStorageSync('userInfo').avatarUrl;
        let userId = wx.getStorageSync('userId');
        let userName = wx.getStorageSync('userInfo').nickName;
        list[index]['up'] = !list[index]['up'];
        if (list[index]['up']) {   //点赞
          list[index]['upvotes'].unshift({ headPic: heade_icon, userId: userId, userName: userName });
        } else {     //取消点赞
          list[index]['upvotes'].map((v, k) => {
            if (v.userId == userId) {
              list[index]['upvotes'].splice(k, 1);
            }
          });
        }
        that.setData({
          list: list
        })
      }
    });
  },
  goDetailPage: function (e) {
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    if (type == 'pic') {
      wx.navigateTo({
        url: '/pages/wiki/picdetail/picdetail?id=' + id
      })
    } else if (type == 'article') {
      wx.navigateTo({
        url: '/pages/wiki/wikidetail/wikidetail?id=' + id
      })
    }
  },
  goattention() {
    wx.navigateTo({
      url: "/pages/mine/myattention/myattention?user=" + this.data.topicId   //他人的主页
    });
  },
  gomyfans() {
    wx.navigateTo({
      url: "/pages/mine/myfans/myfans?user=" + this.data.topicId
    });
  },
  //关注MomentsaddWatch
  handleAttention: function (e) {
    let that = this;
    let userId = e.currentTarget.dataset.userid;
    let list = that.data.list;
    util.request(api.MomentsaddWatch, { fUserId: userId }, 'POST').then(function (res) {
      if (res.errno === 0) {
        list[0].watched = !list[0].watched;
        if (list[0].watched) {
          wx.showToast({ title: '已关注', duration: 1000 })
        }
        if (!list[0].watched) {
          wx.showToast({ title: '已取消关注', duration: 1000 })
        }
        that.setData({
          list: list
        })
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
    let sharePath = '', shareIcon = ''
    if (_this.data.shareItem.channel == 'pic') {
      sharePath = '/pages/wiki/picdetail/picdetail?id=' + _this.data.shareItem.id+'&share=1'
      shareIcon = _this.data.shareItem.content[0]
    } else {
      sharePath = '/pages/wiki/wikidetail/wikidetail?id=' + _this.data.shareItem.id + '&share=1'
      shareIcon = _this.data.shareItem.picUrl
    }
    console.log(sharePath, shareIcon, res.form)
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
  }
})