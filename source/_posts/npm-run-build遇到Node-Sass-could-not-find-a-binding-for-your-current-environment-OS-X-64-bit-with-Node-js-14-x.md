---
title: >-
  npm-run-build遇到Node Sass could not find a binding for your current
  environment: OS X 64-bit with Node.js 14.x
tags:
  - 解决方案
  - 笔记
categories:
  - 解决方案
  - Node
abbrlink: 7710
date: 2020-12-02 09:04:30
---

今天 `npm run build-prod` 打包项目的时候遇到如下报错信息：

```shell
Node Sass could not find a binding for your current environment: OS X 64-bit with Node.js
```

百度了一些解决方案都没法解决问题，后来在 Stack Overflow 上看到了一种解决方案，地址：https://stackoverflow.com/questions/64612707/node-sass-does-not-yet-support-your-current-environment-windows-64-bit-with-uns

1. install / downgrade node.js to a stable version (LTS) like [14.15.0](https://nodejs.org/en/download/)
2. install the compatible node-sass version via `npm install node-sass@4.14.0`; you can find the list [here](https://www.npmjs.com/package/node-sass), or even install `gulp-sass`with `npm i gulp-sass --save-dev`.
