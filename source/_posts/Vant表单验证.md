---
title: vant表单验证
tags:
  - vant
categories:
  - 前端
  - UI
  - Vant
abbrlink: 29400
date: 2022-07-20 16:02:37
---

## 官网示例

https://youzan.github.io/vant/v2/#/zh-CN/form#xiao-yan-gui-ze

这里不提

## 全局表单验证

1. 在 `van-form` 中定义 `ref` 属性 `ref="xxx"`
2. 在触发对应事件的函数中写入如下代码:

```js
this.$refs.xxx.validate()
  .then(() => {
    // 验证通过
  })
  .catch(() => {
    // 验证失败
  });
```

## 局部表单验证

1. 在 `van-form` 中定义 `ref` 属性 `ref="xxx"`
2. 在需要验证项的 `van-field` 上加 `name` 属性 `name="PropName"`
3. 在触发对应事件的函数中写入如下代码:

```js
this.$refs.xxx.validate('name的值')
  .then(() => {
    // 验证通过
  })
  .catch(() => {
    // 验证失败
  });
```