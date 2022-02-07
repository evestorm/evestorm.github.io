---
title: 自定义checkbox
tags:
  - 技巧
categories:
  - 前端
  - CSS
abbrlink: 14594
date: 2021-10-17 15:02:00
---

1. `input:checkbox` 配合 `label`
2. 外层用 `div` 容器包裹
3. input 改 `display: none` ，label 改 `display: block` 并 `opacity: 0`
4. 当选中 label 时，input 会把状态改为 `checked`
5. 最后再利用 `:checked` 伪类选择器 和 `input:checked + label` 相邻兄弟选择器设置 label 的 `opacity: 1`

<iframe height="564" style="width: 100%;" scrolling="no" title="自定义checkbox" src="https://codepen.io/JingW/embed/jOaVROz?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/JingW/pen/jOaVROz">
  自定义checkbox</a> by JingW (<a href="https://codepen.io/JingW">@JingW</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>