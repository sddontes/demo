// 将时间转为2018/10/23 10:00:00格式

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 将时间转为*月*日
const formatTimeToNum = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [month, day].map(formatNumber).join('月')+'日';
}

//根据时间获取星期
const getDates = date => {
  let show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
  let day = date.getDay()
  return show_day[day];
}
// 数字处理
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isValidPhone = str => {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
} 



function redirect(url) {
  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

/**
   * 封封微信的的request
   */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Litemall-Token': wx.getStorageSync('token')
      },
      success: function (res) {

        // if (res.code == 200) {

        //   if (res.data.errno == 501) {
        //     // 清除登录相关内容
        //     try {
        //       wx.removeStorageSync('userInfo');
        //       wx.removeStorageSync('token');
        //     } catch (e) {
        //       // Do something when catch error
        //     }
        //     // 切换到登录页面
        //     wx.navigateTo({
        //       url: '/pages/login/login'
        //     });
        //   } else if (res.data.errno != 501 && res.data.errno != 0){
        //     wx.showToast({ icon: 'none', title: res.data.errmsg})
        //   } else {
        //     resolve(res.data);
        //   }
        // } else {
        //   reject(res.errMsg);
        // }
        console.log("res.code__" ,res)
        if (res) {
          resolve(res.data);
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

module.exports = {
  formatTime: formatTime,
  formatTimeToNum: formatTimeToNum,
  getDates: getDates,
  isValidPhone: isValidPhone,
  request: request,
  redirect
}
