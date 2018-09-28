<template>
    <div class="page" v-title="'抽奖规则'">
        <section class="rule">
            <p class="title">易见金服瑞购商城官方抽奖规则</p>
            <p class="tips">此规则为易见金服商城官方抽奖规则，保证抽奖过程的公平、公正、公开。</p>
            <p class="stitle">【抽奖方法】</p>
            <p>凡是参与项目的用户都会随机分配一个唯一兑换码并提前公示，兑换码将于项目结束，系统随机选择60名用户的下单时间，并删除前5条与后5条数据，保留中间50条数据，然后对剩余用户进行算法分析，计算出中奖号；</p>
            <p class="stitle">【抽奖时间】</p>
            <p>公布中奖结果的时间为项目结束后的当个工作日。</p>
            <p class="stitle">【抽奖资格】</p>
            <p>1、项目必须达标，方可进行抽奖。</p>
            <p>2、用户支付一{{unit}}参与项目抽奖并支付成功，将得到一个兑换码，每个账号每个项目支持参与多次；</p>
            <p class="stitle">【中奖号计算方法】</p>
            <p>根据项目结束后的当个工作日，按照抽奖计算公式进行抽奖。</p>
            <p>计算公式：（A+B）/ 参与人数+活动码起始值</p>
            <p>① 取最后60条最后时间记录，去除首尾各5条。</p>
            <p>② 将时间转换成YYYYMMDDHHMMSS格式的数值；eg:2018-09-01 12:38:37 → 20180901123837</p>
            <p>③ 50条数据累计求和，值为A。</p>
            <p>④ 取最近一期“重庆时时彩”开奖结果，值为B。</p>
            <p>⑤ 数值求和结果与当前活动参与人数相除取余数。</p>
            <p>⑥ 以上所得结果加上活动编号起始值。</p>
            <p class="stitle">【抽奖过程】</p>
            <p>① 兑换码公示：项目结束时，若项目达标，系统将开始计算抽奖；</p>
            <p>② 根据计算规则计算中奖号，公布中奖名单：中奖号码将公布在“参与记录”中的该笔订单的项目详情下。</p>
            <p>③ 未达标项目进行退款：未达标的项目将按照实际支付{{unit}}数按元支付路径进行退款。</p>
            <p>④ 中奖用户完善收货信息后，易见金服官方客服将会在三个工作日内联系您并派发相应奖品。</p>
        </section>

    </div>
</template>

<script>
  export default {
    name: 'ruleAll',
    data() {
      return {
        unit: this.GLOBAL.mallUnit,
      }
    },
    created() {//强制执行
      let that = this
      that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#ffffff','titleColor': 0,'isHomePage': 0}, function(response) {})
    }
  }
</script>

<style scoped>
    .rule {
        background-color: #ffffff;
        padding: 30px 50px;
        color: #666;
        font-size: 28px; /*px*/
        line-height: 56px; /*px*/
        text-align: justify;
    }
    .title {
        color: #333;
        text-align: center;
        font-size: 34px; /*px*/
    }
    .tips {
        font-size: 28px; /*px*/
        color: #cf2d28;
        padding: 10px 0;
    }
    .stitle {
        color: #333;
        font-size: 28px; /*px*/
    }
</style>
