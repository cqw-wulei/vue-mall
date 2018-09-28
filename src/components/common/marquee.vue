<template>
    <div class="my_c">
        <div class="wrap">
            <div id="box">
                <div id="marquee">
                    <span v-for="(item, index) in lists" :key="index">{{item.mobile}}邀请<span style="color: red">{{item.recommendNum}}</span>位好友注册易见金服获得<span style="color: red">{{item.aWardNum}}</span>个{{unit}}奖励<span style="padding-right: 50px"></span></span>
                </div>
            </div>
            <div id="node">
                <span v-for="(item, index) in lists" :key="index">{{item.mobile}}邀请<span style="color: red">{{item.recommendNum}}</span>位好友注册易见金服获得<span style="color: red">{{item.aWardNum}}</span>个{{unit}}奖励<span style="padding-right: 50px"></span></span>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'Marquee',
    props: ['lists'],
    data () {
      return {
        unit: this.GLOBAL.mallUnit,
        text: '', // 数组文字转化后的字符串
        speed: 20
      }
    },
    // 把父组件传入的arr转化成字符串
    mounted: function () {
    },
    methods: {
      move () {
        let that = this
        // 获取文字text 的计算后宽度  （由于overflow的存在，直接获取不到，需要独立的node计算）
        let width = document.getElementById('node').getBoundingClientRect().width
        let spWidth = 1
        if (width > 2000) {
          that.speed = 10
          spWidth = 2
        }
        let box = document.getElementById('box')
        let distance = 0 // 位移距离
        //设置位移
        setInterval(function () {
          distance = distance - spWidth
          // 如果位移超过文字宽度，则回到起点
          if (-distance >= width) {
            distance = 16
          }
          box.style.transform = 'translateX(' + distance + 'px)'
        }, that.speed)
      },
      setData: function () {
        console.log(this.lists)
      }
    },
    // 更新的时候运动
    updated: function () {
      this.move()
    }
  }
</script>
<style scoped>
    .my_c {
        padding: 22px 29px;
        background:#ffffff url("../../images/tips_icon.png") 29px center no-repeat;
        background-size: 30px 26px;

    }
    .wrap {
        margin-left: 43px;
        overflow: hidden;
    }
    #box {
        width: 80000%;
    }
    #box div {
        float: left;
    }
    #marquee {
        color: #333;
        font-size: 22px; /*px*/
        margin: 0 16px 0 0;
    }
    #node {
        position: absolute;
        z-index: -999;
        top: -999px;
        display: block;
        width: 80%;
        overflow: hidden;
        white-space:nowrap;
    }
    .nbsp {
        padding: 0 10px;
    }
</style>
