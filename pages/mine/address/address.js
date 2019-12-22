const app = getApp()
var util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addList:[],
    showcheck: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddressList();
    
  },
  getWXaddress(){
    let that = this;
    wx.chooseAddress({
      success(res) {
        console.log(res)
        util.request(api.AddressSave, {
          id: 0,
          name: res.userName,
          mobile: res.telNumber,
          address: res.detailInfo,
          isDefault: true,
          provinceName: res.provinceName,
          cityName: res.cityName,
          countyName: res.countyName
        }, 'POST').then(function (res) {
          console.log(res)
          if (res.errno === 0) {
            //返回之前，先取出上一页对象，并设置addressId
            wx.showToast({title: '添加成功！' })
          }
        });
      }
    })
  },
  addressAdd(event){
    // 从个人中心添加地址
      wx.navigateTo({
        url: '/pages/mine/newaddress/newaddress?id=' + event.currentTarget.dataset.addressId
      })
  },
  addressAddOrUpdate(event) {
    //返回之前，先取出上一页对象，并设置addressId
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];

    // 如果是从确认订单页进来
    if (prevPage.route == "pages/cart/conrimeorder/confirmorder" && event.currentTarget.dataset.addressId!=0) {
      try {
        wx.setStorageSync('addressId', event.currentTarget.dataset.addressId);
      } catch (e) {
      }
      wx.navigateBack();
    } else {
      // 从个人中心添加地址
      wx.navigateTo({
        url: '/pages/mine/newaddress/newaddress?id=' + event.currentTarget.dataset.addressId
      })
    }
  },
  getAddressList() {
    let that = this;
    util.request(api.AddressList).then(function (res) {
      if (res.errno === 0) {
        //返回之前，先取出上一页对象，并设置addressId
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        // 如果是从确认订单页进来
        if (prevPage.route == "pages/cart/conrimeorder/confirmorder" && wx.getStorageSync('addressId')) {
          res.data.map(v => {
            v.isDefault = false;
            if (v.id == wx.getStorageSync('addressId')){
              v.isDefault = true;
            }
          })
          that.setData({
            addList: res.data
          });
        }else{
          that.setData({
            addList: res.data
          });
        }

      }
    });
  },
})