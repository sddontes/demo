// component/shares/shares.js
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    showfriend:{
      type: Boolean,
      value: true
    },
    // 弹窗内容
    showdelete: {
      type: Boolean,
      value: false
    },
    // 弹窗内容
    showreport: {
      type: Boolean,
      value: false
    },
    showedit:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModalStatus: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal: function () {
      // 显示遮罩层
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
          showModalStatus: false
        })
      }.bind(this), 200)
    },
    _success() {
      this.triggerEvent("success");
    },
    _report() {
      this.triggerEvent("report");
    },
    _delete(){
      this.triggerEvent("delete");
    },
    _edit(){
      this.triggerEvent("edit");
    }
  }
})
