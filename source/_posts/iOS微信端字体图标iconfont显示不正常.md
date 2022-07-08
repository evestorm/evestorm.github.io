---
title: iOS微信端字体图标iconfont显示不正常
tags:
  - 解决方案
  - iOS
categories:
  - 前端
  - 移动端
  - H5
abbrlink: 5764
date: 2020-12-17 21:25:12
---

## 问题描述

iOS 中微信端打开项目发现图标显示成一个个方框；切换页面也同样没显示。但是在 Android 端、IOS 的浏览器显示正常。

备注：刷新页面后能正常显示。

<!-- more -->

## 问题原因

iOS 微信端的缓存机制引起的。

> 具体原因：刚进入页面会检测微信环境的话会发生一次跳转（获取微信用户信息）,在未跳转前，浏览器正在下载图标文件；而跳转使得
> 这些文件下载终止导致不完整。再跳转后想下载这些文件但因为浏览器缓存机制问题所以复用那些不完整的文件。

## 解決方案

1. 微信登录不跳转，由后台静默完成（推荐）；
2. `window.onload()` 方法中执行跳转，因为此时文件都下载完毕
3. 延迟跳转（在用）
4. 登录完成之后再动态加载字体文件（我使用的方案）

```js
login().then(params => {
  // wx wxReady
  let iconfont_link = document.createElement('link);
  iconfont_link.setAttribute('rel', 'stylesheet');
  iconfont_link.setAttribute('href', '//at.alicdn.com/t/font_2275779_59uak70qieo.css');
  document.head.appendChild(iconfont_link);
});
```
