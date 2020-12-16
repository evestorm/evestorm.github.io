---
title: Vue深度监听对象新老值如何保持不一样
tags:
  - 技巧
  - Vue
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 32592
date: 2020-09-20 21:46:45
---

转载自：https://www.haorooms.com/post/vue_new_oldval

## 前言

假如你用 vue 监听复杂对象的时候，新旧值通常是一样的，vue 官方也给出了解释：

> 注意：在变异 (不是替换) 对象或数组时，旧值将与新值相同，因为它们的引用指向同一个对象/数组。Vue 不会保留变异之前值的副本。

<!-- more -->

那么，问题来了，如何让 vue 深度监听对象新老值如何保持不一样？

Vue 官方也给出了方案：

> 观察 Vue 实例变化的一个表达式或计算属性函数。回调函数得到的参数为新值和旧值。表达式只接受监督的键路径。对于更复杂的表达式，用一个函数取代

## 解决方案

对的，很简单，官方提供的方案就是，对于复杂的表达式，用一个函数取代。

那么我们之间把复杂表达式或者对象，用 computed 属性包装一下，再来监听 computed 属性，不就可以了嘛！

**之前的做法：**

```js
data: {
    haoroomsObj: {
        haoroomstestinner: {
            a: '我是haorooms资源库',
            b: '我是haorooms博客'
        }
    }
},
watch: {
  haoroomsObj: {
    handler: (val, olVal) => {
      console.log('我变化了', val, olVal)
    },
    deep: true
  }
},
```

此时，对象变化可以监听到，但是 val,和 oldVal 是一样的。

**函数包装后监听**

```js
data:{
    haoroomsObj: {
        haoroomstestinner: {
            a: '我是haorooms资源库',
            b: '我是haorooms博客'
        }
    }
},
computed: {
  newHaorooms() {
    return JSON.parse(JSON.stringify(this.haoroomsObj));
  }
watch: {
  newHaorooms: {
    handler: (val, olVal) => {
      console.log('我变化了', val, olVal)
    },
    deep: true
  }
},
```

此时监听打印的值就不一样了。
