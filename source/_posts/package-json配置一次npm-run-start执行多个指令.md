---
title: package.json配置一次npm run start执行多个指令
tags:
  - npm
  - 技巧
categories:
  - 前端
  - 构建工具
  - npm
abbrlink: 7128
date: 2021-03-15 16:06:13
---

## 问题

前端项目设置了 express 编写的 mock 数据，每次启动项目得执行两个命令，一个用来开启 vue 客户端，一个用来开启 express 服务端。感觉每次输入两次命令太过麻烦。

<!-- more -->

## 解决

google 了下发现有个模块可以帮助我们实现一次指令执行多个命令：`concurrently`。

## 安装

全局安装：

```shell
npm i -g concurrently
```

或者项目安装：

```shell
npm i concurrently -D
```

然后更改 `package.json`：

> 旧

```json
"mock":"vue-cli-service serve --mode mock",
"nodemon": "nodemon server/index.js",
```

> 新

```json
"mock": "concurrently \"vue-cli-service serve --mode mock\" \"nodemon server/index.js\"",
```

## 更多

其实不安装 `concurrently` 也能实现执行多个命令，那就是：

```json
"all": "node server/server.js && npm run start"
```

这种方案。

不同的是 concurrently 是并联的，&& 是串联的。

在速度上，第一个方法远比第二个方法要快。
