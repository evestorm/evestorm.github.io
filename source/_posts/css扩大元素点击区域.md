---
title: css扩大元素点击区域
tags:
  - 技巧
  - 笔记
categories:
  - 前端
  - CSS
abbrlink: 1303
date: 2019-11-11 13:29:56
---

## 问题描述

项目中遇到使用滑动条的地方，但设计稿上的按钮面积非常小，用户在手机上由于不容易精确触摸到按钮导致拖动滚动条困难：

<!-- more -->

{% asset_img 滑动条.png 滑动条设计稿截图 %}

所以就想着扩大按钮的点击区域。通常情况下想要扩大点击区域有两种方案：

- 增加 border
- 添加 padding

然而由于此滑动条使用的是三方库，圆形按钮的位置使用的是绝对定位，不太好改它本身的大小，因为这样要调整的 css 样式太多。所以上面两种方案都被毙掉了，最后 Google 到下面方案。

## 解决方案

**使用伪元素扩大可点击区域**

伪元素能为其父元素捕获鼠标交互动作，因此，只需通过伪元素扩大父元素的空间大小，就能扩大可点击区域。

代码如下：

```html
<button class="extend-via-pseudo-elem">点击</button>
.extend-via-pseudo-elem { position: relative; } .extend-via-pseudo-elem::before
{ content: ''; position: absolute; top: -20px; right: -20px; bottom: -20px;
left: -20px; }
```
