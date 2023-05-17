---
title: 翻译-理解CSS的clip-path
tags:
  - SVG
categories:
  - 前端
  - CSS
abbrlink: 39376
date: 2023-05-16 14:32:03
---

原文链接：<https://ishadeed.com/article/clip-path/>

以前当我第一次学习 CSS `clip-path` 时，我花了比预计更多的时间，并且也很难记住它。我不知道确切的原因，可能是因为我没有经常使用它吧? 不管怎样，我会和你一起重新学习它。

<!-- more -->

在本文中，我旨在为您提供有关 `clip-path` 的详细工作原理、何时使用它以及如何在您的Web开发项目中使用它的清晰解释。您准备好了吗？让我们开始吧。

## 介绍

`clip-path` 属性创造一个剪切区域，内容在该区域是可见的，而该区域之外是隐藏。以下例子演示一个圆形剪切区域。

```css
.card {
  background-color: #77cce9;
  clip-path: circle(80px at 50% 50%);
}
```

{% asset_img circle.png circle %}

应用clip-path后，可见区域仅为蓝色圆形。圆形外的任何内容都是不可见的。以下是一个动画，展示了前一个示例中圆形的剪辑效果。

{% asset_img circle.gif 动画展示 %}

## 直角坐标系

在深入了解 `clip-path` 的细节前，值得提下直角坐标系的运作。原点是左上角，x轴向右，y轴向下。

{% asset_img coordinate-system.png coordinate-system %}

有了这个理解，让我们来看一个简单的示例，以了解如何裁剪元素。在这个示例中，需要裁剪的区域是一个大小为 `100px` 的圆，其圆心位于 `0,0`（左上角）。

{% asset_img circle2.png circle2 %}

请注意，用户只能看到高亮区域（深蓝色）。圆的其余部分被**裁剪**了。问题是，我们如何才能让整个圆可见呢？好的，我们需要改变x轴和y轴的位置。

{% asset_img circle3.png circle3 %}

圆的中心位置距离左侧 `100px`，距离顶部 `100px`。现在你已经了解了坐标系统是如何工作的，接下来我会解释 `clip-path` 属性可能的取值。

## Clip-Path 的值

### Inset

`inset` 值定义一个嵌入的长方形。我们可以控制四个边，就像我们处理 `margin` 或 `padding`。以下例子演示一个区域的 `inset` 的边 (上下左右) 都是 `20px` 。

{% asset_img inset.png inset %}

如果你需要微调边缘的插入量，可以这样做。这是另一个示例：

```css
.card {
  clip-path: inset(20px 20px 50px 20px);
}
```

该元素距离底部边距 `50px` 。

问题是，我们是否可以有圆形内边距？ 是的！这是可能的，感谢 `round` 关键字。附加 `round <border-radius>` 关键字可以使角落变成圆角。

```css
.card {
  clip-path: inset(20px 20px 50px round 15px);
}
```

{% asset_img inset-radius.png inset-radius %}

不仅如此，我们还可以单独调整每个边的半径。下面是一个示例，其中顶部右侧和底部左侧角落的半径为零。

```css
.card {
  clip-path: inset(20px 20px 50px round 15px 0);
}
```

{% asset_img inset-radius2.png inset-radius2 %}

### Circle

要使用 `circle()` 值，我们需要它的半径和位置。下面是一个示例：

```css
.card {
  clip-path: circle(80px at 50% 50%);
}
```

圆的半径是 `80px`，它的位置是距 `x` 和 `y` 轴 `50%` 。

### Ellipse

利用 `ellipse()`，我们可以设定寛度和高度来创造一个椭圆形。

```css
.card {
  clip-path: ellipse(100px 80px at center);
}
```

{% asset_img ellipse-1.png ellipse-1 %}

### Polygon

对我来说，`polygon()` 是最有趣的。我们可以有能力去控制多个不同的x和y轴的值。

```css
.card {
  clip-path: polygon(5% 5%, 95% 5%, 95% 95%, 5% 95%);
}
```

{% asset_img polygon-1.png polygon-1 %}

我们可以用 `polygon` 设定多个点的值，画复杂的形状。

### Path

`path()` 值允许我们使用 `SVG` 路径来裁剪特定区域。目前，浏览器支持不一致。为了使它在不同的浏览器中正常工作，我们需要使用内联 `SVG` ，然后将 `url()` 用作 `clip-path` 的值。

```html
<svg class="svg">
  <clipPath id="triangle" clipPathUnits="objectBoundingBox">
    <path d="M0.05,0.05 h1 v1"></path>
  </clipPath>
</svg>
```

在 CSS 中，我们需要把 path 值（通常是id）传入 `url()` 中。

```css
.card {
  clip-path: url("#triangle");
}
```

{% asset_img path-1.png path-1 %}

我们了解了 `clip-path` 的理论和它的可取值，是时候用它来实战探索一些用例。你准备好吗？

## 用例

### 斜角效果

在网络上，你可能看见网站的一个区域会有细微斜角背景， 利用 `clip-path` 可以完全实现该效果。

你能猜出怎样实现斜角效果？我们需要使用 `polygon()` 。

```css
.section {
  clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
}
```

某些情况下，去调整 `polygon` 的8个值是烦人的事情。我有小技巧，可以利用浏览器去创造我们想要的形状。首先，我们需要增加如下属性：

```css
.section {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
```

之后，我们需要检查在开发者工具下对应的元素。注意有一个小的多边形图标在 `polygon()` 值的左边。

{% asset_img use-case-1-1.png use-case-1-1 %}

一旦点击图标，可以在浏览器编辑多边形了。

{% asset_img firefox-feature.png firefox-feature %}

(P.S. 只有 Firefox 可以这样，Chrome 不支持)

### 使斜角效果相对于用户可视窗口宽度

我们还可以利用 CSS的 `calc()` 混合 CSS 的可视窗口单位 (VM) 使角度相对于可视窗口宽度。我是从 Kilian Valkhof 的 Sloped edges with consistent angle in CSS 学到的。

```css
.section {
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 5vw), 0 100%);
}
```

### 多重斜角效果

如果我们想要多个有角度的区块怎么办？请参见下面的图例。

{% asset_img use-case-1-2.png use-case-1-2 %}

我首先想到的是简单增加 `box-shadow` 或 `border`。不幸的是，上述属性是会被裁剪的，所以即使我们添加其中一个，它也不会如预期展现出来。

在这情况下，解决方法是利用多重元素，每一个有不同的裁剪点。以下是解决方法：

```html
<div class="hero">
  <img src="bg.jpg" alt="" />
</div>
```

```css
.hero {
  position: relative;
  min-height: 350px;
}

.hero img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 80%, 0 90%);
}

.hero:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -20%;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: #4545a0;
  clip-path: polygon(0 0, 100% 0, 100% 80%, 0 90%);
}
```

我们有一个伪元素有相同大小和 `clip-path` 作为其他元素。不同之处是它通过 `bottom: -20%` 和 `z-index: -1` 处于父元素底下。我使用 20% 是因为它是 `100 - 80` 的结果。

### 滚动中展示

利用 [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)，当用户滚动页面，元素才展示 （译者注：懒加载）。

#### Inset

`inset` 是我发现对这效果最有用的 `clip-path` 值。你可能想为什么？我会在下一个图中告诉你。

{% asset_img how-inset-work.png how-inset-works %}

注意通过 `inset(50%)`，蓝色长方形完全不可见。是的，之所以是 50%，是因为我们从四边设定 `inset`。即是说，`inset` 从长方形的边缩小至中心。

下图中，当用户滚动页面，`inset` 用来展示图像。

{% asset_img use-case-2.png use-case-2 %}

当图像处于可视窗口，下面的 javascript 代码增加 `is-visible` class，我们因而可以通过滚动展示页面。

```js
const images = document.querySelectorAll("img");

function check(entries) {
  entries.map((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}

const observer = new IntersectionObserver(check);
images.forEach((image) => observer.observe(image));
```

```css
img {
  clip-path: inset(50%);
  transition: 1.2s ease-in;
}

img.is-visible {
  clip-path: inset(0);
}
```

很简单吧？我们利用几行css和javascript，创造一个简单的滚动效果。

[Demo](https://codepen.io/shadeed/pen/mdrvKEz)

不只如此，我们还能控制展示过渡的方向。我们只需要四边的其中一边的值。例如，如果我们想要至顶向下的过渡，底的值应该从 100% 至 0。下图解释上述原理。

{% asset_img inset-directions-1.png inset-directions-1 %}

附上互动连接：

[demo](https://codepen.io/shadeed/pen/WNGPKPM)

### 悬停 以及 动画效果

利用 `clip-path` 来创造悬停动画效果的可能性是无穷的。考虑以下例子：

{% asset_img use-case-3.png use-case-3 %}

我们需要把悬停效果增加至指定位置。利用 `circle()` 达到这效果吧。

为了让例子更容易和更好维护，我们使用 css 变量，因而不会重复整个 `clip-path` ，我们只改变需要的 css 变量。

```css
:root {
  --pos: left center;
  --size: 0;
}

.stats__item:before {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #7777e9;
  clip-path: circle(var(--size) at var(--pos));
  transition: 0.4s linear;
}

.stats__item:hover:before {
  --size: 300px;
}
```

不只如此，我们能容易改变动画。我造了一个互动演示，可以通过选择框改变位置。

[demo](https://codepen.io/shadeed/pen/vYXbrrb)

如果你想深入了解更多动画效果，Adam Argyle 先生创造一个非常有用的 css 动画库，它是 100% 依赖 css 的 `clip-path`。[Transition.css](https://www.transition.style/)

### 连漪效果

连漪效果因 Material design 的出现而流行。通过 `clip-path` ，我们可以容易复现这效果。

{% asset_img use-case-4.png use-case-4 %}

```html
<button class="button"><span>Sign up now</span></button>
```

```css
.button {
  position: relative;
}

.button span {
  position: relative;
  z-index: 1;
}

.button:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  opacity: 0.1;
  clip-path: circle(0 at center);
  transition: 0.3s ease-out;
}

.button:hover:before {
  clip-path: circle(100px at center);
}
```

[demo](https://codepen.io/shadeed/pen/LYRaNwg)

## Clip-Path 值得一知的知识

### 不可见区域不接收 `pointer` 事件

当一个区域被裁剪，它之外的区域不接收任何 `pointer` 事件。这意味着用户不能在不可见区域悬停。

### 你可以用相对值

你可否让 `clip-path` 相对于 `font-size` ？你可以在 `clip-path` 利用 `em` 或 `rem`。

## 阅读更多

- [可视化生成多种clip-path](https://bennettfeely.com/clippy/)
- [用SVG实现一个优雅的提示框](https://zhuanlan.zhihu.com/p/143876210)
- [Tooltips using SVG Path](https://medium.com/welldone-software/tooltips-using-svg-path-1bd69cc7becd)
- [CSS Clipping & Masking: A Comprehensive Tutorial with Examples](https://uipencil.com/2022/09/05/tutorial-for-html-css-svg-clipping-and-masking/)
