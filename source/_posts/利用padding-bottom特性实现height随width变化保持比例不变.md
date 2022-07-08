---
title: 利用padding-bottom特性实现height随width变化保持比例不变
tags:
  - 技巧
  - 布局
categories:
  - 前端
  - CSS
abbrlink: 2610
date: 2019-12-12 12:54:41
---

## 起因

希望每个网格高度等于宽度，而宽度已被设为 33.333%：

<!-- more -->

{% asset_img grid-padding-bottom.png grid %}

## 解决方案

### 示例

<iframe height="644" scrolling="no" title="padding-bottom 高度自适应" src="https://codepen.io/JingW/embed/qBENXJr?height=644&amp;theme-id=default&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

### 说明

> 一个元素的 padding，如果值是一个百分比，那这个百分比是相对于其父元素的宽度而言的，padding-bottom 也是如此。

使用 `padding-bottom` 代替 `height` 来实现高度与宽度成比例的效果，将 `padding-bottom` 设置为想要实现的 `height` 的值。同时将其 `height` 设置为 0 以使元素的「高度」等于 `padding-bottom` 的值，从而实现需要的效果。

## 参考来源

- [css 保持 div 等高宽比](http://www.fly63.com/article/detial/1751)
