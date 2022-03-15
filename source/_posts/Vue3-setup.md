---
title: Vue3-setup
tags:
  - Vue3
categories:
  - 前端
  - 框架
  - Vue3
top: true
abbrlink: 52230
date: 2021-10-15 08:53:19
---

# 升级脚手架

```shell
npm i @vue/cli -g

vue create 项目名称
```

{% asset_img 1646820208737-dbfbb531-0b7c-457a-96bc-5d75458933ad.png 100% %}

# composition api （组合API）概念

- 组合API
- 框架层面的
- 把 api 拆分成一个个 hook（钩子） → 最后组合起来形成 → Vue3.0 Composition API 框架设计模式

```javascript
import { watch, ref, toRef, onMounted, computed } from 'vue';
// 在 setup 中使用 composition api
```

<!-- more -->

# setup

## 存在意义

setup 的存在，就是为了能够在其中使用 Composition API

## 🌈 调用时机

**props 初始化完毕之后，beforeCreate 之前被调用**

{% asset_img 1646821099930-b61bd5b6-1899-4799-a739-7b51d1586365.png)![img](/Users/yangliang/Downloads/123.assets/1646821090910-5aec68f7-91a1-4397-85e2-644054d1925c.png 100% %}

## 基本使用

```vue
<template>
  <div>{{ count }}</div>
</template>

<script>
export default {
  name: 'App',
  setup() {
    return {
      count: 0
    }
  },
}
</script>
```

## 返回值

- return 一个对象，对象中的属性会被合并到 render 函数的上下文中供 template 使用
- return 一个render函数，可以渲染模板

### render function

- 可以把 template 删掉，在 setup 中直接 return 一个函数渲染模板

```vue
<script>

import { ref, h } from 'vue';

export default {
  name: 'App',
  setup() {
    const count = ref(0);
    return () => h('h1', [count.value]);
  }
}
</script>
```

### render JSX

```vue
<script>
  export default {
    name: 'App',
    setup() {
      return () => <div>123</div>;
    }
  }
</script>
```

## 参数

- props 接收的属性
  - **不要在** `**setup**` **中解构 props** ，会导致 props 被解构的值**丧失响应式**
    - ❌ `setup({ title })`
    - ❌  `const { title } = props`
- context 上下文选项列表
  - attrs
  - slots
  - emit
  - expose
- 为什么不把 props 和 context 合并在一起当一个参数
  - props 使用比 attrs、emit 更频繁
  - 可以更好的为 props 做类型推断（TS）

### props

父组件 App.vue

```vue
<template>
  <div>
    <Test :title="title" />
  </div>
</template>

<script>

import { ref, h } from 'vue';
import Test from '@/components/Test';

export default {
  name: 'App',
  setup() {
    const title = ref('Lance');
    setTimeout(() => {
      title.value = 'Lance233';
    }, 1000);
    return {
      title
    };
  },
  components: {
    Test
  }
}
</script>
```

子组件 Test.vue

```vue
<template>
  <h1>{{ title }}</h1>
</template>

<script>
import { watch, watchEffect } from 'vue';
export default {
  name: 'Test',
  props: {
    title: String
  },
  setup(props) {
    console.log(props); // Proxy { title: 'Lance' }
    watchEffect(() => {
      console.log('title:', props.title); // 初始化Lance和变化后Lance233都能监听到
    });
    
    watch(() => {
      return props.title; // 要监听的值
    }, (newVal) => {
      console.log('new Title:', newVal); // 只会监听变化后的值
    });
  }
}
</script>
```

{% asset_img 1646823255004-911a33bc-b082-4fe9-8b94-b82e9a0692d5.png 100% %}

{% asset_img 1646823398496-a387ce70-35a6-48b9-a4e5-c13038b8ab81.png 100% %}

{% asset_img 1646823549535-215fda0c-75bb-4847-b169-269dc7e74254.png 100% %}

### context

- 区别于 props ，可以被解构
  - `setup(props, { attrs, slots })`
  - `const { attrs, slots } = context`
- 包含选项列表
  - attrs
  - slots
  - emit
  - expose

```vue
<template>
  <h1>{{ title }}</h1>
</template>

<script>
export default {
  name: 'Test',
  props: {
    title: String
  },
  setup(props, context) {
    console.log(context);
  }
}
</script>
```

{% asset_img 1646824003882-a4ff19d5-5699-45b9-92c2-5ef521c51d46.png 100% %}

#### attrs

- `ctx.attrs`
- return 的时候最好别展开

```vue
<template>
  <h1>{{ attrs.title }}</h1>
</template>

<script>
export default {
  name: 'Test',
  // props: {
  //   title: String
  // },
  setup(props, context) {
    console.log(context.attrs); // 有 title 了
    // 注意得把 props 中的 title 注释掉，才能出现在 attrs 中
    return {
      attrs: context.attrs
    }
  }
}
</script>
```

{% asset_img 1646824430213-67d4449a-c1f1-45c5-a9e2-9c1873bb0d5a.png 100% %}

- 展开后就没有响应式了

```vue
<template>
  <h1>{{ title }}</h1>
</template>

<script>
export default {
  name: 'Test',
  setup(props, context) {
    return {
      ...context.attrs // 展开后就没有响应式了
    }
  }
}
</script>
```

#### emit

- `ctx.emit('事件名', 值)`
- 注册: `emits: ['事件名']`

父组件

```vue
<template>
  <div>
    <Test :count="count" @plus="plus" />
  </div>
</template>

<script>

import { ref } from 'vue';
import Test from '@/components/Test';

export default {
  name: 'App',
  setup() {
    const count = ref(0);
    const plus = num => count.value += num;
    return { count, plus };
  },
  components: { Test }
}
</script>
```

子组件

```vue
<template>
  <div>{{ count }}</div>
  <button @click="plus">增加</button>
</template>

<script>
export default {
  name: 'Test',
  props: {
    count: Number
  },
  emits: ['plus'],
  setup(props, ctx) {
    const plus = () => ctx.emit('plus', 100);
    return { plus }
  }
}
</script>
```

#### setup 中的ctx与getCurrentInstance中的ctx的区别

```javascript
export default {
  setup(props, ctx) {
    console.log(ctx); // 当前setup执行的时候的一个上下文
    console.log(getCurrentInstance().ctx); // 当前组件实例的执行上下文
  }
}
```

## 🌈 setup 中 this 为 undefined

- setup 在组件实例化完成之前，是拿不到当前组件实例的（props之后，beforeCreate之前）