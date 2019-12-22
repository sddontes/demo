var util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    wikiList: [],   //tag标签
    type: 0,
    title: '',
    location: '',
    files: [],
    delIndex: 0,
    locationSuccess: false,
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({ files: JSON.parse(options.files) });
    let _files = JSON.parse(options.files);
    // console.log(_files);
    for (let i in _files) {
      if (_files[i]['percent'] == 0 && !_files[i]['uploadFail']) { that.upload(_files, i); }
    }
    that.getTopicType();
  },
  handleLocation: function () {
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
  getTopicType() {
    let that = this;
    util.request(api.TopicType).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          wikiList: res.data.data
        });
      }
    });
  },
  tagClick: function(e){
    this.setData({
      activeIndex: e.currentTarget.dataset.index,
      type: e.currentTarget.dataset.id
    })
  },

  chooseImage: function (e) {
    let that = this;
    let _files = that.data.files;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tmpFiles = res.tempFiles;
        tmpFiles.map(v => {
          v.percent = 0;
          v.uploadFail = false;
          _files.push(v);
        });
        that.setData({files: _files});
        for(let i in _files){
          if (_files[i]['percent'] == 0 && !_files[i]['uploadFail']){that.upload(_files,i);}
        }
      }
    })
  },
  upload: function (files,i) {
    let that = this;
    const uploadTask = wx.uploadFile({
      url: api.StorageUpload,
      filePath: files[i]['path'],
      name: 'file',
      success: function (res) {   
        if (res.statusCode == 200 && JSON.parse(res.data).errno === 0 ) {
          var _res = JSON.parse(res.data);
          var url = _res.data.url
          files[i]['serverpath'] = url;
          that.setData({files: files});
          console.log("图片上传"+i+"到服务器完成")
          // console.log(files)
        }
      },
      fail: function (e) {
        files[i]['uploadFail'] = true;
        that.setData({files: files});
      },
      complete: function(e){
        if (e.statusCode != 200){
          files[i]['uploadFail'] = true;
          that.setData({ files: files });
        }
      }
    })
    uploadTask.onProgressUpdate((res) => {
      files[i]['percent'] = res.progress;
      that.setData({
        files: files
      })
      // console.log('上传进度', res.progress)
      // console.log('已经上传的数据长度', res.totalBytesSent)
      // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })

  },
  handledel: function(e){
    let that = this;
    let _list = that.data.files;
    that.setData({
      delIndex: e.currentTarget.dataset.index
    });
    _list.splice(e.currentTarget.dataset.index-1, 1);
    that.setData({
      files: _list,
    })
  },
  handleInput: function(e){
    this.setData({
      title: e.detail.value
    })
  },
  publistPic: function(){
    let that = this;
    let picUrls = [];
    that.data.files.map(v => {
      picUrls.push(v.serverpath);
    });
    if(that.data.title == ""){
      wx.showToast({ icon: 'none', title: '请输入标题' });
      return;
    }
    if (picUrls.length <= 0) {
      wx.showToast({ icon: 'none', title: '请上传图片' });
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

    util.request(api.publistPic, {
      channel: 'pic',
      title: that.data.title,
      content: picUrls.join(','),
      location: that.data.location,
      type: that.data.type,
      id:0
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.showToast({title: '发布成功！' })
        setTimeout(()=>{
          wx.navigateBack();
        },1000)
      }
    });
  }
})