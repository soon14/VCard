// pages/financial/institutionintr/index.js
import { lookforsbmodule } from "../../../module/lookforsb";

var lookforsb = new lookforsbmodule
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {
        name: '投资方向',
        tip: '请填写主要投资哪些领域？',
        rate: '0',
        must: true,
        fn: 'onTapItem_0'
      },
      {
        name: '投资阶段',
        tip: '请填写主要投资哪些阶段？',
        rate: '0',
        fn: 'onTapItem_1',
          must: true,
      },
      {
        name: '核心团队',
        tip: '请介绍您的团队成员',
        rate: '0',
        fn: 'onTapItem_2',
          must: true,
      },
      {
        name: '投资理念',
        tip: '请阐述具体的投资理念',
        rate: '0',
        fn: 'onTapItem_3'
      },
      {
        name: '基金规模',
        tip: '请描述总管理的基⾦规模',
        rate: '0',
        fn: 'onTapItem_4'
      },
        {
            name: '客户案例',
            tip: '请增加相关客户案例',
            rate: '0',
            fn: 'onTapItem_5'
        },
    ],
    //写死
    iconList: {
      photo: "/assets/images/icon/icon-phone-gray.png",
      email: "/assets/images/icon/icon-email-gray.png",
      position: "/assets/images/icon/icon-map.png",
      authentication: "/assets/images/icon/icon-authentication-yellow.png"
    },
    // 占位数据 一律用 ---- 数字 0
    item: {
      isAuthentication: 1,
      address: "--------",
      legalPerson: "----",
      name: "--------",
      coTag: [{
        coTagName: "----",
        coTagType: 0
      },
      {
        coTagName: "----",
        coTagType: 0
      }
      ],
      logo: "",
      id: 0,
      companyTemplate: "--------",
      bgId: 0,
      setUpTime: "0000-00-00",
      isNew: true,
    },
      //缓存数据
      id:-1, //缓存机构id
      //接口渲染数据
      totalProgress:'0%'
  },
  
    onPreshow(){
      if (this.data.totalProgress=='100%'){
        wx.navigateTo({
          url: 'pages/financial/card/index' + `?id=${this.data.id}&&type=1`
        })
      }else{
        wx.showToast({
          title: '请先完成度达到100%',
          icon:'none'
        })
      }
      
    },
    onTapItem_0(){

      wx.navigateTo({
        url: '/pages/financial/saveInstitutions/direction/index?'+`id=${this.data.id}`
      })
    }, //投资方向完成度
    onTapItem_1(){
        wx.navigateTo({
            url: '/pages/financial/saveInstitutions/stage/index?'+`id=${this.data.id}`
        })
    }, //投资阶段完成度
    onTapItem_2(){
        wx.navigateTo({
            url: '/pages/financial/addmen/index?'+`id=${this.data.id}&&type=1`
        })
    }, //核心团队完成度
    onTapItem_3(){
        wx.navigateTo({
            url: '/pages/financial/saveInstitutions/idea/index?'+`id=${this.data.id}`
        })
    }, //ideaProgress
    onTapItem_4(){
        wx.navigateTo({
            url: '/pages/financial/saveInstitutions/fundSize/index?'+`id=${this.data.id}`
        })
    }, //基金规模完成度
    onTapItem_5(){
        wx.navigateTo({
            url: '/pages/financial/saveInstitutions/case/index?'+`id=${this.data.id}`
        })
    },//客户案例
    onTapItem_6(){},
    onTapItem_7(){},
    _rander(){
      try {
        lookforsb.getinstitutionsCompany(this.data.id).then(res => {
          console.log(res)
          let totalProgress = res.totalProgress
          let items = this.data.items
          items[0].rate = res.directionProgress //投资方向完成度
          items[1].rate = res.stageProgress //投资阶段完成度
          items[2].rate = res.directionProgress //核心团队完成度
          items[3].rate = res.ideaProgress //投资理念完成度
          items[4].rate = res.fundSizeProgress //基金规模完成度
          items[5].rate = res.caseProgress //客户案例完成度
          let item = res.companyInfo
          this.setData({
            totalProgress,
            items,
            item,
          })

        })
      } catch (e) {
        console.log(e)
      }

    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // options.id
      console.log(options)
    if (options.isNew==1){
      this.setData({
        isNew:true
      })
    }else{
      this.setData({ id: options.id })
      this._rander()
    }
     
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
    this._rander()
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
