---
title: vue项目如何动态配置后端api地址
tags:
  - vue-cli3
  - Vue
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 47242
date: 2020-12-07 13:35:30
---

## 问题描述

后端希望前端能动态配置 API 地址，但前端往往在 `npm run build` 生成 `dist` 后，配置就无法更改了。

<!-- more -->

## 解决方案

利用 `generate-asset-webpack-plugin` 插件，在 build 的时候生成 json 配置文件，然后再使用 axios 异步获取 json 配置，从而达到动态配置 API 的目的。

## 使用步骤

### 安装并引入 generate-asset-webpack-plugin

```shell
npm install generate-asset-webpack-plugin -D
```

> vue.config.js

```js
const GenerateAssetPlugin = require('generate-asset-webpack-plugin');
```

### 定义需要生成的配置内容

> vue.config.js

```js
let createConfig = function (compilation) {
  let cfgJson = {
    server_url: 'http://127.0.0.1'
  };

  return JSON.stringify(cfgJson);
};
```

### 配置

```js
module.exports = {
  configureWebpack: {
    plugins: [
      new GenerateAssetPlugin({
        filename: 'dynamicConfig.json',
        fn: (compilation, cb){
          cb(null, createConfig(compilation))
        }
      })
    ]
  }
}
```

编译后 dist 根目录下就会生成 `dynamicConfig.json` 文件。
