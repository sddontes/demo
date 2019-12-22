const app = getApp()
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // region: ['省', '市', '区'],
    isDefault: true, //强制新增地址为默认地址
    showDel: false,
    address: {
      id: 0,
      provinceId: 0,
      cityId: 0,
      areaId: 0,
      address: '',
      name: '',
      mobile: '',
      isDefault: true,
      provinceName: '',
      cityName: '',
      areaName: ''
    },
    showModalStatus: false,
    selectRegionList: [         //存放弹框头部选中的省市县地址
      { id: 0, name: '省', pid: 1, type: 1 },
      { id: 0, name: '市', pid: 1, type: 2 },
      { id: 0, name: '区', pid: 1, type: 3 }
    ],
    regionType: 1,     //根据这个type,来判断获取的是省市县中的那个数据  1省2市3区，还来判断哪个元素加selected类
    regionList: [],   //弹框中接口请求到的省市县数据数组
    selectRegionDone: false   //判断弹框中的完成按钮是否可点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id && options.id != 0) {
      this.setData({
        addressId: options.id,
        showDel: true
      });
      this.getAddressDetail();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得popup组件
    this.popup = this.selectComponent("#popup");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
    util.request(api.AddressDelete, {
      id: addressId
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.showToast({ icon: 'none', title: '删除地址成功' })
        wx.removeStorage({ key: 'addressId', success: function (res) { }, });
        setTimeout(function () { wx.navigateBack({ delta: 1 }); }, 1000);
      }
    });
  },
  deleteAddress() {
    this.popup.showPopup();
  },
  getAddressDetail() {
    let that = this;
    util.request(api.AddressDetail, { id: that.data.addressId }).then(function (res) {
      if (res.errno === 0) {
        if (res.data) {
          that.setData({
            address: res.data
          });
        }
      }
    });
  },
  bindinputName(event) {
    let address = this.data.address;
    address.name = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputMobile(event) {
    let address = this.data.address;
    address.mobile = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputAddress(event) {
    let address = this.data.address;
    address.address = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindIsDefault(event) {
    let address = this.data.address;
    address.isDefault = event.detail.value;
    this.setData({
      address: address
    });
  },

  // 保存地址
  saveAddress() {
    let address = this.data.address;
    console.log(address.areaId);
    if (address.name == '') {
      wx.showToast({ icon: 'none', title: '请输入姓名' })
      return false;
    }
    if (address.mobile == '') {
      wx.showToast({ icon: 'none', title: '请输入手机号码' })
      return false;
    }
    if (!util.isValidPhone(address.mobile)) {
      util.showErrorToast('手机号不正确');
      return false;
    }
    if (address.areaId == 0 || !address.areaId) {
      wx.showToast({ icon: 'none', title: '请选择省市区' })
      // return false;
    }
    if (address.address == '') {
      wx.showToast({ icon: 'none', title: '请输入街道地址' })
      return false;
    }
    let that = this;
    util.request(api.AddressSave, {
      id: address.id,
      name: address.name,
      mobile: address.mobile,
      provinceId: address.provinceId,
      cityId: address.cityId,
      areaId: address.areaId,
      address: address.address,
      // isDefault: address.isDefault,
      isDefault: that.data.isDefault,
      provinceName: address.provinceName,
      cityName: address.cityName,
      countyName: address.areaName
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        //返回之前，先取出上一页对象，并设置addressId
        wx.showToast({ icon: 'none', title: '添加成功！' })
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        if (prevPage.route == "pages/cart/conrimeorder/confirmorder") {
          prevPage.setData({
            addressId: res.data
          })
          try {
            wx.setStorageSync('addressId', res.data);
          } catch (e) {
          }
        }
        wx.navigateBack();
      }
    });
  },
  
  // 点击弹出选择省市县
  chooseRegion() {
    let that = this;
    this.showModal();
    //设置区域选择数据
    let address = this.data.address;
    if (address.provinceId > 0 && address.cityId > 0 && address.areaId > 0) {
       // 已经选过地址，则回显弹框中头部地址信息，列表中显示的是区的列表，故regionType为3
      let selectRegionList = this.data.selectRegionList;
      selectRegionList[0].id = address.provinceId;
      selectRegionList[0].name = address.provinceName;
      selectRegionList[0].pid = 0;

      selectRegionList[1].id = address.cityId;
      selectRegionList[1].name = address.cityName;
      selectRegionList[1].pid = address.provinceId;

      selectRegionList[2].id = address.areaId;
      selectRegionList[2].name = address.areaName;
      selectRegionList[2].pid = address.cityId;

      this.setData({
        selectRegionList: selectRegionList,
        regionType: 3
      });
      this.getRegionList(address.cityId);
    } else {
      // 若没选过地址，头部地址回显空，列表中显示省的列表
      this.setData({
        selectRegionList: [
          { id: 0, name: '省', pid: 0, type: 1 },
          { id: 0, name: '市', pid: 0, type: 2 },
          { id: 0, name: '区', pid: 0, type: 3 }
        ],
        regionType: 1
      })
      // 获取省市县数据，0为省的数据
      this.getRegionList(0);
    }
    // 判断弹框完成按钮是否可点
    this.setRegionDoneStatus();
  },

  // 获取弹框中的省市县列表，且回显已经选过的地址
  getRegionList(regionId) {
    let that = this;
    let regionType = that.data.regionType;
    util.request(api.RegionList, { pid: regionId }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          regionList: res.data.map(item => {
            //回显已选择的省市县数据
            if (regionType == item.type && that.data.selectRegionList[regionType - 1].id == item.id) {
              item.selected = true;
            } else {
              item.selected = false;
            }
            return item;
          })
        });
      }
    });
  },

  // 判断弹框完成按钮是否是可点击状态
  setRegionDoneStatus() {
    let that = this;
    let doneStatus = that.data.selectRegionList.every(item => {
      // 省市县id只要有一个为0，则程序return true
      return item.id != 0;
    });
    that.setData({
      selectRegionDone: doneStatus
    })

  },

  // 点击省市县完成按钮，把弹框中省市县数据传给address对象中
  doneSelectRegion() {
    if (this.data.selectRegionDone === false) {
      return false;
    }
    let address = this.data.address;
    let selectRegionList = this.data.selectRegionList;
    address.provinceId = selectRegionList[0].id;
    address.cityId = selectRegionList[1].id;
    address.areaId = selectRegionList[2].id;
    address.provinceName = selectRegionList[0].name;
    address.cityName = selectRegionList[1].name;
    address.areaName = selectRegionList[2].name;

    this.setData({
      address: address
    });
    this.hideModal();
  },

  // 弹框头部省市县切换
  selectRegionType(event) {
    let that = this;
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    let selectRegionList = that.data.selectRegionList;
    //判断是否可点击
    if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex - 1].id <= 0)) {
      return false;
    }
    this.setData({
      regionType: regionTypeIndex + 1
    })
    let selectRegionItem = selectRegionList[regionTypeIndex];
    this.getRegionList(selectRegionItem.pid);
    this.setRegionDoneStatus();
  },

  // 点击省市县元素，获取下级数据
  selectRegion(event) {
    let that = this;
    let regionIndex = event.target.dataset.regionIndex;
    let regionItem = this.data.regionList[regionIndex];
    let regionType = regionItem.type;
    let selectRegionList = this.data.selectRegionList;
    selectRegionList[regionType - 1] = regionItem;

    if (regionType != 3) {
      this.setData({
        selectRegionList: selectRegionList,
        regionType: regionType + 1
      })
      this.getRegionList(regionItem.id);
    } else {
      this.setData({
        selectRegionList: selectRegionList
      })
    }
    //重置下级区域为空
    selectRegionList.map((item, index) => {
      if (index > regionType - 1) {
        item.id = 0;
        item.name = index == 1 ? '市' : '区';
        item.pid = 0;
      }
      return item;
    });

    this.setData({
      selectRegionList: selectRegionList
    })

    that.setData({
      regionList: that.data.regionList.map(item => {
        //标记已选择的
        if (that.data.regionType == item.type && that.data.selectRegionList[that.data.regionType - 1].id == item.id) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        return item;
      })
    });
    this.setRegionDoneStatus();
  },


  // 显示关闭省市县弹框
  showModal: function () {
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
})