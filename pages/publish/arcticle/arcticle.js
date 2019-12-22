var util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex:0,
    wikiList:[],
    picUrl: '', //封面图片
    arcList: [{type:1,content:''}],
    title: '',
    type: 0,
    location: '',
    locationSuccess: false,
    arcId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.getTopicType();
    if (wx.getStorageSync('editarc')){
      let _editarc = wx.getStorageSync('editarc');
      let _arcList = [];
      let _content = _editarc.data.content.split('<span></span>');
      _content.map((v,k)=>{
        if(v){
          console.log(v)
          if (v.indexOf('</div>') > 0) {
            v = v.substring(5, v.length - 6)
            _arcList.push({ type: 1, content: v })
          } else {
            v = v.split('\'')[1];
            _arcList.push({ type: 2, path: v, picUrl:v})
          }
        }
      })
      that.setData({
        arcId: _editarc.data.id,
        locationSuccess: true,
        title: _editarc.data.title,
        arcList: _arcList,
        location: _editarc.data.location,
        type: _editarc.data.type
      })
      return;
    }
    let arcticle = wx.getStorageSync('arcticle');
    if (arcticle) {
      that.setData({
        locationSuccess: true,
        title: arcticle.data.title,
        arcList: arcticle.data.arcList,
        location: arcticle.data.location,
        type: arcticle.data.type
      })
    }
    
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  // 输入标题
  handleInput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  handleInputitem: function (e) {
    let that = this;
    let _list = that.data.arcList;
    let index = e.currentTarget.dataset.index;
    _list[index]['content'] = e.detail.value;
    that.setData({
      arcList: _list
    })
  },
  // 新建段落
  handleNew: function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.data.arcList.splice((index + 1), 0, { type: 1 });
    let _arcList = that.data.arcList;
    that.setData({
      arcList: _arcList
    })
  },
  // 添加图片
  handleImg: function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let _arcList = that.data.arcList;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tmpFiles = res.tempFiles;
        tmpFiles.map((v,k) => {
          v.percent = 0;
          v.uploadFail = false;
          v.type = 2;
          that.data.arcList.splice((index+1+k), 0, v);
          _arcList = that.data.arcList;
        });
        that.setData({ arcList: _arcList });
        for (let i in _arcList) {
          if (_arcList[i]['percent'] == 0 && !_arcList[i]['uploadFail']) { that.upload(_arcList, i); }
        }
      }
    })
  },
  upload: function (files, i) {
    let that = this;
    wx.showLoading({
      title: '上传中'
    })
    const uploadTask = wx.uploadFile({
      url: api.StorageUpload,
      filePath: files[i]['path'],
      name: 'file',
      success: function (res) {
        if (res.statusCode == 200 && JSON.parse(res.data).errno === 0) {
          var _res = JSON.parse(res.data);
          var url = _res.data.url
          files[i]['picUrl'] = url;
          that.setData({ arcList: files });
          console.log("图片上传" + i + "到服务器完成")
        }
      },
      fail: function (e) {
        files[i]['uploadFail'] = true;
        that.setData({ arcList: files });
      },
      complete: function (e) {
        wx.hideLoading();
        if (e.statusCode != 200) {
          files[i]['uploadFail'] = true;
          that.setData({ arcList: files });
        }
      }
    })
    uploadTask.onProgressUpdate((res) => {
      files[i]['percent'] = res.progress;
      that.setData({
        arcList: files
      })
      // console.log('上传进度', res.progress)
      // console.log('已经上传的数据长度', res.totalBytesSent)
      // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })

  },
  // 删除
  handledel: function (e) {
    let that = this;
    let _list = that.data.arcList;
    _list.splice(e.currentTarget.dataset.index, 1);
    that.setData({
      arcList: _list,
    })
  },
  // 下移
  handleDown: function(e){
    let that = this;
    let arcList = that.data.arcList;
    let index = e.currentTarget.dataset.index;
    let tmp = {};
    for (let i = 0; i < arcList.length; i++) {
      if (index == i) {
        tmp = arcList[i];
        arcList[i] = arcList[i + 1];
        arcList[i + 1] = tmp;
      }
    }
    that.setData({
      arcList: arcList
    })
  },
  // 上移
  handleUp: function(e){
    let that = this;
    let arcList = that.data.arcList;
    let index = e.currentTarget.dataset.index;
    let tmp = {};
    for(let i=0;i<arcList.length;i++){
      if(index == i){
        tmp = arcList[i];
        arcList[i] = arcList[i-1];
        arcList[i-1] = tmp;
      }
    }
    that.setData({
      arcList: arcList
    })
  },
  getTopicType() {
    let that = this;
    util.request(api.TopicType).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          wikiList: res.data.data
        });
        if(that.data.type != 0){
          res.data.data.map((v,k) => {
            if (that.data.type == v.dicItemValue){
              that.setData({
                activeIndex: k+1
              })
            }
          })
        }
      }
    });
  },
  tagClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index,
      type: e.currentTarget.dataset.id
    })
  },
  handleLocation: function(){
    let that = this;
    // 实例化API核心类
    var qqmapsdk = new QQMapWX({
      key: 'YQXBZ-TNUWX-EXH4X-TSRST-QOLAE-OXB2E'
    });
    wx.getLocation({
      type: 'gcj02',
      success: function (result) {
        //2、根据坐标获取当前位置名称
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: result.latitude,
            longitude: result.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.address_component;
            that.setData({
              locationSuccess: true,
              location: address.province,
              // location: address.province + address.city
            });
          },
          fail: function (res) {
            that.setData({
              location: '点击重新获取'
            });
          },
        });
      }
    })
  },
  publistPic: function(){
    let that = this;
    let picUrls = [];
    let content = [];
    that.data.arcList.map(v => {
      if(v.type ==1 && v.content){
        content.push('<div>'+v.content+'</div><span></span>')
      }else if(v.type == 2 && v.picUrl){
        content.push('<img src=\'' + v.picUrl +'\' /><span></span>');
        picUrls.push(v.picUrl);
      }
    });
    if (that.data.title == "") {
      wx.showToast({ icon: 'none', title: '请输入标题' });
      return;
    }
    if (content.length <= 0) {
      wx.showToast({ icon: 'none', title: '请输入文章内容' });
      return;
    }
    if(picUrls.length <= 0){
      wx.showToast({ icon: 'none', title: '请至少上传一张图片' });
      return;
    }
    if (that.data.location == '' || that.data.locationSuccess == false) {
      wx.showToast({ icon: 'none', title: '请选择所在位置' });
      return;
    }
    if (that.data.activeIndex == 0) {
      wx.showToast({ icon: 'none', title: '请选择分类标签' });
      return;
    }
    that.setData({
      picUrl: picUrls[0]
    })
    try {
      wx.setStorageSync('arcticle', {data:that.data,content:content});
    } catch (e) {
    }
    if (wx.getStorageSync('editarc')){
      try {
        wx.removeStorageSync('editarc')
      } catch (e) {
        // Do something when catch error
      }
    }
    wx.redirectTo({
      url: '../priviewarc/priviewarc',
    });
  },
  onUnload: function (e) {
    if (wx.getStorageSync('editarc')) {
      try {
        wx.removeStorageSync('editarc')
      } catch (e) {
        // Do something when catch error
      }
    }
  },

})