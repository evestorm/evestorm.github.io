---
title: transform转换（一）
tags:
  - CSS3
categories:
  - 前端
  - CSS
abbrlink: 45420
date: 2019-04-09 20:06:05
---

## 介绍

> Transform 属性应用于元素的 2D 或 3D 转换。这个属性允许你将元素旋转，缩放，移动，倾斜等。

———— 出自 [菜鸟教程](http://www.runoob.com/cssref/css3-pr-transform.html)

这次我们讨论的都是 2D 转换，3D 的后面我会单独出一篇~

<!-- more -->

## scale 缩放

这个属性用来放大或缩小元素的大小。语法示例如下：

```css
div {
  transition: transform 1s; /* 给div的transform属性添加过渡效果 */
}
div:hover {
  transform: scale(1.5); /* 让元素放大为原始大小的1.5倍 */
}
```

<iframe height="491" scrolling="no" title="transform scale" src="https://codepen.io/JingW/embed/eoBPYP/?height=491&amp;theme-id=0&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

## translate 位移

该属性用来让元素向上/向下/向左/向右进行位移。

示例：

```css
div {
  transition: transform 1s;
}
div:hover {
  transform: translate(20px, 20px);
}
```

<iframe height="569" scrolling="no" title="LvbqKb" src="https://codepen.io/JingW/embed/LvbqKb/?height=569&amp;theme-id=0&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

## rotate 旋转

该属性让元素能够顺时针或逆时针旋转指定的度数。

示例：

```css
div {
  transition: transform 1s;
}
div:hover {
  transform: rotate(720deg); /* 元素顺时针旋转720度 */
}
```

<iframe height="265" scrolling="no" title="transform rotate" src="https://codepen.io/JingW/embed/BEQELy/?height=265&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

## skew 倾斜

该属性能够让元素基于 x, y 轴倾斜转换

示例：

```css
div {
  transition: transform 1s;
}
div:hover {
  transform: skew(45deg, 45deg);
  /* transform: skewX(25deg);
    transform: skewY(10deg); */
}
```

<iframe height="265" scrolling="no" title="transform skew" src="https://codepen.io/JingW/embed/YMpMQM/?height=265&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

**注意：** 如果仔细观察上面的示例，当鼠标移入 box 后，不但整个 box 进行了倾斜，里面的子元素和文本内容也会发生倾斜。如果不希望里面的内容发生变化，可以使用相反的 skew 值将其恢复：

<iframe height="265" scrolling="no" title="transform skew2" src="https://codepen.io/JingW/embed/bJBJQg/?height=265&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

## transform-origin 变形原点

该属性可以配合 `transform` 属性一起使用，它允许我们指定元素转换的位置原点。默认情况原点位于元素的中心。

例如刚刚上面在讲到 rotate 属性时，我们的旋转是以中心为原点的。但你在某些情况下可能并不想让元素围绕中心旋转，而是左上角旋转，就可以用到该属性。

语法示例：

```css
div {
  transform-origin: left top;
  transition: transform 1s;
}
div:hover {
  transform: rotate(720deg);
}
```

<iframe height="483" scrolling="no" title="transform transform-origin" src="https://codepen.io/JingW/embed/qwqGxO/?height=483&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

## 变换组合

有时候我们可能想要一个元素既旋转又位移，那么我们就可以使用 transform 的简写语法：

```css
div {
  transition: transform 1s;
}
div:hover {
  transform: rotate(90deg) scale(1.5);
}
```

<iframe height="265" scrolling="no" title="ZZBNmN" src="https://codepen.io/JingW/embed/ZZBNmN/?height=265&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>
