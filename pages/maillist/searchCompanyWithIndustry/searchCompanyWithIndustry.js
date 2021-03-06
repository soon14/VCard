// pages/maillist/AllEnterprises/AllEnterprises.js
var app=getApp();
Page({
  data: {
    searchCompany:'',
    industryName:'',
    industryId:'',
    currentPage:1,
    totalPageSize:1,
    city:'',
    iconList:{
      photo:"../../../assets/images/icon/icon-phone-gray.png",
      email:"../../../assets/images/icon/icon-email-gray.png",
      position:"../../../assets/images/icon/icon-address-gray.png",
      authentication:"../../../assets/images/icon/icon-authentication-yellow.png"
    },
    qualityEnterprise:[],
    city:''
  },
  toaddressMaps(e){
    console.log(e.currentTarget.dataset.adress);
    wx.navigateTo({
      url: "../../mine/companyAddressMaps/companyAddressMaps?address="+e.currentTarget.dataset.address,
      success: res => {

      },
      fail: res => {

      },
      complete: res => {

      }
    })
  },
  toSearch(e){
    wx.navigateTo({
      url: "../../commenPage/searchPage/searchPage?storageKey="+e.currentTarget.dataset.storagekey,
      success: res => {
      },
      fail: res => {
      },
      complete: res => {

      }
    })
  },
  tomaillist(){
    wx.navigateBack({
      delta: 1
    })
  },
  getdata(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var that=this;

    wx.request({
      url: app.data.apiurl+'applets/allCocList',
      data: {
          type:1,
          industry:that.data.industryId,
          address:that.data.city,
          currentPage:that.data.currentPage,
          pageSize:10
        },
      header: {
          'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        // console.log(that.data.city);
        // console.log('根据行业查询res')
        // console.log(res)
        // console.log('根据行业查询res')
        if(res.statusCode==200){
          if(res.data.success==0){
            var list=res.data.entity.companyList;
            list.forEach(function(item,index,arr){
              item.textlogo=item.name.substring(0,2);
              item.fontsize='font34';
                if(item.name.length>30){
                  item.fontsize='font'+Math.floor(544*2/(item.name.length+1));
                }
            });
            that.setData({
              qualityEnterprise:that.data.qualityEnterprise.concat(list),
              totalPageSize:res.data.entity.totalPageSize
            });
          }else{
            wx.showToast({
              title: res.data.message,
              image:'../../../assets/images/icon/error-fff.png',
              duration: 2000
            })
          }
        }else{
          wx.showToast({
            title: '加载失败',
            image:'../../../assets/images/icon/error-fff.png',
            duration: 2000
          })
        }
      },
      fail(){
        wx.showToast({
          title: '加载失败',
          image:'../../../assets/images/icon/error-fff.png',
          duration: 2000
        })
      },
      complete(){
        wx.hideLoading({
          title: '加载中'
        })
      }
    })
  },
  goAllCompanyIndustry:function () {
      //去所所有行业
      wx.navigateTo({
        url: '../companyAllIndustry/companyAllIndustry'
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var industryId = options.industryId;
    this.setData({
      industryId:industryId,
      industryName:options.industryName,
        currentPage:1
      });
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
    this.setData({
      qualityEnterprise:[]
    })
    this.getdata()
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
    if(this.data.currentPage<this.data.totalPageSize){
      this.data.currentPage+=1;
      this.setData({
        currentPage:this.data.currentPage
      });
      this.getdata();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
