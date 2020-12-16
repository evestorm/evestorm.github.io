---
title: uni-app引用高德地图
tags:
  - uniapp
categories:
  - 前端
  - 框架
  - uniapp
abbrlink: 30327
date: 2020-06-21 20:40:15
---

## 引入

```js
import amap from '@/lib/amap/amap-wx.js';
```

## 初始化

```js
myAmapFun = new amap.AMapWX({
  key: this.key //该key 是在高德中申请的微信小程序key
});
```

<!-- more -->

### 获取当前定位信息

```js
this.myAmapFun.getRegeo({
  citylimit: true, //仅返回指定城市数据
  success: res => {
    console.log(res[0].regeocodeData.addressComponent); // 获取当前位置提示信息
    console.log(res[0].regeocodeData.pois); //获取的周边提示信息
  },
  fail: err => {
    uni.showToast({
      title: '获取当前定位失败,请手动输入查询',
      icon: 'none'
    });
  }
});
```

### 通过输入词，查询周边地址

```js
myAmapFun.getInputtips({
  keywords: '', //输入的words
  city: this.addressData.cityName, //指定城市数据
  extensions: 'all', //返回地址描述以及附近兴趣点和道路信息，默认"base"
  success: res => {
    if (res && res.tips) {
      console.log(res);
    }
  }
});
```
