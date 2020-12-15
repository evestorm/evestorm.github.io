---
title: node14+版本下hexo部署失败
tags:
  - Node
categories:
  - 教程
  - 博客
abbrlink: 430
date: 2020-06-08 00:03:50
---

最近升级了 node14，发现在用 hexo 写博客部署时失败了，报错大致如下：

```shell
FATAL Something's wrong. Maybe you can find the solution here: https://hexo.io/docs/troubleshooting.html
TypeError [ERR_INVALID_ARG_TYPE]: The "mode" argument must be integer. Received an instance of Object
    at copyFile (fs.js:1890:10)
    at tryCatcher (C:\Users\Administrator\blog\node_modules\bluebird\js\release\util.js:16:23)
    at ret (eval at makeNodePromisifiedEval (C:\Users\Administrator\blog\node_modules\bluebird\js\release\promisify.js:184:12), <anonymous>:13:39)
    at C:\Users\Administrator\blog\node_modules\hexo-deployer-git\node_modules\hexo-fs\lib\fs.js:144:39
    at tryCatcher (C:\Users\Administrator\blog\node_modules\bluebird\js\release\util.js:16:23)
    at Promise._settlePromiseFromHandler (C:\Users\Administrator\blog\node_modules\bluebird\js\release\promise.js:517:31)
    at Promise._settlePromise (C:\Users\Administrator\blog\node_modules\bluebird\js\release\promise.js:574:18)
    at Promise._settlePromise0 (C:\Users\Administrator\blog\node_modules\bluebird\js\release\promise.js:619:10)
    at Promise._settlePromises (C:\Users\Administrator\blog\node_modules\bluebird\js\release\promise.js:699:18)
    at Promise._fulfill (C:\Users\Administrator\blog\node_modules\bluebird\js\release\promise.js:643:18)
    at Promise._resolveCallback (C:\Users\Administrator\blog\node_modules\bluebird\js\release\promise.js:437:57)
    at Promise._settlePromiseFromHandler (C:\Users\Administrator\blog\node_modules\bluebird\js\release\promise.js:529:17)
    at Promise._settlePromise (C:\Users\Administrator\blog\node_modules\bluebird\js\release\promise.js:574:18)
    at Promise._settlePromise0 (C:\Users\Administrator\blog\node_modules\bluebird\js\release\promise.js:619:10)
    at Promise._settlePromises (C:\Users\Administrator\blog\node_modules\bluebird\js\release\promise.js:699:18)
    at Promise._fulfill (C:\Users\Administrator\blog\node_modules\bluebird\js\release\promise.js:643:18)
```

google 了下发现是 hexo 不支持最新 node14+，issue[见此](https://github.com/hexojs/hexo/issues/4263)，解决方案两种：降低 node 版本或者升级最新[hexo@4.2.1](mailto:hexo@4.2.1)+。

我尝试了升级 hexo 到 4.2.1 发现并没有什么卵用，照样报相同的错，所以选择了降低 node 版本到稳定版：

直接到官网下载最新稳定版：https://nodejs.org/en/download/

然后重新执行 `hexo clean && hexo deploy` 打包命令就好了。

P.S. 如果打包成功后，最好验证下 hexo 下的分类和标签是否正常工作，我就遇到了点击自己博客首页的「分类」和「标签」后，跳转的页面报 404，原因是打开的路由最后多了个空格：`./categories/%20` 。不知道啥原因，所以我把 hexo 版本退回到了 3.8.0。这样路由就正确了。
