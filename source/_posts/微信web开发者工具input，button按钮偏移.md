---
title: 微信web开发者工具input，button按钮偏移
tags:
  - 微信开发
categories:
  - 前端
  - 移动端
  - 微信开发
abbrlink: 40884
date: 2019-12-02 13:38:44
---

使用微信 web 开发者工具开发时有时会发现如图，明明 input 框和 button 框在下面，但只有点击箭头位置时才能有效果

<!-- more -->

{% asset_img huanghelou.png huanghelou %}

解决方法：

在排除样式上的错误的情况下：这是因为高分屏 win10 的显示设置默认是 125%，只需调整为 100%即可：

{% asset_img win10分辨率调整.png 分辨率调整 %}
