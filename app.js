//app.js
/**
 * 申请权限，获取用户信息
 */
//globle function globle data
App({
    data: {
        uptoken: '',
        domain: '',
        code: '',
        // apiurl:'http://develop.hopechina.cc/'
        apiurl:'http://182.92.239.187:8028/'
        // apiurl: 'https://cloud.hopechina.cc/'
    },
    globalData: {
        userInfo: {},
        historyList: [],
        //小程序版本号
        version: '1.0.0',
        // userId:1426
        userId: -1,
        cocId: -1,
        //用于组件交互
        ImageTextItem:[]

    },
    /**
     * 申请权限
     * @param options
     */
    onLaunch: function (options) {
        // console.log('小程序的onlaunch')
        //如果没有有效的登录令牌，就进入小程序登录界面
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.clearStorage();
        wx.setStorageSync('logs', logs)
        // wx.removeStorageSync('activityDetailsInfo');
        // wx.removeStorageSync('ocrCardInfo')
        // wx.removeStorageSync('currentpage')
        // wx.removeStorageSync('demanddetails')
        // 登录
        var that = this;
        //获取调用接口获取登录凭证（code）。通过凭证进而换取用户登录态信息，包括用户的唯一标识（openid）及本次登录的会话密钥（session_key）等。用户数据的加解密通讯需要依赖会话密钥完成。更多使用方法详见 小程序登录。
        wx.login({
            success: res => {
                // console.log(res);
                // console.log("去首页");
                if (res.code) {
                    //用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 code2Session，使用 code 换取 openid 和 session_key 等信息
                    that.data.code = res.code;
                    //检查登录
                    that.checkSession();
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        });
        // 获取用户信息
        // 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
        wx.getSetting({
            success: res => {
                // console.log(res);
                // console.log(res.authSetting);
                // console.log(res.authSetting['scope.userInfo']);
                if (res.authSetting['scope.userInfo']) {
                    // console.log('获取授权成功')
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    // TODO 注意升级
                    //https://developers.weixin.qq.com/community/develop/doc/0000a26e1aca6012e896a517556c01

                    wx.getUserInfo({
                        success: res => {
                            // console.log('用户信息+++-----------')
                            // console.log(res)
                            // console.log('用户信息+++-----------')

                            if (res.userInfo.avatarUrl) {
                                wx.setStorage({
                                    key: 'cachAvatarUrl',
                                    data: res.userInfo.avatarUrl
                                })
                            }
                            // 可以将 res 发送给后台解码出 unionId
                            if (res.userInfo) {
                                that.globalData.userInfo = res.userInfo
                            }
                            //getCurrentPages() 函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面
                            var pages = getCurrentPages();
                            // console.log("pages = " + pages);

                            //TODO 这里有个问题下面
                            //不要在 App.onLaunch 的时候调用 getCurrentPages()，此时 page 还没有生成。
                            if (pages.route == "pages/index/index") {
                                pages[0].setData({userAvatar: that.globalData.userInfo.avatarUrl});
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
                } else {
                    //提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success() {
                            // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                            console.log("用户同意授权");
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
                                        pages[0].setData({userAvatar: that.globalData.userInfo.avatarUrl});
                                    }
                                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                    // 所以此处加入 callback 以防止这种情况
                                    if (that.userInfoReadyCallback) {
                                        that.userInfoReadyCallback(res)
                                        // 罗 加
                                        that.globalData.userInfo = res.userInfo
                                    }
                                }
                            });
                        },
                        fail() {
                            that.globalData.userInfo.nickName = "游客" + new Date().getTime();
                            console.log("用户拒绝授权");
                            var pages = getCurrentPages();
                            if (pages.route == "pages/index/index") {
                                pages[0].setData({userAvatar: that.globalData.userInfo.avatarUrl});
                            }
                        }
                    })
                }
            },
            fail: res => {
                that.globalData.userInfo.nickName = "游客" + new Date().getTime();
                console.log('获取授权失败')
            },
            complete: res => {
                // console.log('获取授权完成')
                // console.log(res)
                // console.log('获取授权完成')
            }
        });
    },
    toLogin() {
        wx.redirectTo({
            url: '../../pages/logIn/phone/phone',
            success: function () {
            },
            fail: function () {
            },
            complete: function () {
            }
        })
    },
    checkSession() {
        var that = this;
        //发起 HTTPS 网络请求。使用前请注意阅读相关说明
        wx.request({
            //微信获取密匙
            url: that.data.apiurl + 'applets/checkSession',
            data: {code: that.data.code},
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                // console.log("验证是否绑定过");
                // console.log(res);
                if (res.statusCode == 200) {
                    if (res.data.success == 0) {
                        that.globalData.userId = res.data.entity.userId;
                        if (res.data.entity.cocId != '') {
                            //所属商会ID(多家商会用“，”拼接)
                            that.globalData.cocId = res.data.entity.cocId.join(",");
                        }
                        // wx.switchTab({
                        //     url:'../../index/index'
                        //  });
                        var pages = getCurrentPages();
                        var prevPage = pages[pages.length - 2]
                        // console.log(pages);
                        // wx.navigateBack({
                        //   delta: 1
                        // });

                        // console.log("已经登录过");
                        // console.log(that.globalData.cocId);
                        //无账号绑定
                    } else if (res.data.success == 10003) {
                        //会话密钥
                        that.data.openId = res.data.entity.openid;
                        that.data.session_key = res.data.entity.session_key;
                        console.log(res.data.openid);
                        // that.toLogin();
                        console.log("需要登录");
                    } else {
                        wx.showToast({
                            title: res.data.errcode + ":" + res.data.errmsg,
                            image: '/assets/images/icon/error-fff.png',
                            duration: 2000
                        })
                    }
                } else {
                    wx.showToast({
                        title: '加载失败',
                        image: './assets/images/icon/error-fff.png',
                        duration: 2000
                    })
                }
            },
            fail() {
                wx.showToast({
                    title: '加载失败',
                    image: './assets/images/icon/error-fff.png',
                    duration: 2000
                })
            }
        })
    },
    getPhoneNumber(e) {
        console.log(e);
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
    },
    getTimeDifference(createtime) {
        var nowdate = new Date();    //结束时间
        if (createtime.indexOf("-") >= 0) {
            createtime = createtime.replace(/\-/g, "/");
        }
        var differencedate = nowdate.getTime() - new Date(createtime).getTime();   //时间差的毫秒数
        //计算出相差天数
        var days = Math.floor(differencedate / (24 * 3600 * 1000))
        //计算出小时数
        var hours = Math.floor(differencedate / (3600 * 1000))
        //计算相差分钟数
        var minutes = Math.floor(differencedate / (60 * 1000))
        //计算相差秒数
        var seconds = Math.round(differencedate / 1000)
        var months = Math.floor(days / 30);
        var years = Math.floor(days / 365);
        if (years > 0) {
            return years + "年";
        } else if (months > 0) {
            return months + "月";
        } else if (days > 0) {
            return days + "天";
        } else if (hours > 0) {
            return hours + "小时";
        } else if (minutes > 0) {
            return minutes + "分钟";
        } else {
            return seconds + "秒";
        }
    },
    setState(createTime, endTime) {
        var nowdate = new Date();
        if (createTime && createTime.indexOf("-") >= 0) {
            createTime = createTime.replace(/\-/g, "/");
        }
        if (endTime && endTime.indexOf("-") >= 0) {
            endTime = endTime.replace(/\-/g, "/");
        }
        if (new Date(createTime).getTime() > nowdate.getTime()) {
            return "即将开始";
        } else if (new Date(createTime).getTime() < nowdate.getTime() && new Date(endTime).getTime() > nowdate.getTime()) {
            return "进行中";
        } else if (new Date(createTime).getTime() < nowdate.getTime() && new Date(endTime).getTime() < nowdate.getTime()) {
            return "已结束";
        }
    },
    // 比较两个时间大小
    compareDate(d1, d2) {
        return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
    },
    makeCall(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
        })
    },
    // 验证时候是合法的手机号130-139,150-159,180-189,147号码段的手机号码
    isValidPhoneNumber(number) {
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(147))+\d{8})$/;
        if (!myreg.test(number)) {
            return false;
        } else {
            return true;
        }
    },
    // 验证座机是否合法
    isValidTelphone(number) {
        var myreg = /^0\d{2,3}-?\d{7,8}$/;
        if (number == '') {
            //不必填，为空返回true
            return true;
        } else {
            // 填了就要验证
            if (!myreg.test(number)) {
                return false
            } else {
                return true
            }
        }

    },

    isValidEmail(email) {
        var myreg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org|cc|org)$/;
        if (myreg.test(email)) {
            return true;
        } else {
            return false;
        }
    },

    isEmojiCharacter(substring) {
        for (var i = 0; i < substring.length; i++) {
            var hs = substring.charCodeAt(i);
            if (0xd800 <= hs && hs <= 0xdbff) {
                if (substring.length > 1) {
                    var ls = substring.charCodeAt(i + 1);
                    var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                    if (0x1d000 <= uc && uc <= 0x1f77f) {
                        return true;
                    }
                }
            } else if (substring.length > 1) {
                var ls = substring.charCodeAt(i + 1);
                if (ls == 0x20e3) {
                    return true;
                }
            } else {
                if (0x2100 <= hs && hs <= 0x27ff) {
                    return true;
                } else if (0x2B05 <= hs && hs <= 0x2b07) {
                    return true;
                } else if (0x2934 <= hs && hs <= 0x2935) {
                    return true;
                } else if (0x3297 <= hs && hs <= 0x3299) {
                    return true;
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                    || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                    || hs == 0x2b50) {
                    return true;
                }
            }
        }
    },
    isHaveEmojiStr: function (str) {
        var isEmojiChar = this.isEmojiCharacter(str);
        //是表情
        if (isEmojiChar) {
            var newStr = '';
            newStr = str.replace(/\ud83d[\udc00-\ude4f\ude80-\udfff]/g, '');

            console.log('isHaveEmojiStr-newStr')
            console.log(newStr)
            console.log('isHaveEmojiStr-newStr')

            wx.showToast({
                title: '禁止输入表情字符'
            })
            return newStr;
        } else {
            return str;
        }
    },
 
    // 获取缓存数据
    // getHistory:function () {
    //   wx.getStorage({
    //     key:'history',
    //     success:function (res) {
    //       console.log('success-获取到数据是')
    //       console.log(res.data)
    //       console.log('success-获取到数据是')
    //         globalData.historyList = res.data
    //     },
    //     fail:function (res) {
    //       console.log('走了fail')
    //       if(res.data == null || res.data.length==0 ||res.data==undefined){
    //         console.log('进来fail-if')
    //         //无缓存
    //         wx.setStorage({
    //           key:'history',
    //           data:['old'],
    //           success:function () {
    //             wx.getStorage({
    //               key:'history',
    //               success:function (res ) {
    //                 // 创建成功，返回新创建的缓存数据
    //                 console.log('新创建成功')
    //                 console.log(res.data)
    //                 console.log(res.data)
    //                 console.log('新创建成功')
    //                 // 获取出来再返回
    //                 globalData.historyList = res.data;
    //               },
    //               fail:function () {

    //               }
    //             })
    //           },
    //         })
    //       }
    //     }
    //   })
    // },
})
