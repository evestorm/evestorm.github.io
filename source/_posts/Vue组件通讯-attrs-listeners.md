---
title: Vue组件通讯$attrs/$listeners
tags:
  - 技巧
  - Vue
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 47247
date: 2020-01-13 21:53:46
---

## $attrs

> 包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (`class` 和 `style` 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (`class` 和 `style` 除外)，并且可以通过 `v-bind="$attrs"` 传入内部组件——在创建高级别的组件时非常有用。

——> [Vue.js 官网 - vm.$attrs](https://cn.vuejs.org/v2/api/#vm-attrs)

一句话总结：接收除了 `props` 声明外的所有绑定属性（class、style 除外）

<!-- more -->

图解

{% asset_img attrs1.png 图解 %}

由于 `child.vue` 在 props 中声明了 name 属性，`$attrs` 中只有 age、gender 两个属性，输出结果为：

{ age: “20”, gender: “man” }

{% asset_img attrs2.png attrs2 %}

另外可以在 `grandson.vue` 上通过 `v-bind="$attrs"`， 可以将属性继续向下传递，让 `grandson.vue` 也能访问到父组件的属性，这在传递多个属性时会显得很便捷，而不用一条条的进行绑定。

如果想要添加其他属性，可继续绑定属性。但要注意的是，继续绑定的属性和 `$attrs` 中的属性有重复时，继续绑定的属性优先级会更高。

## $listeners

> 包含了父作用域中的 (不含 `.native` 修饰器的) `v-on` 事件监听器。它可以通过 `v-on="$listeners"` 传入内部组件——在创建更高层次的组件时非常有用。

——> [Vue.js 官网 - vm.$listeners](https://cn.vuejs.org/v2/api/#vm-listeners)

一句话总结：接收除了带有 `.native` 事件修饰符的所有事件监听器

{% asset_img listeners1.png listeners1 %}

`App.vue` 中对 `child.vue` 绑定了两个事件，带有 `.native` 的 `click` 事件和一个自定义事件，所以在 `child.vue` 中，输出 `$listeners` 的结果为：

{ customEvent: fn }

{% asset_img listeners2.png listeners2 %}

同 `attrs` 属性一样，可以通过 `v-on="$listeners"`，将事件监听器继续向下传递，让 `grandson.vue` 访问到事件，且可以使用 `$emit` 触发 `App.vue` 的函数。

如果想要添加其他事件监听器，可继续绑定事件。但要注意的是，继续绑定的事件和 `$listeners` 中的事件有重复时，不会被覆盖。当 `grandson.vue` 触发 `customEvent` 时，`child.vue` 和 `parent.vue` 的事件都会被触发，触发顺序类似于冒泡，先到 `child.vue` 再到 `parent.vue`。

## DEMO

https://codesandbox.io/s/eloquent-wood-b2zed

## 应用

当我们去二次封装别人组件时，可能别人组件上有很多属性，我们不想再次重写一遍

这时候就可以使用 `v-bind="$attrs"` 和 `v-on="$listeners"` 。这是 vue 2.4 版本提供

`vm.$attrs` 是一个属性，其包含了父作用域中不作为 `prop` 被识别 (且获取) 的特性绑定 (class 和 style 除外)。这些未识别的属性可以通过 `v-bind="$attrs"` 传入内部组件。未识别的事件可通过 v-on=”$listeners”传入。

举个例子，比如我创建了我的按钮组件 `myButton`，封装了 `element-ui` 的 `el-button` 组件（其实什么事情都没做），在使用组件 `<my-button />` 时，就可以直接在组件上使用 `el-button` 的属性,不被 `prop` 识别的属性会传入到 `el-button` 元素上去：

```html
<template>
  <div>
    <el-button v-bind="$attrs">确定</el-button>
  <div>
</template>

// 父组件使用
<my-button type='primary' size='mini'/>
```
