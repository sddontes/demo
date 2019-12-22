var app = getApp()
var util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
Page({
  data: {
    showContent: false,
    delID: 0,
    cartGoods: [],
    cartTotal: {},
    disCheck: false,
    checkedAllStatus: true,
    startX: 0, //开始坐标
    startY: 0,
    backtype:1,
    deviceInfo: {},
    height: 0,
    scrollY: true
  },
  swipeCheckX: 35, //激活检测滑动的阈值
  swipeCheckState: 0, //0未激活 1激活
  maxMoveLeft: 90, //消息列表项最大左滑距离
  correctMoveLeft: 90, //显示菜单时的左滑距离
  thresholdMoveLeft: 35,//左滑阈值，超过则显示菜单
  lastShowMsgId: '', //记录上次显示菜单的消息id
  moveX: 0,  //记录平移距离
  showState: 0, //0 未显示菜单 1显示菜单
  touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单
  swipeDirection: 0, //是否触发水平滑动 0:未触发 1:触发水平滑动 2:触发垂直滑动

  onLoad: function (options) {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  onReady: function () {
    //获得popup组件
    this.popup = this.selectComponent("#popup");
  },
  onShow: function () {
    this.data.deviceInfo = wx.getSystemInfoSync();
    this.setData({ height: this.data.deviceInfo.windowHeight-60})
    // 页面显示
    if (wx.getStorageSync('token')) {
      this.getCartList();
    }
  },
  onUnload: function (e) {
    if(this.data.backtype != 2){
      wx.reLaunch({
        url: '/pages/index/index'
      })
    }
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getCartList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  getCartList: function () {
    let that = this;
    util.request(api.CartList).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          cartGoods: []
        });
        let _tmp = res.data.cartList;
        for (var i = 0; i < _tmp.length; i++) {
          _tmp[i].ids = 'id-' + i + 1;
        }
        that.setData({
          showContent: true,
          cartGoods: _tmp,
          cartTotal: res.data.cartTotal
        });
        that.setData({
          checkedAllStatus: that.isCheckedAll(),
          disCheck: that.isDisCheck()
        });
      }
    });
  },
  ontouchstart: function (e) {
    if (this.showState === 1) {
      this.touchStartState = 1;
      this.showState = 0;
      this.moveX = 0;
      this.translateXMsgItem(this.lastShowMsgId, 0, 200);
      this.lastShowMsgId = "";
      return;
    }
    this.firstTouchX = e.touches[0].clientX;
    this.firstTouchY = e.touches[0].clientY;
    if (this.firstTouchX > this.swipeCheckX) {
      this.swipeCheckState = 1;
    }
    this.lastMoveTime = e.timeStamp;
  },

  ontouchmove: function (e) {
    if (this.swipeCheckState === 0) {
      return;
    }
    //当开始触摸时有菜单显示时，不处理滑动操作
    if (this.touchStartState === 1) {
      return;
    }
    var moveX = e.touches[0].clientX - this.firstTouchX;
    var moveY = e.touches[0].clientY - this.firstTouchY;
    //已触发垂直滑动，由scroll-view处理滑动操作
    if (this.swipeDirection === 2) {
      return;
    }
    //未触发滑动方向
    if (this.swipeDirection === 0) {
      //触发垂直操作
      if (Math.abs(moveY) > 4) {
        this.swipeDirection = 2;

        return;
      }
      //触发水平操作
      if (Math.abs(moveX) > 4) {
        this.swipeDirection = 1;
        this.setData({ scrollY: false });
      }
      else {
        return;
      }

    }
    //禁用垂直滚动
    if (this.data.scrollY) {
      this.setData({ scrollY: false });
    }

    this.lastMoveTime = e.timeStamp;
    //处理边界情况
    if (moveX > 0) {
      moveX = 0;
    }
    //检测最大左滑距离
    if (moveX < -this.maxMoveLeft) {
      moveX = -this.maxMoveLeft;
    }
    this.moveX = moveX;
    this.translateXMsgItem(e.currentTarget.id, moveX, 0);
  },
  ontouchend: function (e) {
    this.swipeCheckState = 0;
    var swipeDirection = this.swipeDirection;
    this.swipeDirection = 0;
    if (this.touchStartState === 1) {
      this.touchStartState = 0;
      this.setData({ scrollY: true });
      return;
    }
    //垂直滚动，忽略
    if (swipeDirection !== 1) {
      return;
    }
    if (this.moveX === 0) {
      this.showState = 0;
      //不显示菜单状态下,激活垂直滚动
      this.setData({ scrollY: true });
      return;
    }
    if (this.moveX === this.correctMoveLeft) {
      this.showState = 1;
      this.lastShowMsgId = e.currentTarget.id;
      return;
    }
    if (this.moveX < -this.thresholdMoveLeft) {
      this.moveX = -this.correctMoveLeft;
      this.showState = 1;
      this.lastShowMsgId = e.currentTarget.id;
    }
    else {
      this.moveX = 0;
      this.showState = 0;
      //不显示菜单,激活垂直滚动
      this.setData({ scrollY: true });
    }
    this.translateXMsgItem(e.currentTarget.id, this.moveX, 90);
    //this.translateXMsgItem(e.currentTarget.id, 0, 0);
  },
  getItemIndex: function (id) {
    var cartGoods = this.data.cartGoods;
    for (var i = 0; i < cartGoods.length; i++) {
      if (cartGoods[i].ids === id) {
        return i;
      }
    }
    return -1;
  },
  translateXMsgItem: function (id, x, duration) {
    var animation = wx.createAnimation({ duration: duration });
    animation.translateX(x).step();
    this.animationMsgItem(id, animation);
  },
  animationMsgItem: function (id, animation) {
    var index = this.getItemIndex(id);
    var param = {};
    var indexString = 'cartGoods[' + index + '].animation';
    param[indexString] = animation.export();
    this.setData(param);
  },
  animationMsgWrapItem: function (id, animation) {
    var index = this.getItemIndex(id);
    var param = {};
    var indexString = 'cartGoods[' + index + '].wrapAnimation';
    param[indexString] = animation.export();
    this.setData(param);
  },
    //取消事件
  _error() {
    console.log('你点击了取消');
    this.popup.hidePopup();
  },
  //确认事件
  _success() {
    this.popup.hidePopup();
    let that = this;
    util.request(api.CartDelete, {
      productIds: [that.data.delID]
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.showToast({title: '删除成功' })
        that.getCartList();
      }
    });
  },
  deleteCart(event) {
    this.setData({
      ids: event.currentTarget.dataset.id,
      delID: event.currentTarget.dataset.itemId
    })
    this.popup.showPopup();
  },
    // 判断购物车是否没有选中商品
  isDisCheck: function () {
    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (checkedGoods.length <= 0) {
      return true;
    } else {
      return false;
    }
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },
  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;
    let productIds = [];
    productIds.push(that.data.cartGoods[itemIndex].productId);

    util.request(api.CartChecked, {
      productIds: productIds,
      isChecked: that.data.cartGoods[itemIndex].checked ? 0 : 1
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        let _tmp = res.data.cartList;
        for (var i = 0; i < _tmp.length; i++) {
          _tmp[i].ids = 'id-' + i + 1;
        }
        that.setData({
          cartGoods: _tmp,
          cartTotal: res.data.cartTotal
        });
      }
      that.setData({
        checkedAllStatus: that.isCheckedAll(),
        disCheck: that.isDisCheck()
      });
    });

  },
  checkedAll: function () {
    let that = this;

    var productIds = this.data.cartGoods.map(function (v) {
      return v.productId;
    });
    util.request(api.CartChecked, {
      productIds: productIds,
      isChecked: that.isCheckedAll() ? 0 : 1
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        let _tmp = res.data.cartList;
        for (var i = 0; i < _tmp.length; i++) {
          _tmp[i].ids = 'id-' + i + 1;
        }
        that.setData({
          cartGoods: _tmp,
          cartTotal: res.data.cartTotal
        });
      }
      that.setData({
        checkedAllStatus: that.isCheckedAll(),
        disCheck: that.isDisCheck()
      });
    });

  },
  updateCart: function (productId, goodsId, number, id) {
    let that = this;

    util.request(api.CartUpdate, {
      productId: productId,
      goodsId: goodsId,
      number: number,
      id: id
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        let _tmp = res.data.cartList;
        for (var i = 0; i < _tmp.length; i++) {
          _tmp[i].ids = 'id-' + i + 1;
        }
        that.setData({
          cartGoods: _tmp,
          cartTotal: res.data.cartTotal
        });
      }
      that.setData({
        checkedAllStatus: that.isCheckedAll(),
        disCheck: that.isDisCheck()
      });
    });

  },
  handleInput: function (event) {
    let that = this;
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = that.data.cartGoods[itemIndex];

    if (event.detail.value == '') {
      cartItem.number = ''
      return;
    }

    if (parseInt(event.detail.value) > parseInt(cartItem.maxCount)) {   //输入值大于库存量
      cartItem.number = parseInt(cartItem.maxCount);
    } else if (parseInt(event.detail.value) < 1) {
      cartItem.number = 1;
    } else {
      cartItem.number = parseInt(event.detail.value);
    }

    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.productId, cartItem.goodsId, cartItem.number, cartItem.id);
  },
  handleBlur: function (event) {
    let that = this;
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = that.data.cartGoods[itemIndex];
    if (event.detail.value != '') {
      return;
    }
    cartItem.number = 1;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.productId, cartItem.goodsId, cartItem.number, cartItem.id);
  },

  cutNumber: function (event) {

    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    if (cartItem.number <= 1) {
      return;
    }
    let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
    cartItem.number = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.productId, cartItem.goodsId, number, cartItem.id);
  },
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    if (cartItem.number >= cartItem.maxCount) {
      return;
    }
    let number = cartItem.number + 1;
    cartItem.number = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.productId, cartItem.goodsId, number, cartItem.id);

  },

  // 确认结算
  checkoutOrder: function () {
    //获取已选择的商品
    let that = this;

    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (checkedGoods.length <= 0) {
      wx.showToast({ icon: 'none', title: '请选择要结算的商品' })
      return false;
    }

    // storage中设置了cartId，则是购物车购买
    try {
      wx.setStorageSync('cartId', 0);
      wx.navigateTo({
        url: '/pages/cart/conrimeorder/confirmorder'
      })
    } catch (e) { }

  },
  goMarket: function () {
    this.setData({
      backtype: 2
    })
    wx.switchTab({
      url: '/pages/market/index/index',
    })
  }
})