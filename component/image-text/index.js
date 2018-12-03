// component/image-text/imageTextComponet.js
var Store = require('../../store.js')
var myBehavior = require('../behavior')
import {DATAMODULE} from '../../module/data.js'

var dataModule = new DATAMODULE
Component({
    // behaviors: [myBehavior],
    //外部样式
    // externalClasses: ['hidden'],
    //让外部样式影响
    options: {
        addGlobalClass: true,
    },
    //父子间通信
    relations: {},
    /**
     * Component properties
     */
    properties: {
        ImageTextItem: {
            type: Array,
            observer: function (newVal, oldVal, changedPath) {
                this.setData(
                    {
                        _ImageTextItem: newVal
                    }
                )
            }
        },

    },
    /**
     * Component initial data
     */
    data: {
        _ImageTextItem: [],
        scrollPosition: {
            everyOptionCell: 100,
            top: 47,
            scrollTop: 0,
            scrollY: true,
            scrollViewHeight: 1000,
            scrollViewWidth: 375,
            windowViewHeight: 1000,
        },//拖动设置
        movableViewPosition: {
            x: 0,
            y: 0,
            className: "hidden",
            data: {}
        },//设置拖动区的设置
    },

    /**
     * Component methods
     */
    methods: {
      onView(){
            //点击预览出发的事件
            //抛出记录的数据
            this.triggerEvent('onTapView',{
              ImageTextItem:this.data._ImageTextItem
            })
        },
      onSave() {
        //点击预览出发的事件
        //抛出记录的数据
        this.triggerEvent('onTapSave', {
          ImageTextItem: this.data._ImageTextItem
        })
      },

        onBindscroll: function (event) {
            console.log(event);
            var scrollTop = event.detail.scrollTop;
            this.setData({
                'scrollPosition.scrollTop': scrollTop,
                scrollTopPostion: scrollTop
            })
        },
        onDeleteRow(e) {
            console.log(e.currentTarget.dataset.index);
            var index = e.currentTarget.dataset.index;
            this.data._ImageTextItem.splice(index, 1);
            this.setData({_ImageTextItem: this.data._ImageTextItem});
        },
        onDraggleTouch(event) {
            var touchType = event.type;
            switch (touchType) {
                case "touchstart":
                    this._scrollTouchStart(event);
                    break;
                case "touchmove":
                    this._scrollTouchMove(event);
                    break;
                case "touchend":
                    this._scrollTouchEnd(event);
                    break;
            }
        },
        onTest() {
            console.log(this.properties.ImageTextItem)
            console.log(this.data._ImageTextItem)
        },
        _getOptionInfo(code) {
            for (var i = 0, j = this.data._ImageTextItem.length; i < j; i++) {
                var optionData = this.data._ImageTextItem[i];
                if (optionData.sDtSecCode == code) {
                    optionData.selectIndex = i;
                    return optionData;
                }
            }
            return {};
        },
        _optionsDataTranlate(optionsList, selectClass) {
            for (var i = 0, j = optionsList.length; i < j; i++) {
                optionsList[i].selectClass = selectClass;
            }
            return optionsList;
        },
        _getPositionDomByXY: function (potions) {
            var y = potions.y - this.data.scrollPosition.top + this.data.scrollPosition.scrollTop;
            var _ImageTextItem = this.data._ImageTextItem;
            var everyOptionCell = this.data.scrollPosition.everyOptionCell;
            for (var i = 0, j = _ImageTextItem.length; i < j; i++) {
                if (y >= i * everyOptionCell && y < (i + 1) * everyOptionCell) {
                    this.setData({rangeoption: y - i * everyOptionCell});
                    return _ImageTextItem[i];
                }
            }
            return _ImageTextItem[0];
        },
        _scrollTouchStart: function (event) {
            var firstTouchPosition = {
                x: event.changedTouches[0].pageX,
                y: event.changedTouches[0].pageY,
            }
            var domData = this._getPositionDomByXY(firstTouchPosition);//找到开始的dom
            //movable-area滑块位置处理
            var movableX = 0;
            var movableY = firstTouchPosition.y - this.data.scrollPosition.top - this.data.scrollPosition.everyOptionCell / 2;
            this.setData({
                movableViewPosition: {
                    x: movableX,
                    y: movableY,
                    className: "",
                    data: domData
                }
            })
            var secCode = domData.sDtSecCode;
            var secInfo = this._getOptionInfo(secCode);
            secInfo.selectPosition = event.changedTouches[0].clientY;
            secInfo.selectClass = "dragSelected";
            this.data._ImageTextItem[secInfo.selectIndex].selectClass = "dragSelected";
            var _ImageTextItem = this.data._ImageTextItem;
            this.setData({
                'scrollPosition.scrollY': false,
                selectItemInfo: secInfo,
                _ImageTextItem: _ImageTextItem,
                'scrollPosition.selectIndex': secInfo.selectIndex
            })
        },
        _scrollTouchMove: function (event) {
            var selectItemInfo = this.data.selectItemInfo;
            var selectPosition = selectItemInfo.selectPosition;
            var moveDistance = event.changedTouches[0].clientY;
            var everyOptionCell = this.data.scrollPosition.everyOptionCell;
            var _ImageTextItem = this.data._ImageTextItem;
            var selectIndex = selectItemInfo.selectIndex;
            //movable-area滑块位置处理
            var movableX = 0;
            var movableY = event.changedTouches[0].pageY - this.data.scrollPosition.top - this.data.scrollPosition.everyOptionCell / 2;
            this.setData({
                movableViewPosition: {
                    x: movableX,
                    y: movableY,
                    className: "",
                    data: this.data.movableViewPosition.data
                }
            })

            // 把选择的dom插入到应放的位置
            if (moveDistance - selectPosition > 0 && selectIndex < _ImageTextItem.length - 1) {
                if (_ImageTextItem[selectIndex].sDtSecCode == selectItemInfo.sDtSecCode) {
                    _ImageTextItem.splice(selectIndex, 1);
                    _ImageTextItem.splice(++selectIndex, 0, selectItemInfo);
                    selectPosition += everyOptionCell;
                }
            }

            if (moveDistance - selectPosition < 0 && selectIndex > 0) {
                if (_ImageTextItem[selectIndex].sDtSecCode == selectItemInfo.sDtSecCode) {
                    _ImageTextItem.splice(selectIndex, 1);
                    _ImageTextItem.splice(--selectIndex, 0, selectItemInfo);
                    selectPosition -= everyOptionCell;
                }
            }

            this.setData({
                'selectItemInfo.selectPosition': selectPosition,
                'selectItemInfo.selectIndex': selectIndex,
                _ImageTextItem: _ImageTextItem,
            });
        },
        _scrollTouchEnd: function (event) {
            var _ImageTextItem = this._optionsDataTranlate(this.data._ImageTextItem, "");//清除灰色背景
            this.setData({
                _ImageTextItem: _ImageTextItem,
                'scrollPosition.scrollY': true,
                'movableViewPosition.className': "hidden"
            })
            console.log(this.data.movableViewPosition.className)
        },

        setImageTextItem(e) {
            this.setData({
                _ImageTextItem: e.detail
            })
        },
        //计算出屏幕快高
        setscroll() {
            var systemInfo = wx.getSystemInfoSync();
            // console.log(systemInfo.windowHeight);
            //小程序得到除去导航栏的高度
            var scrollViewHeight = systemInfo.windowHeight * ( 461 / 603);
            var scrollViewWidth = systemInfo.windowWidth;
            this.setData({
                'scrollPosition.scrollViewWidth': scrollViewWidth,
                'scrollPosition.scrollViewHeight': scrollViewHeight,
                'scrollPosition.windowViewHeight': systemInfo.windowHeight,
            });
        }
    },
    /**
     * Component lifetmies
     */
    lifetimes: {
        created: function (option) {

        },
        attached: function () {
          console.log(this.data.movableViewPosition.className)
            // 在组件实例进入页面节点树时执行
            this.setscroll()
        },
    },
    pageLifetimes: {
        show: function () {

        },
        hide: function () {

        },

        resize: function () {
        }
    }
})
