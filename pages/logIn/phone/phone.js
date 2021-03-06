// pages/logIn/logIn.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:'',
    canNext:false
  },
  onGetUserInfo(event){
    console.log(event)
    var that = this
    const userInfo = event.detail.userInfo
    const userdata = event.detail
    console.log(userdata.errMsg)
    if (userdata.errMsg =="getUserInfo:ok"){
      console.log(1)
      wx.getUserInfo({
        success: res => {
          console.log('用户信息+++-----------')
          console.log(res)
          console.log('用户信息+++-----------')
          // 可以将 res 发送给后台解码出 unionId
          if (res.userInfo) {
            that.globalData.userInfo = res.userInfo
          }
          if (res.userInfo.avatarUrl) {
            wx.setStorage({
              key: 'cachAvatarUrl',
              data: res.userInfo.avatarUrl
            })
          }
          var pages = getCurrentPages();
          if (pages.route == "pages/index/index") {
            pages[0].setData({ userAvatar: that.globalData.userInfo.avatarUrl });
          }
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (that.userInfoReadyCallback) {
            that.userInfoReadyCallback(res)
            // 罗 加
            that.globalData.userInfo = res.userInfo
          }
        }
     
      })
    }else{
      console.log(2)
      app.globalData.userInfo.nickName = "游客" + new Date().getTime();

      console.log("用户拒绝授权");
      var pages = getCurrentPages();
      if (pages.route == "pages/index/index") {
        pages[0].setData({ userAvatar: app.globalData.userInfo.avatarUrl });
      }
    }
    // success() {
    //   // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
    //   console.log("用户同意授权");
    //   wx.getUserInfo({
    //     success: res => {
    //       console.log('用户信息+++-----------')
    //       console.log(res)
    //       console.log('用户信息+++-----------')
    //       // 可以将 res 发送给后台解码出 unionId
    //       if (res.userInfo) {
    //         that.globalData.userInfo = res.userInfo
    //       }
    //       if (res.userInfo.avatarUrl) {
    //         wx.setStorage({
    //           key: 'cachAvatarUrl',
    //           data: res.userInfo.avatarUrl
    //         })
    //       }
    //       var pages = getCurrentPages();
    //       if (pages.route == "pages/index/index") {
    //         pages[0].setData({ userAvatar: that.globalData.userInfo.avatarUrl });
    //       }
    //       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //       // 所以此处加入 callback 以防止这种情况
    //       if (that.userInfoReadyCallback) {
    //         that.userInfoReadyCallback(res)
    //         // 罗 加
    //         that.globalData.userInfo = res.userInfo
    //       }
    //     }
    //   });
    // },
    // fail() {
    //   that.globalData.userInfo.nickName = "游客" + new Date().getTime();
    //   console.log("用户拒绝授权");
    //   var pages = getCurrentPages();
    //   if (pages.route == "pages/index/index") {
    //     pages[0].setData({ userAvatar: that.globalData.userInfo.avatarUrl });
    //   }
    // }
  },
  nextStep:function () {
      // console.log(1)
    if(!app.data.openId&&app.globalData.userId!=-1){
      wx.switchTab({
        url:'../../index/index'
     });
    }else{
      wx.redirectTo({
        url: '../code/code'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;    
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
    
    // if(!app.data.openId&&app.globalData.userId!=-1){
    //   setTimeout(function(){
    //     wx.reLaunch({
    //       url:'../../index/index'
    //    });
    //   },800);
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})