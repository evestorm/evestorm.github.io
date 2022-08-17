---
title: Vuetify自定义scss文件全局覆盖sass变量
tags:
  - 笔记
  - 解决方案
categories:
  - 前端
  - UI
  - VuetifyJS
abbrlink: 49246
date: 2022-08-02 11:03:48
---

## 问题描述

VuetifyJS 提供了全局覆盖 `SASS variables` 的方案，详情见 [官方文档](https://vuetifyjs.com/en/features/sass-variables/)，但我希望自定义用来覆盖样式的文件名以及文件路径（官方的覆盖方案得按照它的文件和路径要求）

<!-- more -->

## 解决方案

在你想要的文件夹下创建全局 scss 文件，比如我的就是 `src/assets/common.scss` ：

```scss
$btn-text-transform: none;
```

然后在 `vue.config.js` 中配置：

```js
module.exports = {
  transpileDependencies: ["vuetify"],
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/assets/common.scss"',
      },
      scss: {
        additionalData: '@import "@/assets/common.scss";',
      },
    },
  },
};
```

## 相关知识点

默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
因为 `scss` 语法在内部也是由 sass-loader 处理的
但是在配置 `data` 选项的时候
`scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
所以才需要有上边 `vue.config.js` 中的两个配置

## 参考资源

- [Vue – Mixing SASS with SCSS, with Vuetify as an Example](https://joshuatz.com/posts/2019/vue-mixing-sass-with-scss-with-vuetify-as-an-example/)
- [在vue各个组件中应用全局scss变量](https://segmentfault.com/a/1190000038969536)