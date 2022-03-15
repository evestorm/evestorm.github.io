---
title: Vue3依赖注入
tags:
  - Vue3
categories:
  - 前端
  - 框架
  - Vue3
top: true
abbrlink: 38334
date: 2021-10-16 11:20:19
---

- 语法
  - `provide(name, value)`
  - `inject(name, default value)` 第二个参数可选

## 基本用法

App.vue

```vue
<template>
  <inject-child></inject-child>
</template>

<script>
import injectChild from '@/components/injectChild';
import { provide } from 'vue';
export default {
  name: 'App',
  components: {
    injectChild
  },
  // provide: { // Vue2写法
  //   name: 'Lance',
  //   age: 28
  // },
  setup() {
    // Vue3写法
    provide('name', 'Lance');
    provide('age', 28);
  }
}
</script>
```

injectChild.vue

```vue
<template>
  <div>
    <div>{{ name }}</div>
    <div>{{ age }}</div>
  </div>
</template>
<script>
import { inject } from 'vue';
export default {
  name: 'InjectChild',
  // inject: ['name', 'age'] // Vue2写法
  setup() {
    // Vue3写法
    const name = inject('name');
    const age = inject('age', 'loading...');
    return {
      name,
      age
    }
  }
}
</script>
```

{% asset_img 1647178473111-afcb93d4-6db1-4ad3-b2da-252a49274464-20220315092026850.png 100% %}

<!-- more -->

## provide 响应式

### 父组件更新 provide

App.vue

```vue
<template>
  <div>
    <inject-child></inject-child>
    <button @click="changeName">改变名字</button>
  </div>
</template>

<script>
import injectChild from '@/components/injectChild';
import { provide, ref } from 'vue';
export default {
  name: 'App',
  components: {
    injectChild
  },
  setup() {
    const name = ref('Lance');
    provide('name', name);
    provide('age', 28);

    const changeName = () => {
      name.value = 'GC'; // 子组件能监听到父组件对name的更改
    }

    return {
      changeName
    }
  }
}
</script>
```

injectChild.vue

```vue
<template>
  <div>
    <div>{{ name }}</div>
    <div>{{ age }}</div>
  </div>
</template>
<script>
import { inject } from 'vue';
export default {
  name: 'InjectChild',
  setup() {
    const name = inject('name');
    const age = inject('age', 'loading...');
    return {
      name,
      age
    }
  }
}
</script>
```

### 子组件更新 provide

- 把更新函数也放进 provide 中

App.vue

```vue
<template>
  <div>
    <inject-child></inject-child>
  </div>
</template>

<script>
import injectChild from '@/components/injectChild.vue';
import { provide, ref } from 'vue';
export default {
  name: 'App',
  components: {
    injectChild
  },
  setup() {
    const name = ref('Lance');
    const changeName = () => {
      name.value = 'GC';
    }

    provide('name', name);
    // 父组件把更改函数通过 provide 传递给 子组件
    provide('changeName', changeName);
  }
}
</script>
```

injectChild.vue

```vue
<template>
  <div>
    <div>{{ name }}</div>
    <button @click="changeName">改变名字</button>
  </div>
</template>
<script>
import { inject } from 'vue';
export default {
  name: 'InjectChild',
  setup() {
    const name = inject('name');
    const changeName = inject('changeName');
    return {
      name,
      changeName
    }
  }
}
</script>
```

### 如果不希望子组件更改provide，可以用readonly包裹provide

App.vue

```vue
<template>
  <div>
    <inject-child></inject-child>
  </div>
</template>

<script>
import injectChild from '@/components/injectChild_子组件改变provide.vue';
import { provide, ref, readonly } from 'vue';
export default {
  name: 'App',
  components: {
    injectChild
  },
  setup() {
    const name = ref('Lance');
    const changeName = () => {
      name.value = 'GC';
    }
    // 这样子组件就无法更改name了（如果不用readonly包裹，子组件可以直接更新 name.value）
    provide('name', readonly(name));
    // 父组件把更改函数通过 provide 传递给 子组件
    provide('changeName', changeName);
  }
}
</script>
```

injectChild.vue

```vue
<template>
  <div>
    <div>{{ name }}</div>
    <button @click="changeName">改变名字</button>
    <button @click="injectChildChangeName">子组件改变name</button>
  </div>
</template>
<script>
import { inject } from 'vue';
export default {
  name: 'InjectChild',
  setup() {
    const name = inject('name');
    const changeName = inject('changeName');
    const injectChildChangeName = () => {
      name.value = 'Sherry'; // 无法更改父组件name
    }
    return {
      name,
      changeName,
      injectChildChangeName
    }
  }
}
</script>
```

{% asset_img 1647179370254-19943736-4470-434d-82a3-f319e57a3d66-20220315092026852.png 100% %}

{% asset_img 1647179361665-abb4f2a2-2d23-4d26-b4e9-439f98926fc3-20220315092026851.png 100% %}
