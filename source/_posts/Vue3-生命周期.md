---
title: Vue3生命周期
tags:
  - Vue3
categories:
  - 前端
  - 框架
  - Vue3
top: true
abbrlink: 20538
date: 2021-10-16 09:12:58
---

## getCurrentInstance 获取当前组件实例

```vue
<template>
</template>
<script>
import { getCurrentInstance } from 'vue';
export default {
  name: 'App',
  setup() {
    const instance = getCurrentInstance();
    console.log(instance);
  }
}
</script>
```

{% asset_img 1647156814286-7983bfe0-bb18-432f-86ec-c45933e88184.png 100% %}

<!-- more -->

## options api 和 composition api 区别

```javascript
import { onMounted } from 'vue';
export default {
  mounted() {}, // options api
  setup() {
    onMounted(() => {}); // composition api
  }
}
```

## beforeCreate 和 created 由 setup 代替

- setup 就相当于 beforeCreate 和 created
  - 之前 vue2 中要写在这俩钩子中的内容，都应放进 setup 中去
- 下面钩子函数都应该写在 setup 中
  - 各种钩子函数中的回调，都会在 钩子函数 执行的同时立即执行

## onBeforeMount、onMounted 和 onBeforeUpdate、onUpdated

```vue
<template>
  <div>{{ count }}</div>
</template>
<script>
import {
  getCurrentInstance,
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  watchEffect
  } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);
    setTimeout(() => {
      count.value = 1;
    }, 1000);
    watchEffect(() => {
      console.log('watchEffect count value:', count.value);
    });
    onBeforeMount(() => console.log('onBeforeMount'));
    onMounted(() => console.log('onMounted'));
    onBeforeUpdate(() => console.log('onBeforeUpdate'));
    onUpdated(() => console.log('onUpdated'));
    return {
      count
    }
  }
}
</script>
```

{% asset_img 1647157375873-653bba6f-d988-43c5-b5f8-e4e696b18fa8.png 100% %}

把 watchEffect 中的 flush 设置为 post 时，watch在 beforeUpdate 之后执行

```javascript
watchEffect(() => {
  console.log('watchEffect count value:', count.value);
}, {
  flush: 'post'
});
```

{% asset_img 1647157509943-532d5c1c-c038-4530-af01-9e0f6cd61071.png 100% %}

## onBeforeUnMount 和 onUnMounted

App.vue

```vue
<template>
  <div>
    <Item
      v-for="item of data"
      :key="item.id"
      :item="item"
      @remove="remove"
    />
  </div>
</template>
<script>
import { ref } from 'vue';
import Item from '@/components/Item.vue';
export default {
  name: 'App',
  components: {
    Item
  },
  setup() {
    const data = ref([
      {
        id: 1,
        title: 'Lance'
      },
      {
        id: 2,
        title: 'GC'
      }
    ]);
    const remove = (id) => {
      data.value = data.value.filter(v => v.id !== id);
    }
    return {
      data,
      remove
    }
  }
}
</script>
```

Item.vue

```vue
<template>
  <li>
    <span>{{ item.title }}</span>
    <button @click="remove(item.id)">remove</button>
  </li>
</template>
<script>
import { onBeforeUnmount, onUnmounted } from '@vue/runtime-core';
export default {
  name: 'Item',
  props: {
    item: Object
  },
  emits: ['remove'],
  setup(props, ctx) {
    const remove = (id) => {
      ctx.emit('remove', id);
    }

    onBeforeUnmount(() => {
      console.log(`'onBeforeUnmount': ID为${props.item.id}的项「即将」被删除`);
    });
    onUnmounted(() => {
      console.log(`'onUnmounted': ID为${props.item.id}的项「正在」被删除`);
    });

     return {
      remove
    }
  }
}
</script>
```

{% asset_img 1647158793287-2959d3f6-17f5-443e-8909-9b8559c3ecd7.png 100% %}

## onErrorCaptured

- 子组件出错，父组件可以捕获问题

Item.vue 注释掉 props item 的声明

```vue
<template>
  <li>
    <span>{{ item.title }}</span>
    <button @click="remove(item.id)">remove</button>
  </li>
</template>
<script>
import { onBeforeUnmount, onUnmounted } from '@vue/runtime-core';
export default {
  name: 'Item',
  // props: {
  //   item: Object
  // },
  emits: ['remove'],
  setup(props, ctx) {
    const remove = (id) => {
      ctx.emit('remove', id);
    }

    onBeforeUnmount(() => {
      console.log(`'onBeforeUnmount': ID为${props.item.id}的项「即将」被删除`);
    });
    onUnmounted(() => {
      console.log(`'onUnmounted': ID为${props.item.id}的项「正在」被删除`);
    });

     return {
      remove
    }
  }
}
</script>
```

App.vue 监听 onErrorCaptured

```vue
<template>
  <div>
    <Item
      v-for="item of data"
      :key="item.id"
      :item="item"
      @remove="remove"
    />
  </div>
</template>
<script>
import { onErrorCaptured, ref } from 'vue';
import Item from '@/components/Item.vue';
export default {
  name: 'App',
  components: {
    Item
  },
  setup() {
    const data = ref([
      {
        id: 1,
        title: 'Lance'
      },
      {
        id: 2,
        title: 'GC'
      }
    ]);
    const remove = (id) => {
      data.value = data.value.filter(v => v.id !== id);
    }
    onErrorCaptured((e) => {
      console.log(e);
    });
    return {
      data,
      remove
    }
  }
}
</script>
```

{% asset_img 1647159105552-a869d706-4e53-484a-a091-c5c83910ec11.png 100% %}

## onRenderTracked 和 onRenderTriggered

- render 时触发 onRenderTracked
- render 重新渲染时，触发 onRenderTriggered
- 开发环境下使用

```vue
<template>
  <div>
    <Item
      v-for="item of data"
      :key="item.id"
      :item="item"
      @remove="remove"
    />
  </div>
</template>
<script>
import { onErrorCaptured, onRenderTracked, onRenderTriggered, ref } from 'vue';
import Item from '@/components/Item.vue';
export default {
  name: 'App',
  components: {
    Item
  },
  setup() {
    const data = ref([
      {
        id: 1,
        title: 'Lance'
      },
      {
        id: 2,
        title: 'GC'
      }
    ]);
    const remove = (id) => {
      data.value = data.value.filter(v => v.id !== id);
    }
    onRenderTracked((e) => {
      debugger;
    });
    onRenderTriggered((e) => {
      debugger;
    });
    return {
      data,
      remove
    }
  }
}
</script>
```