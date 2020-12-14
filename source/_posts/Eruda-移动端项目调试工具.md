---
title: Eruda-移动端项目调试工具
tags:
  - 技巧
  - 调试
categories:
  - 工具
  - 测试
abbrlink: 41294
date: 2019-07-08 14:17:36
---

## 起因

之前移动端页面调试我都是手机插线连电脑用 Chrome 或者 Safari 搞定的，然而这种方式挺麻烦的，起码我这么觉得。（p.s. 如果不熟悉连线操作方式，可以查看掘金的[这篇文章](https://juejin.im/post/5b15022ff265da6e163720c6)）后来就考虑搜索替代方案了，于是发现了 [Eruda](https://github.com/liriliri/eruda) 这款调试工具。

<!-- more -->

## 介绍

直接引用作者对这款插件的介绍：Eruda 是一个专为手机网页前端设计的调试面板，类似 DevTools 的迷你版，其主要功能包括：捕获 console 日志、检查元素状态、捕获 XHR 请求、显示本地存储和 Cookie 信息等等。

总结来讲，使用它的好处就是，手机在不连线的情况下访问页面，会在右下角生成一个按钮，点击会弹出一个调试窗口，能够在上面查看 log 日志等信息，方便调试。

### 截图

{% asset_img screenshot.jpg screenshot %}

## 如何使用

### 通过 cdn

```html
<script src="//cdn.bootcss.com/eruda/1.5.2/eruda.min.js"></script>
<script>
  eruda.init();
</script>
```

### 通过 npm

```shell
npm i eruda -D
```

入口文件：

```js
(function () {
  if (!/mdebug=true/.test(window.location.href)) return;
  var script = document.createElement('script');
  script.src = 'https://cdn.bootcss.com/eruda/1.5.2/eruda.min.js';
  script.async = true;
  document.getElementsByTagName('head')[0].appendChild(script);
  script.onload = function () {
    eruda.init();
  };
})();
```

在需要调试时，给地址栏末尾正价 mdebug=true 就 OK 了。

## 资源

- [github - eruda](https://github.com/liriliri/eruda)
- [另一款调试工具 - vconsole](https://github.com/Tencent/vConsole)
