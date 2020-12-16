---
title: Uni-App=>事件处理、事件绑定、事件传参(转载)
tags:
  - uniapp
categories:
  - 前端
  - 框架
  - uniapp
abbrlink: 37783
date: 2020-01-17 20:38:31
---

转载来源：https://blog.csdn.net/Dream_Weave/article/details/87722578

### **uni-app 事件**

事件映射表，左侧为 WEB 事件，右侧为 `uni-app` 对应事件

```css
{
  click: 'tap',
  touchstart: 'touchstart',
  touchmove: 'touchmove',
  touchcancel: 'touchcancel',
  touchend: 'touchend',
  tap: 'tap',
  longtap: 'longtap',
  input: 'input',
  change: 'change',
  submit: 'submit',
  blur: 'blur',
  focus: 'focus',
  reset: 'reset',
  confirm: 'confirm',
  columnchange: 'columnchange',
  linechange: 'linechange',
  error: 'error',
  scrolltoupper: 'scrolltoupper',
  scrolltolower: 'scrolltolower',
  scroll: 'scroll'
}
```

<!-- more -->

**\*在 input 和 textarea 中 change 事件会被转为 blur 事件。\***

**踩坑注意：**

上列表中没有的原生事件也可以使用，例如 map 组件的 regionchange 事件直接在组件上写成 @regionchange,同时这个事件也非常特殊，它的 event type 有 begin 和 end 两个，导致我们无法在 handleProxy 中区分到底是什么事件，所以你在监听此类事件的时候同时监听事件名和事件类型既 `<map @regiοnchange="functionName" @end="functionName" @begin="functionName"><map>`
平台差异所致，bind 和 catch 事件同时绑定时候，只会触发 bind ,catch 不会被触发，要避免踩坑。

### **事件修饰符**

stop 的使用会阻止冒泡，但是同时绑定了一个非冒泡事件，会导致该元素上的 catchEventName 失效！
prevent 可以直接干掉，因为 uni-app 里没有什么默认事件，比如 submit 并不会跳转页面
self 没有可以判断的标识
once 也不能做，因为 uni-app 没有 removeEventListener, 虽然可以直接在 handleProxy 中处理，但非常的不优雅，违背了原意，暂不考虑
按键修饰符：uni-app 运行在手机端，没有键盘事件，所以不支持按键修饰符。

### **事件绑定 @click**

```html
<template>
  <view class="demo" @click="clickTest" @longtap="longtap"></view>
</template>

<script>
  export default {
    methods: {
      clickTest: function (e) {
        console.log(e);
        console.log('click');
      },
      longtap: function (e) {
        console.log(e);
        console.log('longtap');
      }
    }
  };
</script>

<style>
  .demo {
    width: 500px;
    margin: 50px auto;
    background: #8f8f90;
    height: 500px;
  }
</style>
```

注意在小程序中观察对应事件对象，可以利用此对象获取更多信息。

### **事件传参（动态参数演示）**

```html
<template>
  <view>
    <view
      v-for="(item, index) in students"
      class="persons"
      @click="menuClick"
      v-bind:id="index"
    >
      {{index}} - {{item.name}}
    </view>
  </view>
</template>

<script>
  export default {
    data: {
      students: [
        { name: '张三', age: 18 },
        { name: '李四', age: 20 }
      ]
    },
    methods: {
      menuClick: function (e) {
        console.log(e);
        console.log(e.target.id);
      }
    }
  };
</script>

<style>
  .persons {
    width: 750px;
    line-height: 2.2em;
  }
</style>
```
