---
title: iOS上input输入内容拦腰截断
tags:
  - uniapp
categories:
  - 前端
  - CSS
abbrlink: 40889
date: 2020-07-30 23:14:26
---

## 问题

在 ios 上 input 输入框只显示一半高度的字:

{% asset_img input-error.jpeg input输入内容只显示了一半 %}

<!-- more -->

## 解决方案

固定 input 输入框的高度，把 input 输入框写死高度:

```css
/* uniapp 写法，非 uniapp 项目给 input 添加固定高度即可 */
uni-input /deep/ .uni-input-form {
  .uni-input-input {
    height: 50rpx !important;
  }
}
```

{% asset_img input-suc.jpeg 解决 %}
