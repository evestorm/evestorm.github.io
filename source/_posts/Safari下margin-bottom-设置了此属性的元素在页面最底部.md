---
title: Safari下margin-bottom(设置了此属性的元素在页面最底部)
tags:
  - CSS
  - Safari
categories:
  - 前端
  - CSS
abbrlink: 32093
date: 2020-07-16 00:13:14
---

## 问题复现

Safari 下页面最底部元素的 margin-bottom 失效：

<iframe height="265" scrolling="no" title="Margin not working only in Safari (element is at the bottom of the page)" src="https://codepen.io/JingW/embed/QWyZjgV?height=265&amp;theme-id=light&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

{% asset_img chrome_safari.png chrome_safari %}

## 解决方案

底部添加一个透明颜色的 div 撑起高度:

> HTML

```html
<div id="tr-footer"></div>
```

> css

```css
#tr-footer {
  height: ?px;
  width: 100%;
  background: transparent;
}
```
