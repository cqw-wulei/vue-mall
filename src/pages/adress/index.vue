<template>
    <div class="page" v-title="'地址管理'" v-bind:style="{height:mHeight+'px'}">
        <ul class="adress-ul" v-if="adressInfo.length > 0">
            <li class="adress-li clear" :class="{'ismr' : key.distype == 1, 'isedit' : isEdit}" @click="chooseAdress(index)" v-for="(key, index) in adressInfo" :key="index">
                <section class="adress-box fl">
                    <p class="name">{{key.realname}}</p>
                    <p class="phone">{{key.mobile}}</p>
                    <section class="clear">
                        <p class="adress-info fl">{{key.allAddress}}</p>
                        <p class="status fr"></p>
                    </section>
                    <p class="btn-mr" @click.stop="editMr(index)">设置为默认地址</p>
                </section>
                <section class="adress-edit" @click.stop="deleteAdress(index)">
                    <p>删除</p>
                </section>
            </li>
        </ul>
        <ul class="adress-ul" v-else-if="adressInfo.length == 0">
            <section class="no-detail">
                <img v-lazy="noDetailImg">
                <p>暂无收货地址，请添加</p>
            </section>
        </ul>
        <button class="add-btn" @click="addBtn" :class="{isedit: isEdit, tshow: tshow}">添加收货地址</button>
        <alert-tip v-if="showAlert" @sureTip="sureTip()" :alertText="alertText" :alertTitle="alertTitle"></alert-tip>
    </div>
</template>

<script>
  import alertTip from '../../components/common/sureTip'
  import noDetailImg from '../../images/no_detail.png'
  export default {
    name: 'index',
    data() {
      return {
        isFlag: false,
        isEdit: false,
        adressInfo: [],
        mHeight: 0,
        tshow: true,
        noDetailImg: noDetailImg,
        showAlert: false,
        alertText: null,
        alertTitle: '温馨提示'
      }
    },
    created() {//强制执行
      let that = this
      that.bridgeHandler(true)
      that.$bridge.registerhandler('API_EDITADDRESS', (data, responseCallback) => {
        that.bridgeHandler(false)
        that.edit()
      })
      that.$bridge.registerhandler('API_COMPLETEADDRESS', (data, responseCallback) => {
        that.bridgeHandler(true)
        that.edit()
      })
    },
    mounted() {
      this.setAdress()
    },
    methods: {
      bridgeHandler: function(status) {
        let that = this
        if (status) {
          that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#ffffff','titleColor': 0, 'navRightButton': {
              'btnType': 1,
              'btnTitle': '管理',
              'btnHandler': 'API_EDITADDRESS'
            },'isHomePage': '0'}, function(response) {}
          )
        }else {
          that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#ffffff','titleColor': 0, 'navRightButton': {
              'btnType': 1,
              'btnTitle': '完成',
              'btnHandler': 'API_COMPLETEADDRESS'
            },'isHomePage': 0}, function(response) {}
          )
        }
      },
      chooseAdress: function (index) {
        let that = this
        this.isFlag = true
        let _adress = {
          realname: that.adressInfo[index].realname,
          mobile: that.adressInfo[index].mobile,
          allAddress: that.adressInfo[index].allAddress,
          distype: that.adressInfo[index].distype,
          disid: that.adressInfo[index].disid,
        }
        if (!that.isEdit) {
          window.sessionStorage.setItem('adress',JSON.stringify(_adress))
          let lastPageId = window.sessionStorage.getItem('lastPageId')
          that.$router.push('/award/delivery/'+lastPageId)
        }
      },
      edit: function () {//
        this.isEdit = !this.isEdit
      },
      editMr: function (index) {//设置默认地址
        let that = this
        let _data = {
          token: that.$store.state.token,
          disid: that.adressInfo[index].disid
        }
        that.$axios({
            url: '/user/disadd/default',
            type: 'post',
            data: _data,
            success: function (res) {
                if (res.data.code == '0000') {
                  that.showAlert = true
                  that.alertText = '设置成功'
                }else {
                  that.showAlert = true
                  that.alertText = '设置失败'
                }
            }
        })
      },
      deleteAdress: function (index) {
        let that = this
        let _data = {
          token: that.$store.state.token,
          disid: that.adressInfo[index].disid
        }
        that.$axios({
          url: '/user/disadd/remove',
          type: 'post',
          data: _data,
          success: function (res) {
            if (res.data.code == '0000') {
              that.showAlert = true
              that.alertText = '删除成功'
            }else {
              that.showAlert = true
              that.alertText = '删除失败'
            }
          }
        })
      },
      addBtn: function () {
        this.isFlag = true
        let lastPageId = window.sessionStorage.getItem('lastPageId')
        window.sessionStorage.setItem('editId',lastPageId)
        this.$router.push('/adress/add')
      },
      setAdress: function () {
        let that = this
        that.adressInfo = [];
        let _data = {
          token: that.$store.state.token
        }
        that.$axios({
          url: '/user/disadd/all',
          type: 'post',
          data: _data,
          success: function (res) {
            if (res.data.code == '0000') {
              if (res.data.result.length > 0) {
                var _json;
                for (let i = 0; i < res.data.result.length; i++) {
                  _json = {
                    disid: res.data.result[i].disid,
                    realname: res.data.result[i].realname,
                    mobile: res.data.result[i].mobile,
                    address: res.data.result[i].address,
                    distype: res.data.result[i].distype,
                    allAddress: res.data.result[i].pcd + res.data.result[i].address
                  }
                  that.adressInfo.push(_json)
                }
              }else {
                that.mHeight = document.documentElement.clientHeight
              }
            }
            setTimeout(function () {
              that.tshow = false
            },300)
          }
        })
      },
      sureTip(){
        this.showAlert = false
        this.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#ffffff','titleColor': 0, 'navRightButton': {
            'btnType': 1,
            'btnTitle': '管理',
            'btnHandler': 'API_EDITADDRESS'
          },'isHomePage': '0'}, function(response) {}
        )
        this.setAdress()
        this.edit()
      },
    },
    components: {
      alertTip
    },
    beforeRouteLeave (to, from, next) {
      let lastPageId = window.sessionStorage.getItem('lastPageId')
      if (this.isFlag) {//这是一个点击事件
        next(); //正常执行手机返回键
      } else {
        if (from.path !== '/award/delivery/'+lastPageId) { //要离开的路由
          next();//
        }
        //next(false);
        this.$router.push({path: '/award/delivery/'+lastPageId})//指定返回的路由
      }
    }
  }
</script>

<style scoped>
    .tshow {
        display: none;
    }
    .page {
        background-color: #ffffff;
    }
    .adress-ul {
        padding: 0 15px 130px;
    }
    .adress-li {
        background-color: #ffffff;
        margin-top: 30px;
        overflow: hidden;
        position: relative;
        border-radius: 0.1rem;
        box-shadow: 0px 3px 20px #dddddd; /*no*/
    }
    .adress-box {
        width: calc( 100% - 70px);
        padding: 57px 35px 66px;
    }
    .isedit .adress-box {
        width: calc( 83% - 70px);
        padding-bottom: 30px;
    }
    .name {
        padding-bottom: 46px;
    }
    .ismr .name {
        background: url("../../images/mr_adr.png") 100% top no-repeat;
        background-size: 114px 42px;
    }
    .btn-mr {
        display: none;
        color: #F24944;
        margin-top: 30px;
        font-size: 26px; /*px*/
        line-height: 28px; /*px*/
        padding-left: 38px;
        background: url("../../images/sz_mr_icon.png") 0 center no-repeat;
        background-size: 28px 28px;
    }
    .isedit .btn-mr {
        display: block;
    }
    .phone {
        padding-bottom: 18px;
    }
    .adress-info {
        font-weight: normal;
        color: #9D9D9D;
        font-size: 28px; /*px*/
        line-height: 28px; /*px*/
        width: 85%;
        overflow: hidden;
        text-overflow: ellipsis;
        -ms-text-overflow: ellipsis;
        white-space: nowrap;
    }
    .status {
        width: 34px;
        height: 34px;
        background: url("../../images/no_mr_icon.png") center center no-repeat;
        background-size: 100% 100%;
    }
    .ismr .status {
        background: url("../../images/mr_icon.png") center center no-repeat;
        background-size: 100% 100%;
    }
    .isedit .status {
        display: none;
    }
    .isedit .adress-info {
        width: 100%;
    }
    .adress-edit {
        left: 100%;
        transition: all 0.5s;
        width: 17%;
        position: absolute;
        top: 0;
        height: 100%;
        background: #FE6F6B;
        color: #ffffff;
        font-size: 32px; /*px*/
        line-height: 100%;
        text-align: center;
    }
    .adress-edit p {
        height: 32px;
        position: absolute;
        top: 50%;
        width: 100%;
        margin-top: -16px;
    }
    .isedit .adress-edit {
        left: 83%;
    }
    .add-btn {
        color: #ffffff;
        width: 100%;
        height: 100px;
        line-height: 100px;
        font-size: 36px; /*px*/
        margin-top: 30px;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #EA3F3F;
    }
    .isedit.add-btn {
        display: none;
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
    @media
    screen and (-webkit-min-device-pixel-ratio: 2),
    screen and (-moz-min-device-pixel-ratio: 2),
    screen and (min-device-pixel-ratio: 2) {
        .name.ismr {
            background: url("../../images/mr_adr@2x.png") 100% top no-repeat;
            background-size: 114px 42px;
        }
    }
    @media
    screen and (-webkit-min-device-pixel-ratio: 3),
    screen and (-moz-min-device-pixel-ratio: 3),
    screen and (min-device-pixel-ratio: 3) {
        .name.ismr {
            background: url("../../images/mr_adr@3x.png") 100% top no-repeat;
            background-size: 114px 42px;
        }
    }
</style>
