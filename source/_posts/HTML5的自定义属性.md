---
title: HTML5的自定义属性
categories:
  - 前端
  - HTML
abbrlink: 39974
date: 2019-02-10 09:28:00
tags:
---

> 在 HTML5 中我们可以自定义属性，其格式为 `data-*=""`

<!-- more -->

```html
<div id="demo" data-my-name="sw" data-age="10">
<script>
/*
  Node.dataset 是以对象形式存在的，当我们为同一个 DOM 节点指定了多个自定义属性时，
  Node.dataset 则存储了所有的自定义属性的值。
  */
var demo = document.querySelector("#demo");
//获取
//注：当我们如下格式设置时，则需要以驼峰格式才能正确获取
var name = demo.dataset['myName'];
var age = demo.dataset['age'];
//设置
demo.dataset['name'] = 'web developer';
<script/>
```

**资源**

[mdn - data-*](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/data-*)