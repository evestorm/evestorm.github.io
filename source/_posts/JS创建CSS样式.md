---
title: JS创建CSS样式
tags:
  - CSS
categories:
  - 前端
  - JS
  - DOM
abbrlink: 42581
date: 2022-12-04 22:33:38
---

用JS来动态设置CSS样式

```js
function addNewStyle(newStyle) {
  const styleElement = document.getElementById('JS_style');

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.id = 'JS_style';
    document.getElementsByTagName('head')[0].appendChild(styleElement);
  }
  
  styleElement.appendChild(document.createTextNode(newStyle));
}

addNewStyle(`.box { background-color: 'red' }`);
```
