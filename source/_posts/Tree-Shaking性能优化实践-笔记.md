---
title: Tree-Shaking性能优化实践(笔记)
tags:
  - Webpack
categories:
  - 前端
  - 构建工具
  - Webpack
abbrlink: 64509
date: 2019-10-21 20:27:32
---

## 何为 Tree-Shaking

> **Tree shaking** 是一个通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code) 行为的术语。
>
> 它依赖于 ES2015 中的 [import](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import) 和 [export](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export) 语句，用来检测代码模块是否被导出、导入，且被 JavaScript 文件使用。
>
> 在现代 JavaScript 应用程序中，我们使用模块打包(如[webpack](https://webpack.js.org/)或[Rollup](https://github.com/rollup/rollup))将多个 JavaScript 文件打包为单个文件时自动删除未引用的代码。这对于准备预备发布代码的工作非常重要，这样可以使最终文件具有简洁的结构和最小化大小。

——> 来自 [MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/Tree_shaking)

<!-- more -->

## Tree-Shaking 性能优化实践 - 原理篇

链接：[掘金 - 百度外卖大前端技术团队](https://juejin.im/post/5a4dc842518825698e7279a9)

## 摇树优化实战

链接：[webpack4.29.x 成神之路（十三） 摇树优化(tree shaking)](https://segmentfault.com/a/1190000019220154)
