const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const app = getApp()

Page({
  data: {
    banner: [{ link: "1", url: "http://images.huaxi0.com/imgs/MyUpload/house/E/B/8FD3EF709CA24B73ABB08E8C029271F2.jpeg" }, { link: "2", url: "http://images.huaxi0.com/imgs/MyUpload/house/W/V/55A16E2BE5E549BDBDD97AE1E8A101B3.jpeg" }, { link: "1", url:"http://images.huaxi0.com/imgs/MyUpload/house/Y/W/535F37FD2A6942279A19AA45832B27D5.jpeg"}],
    commentfocus: false,
    getLocation: '位置',
    deviceWidth: 0,
    fav:0,  //0推荐1关注
    showAtten: true,   //true显示推荐列表，false关注列表
    page: 1,  //推荐列表
    size: 10,
    total: 0,
    list:[],

    apage:1,   //关注列表
    asize: 10,
    atotle: 0,
    attentionList:[],

    comentvalueId:0,   //文章或图片id
    comentatUserId:0,  //被评论人的id
    comentIndex:0,
    shareItem: {},
    myuserId: '',
    showreport: true,
    showdelete: false,
    shareIndex:0
  },
  onReady: function () {
    this.comment = this.selectComponent("#comment");
    this.shares = this.selectComponent("#shares");
    console.log(this.data.banner)
  },
  onShow: function(){
    if (wx.getStorageSync('setLocation')){
      this.setData({
        getLocation: wx.getStorageSync('setLocation')
      })
    }
    if (wx.getStorageSync('userId')) {
      this.setData({
        myuserId: wx.getStorageSync('userId')
      })
    }
  },
  onLoad: function () {
    this.getCommentsList();
    this.setData({
      deviceWidth: wx.getSystemInfoSync().windowWidth
    })
    this.getBannerData();
  },

  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    let that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    if (that.data.showAtten){  //当前推荐列表
      that.setData({ page: 1 });
      that.getCommentsList();
    }else{
      that.setData({ apage: 1 });
      that.getAttentionList();   
    }
    
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    let that = this;
    if(that.data.showAtten){   //当前推荐列表
      let total = that.data.total;
      let page = that.data.page;
      let size = that.data.size;
      if (Math.ceil(total / size) > page) {
        that.setData({
          page: page + 1
        })
        that.getCommentsList();
      }
    }else{
      let total = that.data.atotal;
      let page = that.data.apage;
      let size = that.data.asize;
      if (Math.ceil(total / size) > page) {
        that.setData({
          apage: page + 1
        })
        that.getAttentionList();
      }
    }
    
  },
  //跳转到详情页
  previewPic: function (e) {
    wx.navigateTo({
      url: '../productDetail/productDetail?prodectId=' + e.currentTarget.dataset.image,
    })
  },
  //加入购物车
  parchesCar: function(){

  },
  showRecommend: function(){
    this.setData({
      // page:1,
      fav: 0,
      showAtten: true
    });
    // this.getCommentsList();
  },
  showAttention: function(){
    this.setData({
      apage: 1,
      fav: 1,
      showAtten: false
    });
    this.getAttentionList();
  },
  handlePublish: function(e){
    if (!app.globalData.hasLogin){
      wx.navigateTo({
        url: '../login/login',
      })
    }else{
      wx.navigateTo({
        url: '../publish/index/index',
      })
    }
  },
  //获取推荐列表
  getCommentsList: function () {
    let that = this;
    util.request(api.MomentsUrl, {
      fav: that.data.fav,
      page: that.data.page,
      size: that.data.size,
    }).then(function (res) {
      if (res.errno === 0) {
          let page = that.data.page;
          let msg = that.data.list;
          
          res.data.data.map(v => {
            if (v.channel == 'pic') {
              v.content = v.content.split(',')
            }
          });
          if(msg.length<=(page-1)*10){  //证明还没调用过这个page的数据
            res.data.data.map(v => {
              msg.push(v);
            });
          }else{
          }
        console.log(msg)
          if(that.data.page >1){
            that.setData({
              list: msg,
              total: res.data.count
            });
          }else{
            that.setData({
              list: res.data.data,
              total: res.data.count
            });
          }
      }
    });
  },
  //点击加入购物车
  parchesCar: function(){

  },

  //关注列表
  getAttentionList: function(){
    let that = this;
    util.request(api.MomentsUrl, {
      fav: that.data.fav,
      page: that.data.apage,
      size: that.data.asize,
    }).then(function (res) {
      if (res.errno === 0) {
          let page = that.data.apage;
          let msg = that.data.attentionList;
          res.data.data.map(v => {
            if (v.channel == 'pic') {
              v.content = v.content.split(',')
            }
          });
          if (msg.length <= (page - 1) * 10) {  //证明还没调用过这个page的数据
            res.data.data.map(v => {
              msg.push(v);
            });
          } else {
          }
          if (that.data.apage > 1) {
            that.setData({
              attentionList: msg,
              atotal: res.data.count
            });
          } else {
            that.setData({
              attentionList: res.data.data,
              atotal: res.data.count
            });
          }
      }
    });
  },
  //关注MomentsaddWatch
  handleAttention: function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let userId = e.currentTarget.dataset.userid;
    let list = that.data.list;
    util.request(api.MomentsaddWatch, { fUserId: userId},'POST').then(function (res) {
      if (res.errno === 0) {
        list.map(v=>{
          if (v.userId == userId){
            v.watched = !v.watched;
          }
          if(v.watched){
            wx.showToast({ title: '已关注',duration:1000})
          }
        if (!v.watched) {
          wx.showToast({ title: '已取消关注', duration: 1000})
          }
        })
        that.setData({
          list: list
        })
      }
    });
  },
  handleUpvotes: function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let userId = e.currentTarget.dataset.userId;
    let id = e.currentTarget.dataset.id;
    let list = that.data.list;
    util.request(api.MomentsUpvote, { fUserId: userId, relId:id}, 'POST').then(function (res) {
      if (res.errno === 0) {
        let heade_icon = wx.getStorageSync('userInfo').avatarUrl;
        let userId = wx.getStorageSync('userId');
        let userName = wx.getStorageSync('userInfo').nickName;
        list[index]['up'] = !list[index]['up'];
        if (list[index]['up']){   //点赞
          list[index]['upvotes'].push({ headPic: heade_icon, userId: userId, userName: userName});
        }else{     //取消点赞
          list[index]['upvotes'].map((v,k) =>{
            if(v.userId == userId){
              list[index]['upvotes'].splice(k,1);
            }
          });
        }
        that.setData({
          list: list
        })
      }
    });
  },
  // 点击评论
  handleComment: function(e){
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
  _success: function(e){
    let that = this;
    let valueId = that.data.comentvalueId;
    let atUserId = that.data.comentatUserId;
    let list = that.data.list;
    let content = e.detail;
    
    util.request(api.CommentPost, { type: '1', valueId: valueId, atuserid: atUserId, content: content}, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.comment.hidePopup();
        list[that.data.comentIndex]['commentVoList'].unshift(res.data);
        list[that.data.comentIndex]['commentcount'] = list[that.data.comentIndex]['commentcount']+1;
        that.setData({
          list: list
        })
        // wx.showToast({ icon: 'none', title: '评论成功' })
      }
    });
  },
  // 跳转到某人主页
  goHomePage: function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mine/homepage/homepage?id='+id
    })
  },
  goDetailPage: function(e){
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    if(type == 'pic'){
      wx.navigateTo({
        url: '/pages/wiki/picdetail/picdetail?id=' + id
      })
    } else if (type =='article'){
      wx.navigateTo({
        url: '/pages/wiki/wikidetail/wikidetail?id=' + id
      })
    }
  },
  // 分享
  // handleShare: function(e){
  //   let that = this;
  //   let item = e.currentTarget.dataset.items;
  //   let index = e.currentTarget.dataset.index;
  //   if(item.userId == that.data.myuserId){
  //     that.setData({
  //       showdelete: true
  //     })
  //   }else{
  //     that.setData({
  //       showdelete: false
  //     })
  //   }
  //   that.setData({
  //     shareIndex: index,
  //     shareItem: item
  //   })
  //   that.shares.showModal()
  // },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (res) {
    var _this = this;
    _this.setData({
      shareItem: res.target.dataset.items
    })
    let sharePath = '',shareIcon=''
    if (_this.data.shareItem.channel == 'pic') {
      sharePath = '/pages/wiki/picdetail/picdetail?id=' + _this.data.shareItem.id+'&share=1'
      shareIcon = _this.data.shareItem.content[0]
    } else {
      sharePath = '/pages/wiki/wikidetail/wikidetail?id=' + _this.data.shareItem.id + '&share=1'
      shareIcon = _this.data.shareItem.picUrl
    }
    console.log(sharePath, shareIcon,res.form)
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
  getBannerData: function () {
    let that = this;
    util.request(api.bannerUrl).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          // banner: res.data.banner
        });
      }
    });
  },
  // _report: function(){
  //   let that = this;
  //   let shareItem = that.data.shareItem;
  //   let feedType = 0;   //1文章图片
  //   wx.navigateTo({
  //     url: "/pages/daqo/report/report?feedType=1&valueId=" + shareItem.id,
  //     success: function(){
  //       that.shares.hideModal();
  //     }
  //   })
  // },
  // _delete: function(){
  //   let that = this;
  //   wx.showModal({
  //     title: '提示',
  //     content: '确定要删除该内容？',
  //     success(res) {
  //       if (res.confirm) {
  //         util.request(api.sharedelete,{id:that.data.shareItem.id},'POST').then(function (res) {
  //           if (res.errno === 0) {
  //             that.data.list.splice(that.data.shareIndex, 1);
  //             that.setData({
  //               list: that.data.list
  //             })
  //             wx.showToast({
  //               title: '已删除',
  //             })
  //             that.shares.hideModal();
  //           }
  //         });
  //       } else if (res.cancel) {
  //           that.shares.hideModal();
  //       }
  //     }
  //   })
  // },
  goZanList: function(e){
    let upvotes = JSON.stringify(e.currentTarget.dataset.upvotes);
    let userName = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/publish/receivezan/receivezan?upvotes=' + upvotes + '&userName=' + userName,
    })
  }
})
