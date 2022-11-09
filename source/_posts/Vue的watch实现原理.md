---
title: Vue的watch实现原理
tags:
  - Vue
categories:
  - 前端
  - 框架
  - Vue
  - 源码系列
abbrlink: 36931
date: 2021-08-12 09:55:26
---

# watch 与 computed 区别

- watch 侦听器
  - 关注点在**数据更新**：给数据增加侦听器，**当数据更新时，侦听器函数执行**
  - 特点：数据更新时，需要完成什么样的逻辑
  - 何时使用：
    - **监听一个数据的变化**，变化后要干什么，用watch
- computed 计算属性
  - **关注点在模板**：抽离复用模板中的**复杂的逻辑运算**
  - 特点：当函数内的**依赖更新后，重新调用**
  - 何时使用：
    - 专注**视图**部分的**复杂的逻辑运算**，用computed

<!-- more -->

# watch实现

## 实现思路

- constructor 接收 options
  - 从 options 解构出 `data、computed、watch`
  - 调用 `init()` 函数初始化
- `init()`函数
  - `initData` 实现 data 数据响应式
  - `initComputed` ，获取 computed 实例
    - computed 实例需要有 `update` 方法用来更新 计算属性新值
  - `initWatch` ，获取 watch 实例
    - watch 实例需要有 `invoke` 方法用来重新执行 watch 回调函数
- `initData` 数据劫持
  - `reactive(vm, __get__, __set__)`
- `initComputed`
  - 遍历 computed 对象，存进 computedPool 数组中
    - 成员对象
      - key: 计算属性名称
      - value: 计算值
      - get: 函数
      - dep: [ 依赖 ]
    - 存完以后还得把 computed 全部挂载到vm上边
  - `update(key, watch)` 
    - setter触发后，用 update 函数更新 computedPool 中对应值
    - 因为有可能 watch 监听了 computed ，所以再执行下 watcher 中的 invoke 函数，看看有没有必要更新 watch
- `initWatch`
  - 遍历 watch 对象，存进 watchPool 数组中
    - 成员对象
      - key: 方法名
      - value: fn 函数（记得绑定this为vm）
  - `invoke(key, newVal, oldVal)` 
    - 遍历 watchPool 找到对应 key 的成员，调用 fn 函数

## 实现代码

### 实现数据响应式

```shell
module
└── Vue
    ├── Computed.js
    ├── Watcher.js
    ├── index.js
    └── reactive.js
src
└── main.js
```

#### src/main.js

```javascript
import Vue from '../module/Vue';

const vm = new Vue({
  el: '#app',
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
  },
  watch: {
    total(newVal, oldVal) {
      console.log('watch total', newVal, oldVal);
    },
    a(newVal, oldVal) {
      console.log('watch a', newVal, oldVal);
    },
    b(newVal, oldVal) {
      console.log('watch b', newVal, oldVal);
    }
  }
});

console.log(vm);
console.log(vm.total);
console.log(vm.total);
console.log(vm.total);

vm.a = 100;

console.log(vm.total);
console.log(vm.total);
console.log(vm.total);

vm.b = 200;

console.log(vm.total);
```

#### module/Vue/index.js

```javascript
import { reactive } from './reactive';
class Vue {
  constructor(options) {
    const { data, computed, watch } = options;
    this.$data = data();
    this.init(this, computed, watch);
  }

  init(vm, computed, watch) {
    this.initData(vm);
    const computedIns = this.initComputed(vm, computed);
    const watcherIns = this.initWatcher(vm, watch);
  }
  
  initData(vm) {
    // 数据响应式
    reactive(vm, (key, value) => {
      console.log(key, value);
    }, (key, newValue, oldValue) => {
      console.log(key, newValue, oldValue);
    });
  }

  // computed没暴露在实例上，需要通过传参
  initComputed(vm, computed) {
    // 枚举 computed ，存到 computedData 中去
    // 返回computed实例 -> 实例里有update -> 更新 computedData 的 value
  }

  initWatcher(vm, watch) {
    // 枚举 watcher -> 增加侦听器
    // 返回watcher实例 -> 实例里有调用 watch 的方法 -> 执行侦听器
  }
}

export default Vue;

/**
 * Vue
 * 
 * data -> 是个函数得执行 -> data() ->
 * 得挂载到 vm.$data 上 -> 得实现响应式 reactive -> 
 * 利用 Object.defineProperty -> 挂载到vm上:vm.xxx
 *    get vm[key] -> 获取的是 vm.$data[key]
 *    set vm[key] -> 设置的是 vm.$data[key] = newVal
 *        触发后 -> updateComputedProp -> value更新
 *        触发后 -> updateWatchProp -> watch函数callback执行
 * 
 * 
 * computed -> computedData = {
 *    value -> 通过 get 计算而来
 *    get   -> method
 *    deps  -> [a, b] method中当前computed属性的依赖
 *            根据 setter 触发后的 key ，
 *            对比下依赖里边有没有，有就重新执行get
 * }
 * 
 * watch -> watchPool -> 存的fn ->
 *          $data下的setter触发 -> 执行 callback
 */
```

#### module/Vue/reactive.js

```javascript
export function reactive(vm, __get__, __set__) {
  // 因为在 getter、setter 中要做很多事情，例如update
  // 所以声明两个回调， __get__、__set__
  const _data = vm.$data;

  for (const key in _data) {
    Object.defineProperty(vm, key, {
      get() {
        __get__(key, _data[key]);
        return _data[key];
      },
      set(newValue) {
        // 由于 watch 函数有 newVal 和 oldVal ，
        // 所以得保存一份修改之前的数据
        const oldValue = _data[key];
        _data[key] = newValue;
        __set__(key, newValue, oldValue);
      }
    });
  }
}
```

### 实现计算属性特性

- 写成一个类
- 方法

- - addComputed
  - update

- 类似发布订阅模式

#### src/main.js

```javascript
import Vue from '../module/Vue';

const vm = new Vue({
  el: '#app',
  data() {
    return {
      a: 1,
      b: 2
    }
  },
  computed: {
    // descriptor.value
    total() {
      console.log('computed total');
      return this.a + this.b;
    },
    // descriptor.value.get
    total2: {
      get() {
        console.log('computed total2');
        return this.a + this.b;
      }
    }
  },
  watch: {
    total(newVal, oldVal) {
      console.log('watch total', newVal, oldVal);
    },
    a(newVal, oldVal) {
      console.log('watch a', newVal, oldVal);
    },
    b(newVal, oldVal) {
      console.log('watch b', newVal, oldVal);
    }
  }
});

console.log(vm);
console.log(vm.total);
console.log(vm.total);
console.log(vm.total);

vm.a = 100;

console.log(vm.total);
console.log(vm.total);
console.log(vm.total);

vm.b = 200;

console.log(vm.total);
```

#### module/Vue/Computed.js

```javascript
class Computed {
  constructor() {
    /**
     * // descriptor.value
     * total() {
     *   console.log('computed total');
     *   return this.a + this.b;
     * },
     * // descriptor.value.get
     * total2: {
     *   get() {
     *     console.log('computed total2');
     *     return this.a + this.b;
     *   }
     * }
     * 
     * {
     *  key: total,
     *  value: 3
     *  get: total fn
     *  dep: [a, b]
     * }
     */
    this.computedData = [];
  }

  addComputed(vm, computed, key) {
    const descriptor = Object.getOwnPropertyDescriptor(computed, key),
          descriptorFn = descriptor.value.get
                          ? descriptor.value.get
                          : descriptor.value,
          value = descriptorFn.call(vm),
          get = descriptorFn.bind(vm), // 保证正确的 this 指向
          dep = this._collectDep(descriptorFn);
    this._addComputedProp({
      key,
      value,
      get,
      dep
    });
    console.log(this.computedData);

    const computedItem = this.computedData.find(item => item.key === key);
    Object.defineProperty(vm, key, {
      get() {
        return computedItem.value;
      },
      // this.total = 500 不生效，还是自身get计算过来的值
      // 保证计算属性是正确的
      set(newValue) {
        computedItem.value = computedItem.get()
      }
    });
  }

  update(key, cb) {
    // 遍历 computed 池，
    // 找有没有哪个 computed 的 dep 依赖中有此 key
    // 如果依赖(key)值变更了，
    // 就重新执行相应 computed 的 value（利用get()）
    this.computedData.map(computed => {
      const dep = computed.dep;
      const find = dep.find(v => v === key);
      if (find) {
        computed.value = computed.get();
        cb && cb(computed.key, computed.value);
        // update值之后，可能还有事儿要干，所以
        // 留一个cb，使其更新后调用
      }
    });
  }

  _addComputedProp(computedProp) {
    this.computedData.push(computedProp);
  }

  _collectDep(fn) {
    const matched = fn.toString().match(/this\.(.+?)/g);
    // console.log(matched); 
    // matched : ['this.a', 'this.b']
    return matched.map(item => item.split('.')[1]);
  }
}

export default Computed;
```

#### module/Vue/index.js

```javascript
import { reactive } from './reactive';
import Computed from './Computed';
class Vue {
  constructor(options) {
    const { data, computed, watch } = options;
    this.$data = data();
    this.init(this, computed, watch);
  }

  init(vm, computed, watch) {
    this.initData(vm);
    const computedIns = this.initComputed(vm, computed);
    const watcherIns = this.initWatcher(vm, watch);

    this.$computed = computedIns.update.bind(computedIns); // 保证 update 的 this 指向 computedIns 实例
  }
  
  initData(vm) {
    // 数据响应式
    reactive(vm, (key, value) => {
      // console.log(key, value);
    }, (key, newValue, oldValue) => {
      // console.log(key, newValue, oldValue);

      // 更新依赖key的computed
      this.$computed(key);
    });
  }

  // computed没暴露在实例上，需要通过传参
  initComputed(vm, computed) {
    // 枚举 computed ，存到 computedData 中去
    // 返回实例 -> 实例里有update -> 更新 computedData 的 value
    const computedIns = new Computed();

    for (const key in computed) {
      computedIns.addComputed(vm, computed, key);
    }

    return computedIns;
  }

  initWatcher(vm, watch) {
    // 枚举 watcher -> 增加侦听器
    // 返回实例 -> 实例里有调用 watch 的方法 -> 执行侦听器
  }
}

export default Vue;

/**
 * Vue
 * 
 * data -> 是个函数得执行 -> data() ->
 * 得挂载到 vm.$data 上 -> 得实现响应式 reactive -> 
 * 利用 Object.defineProperty -> 挂载到vm上:vm.xxx
 *    get vm[key] -> 获取的是 vm.$data[key]
 *    set vm[key] -> 设置的是 vm.$data[key] = newVal
 *        触发后 -> updateComputedProp -> value更新
 *        触发后 -> updateWatchProp -> watch函数callback执行
 * 
 * 
 * computed -> computedData = {
 *    value -> 通过 get 计算而来
 *    get   -> method
 *    deps  -> [a, b] method中当前computed属性的依赖
 *            根据 setter 触发后的 key ，
 *            对比下依赖里边有没有，有就重新执行get
 * }
 * 
 * watch -> watchPool -> 存的fn ->
 *          $data下的setter触发 -> 执行 callback
 */
```

### 实现侦听器特性

#### src/main.js

```javascript
import Vue from '../module/Vue';

const vm = new Vue({
  el: '#app',
  data() {
    return {
      a: 1,
      b: 2
    }
  },
  computed: {
    // descriptor.value
    total() {
      console.log('computed total');
      return this.a + this.b;
    },
    // descriptor.value.get
    total2: {
      get() {
        console.log('computed total2');
        return this.a + this.b;
      }
    }
  },
  watch: {
    total(newVal, oldVal) {
      console.log('watch total', newVal, oldVal);
    },
    a(newVal, oldVal) {
      console.log('watch a', newVal, oldVal);
    },
    b(newVal, oldVal) {
      console.log('watch b', newVal, oldVal);
    }
  }
});

console.log(vm);
console.log(vm.total);
console.log(vm.total);
console.log(vm.total);

vm.a = 100;

console.log(vm.total);
console.log(vm.total);
console.log(vm.total);

vm.b = 200;

console.log(vm.total);
```

#### module/Vue/Watcher.js

```javascript
class Watcher {
  /**
   * addWatcher(vm, watcher, key)
   * 
   * this.watchers -> watch
   * 
   * 
   * total(newVal, oldVal) {
   *   console.log('watch total', newVal, oldVal);
   * }
   * 
   * 
   * {
   *  key,
   *  fn
   * }
   */
  constructor() {
    this.watchers = [];
  }

  addWatcher(vm, watcher, key) {
    this._addWatchProp({
      key,
      fn: watcher[key].bind(vm)
    });
    // console.log(this.watchers);
  }

  // 调用 watcher
  invoke(key, newValue, oldValue) {
    this.watchers.map(item => {
      if (item.key === key) {
        item.fn(newValue, oldValue);
      }
    });
  }

  _addWatchProp(watchProp) {
    this.watchers.push(watchProp);
  }
}

export default Watcher;
```

#### module/Vue/Computed.js

```javascript
class Computed {
  constructor() {
    /**
     * // descriptor.value
     * total() {
     *   console.log('computed total');
     *   return this.a + this.b;
     * },
     * // descriptor.value.get
     * total2: {
     *   get() {
     *     console.log('computed total2');
     *     return this.a + this.b;
     *   }
     * }
     * 
     * {
     *  key: total,
     *  value: 3
     *  get: total fn
     *  dep: [a, b]
     * }
     */
    this.computedData = [];
  }

  addComputed(vm, computed, key) {
    const descriptor = Object.getOwnPropertyDescriptor(computed, key),
          descriptorFn = descriptor.value.get
                          ? descriptor.value.get
                          : descriptor.value,
          value = descriptorFn.call(vm),
          get = descriptorFn.bind(vm), // 保证正确的 this 指向
          dep = this._collectDep(descriptorFn);
    this._addComputedProp({
      key,
      value,
      get,
      dep
    });
    console.log(this.computedData);

    const computedItem = this.computedData.find(item => item.key === key);
    Object.defineProperty(vm, key, {
      get() {
        return computedItem.value;
      },
      // this.total = 500 不生效，还是自身get计算过来的值
      // 保证计算属性是正确的
      set(newValue) {
        computedItem.value = computedItem.get()
      }
    });
  }

  update(key, watch) {
    // 遍历 computed 池，
    // 找有没有哪个 computed 的 dep 依赖中有此 key
    // 如果依赖(key)值变更了，
    // 就重新执行相应 computed 的 value（利用get()）
    this.computedData.map(item => {
      const dep = item.dep;
      const _key = dep.find(v => v === key);
      if (_key) {
        const oldValue = item.value;
        item.value = item.get();
        // cb && cb(computed.key, computed.value);
        // update值之后，可能还有事儿要干，所以
        // 留一个cb，使其更新后调用
        // 其实cb就是watch，需要在computed变更后，
        //看看watcher里有没有监听computed的更新
        // 所以把 cb 改成 watch
        watch(item.key, item.value, oldValue);
      }
    });
  }

  _addComputedProp(computedProp) {
    this.computedData.push(computedProp);
  }

  _collectDep(fn) {
    const matched = fn.toString().match(/this\.(.+?)/g);
    // console.log(matched); 
    // matched : ['this.a', 'this.b']
    return matched.map(item => item.split('.')[1]);
  }
}

export default Computed;
```

#### module/Vue/index.js

```javascript
import { reactive } from './reactive';
import Computed from './Computed';
import Watcher from './Watcher';
class Vue {
  constructor(options) {
    const { data, computed, watch } = options;
    this.$data = data();
    this.init(this, computed, watch);
  }

  init(vm, computed, watch) {
    this.initData(vm);
    const computedIns = this.initComputed(vm, computed);
    const watcherIns = this.initWatcher(vm, watch);

    this.$computed = computedIns.update.bind(computedIns); // 保证 update 的 this 指向 computedIns 实例
    this.$watch = watcherIns.invoke.bind(watcherIns);
  }
  
  initData(vm) {
    // 数据响应式
    reactive(vm, (key, value) => {
      // console.log(key, value);
    }, (key, newValue, oldValue) => {
      // console.log(key, newValue, oldValue);
      if (newValue === oldValue) {
        return;
      }
      // 更新依赖key的computed

      // 还需要监听 computed 中的 值 的变化，所以把 $watch 也传进去
      this.$computed(key, this.$watch);
      this.$watch(key, newValue, oldValue);
    });
  }

  // computed没暴露在实例上，需要通过传参
  initComputed(vm, computed) {
    // 枚举 computed ，存到 computedData 中去
    // 返回实例 -> 实例里有update -> 更新 computedData 的 value
    const computedIns = new Computed();

    for (const key in computed) {
      computedIns.addComputed(vm, computed, key);
    }

    return computedIns;
  }

  initWatcher(vm, watch) {
    // 枚举 watcher -> 增加侦听器
    // 返回实例 -> 实例里有调用 watch 的方法 -> 执行侦听器

    const watcherIns = new Watcher();
    for (const key in watch) {
      watcherIns.addWatcher(vm, watch, key);
    }
    return watcherIns;
  }
}

export default Vue;

/**
 * Vue
 * 
 * data -> 是个函数得执行 -> data() ->
 * 得挂载到 vm.$data 上 -> 得实现响应式 reactive -> 
 * 利用 Object.defineProperty -> 挂载到vm上:vm.xxx
 *    get vm[key] -> 获取的是 vm.$data[key]
 *    set vm[key] -> 设置的是 vm.$data[key] = newVal
 *        触发后 -> updateComputedProp -> value更新
 *        触发后 -> updateWatchProp -> watch函数callback执行
 * 
 * 
 * computed -> computedData = {
 *    value -> 通过 get 计算而来
 *    get   -> method
 *    deps  -> [a, b] method中当前computed属性的依赖
 *            根据 setter 触发后的 key ，
 *            对比下依赖里边有没有，有就重新执行get
 * }
 * 
 * watch -> watchPool -> 存的fn ->
 *          $data下的setter触发 -> 执行 callback
 */
```