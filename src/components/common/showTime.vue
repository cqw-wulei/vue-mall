<template>
    <div class="act-stime">
        <p class="fl">距{{act.status}}还剩</p>
        <ul class="fl" v-if="timeObject.length == 7">
            <li v-for="(key, index) in timeObject" :class="[index == 2 || index == 4 ? 'mr' : '']" :key="index">
                <p :class="[key.animateA ? 'animation_a' : '']">{{key.time}}</p>
                <p class="re"><span class="animation_b" :class="[key.animateB ? 'animation_b' : '']">{{key.time}}</span></p>
            </li>
        </ul>
        <ul class="fl" v-else-if="timeObject.length == 6">
            <li v-for="(key, index) in timeObject" :class="[index == 1 || index == 3 ? 'mr' : '']" :key="index">
                <p :class="[key.animateA ? 'animation_a' : '']">{{key.time}}</p>
                <p class="re"><span class="animation_b" :class="[key.animateB ? 'animation_b' : '']">{{key.time}}</span></p>
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    name: 'Time',
    props: ['actInfo'],
    data() {
      return {
        firstIn: true,
        secondCg: true,
        act: {
          status: '开始',
          hours: '12',
          mins: '01',
          sec: '10'
        },
        timeObject: [
          {
            time: '',
            animateA: false,
            animateB: false
          },
          {
            time: '',
            animateA: false,
            animateB: false
          },
          {
            time: '',
            animateA: false,
            animateB: false
          },
          {
            time: '',
            animateA: false,
            animateB: false
          },
          {
            time: '',
            animateA: false,
            animateB: false

          },
          {
            time: '',
            animateA: false,
            animateB: false
          }
        ]
      }
    },
    mounted: function() {
      var that = this;
      that.setIndex()
    },
    methods: {
      setIndex: function() {
        let that = this
        that.timeStart()
        that.act.status = that.actInfo.status;
        that.act.hours = that.getLeftTime(that.actInfo.time).hours;
        that.act.mins = that.getLeftTime(that.actInfo.time).minutes;
        that.act.sec = that.getLeftTime(that.actInfo.time).second;
        that.setTime(that.act.hours,that.act.mins,that.act.sec)
      },
      timeStart: function () {
        let that = this;
        let timeControl = setInterval(function () {
          that.act.sec > 0 ? that.act.sec-- : (that.act.sec = 59, that.act.mins > 0 ? that.act.mins-- : (that.act.mins = 59, that.act.hours > 0 ? that.act.hours-- : (clearInterval(timeControl),that.timeEndFn())))
          that.setTime(that.act.hours,that.act.mins,that.act.sec)
        },1000)
      },
      setTime: function(h,m,se) {
          let _this = this
          let timeArray = [_this.count(h),_this.count(m),_this.count(se)]
          let finalTime = timeArray.reduce(_this.add).toString().split('')
          for (let i = 0; i < finalTime.length; i++){
            if (finalTime.length  == 7 && _this.firstIn) {
              _this.firstIn = false
              _this.timeObject.push({
                time: '',
                animateA: false,
                animateB: false
              })
            }else if (finalTime.length  == 6 && _this.secondCg && !_this.firstIn) {
              _this.secondCg = false
              _this.timeObject.splice((_this.timeObject.length - 1),1);
            }
            if (finalTime[i] != _this.timeObject[i].time) {
              _this.timeObject[i].animateA = true
              setTimeout(function () {
                _this.timeObject[i].animateB = true
                _this.timeObject[i].time = finalTime[i]
              },400);
              setTimeout(function () {
                _this.timeObject[i].animateA = false
                _this.timeObject[i].animateB = false
              },700);
            }
          }
      },
      count: function(n){
        if (n >= 100) {
          return n
        }else {
          var str = '0' + n
          return str.substr(str.length-2,2)
        }
      },
      add: function(e,f){
        return e + f
      },
      timeEndFn: function () {
        let that = this
        that.$emit('timeEndFn')
        that.act.status = that.actInfo.status;
        that.setIndex()
      }
    },
  }
</script>

<style scoped>
    .act-stime {
        position: absolute;
        top: 10px;
        left: 0;
        padding: 0 10px;
        z-index: 10;
    }
    .act-stime > p {
        font-size: 24px; /*px*/
        color: #333;
        padding-right: 11px;
        display: inline-block;
    }
    li {
         float: left;
         border-radius: 0.05rem;
         background:-webkit-gradient(linear, 0% 0%, 0% 100%,from(#A2A2A2), to(#3F3F3F));/*谷歌*/
         background-image: -webkit-gradient(linear,left bottom,left top,color-start(0, #A2A2A2),color-stop(1, #3F3F3F));/* Safari & Chrome*/
     }
    .mr {
        margin-right: 8px;
    }
    ul li p {
        overflow: hidden;
    }
    ul {
        text-align: center;
        color: #fff;
        font-size: 22px;
        line-height: 36px;
    }
    ul li p {
        width: 24px;
        margin: 0;
        height: 20px;
    }
    .re {
        position: relative
    }
    .re span {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: -20px
    }
    .animation_a {
        -moz-transform-style: preserve-3d;
        -o-transform-style: preserve-3d;
        -ms-transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
        transform-style: preserve-3d;
        -moz-transform-origin: 50% 100%;
        -o-transform-origin: 50% 100%;
        -ms-transform-origin: 50% 100%;
        -webkit-transform-origin: 50% 100%;
        transform-origin: 50% 100%;
        animation: .4s ease 0s normal none 1 running thetop-ani;
        -o-animation: .4s ease 0s normal none 1 running thetop-ani;
        -ms-animation: .4s ease 0s normal none 1 running thetop-ani;
        -moz-animation: .4s ease 0s normal none 1 running thetop-ani;
        -webkit-animation: .4s ease 0s normal none 1 running thetop-ani
    }
    @keyframes thetop-ani {
        0% {
            -moz-transform: rotateX(0);
            -o-transform: rotateX(0);
            -ms-transform: rotateX(0);
            -webkit-transform: rotateX(0);
            transform: rotateX(0)
        }
        100% {
            -moz-transform: rotateX(90deg);
            -o-transform: rotateX(90deg);
            -ms-transform: rotateX(90deg);
            -webkit-transform: rotateX(90deg);
            transform: rotateX(90deg)
        }
    }
    .animation_b {
        -moz-transform-style: preserve-3d;
        -o-transform-style: preserve-3d;
        -ms-transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
        transform-style: preserve-3d;
        -moz-transform-origin: 50% 0;
        -o-transform-origin: 50% 0;
        -ms-transform-origin: 50% 0;
        -webkit-transform-origin: 50% 0;
        transform-origin: 50% 0;
        animation: .3s ease 0s normal none 1 running buttn-ani;
        -o-animation: .3s ease 0s normal none 1 running buttn-ani;
        -ms-animation: .3s ease 0s normal none 1 running buttn-ani;
        -moz-animation: .3s ease 0s normal none 1 running buttn-ani;
        -webkit-animation: .3s ease 0s normal none 1 running buttn-ani
    }
    @keyframes buttn-ani {
        0% {
            -moz-transform: rotateX(-90deg);
            -o-transform: rotateX(-90deg);
            -ms-transform: rotateX(-90deg);
            -webkit-transform: rotateX(-90deg);
            transform: rotateX(-90deg)
        }
        100% {
            -moz-transform: rotateX(0);
            -o-transform: rotateX(0);
            -ms-transform: rotateX(0);
            -webkit-transform: rotateX(0);
            transform: rotateX(0)
        }
    }
</style>
