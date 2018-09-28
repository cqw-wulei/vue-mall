<template>
    <div class="page" v-title="'账户详情'">
        <section class="head-box">
            <p class="my-rb-title">我的{{unit}}(个)</p>
            <p class="my-rb-num">{{user.balance}}</p>
        </section>
        <section class="my-rb-detail">
            <ul class="tab clear">
                <li v-for="(item, index) in tabData" @click="chooseTab(index)" :key="index" class="tab-li fl" :class="[chooseType == item.type ? 'on' : '']">
                    <section>
                        <span>{{item.name}}</span>
                    </section>
                </li>
            </ul>
            <ul class="content" v-if="myListData[listIndex] && myListData[listIndex].length > 0" v-bind:style="{height:mHeight+'px'}" id="content">
                <li class="content-li clear" v-for="(item, index) in myListData[listIndex]" :key="index">
                    <section class="left-sec fl">
                        <p class="type-name">{{item.name}}</p>
                        <p class="type-time">{{item.gmtCreate}}</p>
                    </section>
                    <p class="type-num fr">{{item.changeType == 1 ? '+' : '-'}}{{item.changeNum}}</p>
                </li>
                <button class="more-btn" v-if="show[listIndex]" @click="getMore(listIndex)">加载更多</button>
            </ul>
            <section class="no-detail" v-else>
                <img v-lazy="noDetailImg">
                <p>暂无相关数据</p>
                <button class="yq-btn" @click="yqFriend">邀请好友赚{{unit}}</button>
            </section>
        </section>
    </div>
</template>

<script>
  import noDetailImg from '../../../images/no_detail.png'
  export default {
    name: 'detail',
    data() {
      return {
        unit: this.GLOBAL.mallUnit,
        noDetailImg: noDetailImg,
        tabData: [{type: 0, name: '全部'}, {type: 1, name: '收入'}, {type: 2, name: '支出'}],
        chooseType: 0,
        user: {
          login: this.$store.state.phone,
          balance: this.$store.state.balance,
          totalRecommendRuiCurrency: this.$store.state.totalRecommendRuiCurrency
        },
        myListData: [],
        listIndex: 0,
        mHeight: 0,
        show: [
          false,
          false,
          false
        ],
        currentPage1: 1,
        currentPage2: 1,
        currentPage3: 1
      }
    },
    created() {//强制执行
      let that = this
      that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#','titleColor': 1,'isHomePage': 0}, function(response) {})
    },
    mounted() {
      let that = this
      let _data = {
          changeType: 0,
          token: that.$store.state.token,
          currentPage: that.currentPage1,
          pageSize: 20
      }
      that.setData(_data)
      let _heigh =  window.innerHeight - (document.getElementsByClassName('head-box')[0].getBoundingClientRect().height + document.getElementsByClassName('tab')[0].getBoundingClientRect().height)
      that.mHeight = _heigh - 110
    },
    methods: {
      setData: function(data) {
        let that = this
        that.$axios({
          url: '/account/change',
          type: 'post',
          data: data,
          success: function (res) {
            if (res.data.code == '0000') {
              if (res.data.data.length > 0) {
                let _array = []
                for (let i = 0; i < res.data.data.length; i++) {
                  let _json = {
                    changeType: res.data.data[i].changeType == 1 || res.data.data[i].changeType == 2 || res.data.data[i].changeType == 4 || res.data.data[i].changeType == 5 ? 1 : 2,
                    gmtCreate: that.returnYmd(res.data.data[i].gmtCreate),
                    name: res.data.data[i].name,
                    changeNum: res.data.data[i].changeNum
                  }
                  if (that.myListData[0]) {
                    that.myListData[0].push(_json)
                  } else {
                    _array.push(_json)
                  }
                }
                if (that.myListData[0]) {
                } else {
                  that.myListData.push(_array)
                }
              }
              if (res.data.data.length == 20) {
                that.show[0] = true
                that.currentPage1 = that.currentPage1 + 1
              }else {
                that.show[0] = false
              }
            }
          }
        })
      },
      setData2: function(data) {
        let that = this
        that.$axios({
          url: '/account/change',
          type: 'post',
          data: data,
          success: function (res) {
            if (res.data.code == '0000') {
              if (res.data.data.length > 0) {
                let _array2 = [];
                for (let i = 0; i < res.data.data.length; i++) {
                  let _json = {
                    changeType: res.data.data[i].changeType == 1 || res.data.data[i].changeType == 2 || res.data.data[i].changeType == 4 || res.data.data[i].changeType == 5 ? 1 : 2,
                    gmtCreate: that.returnYmd(res.data.data[i].gmtCreate),
                    name: res.data.data[i].name,
                    changeNum: res.data.data[i].changeNum
                  }
                  if (that.myListData[1]) {
                    that.myListData[1].push(_json)
                  } else {
                    _array2.push(_json)
                  }
                }
                if (that.myListData[1]) {
                } else {
                  that.myListData.push(_array2)
                }
              }
              if (res.data.data.length == 20) {
                that.show[1] = true
                that.currentPage2 = that.currentPage2 + 1
              }else {
                that.show[1] = false
              }
            }
          }
        })
      },
      setData3: function(data) {
        let that = this
        that.$axios({
          url: '/account/change',
          type: 'post',
          data: data,
          success: function (res) {
            if (res.data.code == '0000') {
              if (res.data.data.length > 0) {
                let _array3 = [];
                for (let i = 0; i < res.data.data.length; i++) {
                  let _json = {
                    changeType: res.data.data[i].changeType == 1 || res.data.data[i].changeType == 2 || res.data.data[i].changeType == 4 || res.data.data[i].changeType == 5 ? 1 : 2,
                    gmtCreate: that.returnYmd(res.data.data[i].gmtCreate),
                    name: res.data.data[i].name,
                    changeNum: res.data.data[i].changeNum
                  }
                  if (that.myListData[2]) {
                    that.myListData[2].push(_json)
                  } else {
                    _array3.push(_json)
                  }
                }
                if (that.myListData[2]) {
                } else {
                  that.myListData.push(_array3)
                }
              }
              if (res.data.data.length == 20) {
                that.show[2] = true
                that.currentPage3 = that.currentPage3 + 1
              }else {
                that.show[2] = false
              }
            }
          }
        })
      },
      getMore: function (index) {
        let that = this
        if (index == 0) {
          let _data = {
            changeType: 0,
            token: that.$store.state.token,
            currentPage: that.currentPage1,
            pageSize: 20
          }
          that.setData(_data)
        } else if (index == 1) {
          let _data = {
            changeType: 1,
            token: that.$store.state.token,
            currentPage: that.currentPage2,
            pageSize: 20
          }
          that.setData2(_data)
        } else if (index == 2) {
          let _data = {
            changeType: 2,
            token: that.$store.state.token,
            currentPage: that.currentPage3,
            pageSize: 20
          }
          that.setData3(_data)
        }
      },
      chooseTab: function (index) {
        let that = this
        that.chooseType = index;
        that.listIndex = index;
        if (index == 1 && !that.myListData[1]) {
          let _data = {
            changeType: 1,
            token: that.$store.state.token,
            currentPage: that.currentPage2,
            pageSize: 20
          }
          that.setData2(_data)
        }else if (index == 2 && !that.myListData[2]) {
          let _data = {
            changeType: 2,
            token: that.$store.state.token,
            currentPage: that.currentPage3,
            pageSize: 20
          }
          that.setData3(_data)
        }
      },
      yqFriend: function () {
        let _data = {
          token: that.$store.state.token,
          type: 2
        }
        that.$axios({
          url: '/manage/shareAll',
          type: 'post',
          data: _data,
          success: function (res) {
            if (res.data.code == '0000') {
              that.$bridge.callhandler('API_CONTENT_SHARE', {'type': 0,'title': res.data.data.headline, 'desc': res.data.data.content,'shareUrl': res.data.data.pageUrl}, function(response) {})
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
    .head-box {
        width: 100%;
        height: 228px;
        padding-top: 152px;
        background: url("../../../images/rb_head_bg.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
    .my-rb-title {
        margin: 0 auto;
        width: 168px;
        height: 44px;
        line-height: 44px;
        font-size: 24px; /*px*/
        text-align: center;
        color: #ffffff;
        border: 1px solid #ffffff; /*no*/
        border-radius: 50px; /*no*/
    }
    .my-rb-num {
        margin-top: 44px;
        text-align: center;
        font-size: 78px; /*px*/
        font-weight: bold;
        color: #ffffff;
        line-height: 78px; /*px*/
    }
    .my-rb-detail {
        background: #ffffff;
        margin-top: 20px;
    }
    .tab {
        border-bottom: 1px solid #ebebeb; /*no*/
    }
    .tab-li {
        width: 33.333%;
        padding: 20px 0 0;
        text-align: center;
        color: #9D9D9D;
        font-size: 30px; /*px*/
    }
    .tab-li section {
        padding: 0 0 20px;
    }
    .tab-li section span {
        line-height: 30px; /*px*/
    }
    .tab-li.on {
        color: #EA3F3F;
    }
    .tab-li.on > section {
        border-bottom: 4px solid #EA3F3F; /*no*/
    }
    .content {
        padding: 0 41px 0 29px;
        overflow-y: scroll;
        -webkit-overflow-scrolling : touch;
        overflow-scrolling: touch;
    }
    .content-li {
        padding: 30px 0 26px;
        border-bottom: 1px solid #ebebeb; /*no*/
    }
    .content-li:last-child {
        border: 0 none;
    }
    .type-name {
        color: #333;
        font-size: 30px; /*px*/
        line-height: 30px; /*px*/
    }
    .type-time {
        color: #9D9D9D;
        font-size: 24px; /*px*/
        line-height: 24px; /*px*/
        margin-top: 24px;
    }
    .type-num {
        color: #333;
        font-size: 34px; /*px*/
        line-height: 34px; /*px*/
        margin-top: 2px;
    }
    .no-detail {
        padding: 150px 0 20px;
        background: #ffffff;
    }
    .no-detail > img {
        width: 458px;
        height: 212px;
        margin: 0 auto;
        display: block;
    }
    .no-detail > p {
        color: #9D9D9D;
        font-size: 28px; /*px*/
        line-height: 28px; /*px*/
        padding-top: 30px;
        text-align: center;
    }
    .yq-btn {
        width: 640px;
        height: 80px;
        line-height: 80px;
        display: block;
        font-size: 32px; /*px*/
        margin: 310px auto 0;
        color: #ffffff;
        background-color: #EA3F3F;
        border-radius: 40px; /*no*/
    }
    .more-btn {
        margin: 20px auto;
        display: block;
        width: 150px;
        height: 50px;
        border: 1px solid #9D9D9D;
        color: #9D9D9D;
    }
</style>
