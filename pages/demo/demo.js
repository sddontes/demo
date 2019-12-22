
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();

Page({
  data: {
    delID: 0,
    cartGoods: [],
    cartTotal: {},
    disCheck: false,
    checkedAllStatus: true
  },
  onLoad: function (options) {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  onShow: function () {
    // 页面显示
    if (wx.getStorageSync('token')) {
      this.getCartList();
    }
    else {
      // wx.navigateTo({
      //   url: "/pages/login/login"
      // });
    }
  },
  onUnload: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  onReady: function () {
    //获得popup组件
    this.popup = this.selectComponent("#popup");
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
    let addressId = that.data.addressId;
    util.request(api.CartDelete, {
      productIds: [that.data.delID]
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.showToast({ icon: 'none', title: '删除成功' })
        that.getCartList();
      }
    });
  },
  deleteCart(event) {
    this.setData({
      delID: event.target.dataset.itemId
    })
    this.popup.showPopup();
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
          cartGoods: res.data.cartList,
          cartTotal: res.data.cartTotal
        });

        that.setData({
          checkedAllStatus: that.isCheckedAll(),
          disCheck: that.isDisCheck()
        });
      }
    });
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
        that.setData({
          cartGoods: res.data.cartList,
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
        that.setData({
          cartGoods: res.data.cartList,
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
        that.setData({
          cartGoods: res.data.cartList,
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
    wx.switchTab({
      url: '/pages/market/index/index',
    })
  }
})
