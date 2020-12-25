---
title: 监听某个元素的宽度变化-ResizeObserver
tags:
  - 技巧
  - DOM
categories:
  - 前端
  - JS
  - DOM
abbrlink: 30804
date: 2020-12-24 16:02:09
---

### 问题描述

项目中需要监听某个特定元素的宽度变化。

### 解决方案

[MDN-ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver)

<!-- more -->

> **`ResizeObserver`** 接口可以监听到 [`Element`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 的内容区域或 [`SVGElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/SVGElement)的边界框改变。内容区域则需要减去内边距 padding。（有关内容区域、内边距资料见[盒子模型](https://developer.mozilla.org/docs/Learn/CSS/Introduction_to_CSS/Box_model) ）
>
> ResizeObserver 避免了在自身回调中调整大小，从而触发的无限回调和循环依赖。它仅通过在后续帧中处理 DOM 中更深层次的元素来实现这一点。如果（浏览器）遵循规范，只会在绘制前或布局后触发调用。

```js
const ro = new ResizeObserver(entries => {
  for (const entry of entries) {
    const cr = entry.contentRect;
    // console.log('Element:', entry.target)
    // console.log(`Element size: ${cr.width}px x ${cr.height}px`)
    // console.log(`Element padding: ${cr.top}px ; ${cr.left}px`)
  }
});
ro.observe(document.querySelector('target-element'));
```
