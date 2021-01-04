---
title: vue-cli中sass全局变量配置
tags:
  - 技巧
  - vue-cli3
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 36073
date: 2020-12-30 10:04:47
---

## 问题描述

最近使用 [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) 想添加全局变量 `src/styles/variables.scss` 中的值。然而发现不能直接在组件中使用。

<!-- more -->

例如 `variables.scss` 中定义背景色：

```css
$bgColor: #041a33; // 背景色
```

在组件中使用：

```html
<style lang="scss" scoped>
  .app-main {
    ...
    background: $bgColor;
  }
  ...
</style>
```

发现报错如下：

```shell
SassError: Undefined variable.
    ╷
198 │     background: $bgColor;
```

解决方案是使用 @import 来手动引入 `variables.scss` ：

```css
@import '~@/styles/variables.scss';
```

虽然不报错了，但是总感觉太麻烦，如果我想在其他组件中使用变量，难道每个组件都得引入一次么？所以 Google 了个新方案。

## 解决方案

### 安装 sass 依赖包

```shell
npm install sass-resources-loader --save-dev
```

### vue.config.js 配置

```js
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 旧版 在 sass-loader v7 中，选项名使用data
        data: `@import "~@/assets/scss/variables.scss";`
        // 新版sass-loader，选项名使用prepend
        prependData: `@import "~@/assets/scss/variables.scss";`
      }
    }
  }
};
```

### 注意事项

1. 本配置适用于.scss .sass 文件(`<style lang="scss"></style>`)
2. 默认情况下 sass 选项会同时对 sass 和 scss 语法同时生效，因为 scss 语法在内部也是由 sass-loader 处理的。但是在配置 data 或 prepend 选项的时候.scss 语法要求以分号结尾，.sass 语法要求必须没有分号。
