---
title: BFC的理解与应用
tags:
  - 布局
  - 技巧
categories:
  - 前端
  - CSS
abbrlink: 9722
date: 2018-12-02 23:26:19
---

## 定义

先上MDN上对 BFC 的定义：

> 块格式化上下文（Block Formatting Context，BFC） 是Web页面的可视化CSS渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。

———— [BFC | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

<!-- more -->

不知道别人看完这段定义有何感受，反正我是懵逼的。不过我在这儿还是建议各位认真阅读上面给出的MDN链接至少两遍，这能让你对一个陌生的概念有一个基本的认知。

## 理解

这里谈下我对BFC的理解：BFC其实是一个独立的，与外界隔离了的容器，容器里面的子元素不会影响到外面的元素，外面的也同样不会影响到容器内部的元素。我们可以利用这个特性，来解决一些布局上的问题。

## BFC触发条件

BFC的触发条件有很多，想要知道所有细节可以移步上面给出的 MDN 链接。这里我只列出一些常见触发条件：

- 根元素（HTML元素）
- 浮动元素（float不为none）
- 绝对定位元素（position 为 absolute 或 fixed）
- display 为 block, inline-block, flex, inline-flex, list-item, table
- overflow 值不为 visible 的块元素

## BFC布局特性

对于一个BFC容器来说：

- 内部相邻的两个元素垂直方向上的 margin 会发生重叠
- 不会与外界的浮动元素产生交集，而是紧贴浮动元素的边缘
- 元素从容器的顶端开始垂直地一个接一个地排列
- 每一个元素的左外边缘（margin-left）会触碰到容器的左边缘（border-left）（如果设置了容器内部的元素从右到左的格式排布，则触碰的是右边缘）
- 在计算它的高度时，还会检测内部浮动或者定位元素的高度

## 实际应用

### 清除浮动

利用BFC “在计算它的高度时，还会检测内部浮动或者定位元素的高度” 这条特性，我们可以触发父元素的BFC来清除子元素浮动带来的影响。常见的用法是给父元素设置 `overflow: hidden` 样式（如果考虑IE6版本，还需设置 `zoom: 1`，因为IE6不支持 `overflow: hidden` 来清除浮动）：

<iframe height="265" scrolling="no" title="利用BFC清除浮动" src="https://codepen.io/JingW/embed/BbxEGP/?height=265&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

### 解决外边距合并问题

如果看上面标题不知道在说什么，请很戳[这里](http://www.w3school.com.cn/css/css_margin_collapsing.asp)了解详情。由于属于同一个BFC的两个相邻盒子的垂直margin会发生重叠，那么我们可以隔离开这两个元素，让它们不属于同一个BFC，这样就不会发生margin重叠了。

<iframe height="265" scrolling="no" title="解决外边距合并问题" src="https://codepen.io/JingW/embed/YgLbzY/?height=265&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

### 两栏布局，右边宽度自适应

我们常常在开发中有这样类似的需求：两栏布局，左边定宽，右边自适应。
这时我们就可以利用BFC特性来实现需求：左边设置定宽+左浮动；右边给自己加上 `overflow: hidden` 。
原理就是：给元素设置BFC后，为了和浮动元素不产生任何交集，它会顺着浮动元素的边缘形成自己的封闭上下文。直接上代码看效果：

<iframe height="265" scrolling="no" title="利用BFC实现两栏布局" src="https://codepen.io/JingW/embed/MxGdEe/?height=265&amp;theme-id=0&amp;default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

以上是我对BFC的一些理解以及实际应用，希望能够帮助大家了解BFC这个听起来摸不着头脑的东西。
