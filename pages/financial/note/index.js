// pages/financial/note/index.js
const app = getApp()
import {mymodule} from "../../../module/my";

const my = new mymodule
Page({

    /**
     * 页面的初始数据
     */
    data: {
        items: [
            {
                name: '项目提醒',
                tip: "暂无",
                num: '5',
                fn: "onTap1",
                src: '/pages/financial/note/image/icon-1.png',
                isNew: true
            },
            {
                name: '投资提醒',
                tip: "暂无",
                num: '5',
                fn: "onTap2",
                src: '/pages/financial/note/image/icon-2.png'
            },
            {
                name: '资源留言',
                tip: "暂无",
                num: '5',
                fn: "onTap3",
                src: '/pages/financial/note/image/icon-3.png'
            },
            {
                name: '需求留言',
                tip: "暂无",
                num: '5',
                fn: "onTap4",
                src: '/pages/financial/note/image/icon-4.png'

            },
            {
                name: '活动报名',
                tip: "暂无",
                num: '5',
                fn: "onTap5",
                src: '/pages/financial/note/image/icon-5.png'
            },

        ]

    },
    onTap1() {
        wx.navigateTo({
          url: '/pages/financial/mymessageList/index?type=1',
        })
        console.log(1)
    },
    onTap2() {
      wx.navigateTo({
        url: '/pages/financial/mymessageList/index?type=2',
      })
        console.log(2)
    },
    onTap3() {
//资源0
        wx.navigateTo({
            url: '/pages/supply/messageList/messageList?currenttab=0'
        })
        console.log(3)
    },
    onTap4() {
        // 需求1
        wx.navigateTo({
            url: '/pages/supply/messageList/messageList?currenttab=1'
        })
        console.log(4)
    },
    onTap5() {
        console.log(5)
        wx.navigateTo({
            url: '/pages/activity/leaveMessageForMyActive/leaveMessageForMyActive'
        })
    },

    onTapProject() {
        console.log('onTapProject');
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const userId = app.globalData.userId
// const userId = 4
        my.getmessageList(userId).then(res => {
            console.log(res);
            let messageList = res.messageList
            let items = this.data.items
            messageList.forEach(item => {
                items.forEach((_i, index) => {
                    if (item.type == _i.name) {
                        if (item.content && item.content != '') {
                            items[index].tip = item.content
                        }
                        console.log(item.isOk)
                        if (typeof item.isOk!='undefined' && item.isOk == 0) {
                            items[index].isNew = true
                        } else {
                            items[index].isNew = false
                        }
                    }
                })
            })
            this.setData({
                items,
            })

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
