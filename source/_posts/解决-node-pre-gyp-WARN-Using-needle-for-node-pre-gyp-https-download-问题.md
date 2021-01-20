---
title: 解决'node-pre-gyp WARN Using needle for node-pre-gyp https download'问题
tags:
  - npm
  - Node
categories:
  - 前端
  - 构建工具
  - npm
abbrlink: 36648
date: 2021-01-20 15:42:34
---

华为云跑前端流水线发现进度一直卡在：

```shell
node-pre-gyp WARN Using needle for node-pre-gyp https download
```

进行不下去。

<!-- more -->

在本机进行测试：删除项目根目录下 `node_modules` 文件夹重新进行 `npm i ` 安装发现也卡在这儿。但 `CTRL+C` 停止脚本执行后再 `npm i` 就不会卡主了，而且 `npm run dev` 执行脚本也能正常启动项目。如果你只是在本地安装，这也算是一个解决办法。

然而华为云流水线无法 `CTRL+C` 停止后在 `npm i` ，所以上述办法行不通。还是老老实实 google 下吧，然而搜了很多方案都没法解决此问题，最后在一个 github issue 中找到了解决方案：

https://github.com/mapbox/node-pre-gyp/issues/526

也就是用 `npm i --canvas_binary_host_mirror=https://npm.taobao.org/mirrors/node-canvas-prebuilt/` 替换 `npm i` 来执行。
