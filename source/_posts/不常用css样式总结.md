---
title: 不常用css样式总结
tags:
  - CSS
  - 技巧
categories:
  - 前端
  - CSS
abbrlink: 10974
date: 2020-10-09 22:52:40
---

## 设置 input 的 placeholder 的字体样式

<!-- more -->

```css
input::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  color: red;
}
input::-moz-placeholder {
  /* Firefox 19+ */
  color: red;
}
input:-ms-input-placeholder {
  /* IE 10+ */
  color: red;
}
input:-moz-placeholder {
  /* Firefox 18- */
  color: red;
}
```

### 设置 input 聚焦时的样式

```css
input:focus {
  background-color: red;
}
```

### 取消 input 的边框

```css
border: none;
outline: none;
```

## 二、隐藏滚动条或更改滚动条样式

```css
/*css主要部分的样式*/
/定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸 / ::-webkit-scrollbar {
  width: 10px; /*对垂直流动条有效*/
  height: 10px; /*对水平流动条有效*/
}

/*定义滚动条的轨道颜色、内阴影及圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rosybrown;
  border-radius: 3px;
}

/*定义滑块颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 7px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #e8e8e8;
}

/*定义两端按钮的样式*/
::-webkit-scrollbar-button {
  background-color: cyan;
}

/*定义右下角汇合处的样式*/
::-webkit-scrollbar-corner {
  background: khaki;
}
```

## 三、文字超出隐藏并显示省略号

### 单行（一定要有宽度）

```css
width: 200rpx;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
```

### 多行

```css
word-break: break-all;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
```

## 四、控制 div 内的元素自动换行

```css
word-wrap: break-word;
word-break: break-all;
```

## 五、 纯 css 画三角形

```css
#demo {
  width: 0;
  height: 0;
  border-width: 20px;
  border-style: solid;
  border-color: transparent transparent red transparent;
}
```

## 六、 绝对定位元素居中（水平和垂直方向）

```css
#demo {
  width: 200px;
  height: 200px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: green;
}
```

## 七、表格边框合并

```css
table,
tr,
td {
  border: 1px solid #333;
}

table {
  border-collapse: collapse;
}
```
