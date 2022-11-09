---
title: Vue方法methods实现原理
tags:
  - Vue
categories:
  - 前端
  - 框架
  - Vue
  - 源码系列
abbrlink: 9688
date: 2021-07-10 14:30:04
---

# 特性

- Vue 创建实例时，会自动为 methods **绑定当前实例 this**
- 保证在事件监听时，回调始终指向当前组件实例
- 方法要避免使用箭头函数（箭头函数没法改变this指向，本身指向父级）
  - 箭头函数会阻止Vue正确绑定组件实例this

<!-- more -->

```javascript
var app = Vue.createApp({
  data() {
    return {
      title: 'This is my TITLE'
    }
  },
  template: `
    <h1>{{ title }}</h1>
    <button @click="changeTitle">CHANGE TITLE</button>
  `,
  methods: {
    changeTitle() {
      this.title = 'This is your TITLE'
    }
  }
});

const vm = app.mount('#app');
```

- `@click="changeTitle('This is your TITLE')"`
  - 函数名 + () 不是执行，而是传入实参的容器
  - 相当于React的写法：
  - `onclick = "() => changeTitle('This is your TITLE')"`
  - 也能这么写：
  - `onClick={ () => changeTitle('This is your TITLE') }`
  - `onClick={ changeTitle.bind(this, 'his is your TITLE')}`

# 方法挂载在实例上

而不是 methods 上，而且也没抛出 methods 属性到 vm 实例上

```javascript
var app = Vue.createApp({
  data() {
    return {
      title: 'This is my TITLE'
    }
  },
  template: `
    <h1>{{ title }}</h1>
    <button @click="changeTitle('This is your TITLE')">CHANGE TITLE</button>
  `,
  methods: {
    changeTitle(title) {
      this.title = title;
    }
  }
});

const vm = app.mount('#app');
console.log(vm);
console.log(vm); // undefined
```

{% asset_img 1645700096113-5dfaed2e-2a8f-4676-96fb-d3729fd6c9c3.png 100% %}

# lodash的debounce防抖函数

第一种写法：

组件共用一个debounce，每个实例都共用它，不太好

{% asset_img 1638261218674-b69f59c5-2fd6-4064-b9b0-1509d8862fec.png 100% %}

第二种写法（推荐）：

每次创建的时候都返回一个新的debounce函数

{% asset_img 1638261143375-ceac41d7-187e-480b-b100-0d7b72cf1e78.png 100% %}

# 手写data

```javascript
var Vue = (function() {
  function Vue(options) {
    this.$data = options.data();
    this._methods = options.methods;

    this._init(this);
  }

  Vue.prototype._init = function(vm) {
    initData(vm);
    initMethods(vm);
  }

  function initData(vm) {
    for (var key in vm.$data) {
      (function(k) {
        Object.defineProperty(vm, k, {
          get: function() {
            return vm.$data[k];
          },
          set: function(newVal) {
            vm.$data[k] = newVal;
          }
        });
      })(key);
    }
  }

  function initMethods(vm) {
    for (var key in vm._methods) {
      vm[key] = vm._methods[key];
    }
  }

  return Vue;
})();

var vm = new Vue({
  data() {
    return {
      a: 1,
      b: 2
    }
  },
  methods: {
    increaseA(num) {
      this.a += num;
    },
    increaseB(num) {
      this.b += num;
    },
    getTotal() {
      console.log(this.a + this.b);
    }
  }
});

vm.increaseA(1);
vm.increaseA(1);
vm.increaseA(1);
vm.increaseA(1); // 5

vm.increaseB(2);
vm.increaseB(2);
vm.increaseB(2);
vm.increaseB(2); // 10

vm.getTotal(); // 15
```