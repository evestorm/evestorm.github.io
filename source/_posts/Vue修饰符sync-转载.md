---
title: 转载-Vue修饰符sync
tags:
  - 转载
  - Vue
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 21948
date: 2020-02-02 21:38:17
---

转载自：[简书深入理解 vue 修饰符 sync【 vue sync 修饰符示例】](https://www.jianshu.com/p/6b062af8cf01)

<!-- more -->

在说 vue 修饰符 sync 前，我们先看下官方文档：[vue .sync 修饰符](https://link.jianshu.com/?t=https%3A%2F%2Fcn.vuejs.org%2Fv2%2Fguide%2Fcomponents.html%23sync-修饰符)，里面说 vue .sync 修饰符以前存在于 vue1.0 版本里，但是在在 2.0 中移除了 .sync 。但是在 2.0 发布之后的实际应用中，我们发现 .sync 还是有其适用之处，比如在开发可复用的组件库时。我们需要做的只是让子组件改变父组件状态的代码更容易被区分。从 2.3.0 起我们重新引入了 .sync 修饰符，但是这次它只是作为一个编译时的语法糖存在。它会被扩展为一个自动更新父组件属性的 v-on 监听器。
示例代码如下：

```html
<comp :foo.sync="bar"></comp>
```

会被扩展为：

```html
<comp :foo="bar" @update:foo="val => bar = val"></comp>
```

当子组件需要更新 foo 的值时，它需要显式地触发一个更新事件：

```js
this.$emit('update:foo', newValue);
```

猛一看不明白，下边我么通过一个实例（弹窗的关闭事件）来说明这个代码到底是怎么运用的。

```html
<template>
  <div class="details">
    <myComponent
      :show.sync="valueChild"
      style="padding: 30px 20px 30px 5px;border:1px solid #ddd;margin-bottom: 10px;"
    ></myComponent>
    <button @click="changeValue">toggle</button>
  </div>
</template>
<script>
  import Vue from 'vue';
  Vue.component('myComponent', {
    template: `<div v-if="show">
                    <p>默认初始值是{{show}}，所以是显示的</p>
                    <button @click.stop="closeDiv">关闭</button>
                 </div>`,
    props: ['show'],
    methods: {
      closeDiv() {
        this.$emit('update:show', false); //触发 input 事件，并传入新值
      }
    }
  });
  export default {
    data() {
      return {
        valueChild: true
      };
    },
    methods: {
      changeValue() {
        this.valueChild = !this.valueChild;
      }
    }
  };
</script>
```

动态效果如下：

{% asset_img sync.gif sync %}

vue 修饰符 sync 的功能是：当一个子组件改变了一个 prop 的值时，这个变化也会同步到父组件中所绑定。如果我们不用.sync，我们想做上面的那个弹窗功能，我们也可以 props 传初始值，然后事件监听，实现起来也不算复杂。这里用 sync 实现，只是给大家提供一个思路，让其明白他的实现原理，可能有其它复杂的功能适用 sync。

**Tip**

`.sync` 的作用就是在父级中给组件添加上 `v-on:update:xxx` 这么一个监听，相当于一个语法糖，所以当你要绑定的是一个简单数据类型的时候，就可以使用它，并且子组件需要用$emit 来配合，而如果绑定的是一个引用类型就没必要了，因为子组件随意修改都会触发。
