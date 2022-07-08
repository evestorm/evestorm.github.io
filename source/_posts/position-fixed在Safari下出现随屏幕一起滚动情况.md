---
title: position/fixed在Safari下出现随屏幕一起滚动情况
tags:
  - iOS
  - CSS
  - 移动端
categories:
  - 前端
  - 移动端
abbrlink: 6653
date: 2020-08-07 00:08:50
---

在 `position:fixed/absolute` 内加入：

```css
-webkit-transform: translateZ(0);
```

<!-- more -->

假如有遮罩情况则在内容区域加入：

```css
margin-bottom: 30px;
margin-top: 30px;
```

抖动情况则在内容区域加入：

```css
overflow-y: auto;
```
