---
title: Vuex的基本使用
tags:
  - Vuex
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 36068
date: 2019-03-19 10:57:28
---

## 什么是 Vuex

Vuex 是一个专为 Vue.js 应用程序开发的状态管理工具。

<!-- more -->

## 准备工作

首先使用 vue-cli 脚手架工具新建一个项目：

```shell
vue create vuex-demo
```

src文件夹下的目录结构：

```shell
src
├── App.vue
├── assets
│   └── logo.png
├── components
│   └── HelloWorld.vue
└── main.js # 入口文件
```

## 安装 vuex

命令行下执行：

```shell
npm i vuex
```

然后在入口文件引入 vuex ：

```js
import Vuex from 'vuex'
Vue.use(Vuex)
```

## 一个例子

为了了解 vuex 到底做了什么事情、解决了哪些问题。我们先来实现一个简单的 demo ，有一个标签显示数字，两个按钮分别做数字的 +1 和 -1 操作。

我们先在 `src/components/` 下的 Normal.vue 组件中使用纯 Vue 版本编写代码：

> Normal.vue

```html
<template>
  <div id="normal">
    <p>{{count}}
      <button @click="inc"> + </button>
      <button @click="dec"> - </button>
    </p>
  </div>
</template>

<script>

export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    inc() {
      this.count++
    },
    dec() {
      this.count--
    }
  },
}
</script>
```

然后在 `src/App.vue` 中引入并使用该组件：

```html
<template>
  <div id="app">
    <Normal></Normal>
  </div>
</template>

<script>
import Normal from '@/components/Normal'
export default {
  components: {
    Normal,
  }
}
</script>
```

命令行执行 `npm run serve` 就能运行 App 了。

如上的代码的含义是：两个 button 标签绑定函数，当点击的时候分别调用 inc 和 dec 方法，接着会调用 vue 中的 methods 的对应的方法
。然后会让 data 中的 count 属性值发生改变，改变后会把最新值渲染到视图中。

现在我们来看看使用 vuex 的方式来实现如上 demo ：

> src下新建 `vuex/store.js`

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 注意是new【Vuex.Store】实例而不是【Vuex】
export const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        inc: state => state.count++,
        dec: state => state.count--
    }
})
```

> main.js 中引入

```js
...
import store from '@/vuex/store'
...
new Vue({
  render: h => h(App),
  store
}).$mount('#app')
```

> 在 `src/components/` 下新建 SWVuex.vue 组件

```html
<template>
    <div id="vuex">
        <p>{{count}}
            <button @click="inc">+</button>
            <button @click="dec">-</button>
        </p>
    </div>
</template>

<script>
    export default {
        computed: {
            count() {
                return this.$store.state.count
            }
        },
        methods: {
            inc() {
                this.$store.commit('inc')
            },
            dec() {
                this.$store.commit('dec')
            }
        },
    }
</script>
```

> 在 App.vue 中使用 SWVuex 组件

```html
<template>
  <div id="app">
    <SWVuex></SWVuex>
  </div>
</template>

<script>
import SWVuex from '@/components/SWVuex'
export default {
  components: {
    SWVuex
  }
}
</script>
```

### 两者比较

1. 需要引用 vuex 。
2. methods 的方法不变，但是方法内的逻辑不在函数内进行，而是让 store 对象去处理。
3. count 数据不再是一个 data 函数返回的对象的属性了。而是通过 store 方法内的计算字段返回的。

回到 store 对象上来，store 对象是 Vuex.Store 的实例。在 store 内分为 state 对象和 mutations 对象，其中 state 存放的是状态，
比如 count 属性就是它的状态值，而 mutations 则是一个会引发状态改变的所有方法。

## 什么是状态管理模式

简单的理解就是**统一管理和维护各个 vue 组件的可变化状态**。

我们明白 vue 是单向数据流的，那么它的状态管理一般包含如下几部分：

1. state：驱动应用的数据（一般指 data 中返回的数据）
2. view：一般指模板，以声明的方式将 state 的数据映射到视图
3. actions：响应在 view 上的用户输入导致的状态变化

但是当我们的应用遇到多个组件共享状态时候，那么单向数据流可能不太满足我们的需求，比如：

1. 组件的多层嵌套
2. 多个视图依赖同一个状态

上面这些情况确实能在不使用 vuex 的情况下实现，但往往会导致写出无法维护的代码。因此我们可以把组件的共享状态**提取出来、全局管理**，因此 vuex 产生了。

## Vuex 的优点

最主要解决了组件之间共享同一状态的问题。可以把组件的共享状态提取出来，作为全局来管理。

## 什么情况下才推荐使用 Vuex

大型单页应用！！！如果你的项目不够大，足够简单，最好不要使用 Vuex ，一个简单的 global event bus 就足够所需了。

## State 对象状态的访问

### 通过 computed 计算属性直接赋值

```html
<template>
    <div id="vuex">
        <p>通过 $store.state 方式获取：{{$store.state.count}}</p>
        <p>通过 computed 计算属性赋值：{{count}}</p>
        <p>
            <button @click="inc">+</button>
            <button @click="dec">-</button>
        </p>
    </div>
</template>

<script>
    export default {
        computed: {
            count() {
                return this.$store.state.count
            }
        },
        methods: {
            inc() {
                this.$store.commit('inc')
            },
            dec() {
                this.$store.commit('dec')
            }
        },
    }
</script>
```

### 借助 mapState 辅助函数

#### 对象形式

```html
<template>
    <div id="vuex">
        <p>通过 $store.state 方式获取：{{$store.state.count}}</p>
        <p>通过 computed 计算属性赋值：{{count}}</p>
        <p>
            <button @click="inc">+</button>
            <button @click="dec">-</button>
        </p>
    </div>
</template>

<script>
import {mapState} from 'vuex'
    export default {
        computed: mapState({
            count: state => state.count
        }),
        methods: {
            inc() {
                this.$store.commit('inc')
            },
            dec() {
                this.$store.commit('dec')
            }
        },
    }
</script>
```

#### 数组形式

```js
// 数组中的 count 必须和 store.js 中定义的常量 count 同名，因为这是直接访问 state 的 count
computed: mapState(['count'])
```

## Getters 计算过滤操作

有时候我们需要从 store 的 state 中派生出一些状态，比如在使用 store 中的 state 之前，我们会对 state 中的某些字段进行过滤——让 count 字段都进行加 10 这样的数据操作；但是如果有多个组件需要用到这个操作的话，那么我们就需要复制这个函数，或者抽取到一个共享函数内，
然后多处导入这个函数，但是这上面两种方式都不是太好，因为我们现在有更好的方式来解决它。

Vuex 允许我们在 store 中定义 getters，getters 的返回值会根据它的依赖被缓存起来，且只有当他的依赖值发生改变了才会重新计算。

现在我们对 store.js 文件中的 count 进行一个计算属性的操作，在它每次输出之前，加上20。

如下代码有两个按钮，一个加5，一个减5，那么在加5或者减5之前，先加20，然后再进行加5或者5操作。代码如下：

> store.js

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        inc: (state, num) => state.count += num,
        dec: (state, num) => state.count -= num
    },
    getters: {
        myCount(state) {
            return state.count + 20
        }
    }
})
```

> SWVuex.vue

```html
<template>
    <div id="vuex">
        <p>通过 $store.state 方式获取：{{$store.state.count}}</p>
        <p>通过 computed 计算属性赋值：{{myCount}}</p>
        <p>
            <p>使用 $store.commit('inc', 5) 方式调用</p>
            <!-- $store.commit('inc', 5) 第一个参数是方法名，第二个是参数 -->
            <button @click="$store.commit('inc', 5)">+</button>
            <button @click="$store.commit('dec', 5)">-</button>
        </p>
        <div>
            <p>使用mapMutations修改状态：</p>
            <p>
                <button @click="inc(10)">+</button>
                <button @click="dec(10)">-</button>
            </p>
        </div>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations} from 'vuex'
    export default {
        computed: {
            // mapState(['count']) 此处的 count 必须和 store.js
            // state 中的 count 同名，因为这是直接访问 state 的 count
            ...mapState(['count']),
            // mapGetters 辅助函数，
            // 可以将 store 中的 getter 映射到局部计算属性 myCount
            ...mapGetters(['myCount'])
        },
        methods: {
            ...mapMutations(['inc', 'dec'])
        },
    }
</script>
```

## Mutations 修改状态

Mutations 是修改 vuex 中的 store 的唯一方法。每个 mutations 都有一个字符串的事件类型(type)和一个回调函数(handler)。这个回调函数就是我们进行更改的地方。它也会接受 state 作为第一个参数。

回顾上面的 `store.js` 中有关 mutations 的代码：

```js
mutations: {
    inc: (state, num) => state.count += num,
    dec: (state, num) => state.count -= num
},
```

当我们点击页面上的按钮后会触发事件并执行方法，方法中又会调用 `$store.commit(type, args)` 来传入参数改变 state 数据。

## Actions 异步修改状态

Actions 和 Mutations 类似，但它用来异步修改 state 的状态。而 Mutations 则是同步修改 state 的状态。

我们在 store.js 中声明 actions，actions 可以调用 mutations 的方法的。代码如下：

> store.js

```js
// 增加两个 actions 方法
actions: {
    incAction(context) {
        console.log(context)
        // 调用 mutations 中的 inc 方法，并传参数5
        context.commit('inc', 5)
    },
    decAction(context) {
        context.commit('dec', 5)
    }
}
```

上方代码中的参数 context 指上下文，即 store 本身。

然后在 SWVuex.vue 中通过 `this.$store.dispatch(action方法名, 参数)` 的方式调用：

```html
<template>
    <div id="vuex">
        <p>通过 $store.state 方式获取：{{$store.state.count}}</p>
        <p>通过 computed 计算属性赋值：{{myCount}}</p>
        <div>
            <p>使用 $store.commit('inc', 5) 方式调用</p>
            <!-- $store.commit('inc', 5) 第一个参数是方法名，第二个是参数 -->
            <button @click="$store.commit('inc', 5)">+</button>
            <button @click="$store.commit('dec', 5)">-</button>
        </div>
        <div>
            <p>使用mapMutations修改状态：</p>
            <p>
                <button @click="inc(10)">+</button>
                <button @click="dec(10)">-</button>
            </p>
        </div>
        <div>
            <p>actions的异步操作</p>
            <button @click="incAction"> + </button>
            <button @click="decAction"> - </button>
        </div>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations} from 'vuex'
    export default {
        computed: {
            // mapState(['count']) 此处的 count 必须和 store.js
            // state 中的 count 同名，因为这是直接访问 state 的 count
            ...mapState(['count']),
            // mapGetters 辅助函数，
            // 可以将 store 中的 getter 映射到局部计算属性 myCount
            ...mapGetters(['myCount'])
        },
        methods: {
            ...mapMutations(['inc', 'dec']),
            incAction() {
                this.$store.dispatch('incAction')
            },
            decAction() {
                this.$store.dispatch('decAction')
            },
        },
    }
</script>
```

当然，除了使用 `this.$store.dispatch()` 的方式以外，还可以借助 `mapActions` 来简化代码：

```js
// 新加 mapActions
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
...
methods: {
    ...mapMutations(['inc', 'dec']),
    ...mapActions(['incAction', 'decAction']) // +
},
```
