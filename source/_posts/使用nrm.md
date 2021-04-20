---
title: 使用nrm
tags:
  - nrm
  - 笔记
categories:
  - 后端
  - Node
abbrlink: 55549
date: 2021-04-20 13:59:33
---

## 介绍

nrm 是一个 npm 源管理工具，使用它可以快速切换 npm 源。

## 安装

全局安装

```shell
npm i g nrm --registry=https://registry.npm.taobao.org
```

## 使用

### 查看已安装代理列表

```shell
nrm ls

* npm -------- https://registry.npmjs.org/
  yarn ------- https://registry.yarnpkg.com/
  cnpm ------- http://r.cnpmjs.org/
  taobao ----- https://registry.npm.taobao.org/
  nj --------- https://registry.nodejitsu.com/
  npmMirror -- https://skimdb.npmjs.com/registry/
  edunpm ----- http://registry.enpmjs.org/
```

### 切换代理

```shell
nrm use taobao
```

### 测速

```shell
nrm test npm
```

## .npmrc

然而，设置这些全局代理可能还是不能满足下载一些特定依赖包（在没有 VPN 情况下），比如：`node-sass`、`puppeteer`、`chromedriver`、`electron` 等。可以通过 .npmrc 文件设置具体依赖包的国内镜像。该文件在项目 npm install 时会被加载读取，优先级高于 npm 全局设置。

在需要使用 Yarn 或 NPM 的地方（例如项目根目录）添加一个 `.npmrc` 文件：

```shell
registry=https://registry.npm.taobao.org/
sass_binary_site=http://npm.taobao.org/mirrors/node-sass
chromedriver_cdnurl=http://npm.taobao.org/mirrors/chromedriver
electron_mirror=http://npm.taobao.org/mirrors/electron/ npm install -g electron
puppeteer_download_host=http://npm.taobao.org/mirrors/chromium-browser-snapshots/
```

之后重新使用 NPM 或者 Yarn 安装依赖，基本可以解决问题。
