---
title: 如何对scss变量做cacl计算
tags:
  - 技巧
categories:
  - 前端
  - CSS
  - SCSS
abbrlink: 1852
date: 2021-01-15 11:32:43
---

写页面时需要对一个 scss 变量做 css 的 calc 处理，发现直接使用变量浏览器无法识别，Google 后发现要对变量处理才能正常使用：

<!-- more -->

假定定义卡片变量 `$cardWidth: 450px`，如果要使用 `calc`，直接 `width: calc($cardWidth * 2);` 这么用是不行的，需要按如下使用方法：

```css
width: calc(#{$cardWidth} * 2);
```
