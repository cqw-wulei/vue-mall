import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      component: resolve => require(['@/pages/index/index'],resolve),
      meta: {
        pageTitle: '主页',
        keepAlive: false,
        index:0
      }
    },{
      path: '/detail/:logCode/:isShare/:shareUrl',
      component: resolve => require(['@/pages/index/children/detail'],resolve),
      meta: {
        pageTitle: '活动详情',
        keepAlive: false,
        index:2
      }
    },{
      path: '/act/to/partyInfo',
      component: resolve => require(['@/pages/index/children/partyInfo'],resolve),
      meta: {
        pageTitle: '活动参与详情',
        keepAlive: false,
        index:3
      }
    },{
      path: '/detail/act/to/status/:status',
      component: resolve => require(['@/pages/index/children/status'],resolve),
      meta: {
        pageTitle: '下单状态',
        keepAlive: false,
        index:4
      }
    },{
      path: '/rule',
      component: resolve => require(['@/pages/index/children/children/ruleAll'],resolve),
      meta: {
        pageTitle: '活动计算规则',
        keepAlive: false,
        index:6
      }
    },{
      path: '/award',
      component: resolve => require(['@/pages/award/award'],resolve),
      meta: {
        pageTitle: '参与记录',
        keepAlive: false,
        index:2
      }
    },{
      path: '/award/detail/:id',
      component: resolve => require(['@/pages/award/children/detail'],resolve),
      meta: {
        pageTitle: '参与记录详情',
        keepAlive: false,
        index:5
      }
    },{
      path: '/award/delivery/:id',
      component: resolve => require(['@/pages/award/children/delivery'],resolve),
      meta: {
        pageTitle: '领取地址',
        keepAlive: false,
        index:6
      }
    },{
      path: '/award/sure',
      component: resolve => require(['@/pages/award/children/sure'],resolve),
      meta: {
        pageTitle: '领取确定',
        keepAlive: false,
        index:7
      }
    },{
      path: '/adress',
      component: resolve => require(['@/pages/adress/index'],resolve),
      meta: {
        pageTitle: '地址管理',
        keepAlive: false,
        index:8
      }
    },{
      path: '/empty',
      component: resolve => require(['@/pages/adress/empty'],resolve),
      meta: {
        pageTitle: '地址管理',
        keepAlive: false,
        index:8
      }
    },{
      path: '/adress/add',
      component: resolve => require(['@/pages/adress/children/add'],resolve),
      meta: {
        pageTitle: '添加地址',
        keepAlive: false,
        index:9
      }
    },{
      path: '/recharge',
      component: resolve => require(['@/pages/recharge/recharge'],resolve),
      meta: {
        pageTitle: '充值',
        keepAlive: false,
        index:2
      }
    },{
      path: '/recharge/detail',
      component: resolve => require(['@/pages/recharge/children/detail'],resolve),
      meta: {
        pageTitle: '详情',
        keepAlive: false,
        index:3
      }
    },{
      path: '/recharge/request',
      component: resolve => require(['@/pages/recharge/children/request'],resolve),
      meta: {
        pageTitle: '邀请详情',
        keepAlive: false,
        index:3
      }
    },{
      path: '/recharge/:status',
      component: resolve => require(['@/pages/recharge/children/status'],resolve),
      meta: {
        pageTitle: '支付状态',
        keepAlive: false,
        index:4
      }
    },{
      path: '*',
      redirect: '/index'
    }
  ]
})
