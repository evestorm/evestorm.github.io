---
title: chrome修改滚动条样式
tags:
  - 技巧
  - CSS
  - chrome
categories:
  - 前端
  - CSS
abbrlink: 63768
date: 2021-01-07 16:44:00
---

## 修改滚动条样式

```css
/*css主要部分的样式*/
/*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/

::-webkit-scrollbar {
  width: 20px; /*对垂直流动条有效*/
  height: 40px; /*对水平流动条有效*/
  display: none; /* 隐藏滚动条 */
}

/*定义滚动条的轨道颜色、内阴影及圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgb(246, 214, 214);
  border-radius: 3px;
}

/*定义滑块颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 7px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f50e0e;
}

/*定义两端按钮的样式 */
::-webkit-scrollbar-button {
  background-color: rgb(255, 255, 255);
}

/*定义右下角汇合处的样式*/
::-webkit-scrollbar-corner {
  background: rgb(252, 227, 7);
}
```

## 隐藏滚动条

```css
::-webkit-scrollbar {
  display: none;
}
```
