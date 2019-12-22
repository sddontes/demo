Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    focus: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModalStatus: false,
    showActive: false,
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hidePopup: function () {
      // 隐藏遮罩层
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
          showModalStatus: false,
          content: '',
          showActive: false
        })
      }.bind(this), 200)
    },
    //展示弹框
    showPopup() {
      // 显示遮罩层
      // var animation = wx.createAnimation({
      //   duration: 200,
      //   timingFunction: "linear",
      //   delay: 0
      // })
      // this.animation = animation
      // animation.translateY(300).step()
      // this.setData({
      //   animationData: animation.export(),
      //   showModalStatus: true
      // })
      // setTimeout(function () {
      //   animation.translateY(0).step()
      //   this.setData({
      //     animationData: animation.export()
      //   })
      // }.bind(this), 200)
      this.setData({
        showModalStatus: true
      })
    },
    handleText(e){
      if(e.detail.value == ''){
        this.setData({
          showActive: false
        });
      }else{
        this.setData({
          showActive: true
        });
      }
      this.setData({
        content: e.detail.value
      });
    },
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _error() {
      //触发取消回调
      this.triggerEvent("error")
    },
    _success() {
      if(this.data.showActive){
        //触发成功回调
        this.triggerEvent("success", this.data.content);
      }
    }
  }
})