const api = require('../../config/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [],
    daqoList: [],
    goodsList:[],
    activeIndex: 1,
    showSearchIcon: false,
    showDelIcon: false,
    navlist: ["文章","商品","大全"],
    searchInput: '',
    keyword:'',

    msgpage:1,
    goodspage:1,
    daqopage:1,
    msgTotal:0,
    goodsTotal:0,
    daqoTotal: 0,    
    size:20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type){
      this.setData({
        activeIndex: options.type
      })
      this.getGoodsList();
    }
  },
  navTap: function(e){
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
    this.getGoodsList();
  },
  handleFocus: function(e){
    this.setData({
      showSearchIcon: false
    });
    if(e.detail.value){
      this.setData({
        showDelIcon: true
      });
    }
  },
  handleBlur: function(e){
    var _this = this;
    setTimeout(function(){
      if (!e.detail.value) {
        _this.setData({
          showSearchIcon: true
        })
      }
    },500)
  },
  handleInput: function(e){
    if(e.detail.value){
      this.setData({
        showDelIcon: true,
        searchword: e.detail.value
      });
    }else{
      this.setData({
        showDelIcon: false
      });
    }
  },
  clearKeyword: function(){
    this.setData({
      searchInput: '',
      showDelIcon: false,
      showSearchIcon: true,
      keyword: '',
      msgList:[],
      daqoList:[],
      goodsList:[]
    });
    this.getGoodsList();
  },
  searchConfirm: function(e){
    let that = this;
    that.setData({
      keyword: e.detail.value
    });
    that.getGoodsList();
  },
  getGoodsList: function () {
    let that = this;
    if(!that.data.keyword){
      return;
    }
    let page = 0;
    if (that.data.activeIndex ==1){
      page = that.data.msgpage
    }
    if (that.data.activeIndex == 2) {
      page = that.data.goodspage
    }
    if (that.data.activeIndex == 3) {
      page = that.data.daqopage
    }
    util.request(api.SearchIndex, {
      type: that.data.activeIndex,
      keywords: that.data.keyword,
      page: page,
      size: that.data.size,
    }).then(function (res) {
      if (res.errno === 0) {
        if(that.data.activeIndex == 1){
          let msg = that.data.msgList;
          res.data.items.map(v => {
            msg.push(v);
          });
          if (that.data.page > 1) {
            that.setData({
              msgList: msg,
              msgTotal: res.data.total
            });
          } else {
            that.setData({
              msgList: res.data.items,
              msgTotal: res.data.total
            });
          }
        }
        if (that.data.activeIndex == 2) {
          let msg = that.data.goodsList;
          res.data.goodsList.map(v => {
            msg.push(v);
          });
          if (that.data.page > 1) {
            that.setData({
              goodsList: msg,
              goodsTotal: res.data.count
            });
          } else {
            that.setData({
              goodsList: res.data.goodsList,
              goodsTotal: res.data.count
            });
          }
        }
        if (that.data.activeIndex == 3) {
          let msg = that.data.daqoList;
          res.data.wikiList.map(v => {
            msg.push(v);
          });
          if (that.data.page > 1) {
            that.setData({
              daqoList: msg,
              daqoTotal: res.data.count
            });
          } else {
            that.setData({
              daqoList: res.data.wikiList,
              daqoTotal: res.data.count
            });
          }
        }
      }
    });
  },
  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    let that = this;
    let total = 0;
    let page = 0;
    let size = that.data.size;
    if (that.data.activeIndex == 1) {
      page = that.data.msgpage;
      total = that.data.msgTotal
    }
    if (that.data.activeIndex == 2) {
      page = that.data.goodspage;
      total = that.data.goodsTotal;
    }
    if (that.data.activeIndex == 3) {
      page = that.data.daqopage;
      total = that.data.daqoTotal
    }
    if (Math.ceil(total / size) > page) {
      if (that.data.activeIndex == 1) {
        that.setData({
          msgpage: page + 1
        })
      }
      if (that.data.activeIndex == 2) {
        that.setData({
          goodspage: page + 1
        })
      }
      if (that.data.activeIndex == 3) {
        that.setData({
          daqopage: page + 1
        })
      }
      that.getGoodsList();
    }
  },
})