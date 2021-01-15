---
title: Vue如何把参数传给addEventListener
tags:
  - Vue
  - 技巧
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 27137
date: 2021-01-14 14:35:02
---

## 问题描述

在 Vue 中使用 `document.addEventListener` 需要把回调函数抽离出去放到 `methods` 中，然而 `methods` 中的默认 this 是 vue 实例，如果想要获取 `addEventListener` 的 event 事件对象，就得把方法改成箭头函数的形式：

```js
methods: {
  handleKeyDown: event => {};
}
```

然而此时在 `handleKeyDown` 中又拿不到当前 vue 实例了。

<!-- more -->

## 解决方案

**使用 ES5 的 .bind()**

```js
mounted() {
  //  监听键盘事件
  document.addEventListener('keydown', this.handleKeyDown.bind(null, this));
},
methods: {
  /**
     * @description 监听键盘事件
     * @param {Object} vm 当前vue实例
     * @param {Object} e 事件对象
     */
    handleKeyDown: (vm, e) => {},
}
```

**注意：**

此刻监听器函数中的第二个参数才是 event 事件，而不是第一个参数。
