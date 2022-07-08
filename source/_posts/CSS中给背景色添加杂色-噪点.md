---
title: CSS中给背景色添加杂色(噪点)
tags:
  - CSS
  - 技巧
categories:
  - 前端
  - CSS
abbrlink: 11378
date: 2021-07-16 17:43:59
---

很简单，一句话：

<!-- more -->

```css
background: linear-gradient(
    to right,
    rgba(26, 102, 223, 0.8),
    rgba(77, 140, 228, 0.8)
  ), url(https://i.imgur.com/0Ac5PXg.png);
```

拆开写：

```css
background-color: linear-gradient(
  to right,
  rgba(26, 102, 223, 0.8),
  rgba(77, 140, 228, 0.8)
);
background-image: url(https://i.imgur.com/0Ac5PXg.png);
```

## 参考来源

<https://codepen.io/thebabydino/pen/xbJpbV>
