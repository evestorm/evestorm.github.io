---
title: animation动画（二）
tags:
  - CSS3
categories:
  - 前端
  - CSS
abbrlink: 20298
date: 2019-03-09 10:18:06
---

## 传送门

- [animation动画（一）](https://evestorm.github.io/posts/31280/)
- [animation动画（二）](https://evestorm.github.io/posts/20298/)

<!-- more -->

老规矩，二系列来谈谈具体每个动画属性的含义和用法，算是一个对知识点的总结吧。

## animation-name 动画名称

CSS语法：`animation-name: shrink`

用来设置元素的动画名称。

## animation-duration 持续时间

CSS语法：`animation-duration: 1s`

用来指定动画在一个周期内所花费的时间。

## animation-timing-function 运动曲线

CSS语法：`animation-timing-function: ease-in-out`

用来设置元素的动画速度曲线，它的用法和 [transition-timing-function](https://evestorm.github.io/posts/13167/#transition-timing-function-效果曲线) 类似，想要了解详情的直接点这个链接吧。

> DEMO

<iframe height="521" scrolling="no" title="animation-timing-function" src="https://codepen.io/JingW/embed/qwbVgB/?height=521&amp;theme-id=0&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

## animation-delay 动画延迟

CSS语法：`animation-delay: 1s`

用来设置动画延迟多少秒/毫秒后才开始执行。正值（例如2s）将在2s后启动动画；负值（例如-2s）将立即执行动画，但是动画会从它的动画序列中的第2s位置处立即开始。

## animation-iteration-count 循环次数

CSS语法：`animation-iteration-count: 1s`

用来设置动画循环的次数，默认值是1，表示动画只播放一次。除了使用正整数来设置次数外，还可以将值设置为 `infinite` ，表示无限循环。

## animation-direction 是否反向

CSS语法：`animation-direction: normal | reverse | alternate | alternate-reverse`

用来设置动画在循环过程中是否反向运动，默认值为 `normal` ，即正常模式，动画会从第一帧播放到最后一帧；`reverse` 表示反向模式，动画会从最后一帧倒着播放到第一帧；`alternate` 设置动画先正向播放，第二次再从反向播放，交替进行，例如 animation 系列一中的案例；`alternate-reverse` 则是先让动画反向播放，第二次再正向播放，交替进行。

## animation-fill-mode 动画填充模式

CSS语法：`animation-fill-mode: none | forwards | backwards | both`

用来指定在动画执行之前和之后如何给动画的目标应用样式。这个属性在我第一次接触时没太理解，直到我看了 [segmentfault](https://segmentfault.com/) 上的 [这篇文章](https://segmentfault.com/q/1010000003867335) 。

在理解它之前，我们需要在脑海里有个概念，那就是一个动画是分为初始状态、等待期、动画执行期、完成期四个阶段的。而上面 animation-fill-mode 接收的四个值则分别对应：

- none 表示 等待期和完成期，元素样式都为初始状态样式，不受动画定义（@keyframes）的影响
- forwards 表示等待期保持初始样式，完成期间保持最后一帧样式
- backwards 表示等待期为第一帧样式，完成期跳转为初始样式
- both 表示 等待期样式为第一帧样式，完成期保持最后一帧样式

单纯的文字不直观？相信下面的这个demo能让你豁然开朗：

<iframe height="435" scrolling="no" title="animation-fill-mode" src="https://codepen.io/JingW/embed/qwNLJE/?height=435&amp;theme-id=0&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

## animation-play-state 动画播放状态

CSS语法：`animation-play-state: running | paused`

用来设置动画的播放或者暂停。比如希望在鼠标经过的时候，让动画先停止下来，鼠标移开之后再继续播放，就可以通过设置 `.element:hover { animation-play-state: paused; }` 来实现。下面是一个案例，在鼠标移入时钟后指针暂停旋转；移出后时钟继续旋转。

<iframe height="339" scrolling="no" title="animation-play-state闹钟示例" src="https://codepen.io/JingW/embed/rbMWjB/?height=339&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>
