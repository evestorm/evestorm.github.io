---
title: Vue数据响应式
tags:
  - Vue
categories:
  - 前端
  - 框架
  - Vue
  - 源码系列
abbrlink: 49215
date: 2021-07-08 13:47:18
---

# 简易版

## vm.$data.xxx 与 vm.xxx 的关系

1. Vue 在创建实例的过程中调用了 data 函数
2. data 函数返回数据对象
3. Vue 将其包装成响应式对象后保存到 `$data` 中
4. 而且实现了跨过 `$data` 还能访问属性

<!-- more -->

```javascript
const App = Vue.createApp({
  data() {
    return {
      title: 'This is my TITLE',
    }
  },
  template: `
    <h1>{{ title }}</h1>
  `
});

const vm = App.mount('#app');
console.log(vm);
console.log(vm.$data.title);
console.log(vm.title);

vm.$data.title = 'This is your TITLE';
console.log(vm.title);
```

{% asset_img 1645697714959-a56e3823-6919-4ddc-98c2-b73dd2b383c7-20220308135017139.png 100% %}

### $data 是响应式数据对象

后续在 vm 上添加 author ，不会出现在 vm.$data 上：

```javascript
vm.author = 'Lance';
```

{% asset_img 1638253090165-e65f8193-aeef-4eb8-be60-f0b29f248eb3-20220308135017143.png 100% %}


在 $data 上添加属性，不会出现在 vm 上：

```javascript
vm.$data.author = 'Lance';
```

{% asset_img 1638253259730-e22dc6d8-7383-414c-bb77-946b2b189417-20220308135017139.png 100% %}


两种添加方式都不能渲染到页面上：

```javascript
const App = Vue.createApp({
  data() {
    return {
      title: 'This is my TITLE',
    }
  },
  template: `
    <div>
      <h1>{{ title }}</h1>
      <h1>{{ author }}</h1>
    </div>
  `
});
const vm = App.mount('#app');
// vm.author = 'Lance';
vm.$data.author = 'Lance';
```

{% asset_img 1638253365927-21c6189f-d2ad-4e30-9f9f-0c3747af2b6f-20220308135017162.png 100% %}

### 手写简易 Vue 读写 data

```javascript
var vm = new Vue({
	data() {
  	return {
    	a: 1,
      b: 2
    }
  }
});

console.log(vm.a);
vm.b = 233;
console.log(vm.b);

function Vue(options) {
	this.$data = options.data();
  
  var _this = this;
  for (var key in this.$data) {
  	(function(k) {
    	Object.defineProperty(_this, k, {
      	get: function() {
        	return _this.$data[k];
        },
        set: function(newVal) {
        	_this.$data[k] = newVal;
        }
      });
    })(key);
  }
}
```

### __defineGetter__、__defineSetter__

Object.defineProperty 在 **IE8 下只支持DOM**，可以使用 __defineGetter__、__defineSetter__ 替换方案：

```javascript
var vm = new Vue({
	data() {
  	return {
    	a: 1,
      b: 2
    }
  }
});

console.log(vm.a);
vm.b = 233;
console.log(vm.b);

function Vue(options) {
	this.$data = options.data();
  
  var _this = this;
  for (var key in this.$data) {
  	(function(k) {
    	// Object.defineProperty(_this, k, {
      // 	get: function() {
      //   	return _this.$data[k];
      //   },
      //   set: function(newVal) {
      //   	_this.$data[k] = newVal;
      //   }
      // });
      _this.__defineGetter__(k, function() {
        return _this.$data[k];
      });
      _this.__defineSetter__(k, function(newVal) {
        _this.$data[k] = newVal;
      });
    })(key);
  }
}
```

## data为什么必须得是个函数

- 如果 data 不是个函数，则有可能出现不同实例、组件修改的是同一份 data 引用

```javascript
var data = {
	a: 1,
  b: 2
}
var vm = new Vue({
	data: data
});
var vm2 = new Vue({
	data: data
});

vm.a = 233;
console.log(vm, vm2);

function Vue(options) {
	this.$data = options.data;
  
  var _this = this;
  for (var key in this.$data) {
  	(function(k) {
    	Object.defineProperty(_this, k, {
      	get: function() {
        	return _this.$data[k];
        },
        set: function(newVal) {
        	_this.$data[k] = newVal;
        }
      });
    })(key);
  }
}
```

{% asset_img 1645698421811-9f4df171-e23b-42a0-a05a-ce3d3e9d8984-20220308135017162.png 100% %}

当然分别给两个新对象也没问题，但Vue为了避免出现上边情况，所以强制你得是个function，返回一个新对象，这样在Vue内部执行它时，每次就是新对象了:

```javascript
var vm = new Vue({
	data: {
    a: 1,
    b: 2
  }
});
var vm2 = new Vue({
	data: {
    a: 1,
    b: 2
  }
});

vm.a = 233;
console.log(vm, vm2);

function Vue(options) {
	this.$data = options.data;
  
  var _this = this;
  for (var key in this.$data) {
  	(function(k) {
    	Object.defineProperty(_this, k, {
      	get: function() {
        	return _this.$data[k];
        },
        set: function(newVal) {
        	_this.$data[k] = newVal;
        }
      });
    })(key);
  }
}
```

{% asset_img 1645698444402-8f1f5e5a-fa15-43ca-829a-162699b6b46e-20220308135017151.png 100% %}


**Object.defineProperty 无法监听能修改原数组的数组方法**

```javascript
/**
 * 数据变更检测
 */

const vm = {
  data: {
    a: 1,
    b: 2,
    list: [1, 2, 3, 4, 5]
  }
};

for (var key in vm.data) {
  (function(key) {
    Object.defineProperty(vm, key, {
      get() {
        console.log('数据获取');
        return vm.data[key];
      },
      set(newValue) {
        console.log('数据设置');
        vm.data[key] = newValue;
        // 视图更新操作
      }
    });
  })(key);
}

console.log(vm);

vm.a = 233;
console.log(vm);

// 重新赋值能够触发 set
vm.list = vm.list.map(item => item * 2);
console.log(vm);

// 新增一个数组之前没监听的成员，数组倒是push了999，但没能触发set，间接导致没法更新视图

/**
 * 下列方法，都不返回新数组(7种)
 * Object.defineProperty 没办法监听下列方法对数组的操作变更
 */
// vm.list.unshift(1);
// vm.list.push(999);
// vm.list.pop();
// vm.list.shift();
// vm.list.splice(2, 1);
// vm.list.sort((a, b) => b - a);
// vm.list.reverse();
console.log(vm.list);

// Vue对下列方法进行了包裹封装
// function push() {
//   vm.list.push(233);
//   // 视图更新
// }
```

## Vue2 数组结构

```javascript
const vm = new Vue({
  el: '#app',
  template: `<div></div>`,
  data() {
    return {
      list: [1, 2, 3, 4, 5]
    }
  }
});

console.log(vm.list);
```

{% asset_img 1646211162044-27cd855b-90a2-49b1-8b38-4d87afa3a5d3-20220308135017179.png 100% %}

### 针对修改原数组，执行方法后不返回新数组的方法进行了封装

Vue类似做了这个操作：

1. Vue先调用自己封装的 push 等方法
2. 再在里边调用原生的
3. 再进行一些更新视图操作 

# 复杂版

## 思路

1. 用 `_data` 去接收 `options.data()` 函数返回的对象，保存到 vm 实例中
  1. 为了能直接 `vm.title` 的形式操作数据（跳过 `vm._data.title` 开发更方便），我们遍历 `_data`，通过 `Object.defineProperty` 在 `vm` 实例上挂载了所有 `_data` 下的属性
2. 有了 `_data` 后，我们就需要对 `_data` 本身的改变进行拦截观察了（为了更新值时做页面更新等操作）
  1. 观察者模式，`new Observer(data)`
  2. 递归观察，因为 `_data` 下的属性也有可能是个对象，属性的属性也有可能是个对象...
3. 写 `Observer` 观察者构造函数
  1. 观察者接收的 data 有可能是个数组也有可能是个对象，所以得分情况处理
  2. `是[]` -  给数组的原型链上加中间桥梁
    1.  `[].__proto__ = arrMethods`、`arrMethods.__proto__ = Array.prototype`
    2. `arrMethods` 下挂载了 7 个属性，分别对应能原地改变数组的 7 个方法
    3. 每个方法在执行的时候，先用原生方法执行一次，再执行自己的逻辑
      1. `push、unshift、splice` 三个方法有可能新增数组成员，而新增的成员也有可能是数组或对象，所以还得用一个 `newArr` 保存下新数组成员，然后对它们进行遍历观察
      2. 获取原生方法执行后的结果，返回出去
  3.  `是{}` - 遍历对象属性并用 `Object.defineProperty` 进行数据劫持
    1. 每个对象属性有可能还是个对象或数组，记得再次调用 `new Observer(value)` 观察它

## 文件夹结构

- index.js
  - `function Vue(options)` 
    - `_init(options)` 初始化Vue
      - `initState(this)` 初始化状态（data、computed ...）
- init.js
  - 包含 `initState(vm)` 方法，用来初始化各种状态
    - `initData(vm)` 初始化 data
      - 用临时变量 `vm._data` 保存 `options.data()` 返回的 data
      - 把 `vm._data` 挂载到 `vm` 下
        - 目的：使 `vm.title` 能访问 `vm._data.title`
        - 原理：利用 `Object.defineProperty`
        - 方式：遍历 `vm._data` 调取 `proxyData(vm, '_data', key)` 
      - 对 `vm._data` 进行劫持，监听 `vm._data` 的变化
        - 方式：`observe(vm._data)`
        - `observe` 在 `observe.js` 下
      - 梳理上述两个过程
        - 开发者对 `vm.title` 进行更改
        - 导致 `vm._data.title` 的更改
        - 而我们要监听的，是 `vm._data.title` 的变化
- proxy.js
  - `proxyData(vm, target, key)` 方法
    - 给 `vm` 下挂载 `_data` 下的各个属性（利用 `Object.defineProperty`）
- observe.js
  - `observe(data)` 方法
    - 如果 `vm.data` 不是个对象，则直接 return 不做任何操作
    - 如果是对象，则调用 `new Observer(data)` 对 `vm._data` 进行观察
      - `Observer` 方法在 `observer.js` 中
- observer.js
  - `Observer(data)` 方法
    - 判断传入的 `data` 是否为数组
      - 是
        - `data.__proto__ = arrMethods`（来自下方 array.js）
        - 由于 `data` 这个数组的成员也有可能是对象或者数组，所以还得递归观察，所以得调用 `observeArr(data)` （在 `observeArr.js` 中）
      - 否
        - 调用 `Observer.prototype.walk(data)` 方法
          - 遍历 data，调用 `defineReactiveData(data, key, value)` 观察data下每个属性
          - `defineReactiveData` 在 `reactive.js` 下
- array.js
  - 创建一个继承自Array原型的对象
    - `const originArrMethods = Array.prototype`
    - `const arrMethods = Object.create(originArrMethods)`
  - 用一个数组存 7 个原地更新数组的方法
    - 遍历它们，把它们挂载到 `arrMethods` 下 
      - `[ARR_METHODS].forEach(m => { arrMethods[m] = functino() {} })`
        - 保存传入的参数为数组 
          - `const args = [].slice.call(arguments)`
        - 先用原生方法执行一遍，改变数组 （别忘了保存返回值，最后得返回出去）
          - `const ret = originArrMethods[m].apply(this, args)`
        - `push、unshift、splice` 有可能给数组新增成员，所以用 `newArr` 保存新增数据
          - `push、unshift` 时 `newArr` 就是 `args`
          - `unshift` 时从第三个参数开始才是新增的 `newArr = args.slice(2)`
          - 如果最后发现 `newArr` 有值，则需要调用 `observeArr.js` 遍历并监听它们
    - 导出 `arrMethods` 
- config.js
  - 保存着 `ARR_METHODS` ，是个数组，保存着 7 个原地更新数组的方法名称
- observeArr.js
  - `observeArr(arr)`
    - 遍历 `arr` ，然后对每个数组成员调用 `observe(arr[i])`
- reactive.js
  - `defineReactiveData(data, key, value)`
    - 有可能 value 本身也是个对象，所以先得 `observe(value)`
    - 调用 `Object.defineProperty`
      - get
        - `return value`
      - set
        - `if (newValue === value) return`
        - `value = newValue`
        - 有可能 value 又是个对象，则再对 `value` 观察：`observe(newValue)`


## 代码

### array.js

```javascript
import { ARR_METHODS } from './config';
import observeArr from './observeArr';

var originArrMethods = Array.prototype,
    // 设置我们封装的对象的原型为 Array.prototype
    arrMethods = Object.create(originArrMethods);

// 遍历7个方法
ARR_METHODS.map(method => {
  arrMethods[method] = function() {
    // 把arguments转成真数组
    var args = Array.prototype.slice.call(arguments),
    // 先用Array原生方法执行一遍，改变数组
        rt = originArrMethods[method].apply(this, args);
  
    // 再用临时变量存一下给数组新增的项目
    // 因为只有新增的值没被劫持过，得提出来劫持
    var newArr;

    switch (method) {
      case 'push':
      case 'unshift':
        newArr = args;
        break;
      case 'splice':
        // arr.splice(1,1,2) splice从第三个参数开始才是新增的
        newArr = args.slice(2);
        break;
      default:
        break;
    }

    // 一旦发现有新增的成员，就再观察它
    newArr && observeArr(newArr);
    return rt;
  }
});

export {
  arrMethods
}
```

### config.js

```javascript
var ARR_METHODS = [
  'push',
  'unshift',
  'pop',
  'shift',
  'splice',
  'sort',
  'reverse'
];

export {
  ARR_METHODS
};
```

### index.js

```javascript
import { initState } from "./init";

function Vue(options) {
  this._init(options);
}

// 初始化Vue实例
Vue.prototype._init = function(options) {
  // 首先初始化后先保存 this
  var vm = this;
  // 把options挂载到实例
  vm.$options = options;
  // 首先就得数据劫持，不然没法后面通过劫持关联视图
  initState(vm);
}

export default Vue;
```

### init.js

```javascript
import proxyData from "./proxy";
import observe from './observe';

function initState(vm) {
  var options = vm.$options;

  if (options.data) {
    // 除了data还有computed还有watch
    // 每一个功能都不一样，都得要初始化，所以拆分初始化方法
    initData(vm);
  }
}

function initData(vm) {
  var data = vm.$options.data;
  // 一般我们不直接操作用户的数据，需要用一个临时变量保存起来
  // 所以我们让 vm._data = data ，而 vm._data 又等于传进来的data
  vm._data = data = typeof data === 'function'
                        ? data.call(vm)
                        : data || {};
  
  // 遍历 vm._data 把 data 中属性挂载到 vm 下面(通过 Object.defineProperty) 
  // 此时访问 vm.title 其实访问的是 vm._data.title
  // 此时更改 vm.title 其实更改的是 vm._data.title
  for (var key in data) {
    proxyData(vm, '_data', key);
  }

  // 在没有执行下边 observe 观察 vm._data 时，vm._data 本身还没有被观测，_data 下的属性还都没有被劫持

  // 一旦执行 observe ，其实也就是要对 vm._data 进行劫持
  observe(vm._data); // 观察 vm._data
  console.log(vm);
}

export {
  initState
}
```

### observe.js

```javascript
import Observer from './observer';

function observe(data) {
  // 如果 vm._data 不是个对象或者是个null，就直接返回
  if (data == null || typeof data !== 'object') return;
  // 如果是个对象，就对 vm._data 进行观察
  return new Observer(data);
}

export default observe;
```

### observeArr.js

```javascript
import observe from "./observe";

function observeArr(arr) {
  for (var i = 0; i < arr.length; i++) {
    observe(arr[i]);
  }
}

export default observeArr;
```

### observer.js

```javascript
import defineReactiveData from "./reactive";
import { arrMethods } from './array';
import observeArr from './observeArr';

function Observer(data) {
  // 针对数组：自己写相应方法
  // 针对对象：Object.defineProperty 给对象下每个属性添加数据劫持
  if (Array.isArray(data)) {
    // 让数组的原型等于arrMethods，
    // 这样就会先看调用的方法会不会命中arrMethods中的7个方法中的任意一个
    // 如果有，就走自己封装的7个方法（内部会调用Array方法）。
    // 否则就走 Array.prototype 自身的方法
    data.__proto__ = arrMethods;
    // console.log(data);

    // 由于数组内的成员也有可能是对象或数组，所以得递归观察
    observeArr(data);
  } else {
    this.walk(data);
  }
}

// 劫持 vm._data 下属性
Observer.prototype.walk = function(data) {
  var keys = Object.keys(data);
  console.log(keys); // ['title', 'classNum', 'total', 'teacher', 'students']
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i],
        value = data[key];

    // vm._data, 'title', '学生列表'
    defineReactiveData(data, key, value);
  }
}

export default Observer;
```

### proxy.js

```javascript
function proxyData(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      console.log('proxyData获取' + key);
      // vm.title 相当于访问 vm._data.title
      return vm[target][key];
    },
    set(newValue) {
      // vm.title = xxx 相当于 vm._data.title = xxx
      console.log('proxyData设置' + key);
      vm[target][key] = newValue;
    }
  });
}

export default proxyData;
```

### reactive.js

```javascript
import observe from "./observe";

function defineReactiveData(data, key, value) {
  // 有可能 value 本身也是个对象，所以要递归调用
  observe(value);
  Object.defineProperty(data, key, {
    get: function() {
      console.log('defineReactiveData获取', key);
      return value;
      // 注意这里是返回的 defineReactiveData 下的变量 value
      // 而不是 return 的 data[key]
    },
    set: function(newValue) {
      if (newValue === value) return;
      console.log('defineReactiveData设置', key);
      // 此处改了value后，上边get获取value时也是新的
      value = newValue; // 注意这里不是 data[key] = newValue;
      // 有可能设置的值还是个对象，还得观察
      observe(newValue);
    }
  });
}

export default defineReactiveData;
```

### 注意区别

```javascript
var obj = {
  name: "Lance",
  age: 28
}

function defineReactiveData(data, key, value) {
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newVal) {
      value = newVal;
    }
  })
}

for (const key in obj) {
  // 下边报错
  // Object.defineProperty(obj, key, {
  //   get() {
  //     return obj[key];
  //   },
  //   set(newVal) {
  //     obj[key] = newVal;
  //   }
  // })
  // 下边不报错
  defineReactiveData(obj, key, obj[key]);
}

console.log(obj.name);
```