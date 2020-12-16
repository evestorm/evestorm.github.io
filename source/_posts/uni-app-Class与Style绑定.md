---
title: uni-app=>Class与Style绑定
tags:
  - uniapp
categories:
  - 前端
  - 框架
  - uniapp
abbrlink: 53020
date: 2020-02-18 20:35:46
---

## Class 类和 Style 通过值快速切换

uni 官方和 vue 文档有不明之出，官方已指出

<!-- more -->

```html
<template>
  <view class="content f f-wrap">
    <image
      class="logo"
      src="../../static/image/myHover.png"
      @click="tap"
    ></image>

    <!--
            前：样式
            后：控制:显示/隐藏
         -->

    <!-- 单类 -->
    <view :class="{ active: isActive }">111</view>

    <!-- 对象 -->
    <view class="static" :class="{ active: isActive, 'text-danger': hasError }">
      222
    </view>

    <!-- 数组 -->
    <view class="static" :class="[activeClass, errorClass]">333</view>

    <!-- 条件 -->
    <view
      class="static"
      v-bind:class="[isActive ? activeClass : '', errorClass]"
    >
      444
    </view>

    <!-- 数组+对象 -->
    <view class="static" v-bind:class="[{ activeGrey: isActive }, errorClass]">
      555
    </view>

    <!-- 执行类 -->
    <view class="container" :class="computedClassStr"></view>
    <view class="container" :class="{activeGrey: isActive}">9999</view>

    <!-- style支持的类 -->
    <view v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }">
      666
    </view>
    <view v-bind:style="[{ color: activeColor, fontSize: fontSize + 'px' }]">
      777
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        title: 'Hello',

        // 单激活类
        isActive: true,
        hasError: true,

        // 多种激活类
        activeClass: {
          active: false,
          'text-danger': true
        },
        errorClass: {
          active: true,
          'text-danger': false
        },

        activeColor: true,
        fontSize: 30
      };
    },
    onLoad() {
      this.fetchData();
      console.log('页面加载');
    },
    onShow() {
      console.log('页面显示');
    },
    onReady() {
      console.log('页面初次显示');
    },
    onHide() {
      console.log('页面隐藏');
    },
    onUnload() {
      console.log('页面卸载');
    },
    onBackPress() {
      console.log('页面返回...');
    },
    onShareAppMessage() {
      console.log('分享!');
    },
    onReachBottom() {
      console.log('下拉加载...');
    },
    onPageScroll() {
      console.log('页面滚动...');
    },
    onPullDownRefresh() {
      console.log('上拉刷新...');
      uni.stopPullDownRefresh();
    },

    // #ifdef APP-PLUS
    onNavigationBarButtonTap() {},
    // #endif

    methods: {
      tap(e) {
        console.log('tap点击!', e);
      },
      fetchData() {
        console.log('拉取数据...');
      },
      computedClassStr() {
        return this.isActive ? 'actives' : 'active';
      }
    }
  };
</script>

<style lang="scss">
  .active {
    color: #f00;
  }

  .activeGrey {
    color: #aaa;
  }

  .text-danger {
    color: #f0f;
    font-weight: bold;
  }

  .f {
    display: flex;
  }

  .f-wrap {
    flex-wrap: wrap;
  }
</style>
```

通过模板**（template-style-css）**端控制模板

{% asset_img template-style-css.png template-style-css %}

通过控制端**（JS-style-css）**来控制行为

{% asset_img js-style-css.png js-style-css %}

通过**（CSS）**显示端进行显示

{% asset_img css-style-css.png css-style-css %}
