// pages/financial/edit/index.js
import {programemodule} from "../../../module/programe";
const programe = new programemodule
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo:'',
    avatar:'',
    items: [
    {
        name:'项目介绍',
        tip:'请详细的介绍您的项目？',
        rate:'0',
        must:true,
        fn:'onTapintr'
    },
      {
        name: '融资计划',
        tip: '让投资者更加了解融资计划？',
        rate: '0',
        must: true,
        fn:'onTapPlan'
      },
      {
        name: '路演视频',
        tip: '请上传路演视频，直观阐述项目优势？',
        rate: '0',
        fn:'onTapVideo'
      },
      {
        name: '资源储备',
        tip: '请描述项目的资源储备情况？',
        rate: '0',
        fn:'onTapReso'
      },
      {
        name: '商业模式',
        tip: '请详细的介绍您的项目？',
        rate: '0',
        fn:'onTapBusiness'
      },
    ],
      totalRate:'0',
      isNew:false,//判断是否新建并禁用功能
      id:'-1',//缓存Userid
      pid:'-1',//缓存projectId
      title:'',//项目名称
      Intro:[],//项目介绍
      videoUrl:'',//视频
      videoName:'',//视频名字
    wissoCardId:'-1',
  },
    //点击项目介绍
  onTapintr(){
    if(this.data.isNew){
      wx.showToast({
        title: '请先创建项目名称',
          icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/financial/itemIntr/index?pid='+`${this.data.pid}`
    })
    console.log('onTapintr')
  },
    //点击融资计划
  onTapPlan(){
      if(this.data.isNew){
          wx.showToast({
              title: '请先创建项目名称',
              icon:'none'
          })
          return
      }
      console.log(this.data.financingNew)
      if(this.data.financingNew==1){
        wx.navigateTo({
          url: '/pages/financial/edit/funding-programs/index?pid=' + `${this.data.pid}`
        })
      }else{
        wx.navigateTo({
          url: '/pages/financial/edit/funding-programs/index?pid=' + `${this.data.pid}`
        })
      }
      
    console.log('onTapPlan')
  },
    // 点击上传视频
  onTapVideo(){
      if(this.data.isNew){
          wx.showToast({
              title: '请先创建项目名称',
              icon:'none'
          })
          return
      }

      wx.navigateTo({
        url: '/pages/financial/upvideo/index?'+`pid=${this.data.pid}&&url=${this.data.videoUrl}&&name=${this.data.videoName}`
      })
    console.log('onTapVideo')
  },
    //点击商业储备
  onTapReso(){
      if(this.data.isNew){
          wx.showToast({
              title: '请先创建项目名称',
              icon:'none'
          })
          return
      }
      wx.navigateTo({
          url: '/pages/financial/resourcesReserves/index?'+`pid=${this.data.pid}`
      })
    console.log('onTapReso')
  },
    //点击商业模式
  onTapBusiness(){
      if(this.data.isNew){
          wx.showToast({
              title: '请先创建项目名称',
              icon:'none'
          })
          return
      }
      wx.navigateTo({
        url: '/pages/financial/businessModel/index?'+`pid=${this.data.pid}`
      })
    console.log('onTapBusiness')
  },
  onTapPreShow(){
    console.log('onTapPreShow')
  },

    //点击项目名称

  onTapLogo(){
    if(this.data.isNew){
        wx.navigateTo({
            url: '/pages/financial/projectinfo/index?'
              + `id=${this.data.wissoCardId}&&type=new`
        })
    }else {
        let Intro =JSON.stringify(this.data.Intro)
        wx.navigateTo({
            url: '/pages/financial/projectinfo/index?'
    //id是userid
                +`id=${this.data.id}&&Intro=${Intro}&&title=${this.data.title}&&logo=${this.data.logo}&&pid=${this.data.pid}`,
        })
    }

    // console.log('onTapLogo')
  },
  showTopTips(){

  },
  _getinfoData(){
    //需要传projectId
      programe.getsearchProgress(this.data.pid,'1').then(res=>{
        // console.log(res)
          let projectEdit =   res.projectEdit
          let items = this.data.items
          items[0].rate = projectEdit.projectIntro
          items[1].rate = projectEdit.financing
          items[2].rate = projectEdit.video
          items[3].rate = projectEdit.resource
          items[4].rate = projectEdit.business

          this.setData({
              items,
              totalRate:projectEdit.totalProgress,
              logo:projectEdit.logo,
              Intro:projectEdit.Intro,
              title:projectEdit.title,
          })
        if (projectEdit.video != '0%') {
          programe.getVideo(this.data.pid).then(res => {
            // console.log(res);
            let projectIntro = res.projectIntro
            let videoUrl = projectIntro.videoUrl || ''
            let videoName = projectIntro.videoName || ''

            this.setData({
              videoUrl,
              videoName,
            })
          })
        }
        if (projectEdit.financing == '0%') {
          this.setData({
            financingNew: 1
          })
        }
      })
    
     
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
      //如果是新建则执行新建逻辑
      if(options.type=='new'){
        this.setData({
          isNew: true,
          wissoCardId: options.wissoCardId,
        })
      }else {
        this.setData({
            pid:options.pid,
          wissoCardId: options.wissoCardId,
        })
        //需要载入百分比
          this._getinfoData()

      }
      //缓存userId
      this.setData({
          id:options.id
      })
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
    //加载百分比
      if(!this.data.isNew){
        this._getinfoData()
      }
      console.log(this.data.pid);
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
