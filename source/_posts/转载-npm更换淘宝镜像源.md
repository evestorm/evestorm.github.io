---
title: 转载-npm更换淘宝镜像源
tags:
  - 转载
  - npm
categories:
  - 前端
  - 构建工具
  - npm
abbrlink: 49607
date: 2020-07-29 21:09:18
---

转载自：https://blog.csdn.net/u012780176/article/details/82586358

<!-- more -->

打开终端：

```shell
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

官方源：

默认源

```shell
npm config set registry https://registry.npmjs.org
```

换源：

```shell
npm config set registry https://registry.npm.taobao.org
```

配置后通过以下方法验证是否成功:

```shell
npm config get registry
```
