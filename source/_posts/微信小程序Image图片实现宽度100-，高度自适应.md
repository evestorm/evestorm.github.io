---
title: 微信小程序Image图片实现宽度100%，高度自适应
tags:
  - uniapp
  - 小程序
categories:
  - 前端
  - 移动端
  - 小程序
abbrlink: 1126
date: 2019-12-08 13:42:05
---

做法如下：

样式设置宽度 100%：

```css
.img {
  width: 100%;
}
```

添加属性 mode=”widthFix”：

```html
<image class="img" src="/static/images/hello.png" mode="widthFix"></image>
```
