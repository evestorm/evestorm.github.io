---
title: Vue数据响应式的简单实现
tags:
  - Vue
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 12491
date: 2019-04-27 21:44:34
---

今天来实现一个简单的 Vue 数据响应式，最终达到两个基本效果：

- 当用户在 input 中输入内容时，文本节点会跟着改变
- 当直接更新 message 属性后，页面中 input 标签和文本节点的值会跟着改变

<!-- more -->

最终效果：

{% asset_img sw.gif 实现效果 %}


## 原理

Vue 实现数据响应式的核心原理是：**借助发布/订阅模式** + **数据劫持** 。

- 创建 vue 实例时深度遍历 data 下所有属性，利用 [Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 把属性转为 [getter/setter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/get)。
- Vue 实现了 [发布订阅者模式](https://juejin.im/post/5a9108b6f265da4e7527b1a4)，在模板编译过程中解析 Vue 指令，给组件中的属性添加上相应订阅者（Watcher），这样在数据变更后会触发相应属性的 setter ，通过消息订阅器（Dep）发消息给所有订阅者（Watcher），从而触发相应组件的更新。

## 文件结构

```shell
.
├── Compiler.js       # 指令解析器
├── Dep.js            # 消息订阅器
├── Observer.js       # 观察者
├── Vue.js            # Vue的简单实现
├── Watcher.js        # 订阅者
├── index.html
└── main.js           # 入口文件
```

## 具体代码

### index.html

包含一个 input 标签和文本节点。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>

  <body>
    <div id="app">
      <input type="text" v-model="message" />
      {{message}}
    </div>
    <script src="dist/main.js"></script>
  </body>
</html>
```

### Dep.js 消息订阅器

发布订阅者模式的简单实现。包含核心方法 `listen` 以及 `notify` ，`listen` 负责给属性添加订阅者，`notify` 负责在属性发生变化时通知所有该属性的订阅者。

```js
class Dep {
  constructor() {
    console.log('【Dep】实例化了一个消息订阅器');
    // 订阅者数组
    this.list = [];
  }
  listen(sub) {
    // 谁要订阅我，就调用listen，把自己添加进订阅者数组中去
    this.list.push(sub);
  }
  notify() {
    // 当属性发生变化后，会在 setter 中调用此方法，
    // 消息订阅者通知订阅者数组中的所有人执行update操作
    this.list.forEach(function (item, index) {
      item.update();
    });
  }
}
Dep.prototype.target = null;

export default Dep;
```

### main.js 入口文件

该文件中 new 一个 Vue 实例，并把该实例挂载到 window 对象上。

```js
import Vue from './Vue';
var vm = new Vue({
  el: '#app',
  data: {
    message: 'lance'
  }
});

window.vm = vm;
```

### Observer.js 观察者

深度遍历 data 下的所有属性，利用 `Object.defineProperty` 把属性转为 `getter/setter` ，并在此过程中给每个属性都绑定上发布/订阅模块。

```js
import Dep from './Dep';
class Observer {
  constructor(data) {
    this.data = data;
    Object.keys(this.data).forEach(key => {
      this._bind(data, key, data[key]);
    });
  }
  _bind(data, key, val) {
    var myDep = new Dep();
    Object.defineProperty(data, key, {
      // 新建vm实例时，给data添加属性就是第一次赋值，就调用了get
      get() {
        // 第一次访问这个属性时
        // 把订阅者(Watcher对象)注入发布/订阅模块
        // 后续访问就不用再添加这个属性的订阅者了
        if (Dep.target) myDep.listen(Dep.target);
        return val;
      },
      set(newValue) {
        if (newValue === val) return;
        val = newValue;
        myDep.notify();
      }
    });
  }
}

export default Observer;
```

### Watcher.js 订阅者

实现 update 方法，在属性发生变化时收到通知并执行它，从而更新组件数据。

```js
import Dep from './Dep';
class Watcher {
  // watcher需要当前组件中的：
  // 【节点】，【节点上相关的data属性】，【vm实例】
  constructor(node, name, vm) {
    this.node = node;
    this.name = name;
    this.vm = vm;
    // 将消息订阅器实例的当前订阅者设置为自己
    Dep.target = this;
    this.update();
    Dep.target = null;
  }
  update() {
    // 得到数据变更通知后更新组件
    if (this.node.nodeType === 1) {
      this.node.value = this.vm[this.name];
    }
    this.node.nodeValue = this.vm[this.name];
  }
}

export default Watcher;
```

### Compiler.js 指令解析器

负责解析挂载到 Vue 上的 html 模板，找出 Vue 相关的指令。例如遇到 input 标签上有 `v-model` ，则给绑定的属性添加订阅者（Watcher），并为 input 标签添加 _input_ 事件，在用户输入 value 后更改 data 中相应属性的值。

```js
import Watcher from './Watcher';
// 辨认 {{}} 的正则
const REG = /\{\{(.*)\}\}/;
class Compiler {
  constructor(el, vm) {
    this.el = document.querySelector(el);
    this.vm = vm;
    this.frag = this._createFragment();
    this.el.appendChild(this.frag);
  }
  _createFragment() {
    var frag = document.createDocumentFragment();
    var child;
    // 遍历挂载对象下的所有节点
    while ((child = this.el.firstChild)) {
      this._compile(child);
      frag.appendChild(child);
    }
    return frag;
  }
  _compile(node) {
    var self = this;
    // 类型为元素
    if (node.nodeType === 1) {
      var attr = node.attributes;
      if (attr.hasOwnProperty('v-model')) {
        var name = attr['v-model'].nodeValue;
        // 添加 input 监听事件
        node.addEventListener('input', function (e) {
          self.vm[name] = e.target.value;
        });
        node.value = this.vm[name];
        // 给该属性添加订阅者
        new Watcher(node, name, this.vm);
      }
    }
    // 元素为文本
    if (node.nodeType === 3) {
      // 目标：转化html中的 {{message}} 和 绑上watcher
      if (REG.test(node.nodeValue)) {
        // 获取匹配到的字符串
        var name = RegExp.$1;
        name = name.trim();
        // 给元素添加订阅者，当vm实例的数据发生改变时,
        // 能收到通知并触发watcher中的update来更新元素上的值
        // 传递：
        // node节点（因为要改变元素中的值）
        // name属性名
        // 实例vm（为了调用vm下的属性）
        console.log('【Compiler】解析到文本元素，给它创建一个watcher实例');
        new Watcher(node, name, this.vm);
      }
    }
  }
}

export default Compiler;
```

### Vue.js

调用 `Compiler` 和 `Observer` ，实现数据响应式。

```js
import Observer from './Observer';
import Compiler from './Compiler';

class Vue {
  constructor(options) {
    this.$options = options;
    this.$el = this.$options.el;
    this._data = this.$options.data;
    Object.keys(this._data).forEach(key => {
      this._proxy(key);
    });
    new Observer(this._data);
    new Compiler(this.$el, this);
  }
  // 每次获取或赋值data中的属性时这样写代码：
  // Vue.$options.data.message 很长
  // 我们的期望：Vue.message
  _proxy(key) {
    var self = this;
    Object.defineProperty(this, key, {
      get() {
        return self._data[key];
      },
      set(value) {
        self._data[key] = value;
      }
    });
  }
}

export default Vue;
```

## 最后

根目录下运行 `webpack main.js` 进行打包，浏览器运行 `index.html` 文件后便能看到文章开头的实现效果，完。
