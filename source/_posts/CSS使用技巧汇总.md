---
title: CSS使用技巧汇总
tags:
  - 技巧
categories:
  - 前端
  - CSS
abbrlink: 61575
date: 2020-09-20 13:21:07
---

持续更新…

## CSS 函数

转载自：https://blog.csdn.net/qq449245884/article/details/108467025

DEMO 地址：https://codepen.io/protic_milos/pen/GRpYJKd

<!-- more -->

### attr()

`attr` 函数用于获取所选元素的属性值。 它接受三个参数，`属性名称` ，`属性值的单位` 和 `默认值` 。

语法: `attr( attribute-name ? [, ]? )`

**DEMO**

> HTML

```html
<p data-text="the attr function" data-tooltip="Hi from attr!" class="attr">
  This text is combined with
</p>
```

> CSS

```css
p::after {
  content: ' ' attr(data-text);
}

p.attr:hover::after {
  content: ' ' attr(data-tooltip);
  background-color: orange;
  color: white;
}
```

### calc()

这个函数使我们能够计算 CSS 值，而不是指定确切的值。通常用于计算元素的大小或位置。它支持加法、减法、乘法和除法。

需要特别注意重要一点是+和-运算符必须用空格隔开，不然无法正常工作。\*和/运算符不有这限制，但出于一致性的考虑，建议添加空格。

另外，很棒的是，我们可以混合 CSS 单位，例如，我们可以减去百分比和像素。

我们可以用 calc 构建一个带有居中元素的示例:

> HTML

```html
<p class="calc">Centered with calc</p>
```

> CSS

```css
p.calc {
  padding: 10px;
  background-color: orange;
  color: white;
  width: 200px;
  text-align: center;
  margin-left: calc(50% - 100px);
}
```

### var()

通过这个函数，我们可以使用一个自定义属性的值作为另一个 CSS 属性的值。简单地说，我们可以定义一个颜色，例如，将它放在自定义属性(CSS 变量)中，然后通过调用 var 函数重用该属性值。

与 CSS 变量一起，该函数提高了可维护性并减少了重复。一个用例是为网站创建主题。

此函数接受两个参数，即自定义属性和一个默认值，如果出现问题，将使用它们。

```css
:root {
  --bg-color: green;
  --color: white;
}

p.var {
  background-color: var(--bg-color);
  color: var(--color);
}
```

### counter()

就我个人而言，我从未使用过这种方法，但它看起来是很有趣。这个函数返回指定计数器的当前值，需要与 `counter-reset`和`counter-increment` 配合使用。

我们可以用它来计算其他元素，比如有序列表。

```html
<div class="counter">
  <span>Mars</span>
  <span>Bounty</span>
  <span>Snickers</span>
</div>
```

### circle()

这个函数创建一个圆形区域来屏蔽它所应用的元素。你可以指定它的半径和位置。通常与图像一起使用来创建圆角形状。此函数是`clip-path`属性值。

另外，值得一提的是，除了圆之外，您还可以创建椭圆和多边形形状。

> HTML

```html
<img
  class="circle"
  src="https://devinduct.com/Uploads/PostImages/1122dcb9-954a-4641-9ca6-c38e9472698f.png"
/>
```

> CSS

```css
img.circle {
  clip-path: circle(30%);
}
```
