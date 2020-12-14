---
title: CSS百分比实现高度自适应
tags:
  - 技巧
  - 布局
categories:
  - 前端
  - CSS
abbrlink: 40550
date: 2020-03-09 13:32:41
---

## 基本知识点

当 `padding/margin` 取形式为百分比的值时，无论是 `left/right`，还是 `top/bottom` ，都是以父元素的 `width` 为参照物。

{% asset_img margin-top.png margin-top %}

<!-- more -->

## 1. 给容器设置 padding-top/bottom

`padding-top/bottom` 的百分比值，是依赖父容器宽度的，所以给子元素设置一个与父元素高度相同百分值的 `padding-top` 即可实现。

```css
div {
  border: 1px solid red;
  background: green;
  width: 50%; /*父元素宽度一半*/
  padding-top: 50%; /*与width一样，为父元素宽度一半*/
}
```

此方案浏览器兼容性很不错，唯一的缺陷是无法给容器设置 `max-height` 属性了，因为 `max-height` 只能限制内容高度，而不能限制 `padding` ，为了解决这个问题我们可以选择下面这个办法。

## 2. 给子元素/伪元素设置 margin/padding 撑开容器

从上面的方案的盒模型看出 max-height 失效的原因是容器的高度本来就是 padding 撑的，而内容高度为 0，max-height 无法起作用。那想要优化这一点，唯一的方法就是利用内容高度来撑开而非 padding，这个方案跟消除浮动所用的方案非常相似：给容器添加一个子元素/伪元素，并把子元素/伪元素的 pading/margin 设为 100%，使其实际高度相当于容器的宽度，如此一来，便能把容器的高度撑至与宽度达成我们预想的宽高比(1:1)了。由于添加子元素与 HTML 语义化相悖，因此更推荐使用伪元素:after 来实现此方案。

```css
div {
  border: 1px solid red;
  background: green;
  width: 50%; /*父元素宽度一半*/
}

div::after {
  content: '';
  display: block;
  margin-top: 100%;
}
```

使用该方法可能需考虑 `margin` 折叠的问题，可在父元素上加 `overflow:hidden` 触发 BFC 解决。

转载自：https://www.jianshu.com/p/25e7d0793bf0
