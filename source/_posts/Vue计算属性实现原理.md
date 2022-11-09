---
title: Vue计算属性实现原理
tags:
  - Vue
categories:
  - 前端
  - 框架
  - Vue
  - 源码系列
abbrlink: 45262
date: 2021-08-08 14:48:17
---

# 作用

解决模板中**复杂的逻辑运算**以及**复用的问题**

<!-- more -->

## 逻辑样式尽可能的绝对分离

```javascript
const App = {
  data() {
    return {
      studentCount: 1
    }
  },
  template: `
    <h1>{{ studentCount > 0 ? ('学生数：' + studentCount) : '暂无学生' }}</h1>
  `
}

Vue.createApp(App).mount('#app');
```

## 模板中多次使用同样的插值表达式

避免多次计算，只要data下属性不改变，只会计算一次，也就是缓存

```javascript
const App = {
  data() {
    return {
      studentCount: 1
    }
  },
  template: `
    <h1>{{ studentCountInfo }}</h1>
    <h1>{{ studentCountInfo }}</h1>
  `,
  computed: {
    studentCountInfo() {
      console.log('Invoked');
      return this.studentCount > 0
                            ? ('学生数：' + this.studentCount)
                            : '暂无学生';
    }
  }
}

Vue.createApp(App).mount('#app');
```

{% asset_img 1638272012426-61b34c3e-eb27-422c-b3ca-408bfa4b2ca3.png 100% %}

# 特性

- 计算属性只在内部逻辑**依赖的数据发生变化**的时候才会被再次调用
- **计算属性会缓存**其依赖的上一次计算出的数据结果
- **多次复用**一个相同的数据，计算属性**只会调用一次**
- 计算属性直接挂载在实例上

# 使用方式

```javascript
const vm = new Vue({
  data() {
    return {
      name: 'Lance',
      age: 28
    }
  },
  computed: {
    // 默认为 getter
    getName() {
      return this.name;
    },
    // getter、setter 配合使用
    ageData: {
      get() {
        return this.age;
      },
      set(newVal) {
        this.age = newVal;
      }
    }
  }
});
```

# 代码实现

## 实现思路

- 根据computed特性来思考
- - 数据得缓存
- - - 得有个地方保存每次计算后的结果
- - get函数中的依赖发生变化后，就得重新计算
- - - 所以得把这些依赖收集起来
- - 监听到依赖变化后得更新
- - - 还得保存get函数
- 思路：
- - computedPool
- - - 有一个 pool 存所有 computed
- - - pool中每个 computed 都是个对象，包含
- - - - value：缓存计算结果
- - - - get：保存get函数
- - - - dep：收集函数中的依赖

## 代码实现

1. 收集 data 依赖，实现响应式
  1. setter触发时，调用 update 方法更新有关 data 绑定的视图
  2. setter触发时，调用 updateComputed 遍历 computedPool 每一项下的 dep 依赖，发现更新的 key 匹配上 dep 中的依赖，就重新算一遍 fn，再赋值给对应的 计算属性，实现更新数据
    1. 再调用 update 更新视图
      1. 从 dataPool 中找到相应计算属性的dom更新值
2. 收集 computed 依赖，遍历 computed 中每个 key
  1. 存到 computedPool 中，每个key对应一项，包含
    1. value：缓存计算结果
    2. get：getter 或者 函数本身
    3. dep：收集函数中存在的依赖的 data
  2. 遍历 computedPool ，把计算属性的值挂载到 vm 实例上
3. render 渲染视图
  1. 创建一个新div利用 innerHTML 包裹模板
  2. 编译模板
    1. 遍历模板找到所有 `{{}}` 的 dom
    2. 用 `{{}}` 中的 data 属性名做 key ，dom做 value 存到 dataPool 中去
  3. 挂载div到 $el

```javascript
/**
  var vm = new Vue({
    el: '#app',
    template: `
      <span>{{ a }}</span>
      <span>+</span>
      <span>{{ b }}</span>
      <span>=</span>
      <span>{{ total }}</span>
    `,
    data() {
      return {
        a: 1,
        b: 2
      }
    },
    computed: {
      total() {
        console.log('computed total');
        return this.a + this.b;
      }
    }
  });
 */
var Vue = (function() {
  var reg_var = /\{\{(.+?)\}\}/g,
      computedData = {}, // 计算属性集合
      dataPool = {}; // 收集有 {{ }} 需要响应式的dom
  /**
   * total: {
   *  value: 函数执行返回的结果
   *  get: get
   *  dep: ['a', 'b']
   * }
   */
  var Vue = function(options) {
    this.$el = document.querySelector(options.el);
    this.$data = options.data();

    this._init(this, options.computed, options.template);
  }

  Vue.prototype._init = function(vm, computed, template) {
    dataReactive(vm); // 数据响应式
    computedReactive(vm, computed); // 计算属性收集
    render(vm, template); // 渲染
  }

  function render(vm, template) {
    var container = document.createElement('div'),
        _el = vm.$el;

    container.innerHTML = template;
    // 编译模板
    var domTree = _compileTemplate(vm, container);
    _el.appendChild(domTree);
  }

  // 更新视图
  function update(vm, key) {
    dataPool[key].textContent = vm[key];
  }

  function _compileTemplate(vm, container) {
    // 获取 template 下所有tag
    var allNodes = container.getElementsByTagName('*'),
        nodeItem = null;

    for (var i = 0; i < allNodes.length; i++) {
      nodeItem = allNodes[i];
      // 匹配 {{ }} 中的data和computed
      var matched = nodeItem.textContent.match(reg_var);
      if (matched) {
        nodeItem.textContent = nodeItem.textContent.replace(reg_var, function(node, key) {
          // 收集有 {{ }} 需要响应式的dom
          dataPool[key.trim()] = nodeItem;
          return vm[key.trim()];
        })
      }
    }
    return container;
  }

  function dataReactive(vm) {
    var _data = vm.$data;
    for (var key in _data) {
      (function(key) {
        Object.defineProperty(vm, key, {
          get() {
            return _data[key];
          },
          set(newVal) {
            _data[key] = newVal;
            update(vm, key);
            _updateComputedData(vm, key, function(key) {
              update(vm, key);
            })
          }
        });
      })(key);
    }
  }

  function computedReactive(vm, computed) {
    _initComputedData(vm, computed);

    for (var key in computedData) {
      (function(key) {
        Object.defineProperty(vm, key, {
          get() {
            return computedData[key].value;
          },
          set(newVal) {
            computedData[key].value = newVal;
          }
        });
      })(key);
    }
  }

  function _initComputedData(vm, computed) {
    for (var key in computed) {
      // console.log(Object.getOwnPropertyDescriptor(computed, key)); 
      // configurable: true
      // enumerable: true
      // value: ƒ total()

      var descriptor = Object.getOwnPropertyDescriptor(computed, key),
      // computed有可能是对象，也有可能是getter
          descriptorFn = descriptor.value.get
                          ? descriptor.value.get
                          : descriptor.value;

      /**
       * total: {
       *  value: 函数执行返回的结果
       *  get: get
       *  dep: ['a', 'b']
       * }
       */
      computedData[key] = {};
      computedData[key].value = descriptorFn.call(vm);
      computedData[key].get = descriptorFn.bind(vm);
      computedData[key].dep = _collectDep(descriptorFn);
      console.log(computedData);
    }
  }

  function _collectDep(fn) {
    var _collection = fn.toString().match(/this.(.+?)/g);
    console.log(_collection);
    if (_collection.length > 0) {
      for (var i = 0; i < _collection.length; i++) {
        _collection[i] = _collection[i].split('.')[1];
      }
    }

    return _collection;
  }

  function _updateComputedData(vm, key, update) {
    var _dep = null;

    // 循环 computedData 中的计算属性们
    for (var _key in computedData) {
      _dep = computedData[_key].dep;
      // 查看收集的当前计算属性的dep中的依赖data
      for (var i = 0; i < _dep.length; i++) {
        // 如果对应上了当前变化的data属性
        if (_dep[i] === key) {
          // 就重新执行一次computedData下对应方法，赋值给vm下对应计算属性
          vm[_key] = computedData[_key].get();
          update(_key);
        }
      }
    }
  }

  return Vue;
})();

export default Vue;
/**
 * 计算属性：解决模板中复杂的逻辑运算以及复用的问题
 * ● 计算属性只在内部逻辑依赖的数据发生变化的时候才会被再次调用
 * ● 计算属性会缓存其依赖的上一次计算出的数据结果
 * ● 多次复用一个相同的数据，计算属性只会调用一次
 */

import Vue from '../module/Vue';

var vm = new Vue({
  el: '#app',
  template: `
    <span>{{ a }}</span>
    <span>+</span>
    <span>{{ b }}</span>
    <span>=</span>
    <span>{{ total }}</span>
  `,
  data() {
    return {
      a: 1,
      b: 2
    }
  },
  computed: {
    total() {
      console.log('computed total');
      return this.a + this.b;
    }
    // total: {
    //   get() {
    //     console.log('computed total');
    //     return this.a + this.b;
    //   }
    // }
  }
});

console.log(vm);

console.log(vm.total);
console.log(vm.total);
console.log(vm.total);
console.log(vm.total);

vm.a = 100;
vm.b = 200;

console.log(vm.total);
console.log(vm.total);
console.log(vm.total);
console.log(vm.total);
```