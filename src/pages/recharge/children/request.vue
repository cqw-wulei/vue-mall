<template>
    <div class="page" v-title="'邀请详情'" v-bind:style="{height:mHeight+'px'}">
        <section class="head-box">
            <p class="my-rb-title">累计获得奖励{{unit}}(个)</p>
            <p class="my-rb-num">{{totalNum}}</p>
        </section>
        <section class="tips">
            <my_marquee :lists="lists" ref="childs"></my_marquee>
        </section>
        <section class="my-rb-detail">
            <ul class="tab clear">
                <li class="tab-li fl">
                    <section>
                        <span>我邀请的</span>
                    </section>
                </li>
            </ul>
            <ul class="content" v-if="myRequestData.length > 0">
                <li class="content-li clear" v-for="(item, index) in myRequestData" :key="index">
                    <section class="left-sec fl">
                        <p class="type-name">{{item.mobile}} <span class="request_type"></span></p>
                        <p class="type-time">{{item.gmtCreate}}</p>
                    </section>
                    <p class="type-num fr">+{{item.awardNum}}</p>
                </li>
            </ul>
            <section class="no-detail" v-else>
                <img v-lazy="noDetailImg">
                <p>暂无相关数据</p>
            </section>
            <button class="yq-btn" @click="yqFriend">邀请更多好友</button>
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
        lists: [],
        myRequestData: [],
        totalNum: 0,
        postData: {
          token: this.$store.state.token,
          pageSize: 10,
          currentPage: 1
        },
        mHeight: 0,
        isFirst: true,
        sw: false
      }
    },
    created() {//强制执行
      let that = this
      that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#','titleColor': 1,'isHomePage': 0}, function(response) {})
    },
    mounted() {
      let that = this
      that.setData()//初始化数据
      // 注册scroll事件并监听
      window.addEventListener('scroll',function(){
        // 判断是否滚动到底部
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.offsetHeight) {
          // console.log(sw);
          // 如果开关打开则加载数据
          if(that.sw == true){
            // 将开关关闭
            that.sw = false
            that.setData()
          }
        }
      });
    },
    methods: {
      setData: function() {
        let that = this
        that.$axios({
          url: '/manage/shareAwardList',
          type: 'post',
          data: that.postData,
          success: function (res) {
            if (res.data.code == '0000') {
              that.totalNum = res.data.data.totalNum
              if (res.data.data.myShare.length > 0) {
                for (let i = 0; i < res.data.data.myShare.length; i++) {
                  res.data.data.myShare[i].gmtCreate = that.returnYmd(res.data.data.myShare[i].gmtCreate)
                  that.myRequestData.push(res.data.data.myShare[i])
                }
              }
              if (res.data.data.myShare.length == 10) {
                that.postData.pageSize++
                that.sw = true
              }
              if(that.isFirst) {
                that.isFirst = false
                if (res.data.data.awardMsg.length > 0) {
                  for (let i = 0; i < res.data.data.awardMsg.length; i++) {
                    that.lists.push(JSON.parse(res.data.data.awardMsg[i]))
                  }
                  that.$refs.childs.setData();
                }
              }
            }
          }
        })
      },
      yqFriend: function () {
        let that = this
        let _data = {
          token: that.$store.state.token,
          type: 1
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
    .page {
        background-color: #ffffff;
        width: 100%;
    }
    .head-box {
        width: 100%;
        height: 228px;
        padding-top: 152px;
        background: url("../../../images/rb_head_bg.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
    .my-rb-title {
        margin: 0 auto;
        width: 264px;
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
        border-top: 20px solid #F5F7F9;
    }
    .tips {
        width: 100%;
        overflow: hidden;
    }
    .tab {
        border-bottom: 1px solid #EBEBEB; /*no*/
    }
    .tab-li {
        width: 25%;
        padding: 20px 0 0;
        text-align: center;
        color: #333;
        font-weight: bold;
        font-size: 30px; /*px*/
    }
    .tab-li section {
        padding: 0 0 20px;
    }
    .tab-li section span {
        padding-left: 26px;
        line-height: 30px; /*px*/
    }
    .content {
        padding: 0 41px 0 29px;
        margin-bottom: 130px;
    }
    .content-li {
        padding: 30px 0 26px;
    }
    .content-li:last-child {
        border-bottom: 1px solid #EBEBEB; /*no*/
    }
    .type-name {
        color: #333;
        font-size: 30px; /*px*/
        line-height: 30px; /*px*/
    }
    .request_type {
        font-size: 26px; /*px*/
        color: #9D9D9D;
        padding-left: 20px;
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
        background: #ffffff;
        padding: 150px 0 20px;
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
        width: 642px;
        height: 80px;
        line-height: 80px;
        display: block;
        font-size: 32px; /*px*/
        color: #ffffff;
        background-color: #EA3F3F;
        border-radius: 50px; /*no*/
        position: fixed;
        bottom: 40px;
        left: 54px;
    }
</style>
