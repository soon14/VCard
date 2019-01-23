// pages/mine/myCompany/myCompany.js
import {programemodule} from "../../../module/programe";
const programe = new programemodule
import {lookforsbmodule} from "../../../module/lookforsb";
const lookforsb = new lookforsbmodule
var app=getApp();
Page({
  data: {
      currentPage:1,
      pageSize:10,
      companyList:[],
      isEdit:false,//是否是编辑模式
      pid:`-1`,//缓存projectId
    isNewCreate:false,//是否试新建模式
    wissoCardId: '-1'//wissoCardId
  },
  goXiangqing:function(){
    wx.navigateTo({
      url: '../myCompanyDes/myCompanyDes',
      success: res => {
      },
      fail: res => {
      },
      complete: res => {
      }
    })
  },
  goAddCompany:function () {

    wx.navigateTo({
      url: '../addCompany/addCompany' + `?cardid=${this.data.wissoCardId}`
    })
  },
   getdata:function () {
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var that=this;
    var app = getApp();
    var id = app.globalData.userId;
    wx.request({
      url: app.data.apiurl+'applets/myCompanyList',
      data: {userId:id,currentPage:that.data.currentPage,pageSize:that.data.pageSize},
      header: {
          'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if(res.statusCode==200){
          if(res.data.success==0){
            console.log('请求的数据是--------')
            console.log(res);
            console.log('请求的数据是--------')
            that.setData({
              companyList:res.data.entity.companyList
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      //2018.12.29 修改
      console.log(options)
    if (options.wissoCardId){
      this.setData({
        wissoCardId: options.wissoCardId
      })
    }
    if (options.type =='edit'){
      this.setData({
        isEdit:true,
          pid:options.pid,
      })
    }else if(options.type == 'new'){
        this.setData({
          isNewCreate:true,

        })
    }

  },
  onTapItem(e){

    // console.log(e.currentTarget.dataset)
    let item = e.currentTarget.dataset
    //item.id公司id
    if(this.data.isEdit){
      //如果是从编辑界面进来的
      //走新编辑接口保存并返回
        console.log(this.data.pid);
        programe.setprojectintroduction_introEditProgress_companyName(this.data.pid,item.id).then(res=>{
          wx.navigateBack()
            wx.showToast({
                title: '保存成功',
                duration:2000,
                icon:'none'

            })
        })

    } else if (this.data.isNewCreate){
        console.log(1)

        // 新建投资机构
      lookforsb.postcreateInvestment(this.data.wissoCardId, '1').then(res => {
        console.log(res);
        wx.navigateTo({
          url: '/pages/financial/institutionintr/index?id=' + res.cardId
        })
      })
    }else{
      wx.navigateTo({
        url: `../myCompanyDes/myCompanyDes?id=${item.id}`,
      })
    }
  },
  //新增结束//
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getdata();
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
