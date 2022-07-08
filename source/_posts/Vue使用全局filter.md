---
title: Vue使用全局filter
tags:
  - 笔记
  - Vue
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 7498
date: 2019-05-17 21:36:53
---

### 1. Vue 中 Filter 声明方式

Vue 中存在两种声明 Filter 过滤器的方式:

<!-- more -->

**全局过滤器**

```js
Vue.filter('testFilter1', val => {
  console.log('全局过滤器', val);
});
```

这种方式将过滤器声明到了 Vue 类型上，所有 Vue 对象即可访问这个过滤器

**本地过滤器**

```js
new Vue({
  filters: {
    testFilter2(val) {
      console.log('本地过滤器', val);
    }
  }
});
```

这种方式将过滤器声明到这个 Vue 对象中，所以只能这个 Vue 对象进行访问

### 2. Vue 中在 Methods 中访问 Filter

Vue 中在 Methods 中访问 Filter 有两种方式,分别对应两种 Filter 的声明方式

**访问全局过滤器**

```html
<div id="body">
  <button @click="getGlobal()">调用全局过滤器</button>
</div>
<script>
  Vue.filter('testFilter1', val => {
    console.log('全局过滤器', val);
  });
  new Vue({
    el: '#body',
    methods: {
      getGlobal() {
        //使用Vue.Filter()方式获取全局过滤器
        var te = Vue.filter('testFilter1');
        //调用全局过滤器
        te('filter');
      }
    }
  });
</script>
```

**访问本地过滤器**

```html
<div id="body">
  <button @click="getLocal()">调用本地过滤器</button>
</div>
<script>
  new Vue({
    el: '#body',
    filters: {
      testFilter2(val) {
        console.log('本地过滤器', val);
      }
    },
    methods: {
      getLocal() {
        //使用this.$options.filters[]方式获取本地过滤器
        var te = this.$options.filters['testFilter2'];
        //调用本地过滤器
        te('filter');
      }
    }
  });
</script>
```
