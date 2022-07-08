---
title: 转载-postcss-px2rem-插件进行页面自适应
tags:
  - Vue
  - 转载
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 63504
date: 2020-08-14 00:11:39
---

转载自：https://blog.csdn.net/qq_24991841/article/details/88887053

<!-- more -->

## 1.安装

> npm i postcss-px2rem -D

## 2.vue.config.js 文件中

```js
const px2rem = require('postcss-px2rem');
const postcss = px2rem({
  remUnit: 192 //基准大小 baseSize，需要和rem.js中相同
});
module.exports = {
  // 其他内容
  css: {
    loaderOptions: {
      postcss: {
        plugins: [postcss]
      }
    }
  }
};
```

## 3.在 src 下创建 rem.js 文件夹

```js
export function setRemInit() {
  // postcss-px2rem的内容
  // 基准大小
  const baseSize = 192;
  // 设置 rem 函数
  function setRem() {
    // 当前页面宽度相对于 1920 px(设计稿尺寸)的缩放比例，可根据自己需要修改。
    const scale = document.documentElement.clientWidth / 1920;
    // 设置页面根节点字体大小
    document.documentElement.style.fontSize = `${baseSize * scale}px`;

    // 这个if语句代码，是用来控制屏幕的最小宽度，不需要可以可以不写
    if (Number(document.documentElement.style.fontSize.slice(0, -2)) <= 130) {
      document.documentElement.style.fontSize = '130px';
    }
  }
  // 初始化
  setRem();
  // 改变窗口大小时重新设置 rem
  window.addEventListener('resize', setRem);
}
```

## 4.在 main.js 中引用 rem.js

```js
import { setRemInit } from '@/rem';

setRemInit(); //进行初始化立即运行
```

**注：参数解释：
baseSize 是用来设置 html font-size 的大小 。
remUnit 在 postcss-px2rem 中对你设置 px 转化为 rem，例如，width: 1920px, remUnit = 192 。 则页面渲染完成后，你会发现， width : 10rem; 1920/192 =10。 所以你要保证 baseSize 和 remUnit 对值始终一致，这样才能将 html font-size 和 px 建立正确对关系**
