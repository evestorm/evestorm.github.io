---
title: Vue自定义create方法用于通过JS创建组件实例
tags:
  - Vue
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 6559
date: 2020-09-24 16:16:03
---

### 方案一：Vue.extend(Component) 获取组件构造函数

`Vue.extend` 是 Vue 全局 API，[官方文档](https://cn.vuejs.org/v2/api/#Vue-extend) 对其描述如下：

> 使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。

从官方文档的描述中，我们可以知道，`extend` 创建的是 Vue 构造器，而不是我们平时常写的组件实例，所以不可以通过 `new Vue({ components: testExtend })` 来直接使用，需要通过 `new Profile().$mount('#mount-point')` 来挂载到指定的元素上。

<!-- more -->

#### 为什么使用 extend

在 vue 项目中，我们有了初始化的根实例后，所有页面基本上都是通过 router 来管理，组件也是通过 `import` 来进行局部注册，所以组件的创建我们不需要去关注，相比 `extend` 要更省心一点点。但是这样做会有几个缺点：

1. 组件模板都是事先定义好的，如果我要从接口动态渲染组件怎么办？
2. 所有内容都是在 `#app` 下渲染，注册组件都是在当前位置渲染。如果我要实现一个类似于 `window.alert()` 提示组件要求像调用 JS 函数一样调用它，该怎么办？

这时候，`Vue.extend + vm.$mount` 组合就派上用场了。

接下来，让我们用 Vue.extend() 来实现一个方法，该方法用来动态创建一个组件实例。

**步骤一：获取组件构造函数**

```js
// Vue.extend 返回一个预设了部分选项的 Vue 实例构造器，即类似于js 中的构造函数，用来生成组件
const ConponentConstructor = Vue.extend(Component);
```

**步骤二：构建组件实例并挂载到 DOM 节点上**

```js
// 构建一个Component的实例
const vm = new ConponentConstructor({
  // render：字符串模板 template 的替代方案，用于返回 createElement 方法创建的 VNode
  render(createElement) {
    // render 方法接受 createElement 方法作为第一个参数用来创建 VNode
    return createElement(Component, { props }); // 返回 createElement 创建的VNode
  }
});
vm.$mount(); // $mount() 把Vue实例挂载到DOM节点上  // $mount()方法不设置挂载目标，依然可以转换vnode为真实节点$el
```

**步骤三：把当前 Vue 实例关联的 DOM 元素挂载到 body 上**

```js
// 把 Vue 实例关联的DOM 元素挂载到 body 上
document.body.appendChild(vm.$el);
// 获取组件实例
const component = vm.$children[0]; // vm.$children 当前实例的直接子组件
component.remove = () => {
  // 把当前实例关联的DOM 元素从 body 删除
  document.body.removeChild(vm.$el);
  // 销毁实例，此时对应 Vue 实例的所有指令都会被解绑，所有的事件监听器也会被移除
  vm.$destroy();
};
```

以下是完整代码：

**方案一的第一种写法：**

```js
import Vue from 'vue';

/**
 * create 创建一个指定组件的实例
 * @param {*} Component 组件配置对象
 * @param {*} props 传递给组件的属性
 */

const create = (Component, props) => {
  // Vue.extend 返回一个预设了部分选项的 Vue 实例构造器，即类似于js 中的构造函数，用来生成组件
  const ComponentConstructor = Vue.extend(Component);

  // 在 new ComponentConstructor() 里使用 render 函数，此处返回的是 Vue 实例，还需要通过 vm.$children[0] 来获取组件实例
  const vm = new ComponentConstructor({
    // 字符串模板 template 的替代方案，用于返回 createElement 方法创建的 VNode
    render(createElement) {
      // render 方法接受 createElement 方法作为第一个参数用来创建 VNode
      return createElement(Component, { props }); // 返回 createElement 创建的VNode
    }
  });

  vm.$mount(); // $mount() 把Vue实例挂载到DOM节点上  // $mount()方法不设置挂载目标，依然可以转换vnode为真实节点$el

  // 把 Vue 实例关联的DOM 元素挂载到 body 上
  document.body.appendChild(vm.$el);

  // 获取组件实例
  const component = vm.$children[0]; // vm.$children 当前实例的直接子组件
  component.remove = () => {
    // 把当前实例关联的DOM 元素从 body 删除
    document.body.removeChild(vm.$el);
    // 销毁实例，此时对应 Vue 实例的所有指令都会被解绑，所有的事件监听器也会被移除
    vm.$destroy();
  };

  return component;
};

export default create;
```

**方案一的第二种写法：**

```js
import Vue from 'vue';

/**
 * create 创建一个指定组件的实例
 * @param {*} Component 组件配置对象
 * @param {*} props 传递给组件的属性
 */

const create = (Component, props) => {
  // Vue.extend 返回一个预设了部分选项的 Vue 实例构造器，即类似于js 中的构造函数，用来生成组件
  const Ctor = Vue.extend(Component);
  // 此处 new Ctor() 后返回的是组件实例，可直接用于挂载
  const comp = new Ctor({ propsData: props });
  comp.$mount();
  document.body.appendChild(comp.$el);
  comp.remove = () => {
    // 移除dom
    document.body.removeChild(comp.$el);
    // 销毁组件
    comp.$destroy();
  };

  return comp;
};

export default create;
```

### 方案二：通过 new Vue() 的方式实例化一个组件实例

#### new Vue()

> new Vue() 用于创建一个 Vue 实例

**步骤一：构建 Component 实例**

```js
const vm = new Vue({
  // 字符串模板 template 的替代方案，用于返回 createElement 方法创建的 VNode
  render(createElement) {
    // render 方法接受 createElement 方法作为第一个参数用来创建 VNode
    return createElement(Component, { props }); // 返回 createElement 创建的VNode
  }
}).$mount(); // 不设置挂载目标，依然可以转换vnode为真实节点$el
```

**步骤二：把 Vue 实例关联的 DOM 元素挂载到 body 上**

```js
document.body.appendChild(vm.$el);
```

**步骤三：获取组件实例并返回**

```js
const component = vm.$children[0]; // vm.$children 当前实例的直接子组件
component.remove = () => {
  // 把当前实例关联的DOM 元素从 body 删除
  document.body.removeChild(vm.$el);
  // 销毁实例，此时对应 Vue 实例的所有指令都会被解绑，所有的事件监听器也会被移除
  vm.$destroy();
};
```

以下是完整代码：

```js
import Vue from 'vue';

// Component - 组件配置对象
// props - 传递给它的属性
function create(Component, props) {
  // 1.构建Component的实例
  const vm = new Vue({
    render(h) {
      // h是createElement
      // 它可以返回一个vnode
      return h(Component, { props });
    }
  }).$mount(); // 不设置挂载目标，依然可以转换vnode为真实节点$el
  // 2.把 Vue 实例关联的DOM 元素挂载到 body 上
  document.body.appendChild(vm.$el);

  // 3.获取组件实例
  const comp = vm.$children[0];
  comp.remove = () => {
    document.body.removeChild(vm.$el);
    vm.$destroy();
  };

  return comp;
}
export default create;
```

我们已经实现了用于创建组件实例的 create 方法，那么我们该怎么使用它呢？

### 方法调用

#### 方式一：import 导入

在你需要调用该方法的文件中通过 import 的方式导入 create 方法，然后直接调用：

```js
create(Notice, {
  title: '老杨喊你来搬砖',
  message: isValid ? '请求登录。。。' : '校验失败了'
}).show();
```

create 方法的第一个参数是一个已经定义好的组件，第二个参数是传递给传入 create 方法的组件的 props，props 中的属性必须是传入的组件中已经定义好的。

上面代码的含义是通过 create 方法创建 Notice 组件的实例，调用 Notice 组件中定义的 show() 方法显示出来。

#### 方式二：定义成插件，在全局调用

```js
import Notice from '@/components/Notice.vue'；
import Vue from 'vue'
//...
// 此处是 create 方法的具体实现
//...
export default {
 install(Vue) {
 Vue.prototype.$notice = function (options) {
   return create(Notice, options)
   }
 }
}
```

定义成插件后，便可以在全局作用下调用 create 方法了：

```js
this.$notice（{
 title: '我是弹窗标题',
 message: '我是弹窗提示信息',
 duration: 1000
}).show();
```

附上 Notice 组件的代码：

```vue
<template>
  <div class="box" v-if="isShow">
    <h3>{{ title }}</h3>
    <p class="box-content">{{ message }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 1000
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    show() {
      this.isShow = true;
      setTimeout(this.hide, this.duration);
    },
    hide() {
      this.isShow = false;
      this.remove();
    }
  }
};
</script>

<style>
.box {
  position: fixed;
  width: 100%;
  top: 16px;
  left: 0;
  text-align: center;
  pointer-events: none;
  background-color: #fff;
  border: grey 3px solid;
  box-sizing: border-box;
}
.box-content {
  width: 200px;
  margin: 10px auto;
  font-size: 14px;
  padding: 8px 16px;
  background: #fff;
  border-radius: 3px;
  margin-bottom: 8px;
}
</style>
```

来源：https://www.yuque.com/moozi/umgbyh/mps35y
