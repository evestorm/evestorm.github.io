---
title: mac下HBuilderX 运行到微信小程序node-sass异常
tags:
  - uniapp
categories:
  - 前端
  - 框架
  - uniapp
abbrlink: 23800
date: 2021-04-21 15:22:44
---

使用 cli 方式创建了 uniapp ，由于项目中使用到了 scss ，所以安装了 node-sass 和 sass-loader 。

在 VSCode 通过命令行的方式运行项目，可以编译成功，但在 HBuilderX 中直接编译无法通过，会报错：

```shell
Node Sass could not find a binding for your current environment: OS X 64-bit with Node.js 8.x
```

找了下解决方案，看到如下贴: <https://ask.dcloud.net.cn/question/82024>

解决方案如下：

1. cd /Applications/HBuilderX.app/Contents/HBuilderX/plugins/node
2. mv node node-v8 为的是把 node 执行文件改名为 node-v8
3. 执行 nvm which current 拿到当前环境下 node 路径，类似 `/Users/admin/.nvm/versions/node/v14.15.1/bin/node`
4. 然后复制该路径并在 finder 下 cmd+shifit+g 跳转到该路径
5. 接着 ctrl + v 复制该 node 执行文件到 `/Applications/HBuilderX.app/Contents/HBuilderX/plugins/node/` 文件夹下就好了
