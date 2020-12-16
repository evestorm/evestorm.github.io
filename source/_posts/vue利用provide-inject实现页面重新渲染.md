---
title: vue利用provide+inject实现页面重新渲染
tags:
  - Vue
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 57665
date: 2019-10-08 21:42:40
---

在 vue 中有时 vuex 或者 computed 的数据改变后数据并不会进行重新渲染，只有刷新后数据才会重新加载，

但如果为了让页面重新加载而采用 window.reload()或者 router.go(0)进行刷新那加载慢闪烁白屏等问题会让客户体验及其不好

<!-- more -->

这时就可以进行局部刷新，原理是使用 provide+inject 的组合来控制 router-view 的显示消失完成

provide+inject 这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效

在 app.vue 中注册函数 reload 对属性 isRouterAlive 进行开关操作

{% asset_img provide-reload.png provide-reload %}

然后在需要使用的组件中注入方法直接 this.reload()使用即可

{% asset_img inject-reload.png inject-reload %}

补充：在 reload 中的 this.$nextTick()是将回调延迟到下次 DOM 更新循环之后执行，基本等价于 setTimeout(()=>{},0)

能够让一些数据完成接收替换后再进行调用，也是能解决加载问题的方法之一
