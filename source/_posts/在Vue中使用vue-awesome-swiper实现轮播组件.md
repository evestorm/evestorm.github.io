---
title: 在Vue中使用vue-awesome-swiper实现轮播组件
tags:
  - swiper
  - vue-awesome-swiper
  - 笔记
categories:
  - 前端
  - UI
  - vue-awesome-swiper
abbrlink: 58466
date: 2022-07-27 17:44:29
---

## 安装

```shell
npm install vue-awesome-swiper@3 --save
```

<!-- more -->

**version**

- "vue": "^2.6.11"
- "vue-awesome-swiper": "^3.1.3"

## 代码片段

```vue
<template>
  <div class="transaction-list" v-if='dataSource.length > 0'>
      <swiper :options="swiperOption" ref="mySwiper" class='sw-swiper' :key='swiperKey'>
      <swiper-slide v-for="(item, index) in dataSource" :key="index">
        <div class="transaction-item">
          <div class="transaction-item-name" :title="item.appName">{{ item.appName }}</div>
          <div class="transaction-item-amount">
            <div class="transaction-item-amount-item">
              <div class="amount-item-num">{{ `${Number(item.amount)}笔/分` }}</div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

export default {
  props: {
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 文档配置: https://3.swiper.com.cn/api/basic/2014/1215/21.html
      swiperOption: {
        initialSlide: 0, // 设定初始化时slide的索引
        direction: 'vertical', // Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)
        loop: true,
        loopPreventsSlide: true,
        autoplay: {
          delay: 2000, // 自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换
          disableOnInteraction: false, // 用户操作swiper之后，是否禁止autoplay。默认为true：停止。(操作包括触碰，拖动，点击pagination等)
        },
        simulateTouch: false, // 默认为true，Swiper接受鼠标点击、拖动。
        freeMode: false, // 默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
        slidesPerView: 'auto', // 自适应 swiper 宽度内展示多少个 swiper-slide
        observer: true, // 修改 swiper 自己或子元素时，自动初始化 swiper
        observeParents: true, // 修改 swiper 的父元素时，自动初始化 swiper
        autoHeight: true, // 自适应高度
      },
      swiperKey: 0, // 强制更新 swiper 数据更新
    }
  },
  components: { swiper, swiperSlide },
  watch: {
    dataSource: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.$refs.mySwiper && this.$refs.mySwiper.swiper) {
          const swiper = this.$refs.mySwiper.swiper;
          // 找到真实 idx
          const oldActiveIdx = swiper.realIndex;
          // 从旧数据中找到目标数据
          const oldTarget = oldVal.find((v, idx) => idx === oldActiveIdx);
          if (oldTarget) {
            // 更新 swiper 数据
            this.swiperKey = Math.random().toString(36).substr(2);
            // 在新数据中找到上一次轮播索引对应的数据
            const newTargetIdx = newVal.findIndex(v => v.appName === oldTarget.appName);
            console.log({
              swiper,
              oldActiveIdx,
              newTargetIdx,
              len: newVal.length
            });
            // 渲染新数据时，定位到上一次的目标索引
            this.swiperOption.initialSlide = newTargetIdx || 0
          }
        }
      }
    }
  }
}
</script>
```

## 注意点

1. 我这边异步数据轮询，发现 swiper 轮播时数据不更新
   1. 解决方案: 给 swiper 组件上设置 `swiperKey` ；每次更新完数据重新设置一个和上次不同的 `swiperKey` 即可
2. 异步数据获取到以后，页面更新了，但是不自动轮播
   1. 解决方案：给 swiper 外部 div 上添加 `v-if='dataSource.length > 0'`
3. 竖向滚动时，`swiper-slide` 组件高度和遍历的 `transaction-item` 高度不一致
   1. 解决方案：`swiperOption` 配置项中配置 `slidesPerView: 'auto'` 以及 `autoHeight: true`
4. 产品需要轮询过程中，更新数据时，swiper 不会重置从第一个 slider 开始重新轮播，而是从更新前的索引继续播放
   1. 解决方案：参考代码片段中的 watch 方法
5. 如果不想让用户能够手动滚动swiper
   1. 只要在最外层的容器上增加 `class="swiper-no-swiping"` 就好了（前提是：引入了 swiper 相关的css）

## 相关资源

- [surmon-china/vue-awesome-swiper](https://github.com/surmon-china/vue-awesome-swiper)
- [Swiper](https://swiperjs.com/)
- [Swiper3.x 中文文档](https://3.swiper.com.cn/api/index.html)
- [插件------vue-awesome-swiper 插件不会loop(无限循环)了](https://blog.csdn.net/COCOLI_BK/article/details/121742902)
- [vue-awesome-swiper实现循环滚动列表](https://blog.csdn.net/weixin_39150852/article/details/112475610)
- [swiper和vue-awesome-swiper竖向滚动，自适应高度解决方案_ccyolo的博客-程序员ITS401](https://its401.com/article/ccyolo/119824406)
- [vue-awesome-swiper重新初始化](https://www.jianshu.com/p/2bf533974047)