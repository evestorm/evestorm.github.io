---
title: animation动画（一）
tags:
  - CSS3
categories:
  - 前端
  - CSS
abbrlink: 57136
date: 2019-03-05 09:47:28
---

## 传送门

- [animation动画（一）](https://evestorm.github.io/posts/31280/)
- [animation动画（二）](https://evestorm.github.io/posts/20298/)

## 介绍

> CSS Animations 是CSS的一个模块，它定义了如何用关键帧来随时间推移对CSS属性的值进行动画处理。关键帧动画的行为可以通过指定它们的持续时间，它们的重复次数以及它们如何重复来控制。

———— 出自 [CSS Animations | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations)

<!-- more -->

## 语法

```css
/* 简写 */
animation: 动画名称，一个周期所花费的时间，运动曲线（默认ease），
           动画延迟（默认0），播放次数（默认1），
           是否反向播放动画（默认normal），是否暂停动画（默认running）
```

就像在介绍中写到的那样，整个 animations 是个模块，包含很多属性来定义动画，比方说 `animation-name` 、`animation-duration` 和 `animation-delay` 等等。但本着快速上手的目的，第一篇文章主要围绕 `animation` 这个简写属性来讲，因为用它最直观，而且就经验来讲，日常使用最多的也是这个属性。

## 如何使用

一个CSS3动画由两个基本项组成：

1. 关键帧（Keyforames） - 用来定义动画的阶段和样式。
2. 动画属性 - 分配关键帧（@keyframes）到一个特定的css元素，来定义它的动画方式。

我们围绕这两项讨论，并在这个过程中实现一个按钮不断放大缩小的动画效果：

{% asset_img shrink.gif shrink %}

### keyframes

关键帧 keyframes 定义了动画在每个阶段的动画效果。它包括：

- 动画名称：定义动画的名称
- 动画阶段：整个动画阶段用百分比来表示。0% 表示动画的开始状态。100% 表示动画的结束状态。可以在其间添加多个中间状态，比如 20%，60%…
- 动画属性：给动画每个阶段定义的CSS属性

现在我们来编写一段 @keyframes 。动画名称命名为 `shrink` 。它只有简单的两个阶段：

- 第一阶段（0%）：元素的缩放比例为 1:1
- 第二阶段（100%）：元素的缩放比例为 1:0.8

```css
@keyframes shrink {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    -webkit-transform: scale(0.8);
    transform: scale(0.8);
  }
}
```

### 动画属性

接着，我们给要设置动画的元素添加上动画属性。要使动画生效，我们至少要添加以下两个动画属性：

- animation-name: 动画的名称，在 @keyframes 中定义。
- animation-duration: 动画的持续时间，以秒为单位（例如 5s）或毫秒（例如 200ms）。

```css
button {
  /*  其他样式  */
  ...
  /*  动画名称: shrink  */
  animation-name: shrink;
  /*  动画持续时间: 0.5秒 */
  animation-duration: .5s;
}
```

这样我们就实现页面加载后，一个按钮从开始的原始大小，经过0.5s后变成了原始大小的0.8的动画效果。然而我们希望最终的效果是一个按钮的不断放大和缩小，交替进行。这就得添加 `animation-iteration-count` 和 `animation-direction` 两个动画属性了，它们一个用来定义元素动画的循环次数，一个用来定义动画在循环过程中是否反向运动：

```css
button {
  ...
  /*  动画的循环次数: 无限次  */
  animation-iteration-count: infinite;
  /*  循环是否反向：先正向后反向  */
  animation-direction: alternate;
}
```

最终的简写形式如下：

```css
button {
  ...
  animation: shrink .5s linear alternate infinite;
}
```

完整效果：

<iframe height="265" scrolling="no" title="animation-shrink" src="https://codepen.io/JingW/embed/MRaJrz/?height=265&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

## 资源 📚

- animation | 一个CSS3动画库

  【推荐】

  - [点我查看效果](https://daneden.github.io/animate.css/)

- magic | 另一个CSS3动画库

  - [点我查看效果](https://www.minimamente.com/example/magic_animations/)
