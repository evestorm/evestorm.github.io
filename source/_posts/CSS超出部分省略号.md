---
title: CSS超出部分省略号
tags:
  - 技巧
categories:
  - 前端
  - CSS
abbrlink: 26295
date: 2019-07-09 14:08:33
---

## CSS 实现单行省略号

<!-- more -->

```css
p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

## CSS 实现多行省略号

```css
p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; //行数
  overflow: hidden;
}
```

-webkit-line-clamp 用来限制在一个块元素显示的文本的行数。 为了实现该效果，它需要组合其他的 WebKit 属性。常见结合属性：

display: -webkit-box; 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。

-webkit-box-orient 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。

http://www.daqianduan.com/6179.html
