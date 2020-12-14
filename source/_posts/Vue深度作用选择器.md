---
title: Vue深度作用选择器
tags:
  - scss
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 5691
date: 2020-12-08 10:01:06
---

之前写 uni-app 在修改三方深层样式时，会使用 `/deep/` ，例如：

```css
.container /deep/ .el-input__inner {
}
```

但在我的 Vue 项目中却报错，使用 `::v-deep` 则可以：

```css
.container ::v-deep .el-input__inner {
}
```

## 文档

[Deep Selectors](https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors)
