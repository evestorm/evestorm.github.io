---
title: >-
  真机调试或打包时There are no devices registered in your account on the developer
  website
tags:
  - iOS
categories:
  - 移动端
  - iOS
abbrlink: 32648
date: 2020-07-14 19:38:04
---

真机测试打包的时候 Xcode 运行报错：

> There are no devices registered in your account on the developer website. Plug in and select a device to have Xcode register it

<!-- more -->

{% asset_img signing.png signing %}

原因：

1. 真机调试时：一般是首次调试，左上角没有选择真机 iPhone
2. 打包时：苹果要求我们打包上架之前至少要在开发者网站注册一台真机，大多数人都不会遇到这种情况，因为在上架前我们肯定会真机调试一下，在调试的时候 Xcode 就自动帮我们注册了。

但也有少数人从没在真机上调试过就直接打包的。
（把错误直译过来就是：我们没有在开发者账号（Apple ID）上注册 iOS 设备（真机）他让我们把 iOS 设备连上电脑，选择一个设备让 Xcode 自动帮我们注册一下。）

解决方法：

连上 iPhone，在 Xcode 左上角选择刚连上的真机 iPhone（而不是模拟器），然后运行一下，Xcode 就自动帮我们注册了这台 iPhone 了。
