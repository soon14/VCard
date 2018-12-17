import {
  programemodule
} from '../../module/programe.js'
import{
  lookforsbmodule
} from '../../module/lookforsb.js'
var program = new programemodule
var lookforsb = new lookforsbmodule
var sliderWidth = 0 // 需要设置slider的宽度，用于计算中间位置，//废除
// pages/financial/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1,
    tabs: ["找投资", "找项目"],//写死
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    projectList: [],
    totalPage:10,
      /****找投资***/
      //pop//
    hidlookType:true,//显示选择投资人/机构
      typename:'投资机构/投资人',//显示选项名字


  },
  onTapAddBtn(){
    wx.navigateTo({
      url: '/pages/financial/edit/index',
    })
  },
  onAdd(){
    // console.log("onAdd")
  },
  onAddList(e) {
    var currentPage = this.data.currentPage
    //当总页数时，不再发起请求
    if (this.data.currentPage >=this.data.totalPage) {
      return
    }
    this.setData({
      currentPage:currentPage+1
    })
    console.log(this.data.currentPage)
    this._randerData(this.data.currentPage)
  },
  onTabClick(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
    // 优化下滑线
  _setItemDom() {
      var that = this;
    wx.getSystemInfo({
      success: function(res) {
        //获取选中item里左面的距离
        var query = wx.createSelectorQuery()
        query.select('.weui-bar__item_on').boundingClientRect(function(rect) {
            // console.log(rect);
            that.setData({
            sliderLeft: (rect.width-30)/2, //偏移到中部
            sliderOffset: rect.left // 节点的左边界坐标
          });
        }).exec()
      }
    });
  },

  _randerData(page){
    program.getProjectList(page).then(res => {
      // console.log(res)
      var list = this.data.projectList.concat(res.projectList)
      this.setData({
        projectList: list,
        totalPage: res.totalPageSize
      })
    })
      //TODO 未给图纸和逻辑
      // program.getIndustryList().then(res=>{
      //   console.log(res);
      // })
  },

  _clearData(){
    this.setData({
      projectList:[],
      currentPage:1
    })
    this._randerData(this.data.currentPage)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._setItemDom()
    lookforsb.getinvestmentCardList({
      fieldId:'0',
      type:'0',
      currentPage:'1'
    }).then(res=>{
      console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this._randerData(1)
    var me = this

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   * 清除缓存 并 加载新数据
   */
  onPullDownRefresh: function() {
    wx.clearStorage()
    this._clearData()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
   console.log(1)
   this.onAddList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
