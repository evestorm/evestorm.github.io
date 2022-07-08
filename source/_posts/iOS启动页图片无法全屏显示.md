---
title: iOS启动页图片无法全屏显示
tags:
  - iOS
  - Xcode
categories:
  - 移动端
  - iOS
abbrlink: 58404
date: 2020-08-04 23:17:26
---

在 Xcode 中设置启动页图片发现上下 Safe Area 区域图片没能填满：

{% asset_img safearea.png 安全区域未填满 %}

<!-- more -->

## 解决方法

设置相应约束的 FirstItem ，改 `Safe Area` 为 `SuperView` ：

{% asset_img safearea2superview.png 安全区域未填满 %}

## 完成

{% asset_img superview.png 安全区域未填满 %}
