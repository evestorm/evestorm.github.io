---
title: 转载-Vue全局组件自动注册
tags:
  - Vue
  - vue-cli3
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 64138
date: 2021-01-13 11:10:53
---

在 Vue 中，我们通过 `Vue.component('MyComponentName', { /* ... */ })` 的方式来进行全局组件注册，但如果需要全局注册的组件很多，这时代码就会变得比较臃肿，例如：

<!-- more -->

```js
// 注册 5 个全局组件
import ExampleComponent1 from './components/exampleComponent1/index';
import ExampleComponent2 from './components/exampleComponent2/index';
import ExampleComponent3 from './components/exampleComponent3/index';
import ExampleComponent4 from './components/exampleComponent4/index';
import ExampleComponent5 from './components/exampleComponent5/index';

Vue.component('ExampleComponent1', ExampleComponent1);
Vue.component('ExampleComponent2', ExampleComponent2);
Vue.component('ExampleComponent3', ExampleComponent3);
Vue.component('ExampleComponent4', ExampleComponent4);
Vue.component('ExampleComponent5', ExampleComponent5);
```

下面我们就针对这块痛点，做些优化。

## 循环注册

回看上面的演示代码，最先能想到的优化方式，就是能不能做到批量注册，但查了 Vue 的手册，并没有看到组件批量注册的 API。

没办法，只能改变下思路，既然不能批量注册，那能不能做一层循环，在循环体内依次注册我们的组件呢？

答案当然是可以的，来看下我的实现代码：

```js
import ExampleComponent1 from './components/exampleComponent1/index';
import ExampleComponent2 from './components/exampleComponent2/index';
import ExampleComponent3 from './components/exampleComponent3/index';
import ExampleComponent4 from './components/exampleComponent4/index';
import ExampleComponent5 from './components/exampleComponent5/index';

const components = {
  ExampleComponent1,
  ExampleComponent2,
  ExampleComponent3,
  ExampleComponent4,
  ExampleComponent5
};
Object.keys(components).forEach(key => {
  Vue.component(key, components[key]);
});
```

首先组件还是要手动引入，引入之后我定义了一个 `components` 的对象，将引入组件的变量名存放在 `components` 对象里，最后通过 `Object.keys()` 方法循环对象并注册组件。

这个方法虽然减轻了一部分工作，但实际使用中，依旧还是比较麻烦，于是我又开始思考能否做到全自动注册。

## 自动注册

之前在阅读 [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) 的时候，学习到了一个语法 `require.context()` ，这是 Webpack 的一个 API ，它能做到遍历文件夹中的指定文件并自动引入。

既然能遍历指定文件，还能自动引入，这就已经解决了主要问题了，而我要做无非就是在遍历指定文件的同时，将其注册就可以了。

下面来看下实现代码：

```js
import Vue from 'vue';

const componentsContext = require.context('./components', true, /index.vue$/);
componentsContext.keys().forEach(component => {
  // 获取文件中的 default 模块
  const componentConfig = componentsContext(component).default;
  Vue.component(componentConfig.name, componentConfig);
});
```

首先通过 `require.context()` 获取 ./components 目录下所有文件夹里的 index.vue 文件，然后循环依次读取文件中的 default 模块，并使用组件的 `name` 做为组件名进行组件注册。

> 需要注意的是，组件必须设置 `name` 值，因为注册的组件名就是 `name` 值，所以还要确保不能重名。

```js
export default {
  name: 'ExampleComponent1'
};
```

到此为止，我们已经实现组件的全局自动注册功能了，只需按照规范写好组件，放到 ./components 目录下即可，程序就会自动遍历并注册，无需我再手动操作。

## 扩展

组件有另一种调用方式，也就是通过 js 调用，例如 ElementUI 里的 [Notification](https://element.eleme.cn/#/zh-CN/component/notification) 组件，它的调用就是通过 `this.$notify()` 的方式调用，而 `$notify` 方法是 ElementUI 挂载到 Vue 原型链上的一个全局方法。

针对这种通过 js 调用的组件，我们需要在原有组件同目录下增加一个 js 文件，里面的代码如下：

```js
import Vue from 'vue';

const component = require('./main.vue').default;
const constructor = Vue.extend(component);

const exampleComponent1 = options => {
  options = options || {};
  let instance = new constructor({
    data: options
  });
  instance.vm = instance.$mount();
  instance.dom = instance.vm.$el;
  document.body.appendChild(instance.dom);
  return instance.vm;
};

export default {
  install: Vue => {
    Vue.prototype[`$${component.name}`] = exampleComponent1;
  }
};
```

这时候，我们还需要修改一下自动注册的代码。

```js
import Vue from 'vue';

const componentsContext = require.context(
  './components',
  true,
  /index.(vue|js)$/
);
componentsContext.keys().forEach(component => {
  // 组件配置信息
  const componentConfig = componentsContext(component).default;
  if (/.vue$/.test(component)) {
    Vue.component(componentConfig.name, componentConfig);
  } else {
    Vue.use(componentConfig);
  }
});
```

在循环依次读取文件中的 default 模块的时候，判断一下文件是 vue 文件还是 js 文件，如果是 vue 文件，则进行组件注册，如果是 js 文件，则将组件挂载到 Vue 原型链上。

上面这个 Demo，在实际使用中，就可以通过 `this.$ExampleComponent1()` 的方式调用组件了。

## 最后

全局组件自动注册的功能也加入到 [vue-autumation](https://gitee.com/eoner/vue-automation/) 中，这是一个基于 Vue CLI 3 制作的 Vue 脚手架，能方便快速进行业务开发，欢迎大家关注。

作者：Hooray
链接：https://juejin.cn/post/6844903893244051463
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
