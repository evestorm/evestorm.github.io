---
title: transition过渡（一）
tags:
  - CSS3
categories:
  - 前端
  - CSS
abbrlink: 41749
date: 2019-02-19 09:29:51
---

## 传送门

- [transition过渡（一）](https://evestorm.github.io/posts/24967/)
- [transition过渡（二）](https://evestorm.github.io/posts/13167/)

<!-- more -->

## 介绍

> CSS3 过渡是元素从一种样式逐渐改变为另一种的效果。
> 要实现这一点，必须规定两项内容：
>
> - 指定要添加效果的CSS属性
> - 指定效果的持续时间。

———— 出自 [菜鸟教程](http://www.runoob.com/css3/css3-transitions.html)

## 语法

```css
/* 分开写：*/
transition-property: css属性名称;
transition-duration: 过渡所花时间(默认0);
transition-timing-function: 过渡的时间曲线(默认ease);
transition-delay: 延迟时间(默认0);

/* 简写形式： */
transition： CSS属性，花费时间，效果曲线(默认ease)，延迟时间(默认0)
```

## 栗子 🌰

### 单个属性的变化 —> 按钮 :hover 效果

下面的两个按钮，在鼠标移入时都被设置了 `background: yellow;` 样式。但只给第一个加上了 `transition: background 2s;` 属性，意思是如果背景发生变化，则给2s的过渡效果。

<iframe height="265" scrolling="no" title="XGvqMB" src="https://codepen.io/JingW/embed/XGvqMB/?height=265&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

### 多个属性的变化 —> 单独设置

针对多个属性设置过渡效果，用逗号隔开就好。下面案例鼠标移入后，使正方形过渡到圆形，且颜色逐渐变浅，核心代码：

```css
transition: background .5s ease-out, border-radius .5s ease-in;
```



<iframe height="265" scrolling="no" title="transition-多属性" src="https://codepen.io/JingW/embed/dLyWKM/?height=265&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

### 多个属性的变化 -> all

如果要过渡的css属性较多，可以尝试使用 all 一步搞定。下面案例中将鼠标移入正方形盒子，会使其慢慢缩小为一个圆形，且颜色逐渐变深，核心代码：

```css
transition: all .5s ease-out;
```



<iframe height="265" scrolling="no" title="transition-多属性-all" src="https://codepen.io/JingW/embed/GLRmXm/?height=265&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

## 实用 demo

### 下拉导航菜单

<iframe height="265" scrolling="no" title="transition-下拉导航" src="https://codepen.io/JingW/embed/MxNXex/?height=265&amp;theme-id=0&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>
