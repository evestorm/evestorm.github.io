---
title: CSS颜色反转
tags:
  - 技巧
categories:
  - 前端
  - CSS
abbrlink: 29097
date: 2023-02-06 21:48:24
---

最近写 Chrome 插件，需要实现一个简单的暗黑风。网上搜了搜发现 [CSS Filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter) 可以满足我的要求。

<!-- more -->

具体落实到代码，`invert` 的值是个百分数，100%就是完全反转颜色，0%就是正常显示:

```css
.normal {
 filter: invert(0%);
}

.inverted {
 filter: invert(100%);
}
```
