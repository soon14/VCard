import {
    HTTP
} from '../utils/http.js'


//为了保证我们程序的最小化，发布模式下我们需要删除mock.js,并更改DEBUG为false，或者彻底删除api.js中的else部分

export class programemodule extends HTTP {
    //根据对象属性中字母 来分类
    /**
     *
     * @param industryData 需要排序的数组
     * @param industryDataName 对象中的排序字母属性名字
     * @returns {Object}
     */
    resortbyalphabet(industryData, industryDataName) {
        var charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var allDataArr = [];
        var tempTagList = [];
        for (var j = 0; j < charStr.length; j++) {
            var newArr = new Array();
            allDataArr.push(newArr)
        }
        for (var i = 0; i < industryData.length; i++) {
            var item = industryData[i];
            for (var m = 0; m < charStr.length; m++) {
                // console.log(item[industryDataName])
                if (item[industryDataName] == charStr[m]) {
                    tempTagList.push(charStr[m])
                    allDataArr[m].push(item)
                }
            }
        }
        var searchLetter = this._arrayDuplicateRemoval(tempTagList).sort()

        let obj = {}
        obj = {
            searchLetter, //字母表
            allDataArr,// 以字母分好的数据
        }
        return obj
    }


    getOldIndustryList() {
        return this.request({
            url: 'applets/industryList'
        })
    }

    getIndustryList() {
        return this.request({
            url: 'VCard/industryList',
        })
    }

    /**
     * 详情页面接口
     * @param projectId
     * @param type
     */
    getProjectDetail({
                         projectId, type
                     }) {
        const name = 'ProjectDetail'
        var key = this._getKey(projectId, type, name)
        return this._saveStorage(this.request({
            url: 'VCard/projectDetail',
            data: {
                projectId: projectId,
                type: type
            }
        }), key, type, projectId, name)

    }

    /**
     * 当前页数，默认条数
     * 并加入缓存
     */
    getProjectList(currentPage, pageSize, id) {

        let data
        // 缓存中寻找 or API 写入到缓存中
        data = {
            currentPage,
            pageSize,
        }
        if (!pageSize) {
            data.pageSize = 10;
        }
        if (!id) {
            id = '-1'
        } else {
            data.industryId = id
        }
        // key 确定key
        var key = this._getKey(id, currentPage)
        return this._saveStorage(this.request({
            url: 'VCard/projectList',
            data,
        }), key, currentPage, id)

    }

    /**
     * 逗号变成字符串
     * @param string 以逗号分割的字符串
     * @param isFive 是否是最多5个
     * @returns {*} 数组
     */
    splitbycomma(string, isFive = true) {
        // console.log(typeof string)
        if (typeof string != 'string') {
            throw Error('需要字符串')
        } else {
            var arr = string.split(',')
            //规定至多显示5个。随机给出5个。
            if (isFive) {
                if (arr.length < 5) {
                    return arr
                } else {
                    var result = [];

                    var ranNum = 5;

                    for (var i = 0; i < ranNum; i++) {

                        var ran = Math.floor(Math.random() * (arr.length - i));

                        result.push(arr[ran]);

                        arr[ran] = arr[arr.length - i - 1];

                    }
                    ;
                    return result
                }
            } else {
                return arr
            }


        }
    }

    /***
     * 当前页
     * 搜索的id
     * 缓存的数据
     *
     */
    _setStoragePage(current, data, id, name = null) {
        if (!id) {
            id = '-1'
        }
        //追加时间戳
        var time = new Date().getTime()

        var data = {
            data: data,
            time: time
        }

        wx.setStorage({
            key: this._getKey(id, current, name),
            data: data,
        })
    }

    /**
     *  获得缓存的key名字
     * @param id
     * @param index
     * @param name
     * @returns {*}
     * @private
     */
    _getKey(id, index, name) {
        if (!name) {
            name = 'programe-'
        } else {
            name = 'programe-' + name
        }
        const key = id + name + index
        return key
    }

    /**
     * 封装 缓存
     * @param fn 需要promise 对象
     * @param key key名字
     * @param current 分页
     * @param id
     * @param name
     * @returns {*}
     * @private
     */
    _saveStorage(fn, key, current = 1, id = -1, name = '') {

        var program = wx.getStorageSync(key)
        var now = new Date().getTime()
        if (!program || (now - program.time > 600000)) {
            // console.log('ajax')
            return fn.then(res => {
                this._setStoragePage(current, res, id, name)
                return res
            })
        } else {
            return new Promise((resolve) => {
                resolve(program.data)
            })
        }
    }

    //去重
    _arrayDuplicateRemoval(array) {
        var res = [];
        var json = {};
        for (var i = 0; i < array.length; i++) {
            if (!json[array[i]]) {
                res.push(array[i]);
                json[array[i]] = 1;
            }
        }
        return res;
    }

    //////////////////////////////////////////// 保存展示编辑接口/////////////////////////////
//2-6、编辑项目 查询完成度
    /**
     *
     * @param projectId
     * @param type
     *
     * type:1 查询整个项目每项的完成度
     type:2 查询项目介绍每项的完成度
     type:3查询商业模式每项的完成度
     type:4 查询资源储备每项的完成度
     */

    getsearchProgress(projectId, type,) {
        return this.request({
            url: 'VCard/searchProgress',
            data: {
                projectId,
                type,
            }
        })
    }

    //4-2我的商业计划书
    getbusinessPlan(userId, type, currentPage) {
        return this.request({
            url: 'VCard/businessPlan',
            data: {
                userId,
                type,
                currentPage,
                pageSize: 10,
            }
        })
    }

    //商业计划书操作（上下架、删除）
    /**
     *
     * @param userId
     * @param projectId
     * @param type
     *
     *type=0上架
     type=2下架
     type=3 删除
     *
     */
    postprojectOperation(userId, projectId, type) {
        return this.request({
            url: 'VCard/projectOperation',
            data: {
                userId,
                type,
                projectId,
            }
        })
    }

    ////************** 项目编辑 **************///////
    //2-1、创建项目
    /**
     *
     * @param userId
     * @param name
     * @param label
     * @param intro
     * @param logo
     */
    postcreateProject(userId, name, label, intro, logo) {
        return this.request({
            url: 'VCard/createProject',
            data: {
                userId,
                name,
                label,
                intro,
                logo,

            }
        })
    }

    //2-2、编辑商业计划书（项目书）
    /**
     *
     * @param projectId
     * @param type
     * 编辑内容
     1：项目介绍
     2：视频介绍
     3：企业基本信息
     4：资源储备 //干掉
     5：商业模式 // 干掉
     6：融资计划
     7：联系方式
     * @param data
     * type=1
     *logo
     *name
     * label
     * projectInfo
     * type = 2
     * videoName
     * videoUrl
     * type = 3
     * companyId
     * type = 6
     * financing Arry
     * type = 7
     * cardId
     */
    posteditProject(projectId, type, data) {
        data.projectId = projectId
        data.type = type

        return this.request({
            url: 'VCard/editProject',
            data: data
        })
    }

    //编辑项目名称
    setProjectName(projectId, logo, name, label, projectInfo) {
        let myData = {}
        myData.logo = logo
        myData.name = name
        myData.label = label
        myData.projectInfo = projectInfo
        console.log(myData)
        return this.posteditProject(projectId, '1', myData)
    }

    //*****项目介绍编辑**********//
    //展示项目介绍
    //项目介绍的完整度
    getprojectintroduction_introEditProgress(projectId) {
        return this.getsearchProgress(projectId, '2')
    }

    //项目介绍保存公司信息
    setprojectintroduction_introEditProgress_companyName(projectId, data) {
        let myData = {}
        myData.companyId = data
        return this.posteditProject(projectId, '3', myData)
    }

    //获取联系人-展示页面-1
    getPersionmen(projectId) {
        return this.request(
            {
                url: 'VCard/getPersion',
                data: {
                    projectId,
                    type: '1'
                }
            }
        )
    }

    //获取所有机构人员列表 联系人 选择界面-2
    getCompanyTeam(projectId) {
        return this.request({
            url: 'VCard/getCompanyTeam',
            data: {
                cardId: projectId,
                type: '2'
            }
        })
    }

    //项目介绍-保存联系人
    setprojectintroduction_introEditProgress_callmen(projectId, data) {
        let myData = {}
        myData.cardId = data
        return this.posteditProject(projectId, '7', myData)
    }

    ///////核心成员/////////
    //**TODO 需要调整 **//
    //获取核心团队-展示页面-1  编号2-2-2
    getUserIntroTeam(projectId) {
        return this.request(
            {
                url: 'VCard/getPersion',
                data: {
                    projectId,
                    type: '2'
                }
            }
        )
    }

    //项目介绍-核心团队保存-图文

    setproject_saveCoreTeam(projectId, userId, id, userImage, userName, gender, position, userIntro) {
        var myData = {
            cardId: projectId,
            type: '2',
            userId,
            id,
        }
        if (userImage) {
            myData.userImage = userImage
        }
        if (userName) {
            myData.userName = userName
        }
        if (gender) {
            myData.gender = gender
        }
        if (position) {
            myData.position = position
        }
        if (userIntro) {
            myData.userIntro = userIntro
        }

        return this.request({
            url: 'Vard/saveCoreTeam',
            data: myData,
        })
        //获取核心成员图文接口
    }

    getproject_getUserIntro(projectId, userId, id) {
        return this.request({
            url: 'VCard/getUserIntro',
            data: {
                cardId: projectId,
                type: '2',
                userId,
                id,
            }

        })
    }

    ////////******项目介绍结束*****//////



//2-2-1  获取图文接口
    /**
     *
     * @param projectId
     * @param type
     *    type=1产品定位
     type=2空间趋势
     type=3产品趋势
     type=4目标客户
     type=5价值主张
     type=6渠道通路
     type=7竞争优势
     type=8收入模式
     type=9成本构成
     type=10产品研发
     type=11知识产权
     type=12渠道布局
     type=13运营资质
     type=14战略合作
     type=15适用客户
     type=16价值产品价值
     type=17客户案例
     */
    getImageTextDatta(projectId, type) {
        return this.request({
            url: 'VCard/getImageTextDatta',
            data: {
                projectId,
                type,
            }
        })
    }

    //2-2-3  保存图文接口
    /**
     *
     * @param projectId
     * @param type
     * type=1产品定位
     type=2空间趋势
     type=3产品优势
     type=4目标客户
     type=5价值主张
     type=6渠道通路
     type=7竞争优势
     type=8收入模式
     type=9成本构成
     type=10产品研发
     type=11知识产权
     type=12渠道布局
     type=13运营资质
     type=14战略合作
     type=15适用客户
     type=16价值产品价值
     type=17客户案例
     *
     * @param imageText
     * @param customerList
     *
     */
    postsaveImageTextDatta(projectId, type, imageText, customerList) {
        let mydata = {

            type,
            projectId,
        }
        if (imageText) {
            mydata.imageText = imageText
        }
        if (customerList) {
            mydata.customerList = customerList
        }
        return this.request({
            url: 'VCard/saveImageTextDatta',
            data:mydata
        })
    }

    ////****----融资计划-----*****/////

    //融资计划展示
    getfinancingInfo(projectId){
       return this.request({
            url:'VCard/projectDetail',
            data:{
                projectId,
                type:'2'
            }
        })
    }
    ///****----融资计划结束----****/////

    //*****资源储备******////
    getresourcesProgress(projectId){
       return this.getsearchProgress(projectId,'4')
    }
    //****资源储备结束****//
/////—**项目编辑结束**-//////

}
