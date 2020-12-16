---
title: Vue组件化常用技术总结(笔记)
tags:
  - Vue
  - 笔记
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 27829
date: 2020-01-30 21:48:18
---

# 组件化常用技术

## 组件传值、通信

### 父组件 => 子组件

- 属性 props

```js
// child
props: {
  msg: String;
}

// parent
<HelloWorld msg="Welcome to Your Vue.js App" />;
```

<!-- more -->

- 引用 refs

```html
// parent
<HelloWorld ref="hw" />

this.$refs.hw.xx // P.S. • 如果ref放在了原生DOM元素上，获取的数据就是原生DOM对象
- 可以直接操作 • 如果ref放在了组件对象上，获取的就是组件对象 -
可以获取到组件内data、methods，通过 this.$refs.refName.data名称/method名称 -
可以获取到DOM对象，通过 this.$refs.refName.$el进行操作
```

### 子组件 => 父组件：自定义事件

```js
// child
props: { add: Function }
this.$emit('add', good)

// parent
<Cart @add="cartAdd($event)"></Cart>
```

### 兄弟组件：通过共同祖辈组件

通过共同的祖辈组件搭桥，`$parent` 或 `$root`。

```js
// brother1
this.$parent.$on('foo', handle);

// brother2
this.$parent.$emit('foo');
```

### 祖先和后代之间

- provide/inject：能够实现祖先给后代传值

```js
// ancestor
provide() {
   return {foo: 'foo'}
}

// descendant
inject: ['foo']
```

- dispatch：后代给祖先传值

```js
// 定义一个dispatch方法，指定要派发事件名称和数据
function dispatch(eventName, data) {
  let parent = this.$parent
  // 只要还存在父元素就继续往上查找
  while (parent) {
    // 父元素用$emit触发
    parent.$emit(eventName,data)
    // 递归查找父元素
    parent = parent.$parent
  }
}

// 使用，HelloWorld.vue
<h1 @click="dispatch('hello', 'hello,world')">{{ msg }}</h1>

// App.vue
this.$on('hello', this.sayHello)
```

### 任意两个组件之间：事件总线 或 vuex

- 事件总线：创建一个 Bus 类负责事件派发、监听和回调管理

```js
// 自定义Bus：事件派发、监听和回调管理
class Bus {
  constructor(){
    // {
    //   eventName1:[fn1,fn2],
    //   eventName2:[fn3,fn4],
    // }
    this.callbacks = {}
  }
  $on(name, fn){
    this.callbacks[name] = this.callbacks[name] || []
    this.callbacks[name].push(fn)
  }
  $emit(name, args){
    if(this.callbacks[name]){
      this.callbacks[name].forEach(cb => cb(args))
    }
  }
}

// main.js
Vue.prototype.$bus = new Bus()
// child1
this.$bus.$on('foo', handle)
// child2
this.$bus.$emit('foo')
copy// 封装 vueEvent.js
import Vue from 'vue';
var VueEvent = new Vue();
export default VueEvent;

// 使用

// 广播者
import VueEvent from '../model/VueEvent.js';
methods: {
  emitNews() { VueEvent.$emit('to-news', this.msg) }
}

// 监听者
import VueEvent from '../model/VueEvent.js';
mounted() {
  VueEvent.$on('to-news', function(data) {...接收到了data...})
}
```

- Vuex：创建唯一的全局数据管理者 store，通过它管理数据并通知组件状态变更

## 插槽

> Vue 2.6.0 之后采用全新 v-slot 语法取代之前的 slot、slot-scope

### 匿名插槽

```html
// comp1
<div>
  <slot></slot>
</div>

// parent
<comp>hello</comp>
```

### 具名插槽

```html
// comp2
<div>
  <slot></slot>
  <slot name="content"></slot>
</div>

// parent
<Comp2>
  <!-- 默认插槽用default做参数 -->
  <template v-slot:default>具名插槽</template>
  <!-- 具名插槽用插槽名做参数 -->
  <template v-slot:content>内容...</template>
</Comp2>
```

### 作用域插槽

```html
// comp3
<div>
  <slot :foo="foo"></slot>
</div>

// parent
<Comp3>
  <!-- 把v-slot的值指定为作用域上下文对象(e.g. {foo: foo}) -->
  <template v-slot:default="ctx">来自子组件数据：{{ctx.foo}}</template>
</Comp3>
```
