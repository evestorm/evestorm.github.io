---
title: element-ui全屏select下拉框不显示下拉列表的问题
tags:
  - element-ui
categories:
  - 前端
  - UI
  - element-ui
abbrlink: 35961
date: 2021-01-27 16:00:50
---

## 问题

项目中需要用到页面全屏功能，使用后发现 element-ui 的 select 组件无法显示下拉列表。

<!-- more -->

## 原因

element-ui 默认将弹出框插入到了 `body` 元素。当设置了某个元素全屏时，会遮挡住原来的 `select` 下拉数据。

## 解决方案

查看 [官网文档](https://element.eleme.io/#/zh-CN/component/select#select-attributes) 发现可以对 `el-select` 组件设置 `popper-append-to-body` 属性：

```html
<el-select :popper-append-to-body="false"></el-select>
```

设置为 false 后，弹出框就不会插入到 body 元素下了。

## 全屏插件

```shell
npm i screenfull
```

设置某个元素全屏：

```js
const element = document.getElementById('button');
screenfull.toggle(element);
```
