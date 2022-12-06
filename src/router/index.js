/*
 * @Author      : Mr.bin
 * @Date        : 2022-06-23 08:37:45
 * @LastEditTime: 2022-12-06 21:44:06
 * @Description : 路由
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  /*
   * 前面加"/"表示绝对路径，不加"/"表示相对路径
   * 一般嵌套路由中的子路由不需要加"/"，它会在父路由后自动加上"/子路由"
   * 比如父 "/father"，子 "child"，要想访问子路由，跳转链接需要写成 "/father/child"
   */

  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout'),
    redirect: '/home',
    children: [
      // 首页
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home'),
        meta: ['首页']
      },
      // 用户
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user'),
        meta: ['用户']
      },
      // 添加用户
      {
        path: 'user-add',
        name: 'user-add',
        component: () => import('@/views/user-add'),
        meta: ['添加用户']
      },
      // 用户信息修改
      {
        path: 'user-edit',
        name: 'user-edit',
        component: () => import('@/views/user-edit'),
        meta: ['用户信息修改']
      },
      // 设置医院名称
      {
        path: 'set-hospital',
        name: 'set-hospital',
        component: () => import('@/views/set/set-hospital'),
        meta: ['设置医院名称']
      },
      // 调零
      {
        path: 'set-zero',
        name: 'set-zero',
        component: () => import('@/views/set/set-zero'),
        meta: ['调零']
      },
      // 设置K
      {
        path: 'set-k',
        name: 'set-k',
        component: () => import('@/views/set/set-k'),
        meta: ['设置K']
      },
      // 设置蹬伸动作范围
      {
        path: 'set-maxDistance',
        name: 'set-maxDistance',
        component: () => import('@/views/set/set-maxDistance'),
        meta: ['设置蹬伸动作范围']
      },
      // 开发者
      {
        path: 'set-developer',
        name: 'set-developer',
        component: () => import('@/views/set/set-developer'),
        meta: ['开发者']
      },
      // 数据迁移
      {
        path: 'set-data-migration',
        name: 'set-data-migration',
        component: () => import('@/views/set/set-data-migration'),
        meta: ['数据迁移']
      },
      // 游戏
      {
        path: 'game',
        name: 'game',
        component: () => import('@/views/game'),
        meta: ['游戏']
      },

      /* 测试模块 */
      // 测试项目选择
      {
        path: 'test-select',
        name: 'test-select',
        component: () => import('@/views/test-mode/select'),
        meta: ['测试项目选择']
      },
      // 测试具体测量
      {
        path: 'test-measure',
        name: 'test-measure',
        component: () => import('@/views/test-mode/measure'),
        meta: ['测试具体测量']
      },

      /* 训练模块 */
      // 训练项目选择
      {
        path: 'train-select',
        name: 'train-select',
        component: () => import('@/views/train-mode/select'),
        meta: ['训练项目选择'],
        redirect: '/train-select/basics',
        children: [
          // 基础训练
          {
            path: 'basics',
            name: 'basics',
            component: () => import('@/views/train-mode/select/basics'),
            meta: ['基础训练']
          },
          // 进阶训练
          {
            path: 'advance',
            name: 'advance',
            component: () => import('@/views/train-mode/select/advance'),
            meta: ['进阶训练']
          },
          // 离心训练
          {
            path: 'offcenter',
            name: 'offcenter',
            component: () => import('@/views/train-mode/select/offcenter'),
            meta: ['离心训练']
          },
          // 等长训练
          {
            path: 'equal',
            name: 'equal',
            component: () => import('@/views/train-mode/select/equal'),
            meta: ['等长训练']
          },
          // 自定义训练
          {
            path: 'custom',
            name: 'custom',
            component: () => import('@/views/train-mode/select/custom'),
            meta: ['自定义训练']
          }
        ]
      },
      // 训练具体测量
      {
        path: 'train-measure',
        name: 'train-measure',
        component: () => import('@/views/train-mode/measure'),
        meta: ['训练具体测量']
      },
      // 训练具体测量-等长训练专用
      {
        path: 'train-measure-equal',
        name: 'train-measure-equal',
        component: () => import('@/views/train-mode/measure-equal'),
        meta: ['训练具体测量-等长训练专用']
      },

      /* MTT模块 */
      // mtt项目选择
      {
        path: 'mtt-select',
        name: 'mtt-select',
        component: () => import('@/views/mtt-mode/select'),
        meta: ['mtt项目选择'],
        redirect: '/mtt-select/static-feedback',
        children: [
          // 静态反馈训练
          {
            path: 'static-feedback',
            name: 'static-feedback',
            component: () => import('@/views/mtt-mode/select/static-feedback'),
            meta: ['静态反馈训练']
          },
          // 动态反馈训练
          {
            path: 'dynamic-feedback',
            name: 'dynamic-feedback',
            component: () => import('@/views/mtt-mode/select/dynamic-feedback'),
            meta: ['动态反馈训练']
          },
          // 肌耐力训练
          {
            path: 'muscular-endurance',
            name: 'muscular-endurance',
            component: () =>
              import('@/views/mtt-mode/select/muscular-endurance'),
            meta: ['肌耐力训练']
          },
          // 肌肥大训练
          {
            path: 'hypermyotrophy',
            name: 'hypermyotrophy',
            component: () => import('@/views/mtt-mode/select/hypermyotrophy'),
            meta: ['肌肥大训练']
          }
        ]
      },
      // mtt具体测量
      {
        path: 'mtt-measure',
        name: 'mtt-measure',
        component: () => import('@/views/mtt-mode/measure'),
        meta: ['mtt具体测量']
      },

      /* 数据记录 */
      // 测试
      {
        path: 'test-record',
        name: 'test-record',
        component: () => import('@/views/record/test')
      },
      // 训练
      {
        path: 'train-record',
        name: 'train-record',
        component: () => import('@/views/record/train')
      },
      // MTT
      {
        path: 'mtt-record',
        name: 'mtt-record',
        component: () => import('@/views/record/mtt')
      }
    ]
  },

  /* 测试报告 */
  {
    path: '/test-print',
    name: 'test-print',
    component: () => import('@/views/test-mode/print'),
    meta: ['测试报告']
  },
  /* 训练报告 */
  {
    path: '/train-print',
    name: 'train-print',
    component: () => import('@/views/train-mode/print'),
    meta: ['训练报告']
  },
  /* MTT报告 */
  {
    path: '/mtt-print',
    name: 'mtt-print',
    component: () => import('@/views/mtt-mode/print'),
    meta: ['MTT报告']
  },
  // 测试-长期趋势报告
  {
    path: '/test-secular-trend-print',
    name: 'test-secular-trend-print',
    component: () => import('@/views/test-mode/secular-trend-print'),
    meta: ['测试-长期趋势报告']
  },
  // 训练-长期趋势报告
  {
    path: '/train-secular-trend-print',
    name: 'train-secular-trend-print',
    component: () => import('@/views/train-mode/secular-trend-print'),
    meta: ['训练-长期趋势报告']
  },
  // MTT-长期趋势报告
  {
    path: '/mtt-secular-trend-print',
    name: 'mtt-secular-trend-print',
    component: () => import('@/views/mtt-mode/secular-trend-print'),
    meta: ['MTT-长期趋势报告']
  },

  {
    path: '/refresh',
    name: 'refresh',
    component: () => import('@/views/refresh')
  },

  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes,
  /* 自定义路由切换时页面如何滚动 */
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 } // 回到顶部
  }
})
export default router
