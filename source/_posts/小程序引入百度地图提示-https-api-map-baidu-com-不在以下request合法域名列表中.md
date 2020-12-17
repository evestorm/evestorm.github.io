---
title: 小程序引入百度地图提示"https//api.map.baidu.com"不在以下request合法域名列表中
date: 2020-03-22 13:34:34
tags:
- 小程序
-uniapp
categories:
- 前端
- 移动端
- 小程序
---

## 问题描述

小程序中使用到了「百度地图 API 定位」来获得当前位置。但微信开发者工具的控制台提示了如标题所示的警告说明。

<!-- more -->

## 解决方案

登录微信公众平台－> “设置” －> “开发设置” －> “request 合法域名” －>添加 `api.map.baidu.com` －> 点击”保存并提交”：

{% asset_img js-requestAK-2.PNG 添加`api.map.baidu.com` %}

打开开发者工具 －> “项目” －> 点击”刷新”，合法域名设置同步完成。如图所示：

{% asset_img js-requestAK-legal.PNG 刷新 %}

## 参考文档

- [Hello 我的小程序 - 百度地图开放平台](https://lbs.baidu.com/index.php?title=wxjsapi/guide/helloworld)
