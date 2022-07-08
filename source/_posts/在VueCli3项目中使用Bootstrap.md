---
title: 在VueCli3项目中使用Bootstrap
tags:
  - Vue
  - Bootstrap
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 53837
date: 2020-08-14 13:07:56
---

## 安装

```shell
npm i bootstrap jquery popper.js --save
```

<!-- more -->

## 配置

在项目根目录下新建或修改`vue.config.js`

```js
const webpack = require('webpack');
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default']
      })
    ]
  }
};
```

## 引入

在`main.js`中引入

```js
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'jquery';
```

## 使用

在组件模板中，可以像常规开发那样使用 bootstrap

```html
<template>
  <div class="container">
    <div class="row mt-0 mt-md-2">
      <div class="col-12 col-lg-9 px-0"></div>
      <div class="Right d-none d-lg-block col-lg-3  pl-2 p-0"></div>
    </div>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped></style>
```
