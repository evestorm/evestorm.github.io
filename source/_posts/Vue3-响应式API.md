---
title: Vue3响应式API
tags:
  - Vue3
categories:
  - 前端
  - 框架
  - Vue3
top: true
abbrlink: 6721
date: 2021-10-15 09:01:52
---

## reactive

- 接收一个**对象**，返回一个响应式的被Proxy包装过的对象（返回的对象 不等于 源对象）
  - 基本类型无法被 reactive 代理
- 等同于 Vue2.0 中的 `Vue.observable()`
- 原理：Proxy 代理
  - **深度响应**
  - **递归代理**

<!-- more -->

```vue
<template>
  <div>{{ proxyObj.name }}</div>
</template>

<script>
import { reactive } from 'vue';

export default {
  name: 'App',
  setup() {
    const proxyObj = reactive({
      name: 'Lance',
      age: 233
    });

    console.log(proxyObj);
    
    return {
      proxyObj
    }
  }
}
</script>
```

{% asset_img 1646907263944-c9ce8065-cc0a-4b7e-8c14-46cc35605336.png 100% %}

```vue
<template></template>
<script>
import { reactive } from 'vue';
export default {
  name: 'App',
  setup() {
    const obj = reactive(1); // 无法包装基本类型
  }
}
</script>
```

{% asset_img 1647136979250-6937a003-38d1-41f0-b03b-0cea5288e65f.png 100% %}

## 🌈 ref

- **数据响应式**
  - ref(基本类型的值)
    - return 一个 RefObject，其中的 value 就是ref包裹的值
  - ref(复杂类型的值)
    - return 一个 RefObject，其中的 value 是用 reactive 包装过的 Proxy 代理对象
- **得通过** `**.value**` **的方式读写属性**
- return 出去后会被 vue **自动拆包，template** 中不需要 `.value` 访问

```vue
<template>
  <div>{{ count }}</div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'App',
  setup() {
    const count = ref(0);
    console.log("count:", count);
    console.log("===");
    console.log("count.value:", count.value);
    console.log("===");

    const obj = ref({
      name: 'Lance',
      age: 233,
      info: {
        grade: 120
      }
    });

    console.log("obj", obj);
    console.log("===");
    console.log("obj.value", obj.value); // 第一层需要 .value 拆包
    console.log("===");
    console.log("obj.value.info", obj.value.info); // 后续都是 Proxy 对象了，不用拆包
    console.log("===");
    console.log("obj.value.info.grade", obj.value.info.grade);
    
    return {
      count,
      obj
    }
  }
}
</script>
```

{% asset_img 1646909423008-a47fd37a-0b9e-49ae-ad01-2f37be6cb9dd.png 100% %}

### reactive包裹ref

- 就不用再对此 ref 拆包 `.value` 了

```vue
<template>
  <div>{{ proxyObj.count }}</div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  name: 'App',
  setup() {
    const count = ref(0);
    const proxyObj = reactive({
      name: 'Lance',
      age: 233,
      count // 相当于vue给你解包了：count: count.value
    });

    console.log(proxyObj.count); // 所以此处不用再 .value，template 中 也不用
    
    return {
      proxyObj
    }
  }
}
</script>
```

### 新的ref会覆盖老的ref

```vue
<template>
  <div>{{ count }}</div>
</template>

<script>
import { reactive, ref } from 'vue';

export default {
  name: 'App',
  setup() {
    const count = ref(0);
    
    const state = reactive({
      count
    });

    const newCount = ref(1);
    state.count = newCount; // 新的ref替换旧的ref
    console.log("state.count:", state.count); // 新的会覆盖旧的
    console.log("count:", count.value); // 原来的不变
    
    return {
      count,
      state
    }
  }
}
</script>
```

{% asset_img 1646908426634-c50fc760-99fe-4ca2-ae67-1961d83ff71d.png 100% %}

### ref放进数组、Map等原始集合类型的reactive中时不会自动拆包

- native collection type（array、Map、Set、...）

```vue
<template>
  <div>{{ count }}</div>
</template>

<script>
import { reactive, ref } from 'vue';

export default {
  name: 'App',
  setup() {
    const count = ref(0);

    const arr = reactive([count]);
    console.log(arr[0].value); // 需要手动拆包

    const map = reactive( new Map( [['name', ref(233)]] ) );
    console.log(map.get('name').value); // 需要手动拆包
    
    return {
      count
    }
  }
}
</script>
```

{% asset_img 1646908773357-cc569fae-5362-48ee-84db-38a7d7fb61cd.png 100% %}

## unref

- 拆包语法糖
- 如果被包裹值是个 ref ，就返回拆包后的 `.value` 值；否则就返回原值

### 原理

```vue
<template></template>

<script>
import { isRef, ref } from 'vue';
export default {
  name: 'App',
  setup() {
    const info = {
      name: 'Lance',
      age: 233
    };
    const refInfo = ref({
      name: 'GC',
      age: 111
    });

    const obj = isRef(info) ? info.value : info;
    const obj2 = isRef(refInfo) ? refInfo.value : refInfo;
    console.log(obj);
    console.log(obj2);
  }
}
</script>
```

{% asset_img 1646909950255-9454bf23-843b-4ad1-a473-1485fedae167.png 100% %}

### 使用

```vue
<template>
  <div></div>
</template>

<script>
import { ref, unref } from 'vue';
export default {
  name: 'App',
  setup() {
    const info = {
      name: 'Lance',
      age: 2333
    };
    const refInfo = ref({
      name: 'GC',
      age: 111
    });

    const obj = unref(info); // 返回原始对象
    const obj2 = unref(refInfo); // 会拆包，返回 Proxy 对象
    console.log(obj);
    console.log(obj2);
  }
}
</script>
```

{% asset_img 1646910174254-5513542a-aa29-4783-b11b-934df576bd08.png 100% %}

## toRef

- 主要针对的是 reactive 中的数据
- toRef 的值更新，会同步 reactive 对象中的相同属性更新
- reactive 对象属性更新，对应 toRef 值也会更新
- 使用场景：

- - 不需要整个 reactive 响应式对象，只想使用其下的某个属性单独拿出来作为响应式 ref 使用

```vue
<template></template>

<script>
import { reactive, toRef } from 'vue';

export default {
  name: 'App',
  setup() {
    const state = reactive({
      name: 'Lance'
    });
    const nameRef = toRef(state, 'name');
    nameRef.value = 'GC';
    console.log(state.name); // 同步更新了
    state.name = 'Lance';
    console.log(nameRef.value); // 也更新了
  }
}
</script>
```

### 使用场景：自定义 composition api 中使用响应式对象下某个属性

```vue
<template></template>

<script>
import { reactive, toRef } from 'vue';

function useDoSth(name) {
  return `My name is ${name.value}`;
}
export default {
  name: 'App',
  setup() {
    const state = reactive({
      name: 'Lance'
    });
    const nameRef = toRef(state, 'name');
    
    const sentence = useDoSth(nameRef);
    console.log(sentence);
  }
}
</script>
```

{% asset_img 1646910891822-3a621501-efeb-4770-ab9c-d4fc4512dc3f.png 100% %}

## 🌈 toRefs

- 给 reactive 响应式对象下每个属性都转成 ref

```vue
<template></template>

<script>
import { reactive, toRefs } from 'vue';

export default {
  name: 'App',
  setup() {
    const state = reactive({
      name: 'Lance',
      age: 233,
      info: {
        grade: 100
      }
    });
    const stateRefs = toRefs(state);
    console.log(stateRefs);
    console.log(stateRefs.name.value);
  }
}
</script>
```

{% asset_img 1646911229231-891dd691-e7df-4963-a9dd-666cf715919f.png 100% %}

### 作用

- 展开 reactive ，能在 template 中省去对象名直接访问对象下的属性

```vue
<template>
  <div>
    <!-- 通过 reactive 访问属性 -->
    <div>{{ state.name }}</div>
    <!-- 通过 toRefs reactive 之后越过对象名直接访问属性 -->
    <div>{{ name }}</div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';

export default {
  name: 'App',
  setup() {
    const state = reactive({
      name: 'Lance',
      age: 233,
      info: {
        grade: 100
      }
    });
    const stateRefs = toRefs(state);
    
    return {
      state,
      ...stateRefs
    }
  }
}
</script>
```

{% asset_img 1646911517689-3958cefa-921e-49ed-a9db-2d635cd80da6.png 100% %}

## isRef

- 判断一个值是不是 ref 值

```vue
<template></template>

<script>
import { reactive, toRefs, isRef } from 'vue';

export default {
  name: 'App',
  setup() {
    const state = reactive({
      name: 'Lance',
      age: 233,
      info: {
        grade: 100
      }
    });
    const stateRefs = toRefs(state);
    console.log("isRef(stateRefs):", isRef(stateRefs));
    console.log("isRef(stateRefs.name):", isRef(stateRefs.name));
    return {
      state,
      ...stateRefs
    }
  }
}
</script>
```

{% asset_img 1646911694478-59a0ee81-375b-4dff-b2e1-02ba093db013.png 100% %}

## 🌈 customRef

- 自定义ref
- 应用：防抖节流

```vue
<template>
  <div>
    <span>{{ text }}</span>
    <input type="text" v-model="text">
  </div>
</template>

<script>
import { customRef } from 'vue';

/**
 * value: 值
 * delay: 延迟
 */
function useDebounce(value, delay = 200) {
  let t = null;

  // 返回 customRef, customRef 接收一个工厂函数
  /**
   * track: getter访问时执行
   * trigger: setter触发更新时执行
   */
  return customRef((track, trigger) => {
    // 返回一个对象, 包含 getter、setter
    return {
      get() {
        track();
        return value;
      },
      set(newVal) {
        clearTimeout(t);
        t = setTimeout(() => {
          value = newVal;
          trigger();
        }, delay);
      }
    }
  });
}
export default {
  name: 'App',
  setup() {
    const text = useDebounce('', 500);
    return {
      text
    }
  }
}
</script>
```

{% asset_img 1646912349889-c3e915a5-708c-484a-ae89-49d2a5b8b694.png 100% %}

## shallowRef/triggerRef

### shallowRef

- 如果 `shallowRef()` 的是个对象，则不会把它包装成 reactive 响应式对象，但对象本身改变能够被监听到

```vue
<template>
  <div>{{ shallowInfo.name }}</div>
</template>
<script>
import { isReactive, ref, shallowRef } from 'vue';
export default {
  name: 'App',
  setup() {
    const info = ref({
      name: 'Lance'
    })
    info.value.name = 'Lance1'
    console.log(info.value); // Proxy { name: 'Lance1' }
    console.log(isReactive(info.value)); // true

    const shallowInfo = shallowRef({
      name: 'GC'
    });
    setTimeout(() => {
      // shallowInfo.value.name = 'GC1'; // shadowRef 会追踪 value 本身的变化（直接赋值新对象）；但不会把value包装成reactive响应式对象
      shallowInfo.value = { name: 'GC1' }; // 页面1s后变成 GC1
    }, 1000);
    // shallowInfo.value.name = 'GC1';
    console.log(shallowInfo); // 普通值 { name: 'GC1' }
    console.log(isReactive(shallowInfo)); // false

    return {
      shallowInfo
    }
  }
}
</script>
<template>
  <div>{{ shallowInfo.name }}</div>
</template>
<script>
import { isReactive, ref, shallowRef, watchEffect } from 'vue';
export default {
  name: 'App',
  setup() {
    const shallowInfo = shallowRef({
      name: 'GC'
    });
    
    watchEffect(() => {
      console.log(shallowInfo.value.name); // 监听不到
    });
    shallowInfo.value.name = 'GC1'; // 上边 watchEffect 监听不到这里的变化

    return {
      shallowInfo
    }
  }
}
</script>
```

### triggerRef

- 上边 `shallowRef` 的变化监听不到了，如果想要监听，就用 `triggerRef` 手动触发监听

```vue
<template>
  <div>{{ shallowInfo.name }}</div>
</template>
<script>
import { isReactive, ref, shallowRef, triggerRef, watchEffect } from 'vue';
export default {
  name: 'App',
  setup() {
    const shallowInfo = shallowRef({
      name: 'GC'
    });
    
    watchEffect(() => {
      console.log(shallowInfo.value.name); // 监听不到
    });
    shallowInfo.value.name = 'GC1'; // 上边 watchEffect 监听不到这里的变化
    triggerRef(shallowInfo); // 手动触发更新: watchEffect 监听到了；template也更新了

    return {
      shallowInfo
    }
  }
}
</script>
```

## 🌈 computed

- 返回一个不可变的响应式ref，computed 的返回值是从 Proxy 的 getter 中取的
- 内部也是用 Proxy 实现的
- 用法
  - `computed(() => 'xxx')`
  - `computed({ get() {}, set() {} })`

```vue
<template>
  <div>{{ sentence }}</div>
</template>

<script>
import { ref, computed } from 'vue';
export default {
  name: 'App',
  setup() {
    const name = ref('Lance');
    const sentence = computed(() => `欢迎${name.value}的到来`);
    return {
      sentence
    }
  }
}
</script>
<template>
  <div>{{ sentence }}</div>
  <div>{{ sentence2 }}</div>
</template>

<script>
import { ref, computed } from 'vue';
export default {
  name: 'App',
  setup() {
    const name = ref('Lance');
    const sentence = computed(() => `欢迎${name.value}的到来`);
    const sentence2 = computed({
      get() {
        return `获取${name.value}`
      },
      set(val) {
        console.log(`我被修改成了${val}`);
        name.value = 'GC';
      }
    });
    sentence2.value = 233;
    return {
      sentence,
      sentence2
    }
  }
}
</script>
```

## readonly

- 深度设置属性的 readonly

```vue
<template>
  <div>123</div>
</template>
<script>
import { reactive, readonly, watchEffect } from 'vue';
export default {
  name: 'App',
  setup() {
    const reactiveObj = reactive({
      name: 'Lance',
      info: {
        grade: 120,
        weight: 130
      }
    });
    const readonlyReactiveObj = readonly(reactiveObj);

    reactiveObj.name = 'GC';
    console.log(reactiveObj); // 能够改变
    readonlyReactiveObj.name = 'GC1'; // info 下的属性也无法改变
    console.log(readonlyReactiveObj); // 无法改变

    watchEffect(() => {
      console.log(readonlyReactiveObj.name);
      // 源对象reactiveObj改变，readonlyReactiveObj也会同步更新，而且会被 watchEffect 监听到
    });
  }
}
</script>
```

{% asset_img 1647075389173-cfdd9248-6cb1-4539-986e-aecc5b3a2d97.png 100% %}

## 🌈 watchEffect

- 首次加载会被立即执行一次
- 自动收集 watchEffect 中的依赖
- 依赖改变后，watchEffect 会被重新执行一次
- 组件被卸载后会自动停止（unmounted）
- watchEffect 返回 stop 函数，显示的执行能够立即停止 watchEffect 的监听
- 执行时期
  - 首次执行：在组件 `mounted` 之前被调用
  - 后续执行：默认在组件 `beforeUpdate` ，也就是组件更新之前被调用

```vue
<template>
  <div></div>
</template>
<script>
import { ref, watchEffect } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);

    const stop = watchEffect(() => {
      console.log(count.value); // 0 2
    });
    setTimeout(() => {
      stop();
      // 此处显示调用后，就无法监听到下边 3s 后对 count.value 的改变了
    }, 2000);

    setTimeout(() => {
      count.value = 2;
    }, 1000);

    setTimeout(() => {
      count.value = 233; // 没能被 watchEffect 监听到，因为被显示 stop 了
    }, 3000);
  }
}
</script>
```

### 清除副作用

- 有时我们会在 watchEffect 中做一些副作用操作
  - e.g. axios 异步数据数据、Promise、input 防抖搜索
  - 此刻传入 watchEffect 中的函数是个异步函数
  - 我们可以在 onInvalidate 回调中清除副作用
- onInvalidate 执行时机
  - watch(副作用) 即将被执行时
  - watch 被 stop 停止

```vue
<template>
  <div></div>
</template>
<script>
import { ref, watchEffect } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);
    // effect function（副作用函数） 指的是：
        // async (onInvalidate) => {} 这个异步函数整体
    // effect（副作用）指的是：
        // const data = await Promise.resolve(count.value); 这个异步Promise
    const stop = watchEffect(async (onInvalidate) => {
      const data = await Promise.resolve(count.value);
      console.log(data);

      onInvalidate(() => {
        // 可以在 onInvalidate 回调中拦截 上边 await 函数产生的副作用
        // 即 onInvalidate 会在外层这个副作用函数（async (onInvalidate) => {}）调用之前执行
        console.log('onInvalidate is triggered');
      });
    });
    setTimeout(() => {
      count.value = 2;
    }, 1000);
    setTimeout(() => {
      stop();
      console.log('watchEffect is stopped');
    }, 2000);
  }
}
</script>
```

{% asset_img 1647078456088-eba4dbd0-ba20-4c0a-9954-f45c7b4b449e.png 100% %}

即使没有产生副作用，onInvalidate 也先于 watchEffect 函数执行：

```vue
<template></template>
<script>
import { ref, watchEffect } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);
    const stop = watchEffect((onInvalidate) => {
      console.log(count.value);

      onInvalidate(() => {
        // 此回调也会先于 上边 log 所在的函数之前执行
        console.log('onInvalidate is triggered');
      });
    });
    setTimeout(() => {
      count.value = 2;
    }, 1000);
    setTimeout(() => {
      stop();
      console.log('watchEffect is stopped');
    }, 2000);
  }
}
</script>
```

{% asset_img 1647078656470-61e439a6-3ebb-4b98-8298-ffa5f787dae7.png 100% %}

更清晰的例子：

```vue
<template></template>
<script>
import { ref, watchEffect } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);
    function getData() {
      return new Promise((resolve, reject) => {
        resolve(100);
      });
    }
    watchEffect(async (onInvalidate) => {
      console.log("count.value", count.value);
      const data = await getData();
      console.log("data", data);
      onInvalidate(() => {
        console.log('onInvalidate is triggered');
      });
    });
    setTimeout(() => {
      count.value = 233;
    }, 1000);
  }
}
</script>
```

1. 先立即执行一次 watchEffect 打印 count.value 0，接着打印 data 100
2. 然后1s后改变了count
3. 在 watchEffect 执行之前先执行了 onInvalidate 中的回调 `onInvalidate is triggered`
4. 然后才再次执行 watchEffect 打印 count.value 233，最后打印 data 100

{% asset_img 1647079962315-2ce5c980-a860-4f76-8b34-d94df0fcfbee.png 100% %}

- 如果 watchEffect 产生了副作用，vue会自动捕获这个异步函数隐式返回的promise的错误

```vue
<template></template>
<script>
import { ref, watchEffect } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);
    function getData() {
      return new Promise((resolve, reject) => {
        reject('err');
      });
    }
    watchEffect(async (onInvalidate) => {
      console.log("count.value", count.value);
      const data = await getData();
      console.log("data", data);
      onInvalidate(() => {
        console.log('onInvalidate is triggered');
      });
    });
    setTimeout(() => {
      count.value = 233;
    }, 1000);
  }
}
</script>
```

{% asset_img 1647080391398-2d8681e0-2051-4af5-845f-b0b80fa18ff6.png 100% %}

### 副作用刷新时机

当一个用户定义的副作用函数进入队列时，默认情况下，会在**所有的组件 update 前执行**

- **也就是说，watchEffect 会在组件更新之前调用**

```vue
<template>
  <div>{{ count }}</div>
</template>
<script>
import { ref, watchEffect, onBeforeUpdate } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);
    setTimeout(() => {
      count.value = 2333;
    }, 1000);
    watchEffect(() => {
      console.log(count.value);
    });
    onBeforeUpdate(() => {
      console.log('onBeforeUpdate');
    });
    return {
      count
    }
  }
}
</script>
```

{% asset_img 1647089087587-c429cadb-f1a6-4761-a344-da78cdb16386.png 100% %}

如果想要在组件更新之后才调用，则给 watchEffect 追加一个参数，参数是对象，设置 `flush` 属性

- flush
  - `pre` 默认值：组件更新前调用
  - `post` ：组件更新后调用
  - `sync` ：同步执行（用得少）

```vue
<template>
  <div>{{ count }}</div>
</template>
<script>
import { ref, watchEffect, onBeforeUpdate } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);
    setTimeout(() => {
      count.value = 2333;
    }, 1000);
    watchEffect(() => {
      console.log(count.value);
    }, {
      flush: 'post'
    });
    onBeforeUpdate(() => {
      console.log('onBeforeUpdate');
    });
    return {
      count
    }
  }
}
</script>
```

{% asset_img 1647089101778-e7ed038b-c9c2-4d94-9fcc-87614f72a78d.png 100% %}



- 首次执行 watchEffect ，是在组件 `mounted` 之前被调用

```vue
<template>
  <div>{{ count }}</div>
</template>
<script>
import { ref, watchEffect, onBeforeUpdate, onMounted } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);
    setTimeout(() => {
      count.value = 2333;
    }, 1000);
    watchEffect(() => {
      console.log(count.value);
    });
    onMounted(() => {
      console.log('onMounted');
    });
    onBeforeUpdate(() => {
      console.log('onBeforeUpdate');
    });
    return {
      count
    }
  }
}
</script>
```

{% asset_img 1647089480881-14202643-7708-41ff-8bac-0dfb73986df7.png 100% %}

- 如果需要在 watchEffect 中使用到 DOM ，请在外表包裹一层 `onMounted`

```vue
<template>
  <div ref="myRef"></div>
</template>
<script>
import { ref, watchEffect, onMounted } from 'vue';
export default {
  name: 'App',
  setup() {
    const myRef = ref(null);
    
    onMounted(() => {
      watchEffect(() => {
        console.log(myRef.value);
      });
    });
    return {
      myRef
    }
  }
}
</script>
```

{% asset_img 1647089672030-b7e44d43-8af5-4957-831c-79eab4d0046d.png 100% %}

### watch debug

- watchEffect 第二个参数对象中接收两个函数
  - `onTrack` 依赖被追踪时被调用
  - `onTrigger` 依赖变更导致 watch 副作用被触发时被调用
  - 要调试的时候就在这俩函数中打 `debugger`
  - 这俩函数只会在开发模式下生效，生产环境不生效

```vue
<template>
  <div>{{ count }}</div>
</template>
<script>
import { ref, watchEffect } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);
    setTimeout(() => {
      count.value = 2333;
    }, 1000);
    watchEffect(() => {
      console.log(count.value);
    }, {
      onTrack(e) { // 依赖项被追踪时调用
        console.log('track', e);
      },
      onTrigger(e) { // 依赖更新导致watch副作用被调用时调用
        debugger;
        console.log('trigger', e);
      }
    });
    return {
      count
    }
  }
}
</script>
```

{% asset_img 1647090263688-d608c3ec-15d1-46f6-8e00-a40a1135fa1b.png 100% %}

## 🌈 watch

- 懒加载
  - 区别于 watchEffect ，首次加载不被监听
- 接收两个函数
  - 第一个函数中：return 要监听的对象
  - 第二个函数中：监听后要处理的逻辑

### 监听单个值

```vue
<template>
  <div>{{ count }}</div>
</template>
<script>
import { ref, watch } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);
    setTimeout(() => {
      count.value = 233;
    }, 1000);
    // 第一种写法
    watch(() => {
      return count.value; // 要监听的对象
    }, (newVal, oldVal) => {
      console.log(count.value);
      console.log('newVal:', newVal, 'oldVal:', oldVal);
    });
    // 简写
    watch(() => count.value, (newVal, oldVal) => {
      console.log(count.value);
      console.log('newVal:', newVal, 'oldVal:', oldVal);
    });
    return {
      count
    }
  }
}
</script>
```

{% asset_img 1647091468788-93cc179d-6527-4d8a-87ef-7285de1dfb55.png 100% %}

第二种写法：

- 只支持 `ref` ，`reactive` 数据只能用第一种方案

```vue
<template>
  <div>{{ count }}</div>
</template>
<script>
import { ref, watch } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);
    setTimeout(() => {
      count.value = 233;
    }, 1000);
    // 第二种写法
    watch(count, (newVal, oldVal) => {
      console.log(count.value);
      console.log('newVal:', newVal, 'oldVal:', oldVal);
    });
    return {
      count
    }
  }
}
</script>
```

- reactive:

```vue
<template>
  <div></div>
</template>
<script>
import { reactive, watch } from 'vue';
export default {
  name: 'App',
  setup() {
    const obj = reactive({
      name: 'lance'
    });
    setTimeout(() => {
      obj.name = 'GC';
    }, 1000);
    watch(() => {
      return obj.name;
    }, () => {
      console.log(obj.name);
    });
    // 简写形式：
    watch(() => obj.name, () => {
      console.log(obj.name);
    });
  }
}
</script>
```

### 监听多个值

```vue
<template></template>
<script>
import { ref, watch } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);
    const name = ref('张三');
    setTimeout(() => {
      count.value = 1;
      name.value = '李四';
    }, 1000);
    watch(() => {
      return [count.value, name.value];
    }, ([newCount, newName], [oldCount, oldName]) => {
      console.log({
        'newCount': newCount,
        'newName': newName,
        'oldCount': oldCount,
        'oldName': oldName
      });
    });
  }
}
</script>
```

{% asset_img 1647093277494-abf6c488-4798-4dea-8017-666f5bcb34e2.png 100% %}

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <p>{{ name }}</p>
    <button @click="changeName">change</button>
  </div>
</template>
<script>
import { ref, watch } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);
    const name = ref('张三');

    const changeName = () => {
      name.value = '李四';
    }

    watch(() => {
      return [count.value, name.value];
    }, ([newCount, newName], [oldCount, oldName]) => {
      console.log(newName); // 李四
    });

    return {
      count,
      name,
      changeName
    }
  }
}
</script>
```

### 与 watchEffect 共享的行为

watch 与 [watchEffect](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#watcheffect)共享[停止侦听](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#停止侦听)，[清除副作用](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#清除副作用) (相应地 onInvalidate 会作为回调的第三个参数传入)、[副作用刷新时机](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#副作用刷新时机)和[侦听器调试](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#侦听器调试)行为。

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <p>{{ name }}</p>
    <button @click="changeName">change</button>
  </div>
</template>
<script>
import { onBeforeUpdate, ref, watch } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);
    const name = ref('张三');

    const changeName = () => {
      console.log('点击按钮后');
      name.value = '李四';
    }

    watch(() => {
      return [count.value, name.value];
    }, ([newCount, newName], [oldCount, oldName]) => {
      console.log(newName);
    }, {
      flush: 'post',
      onTrack(e) {
        console.log('onTrack', e);
      },
      onTrigger(e) {
        console.log('onTrigger', e);
      }
    });

    onBeforeUpdate(() => {
      console.log('onBeforeUpdate');
      // 默认先 watch 后 onBeforeUpdate
      // flush: 'post' 之后, 先 onBeforeUpdate 后 watch
    });

    return {
      count,
      name,
      changeName
    }
  }
}
</script>
```

{% asset_img 1647093533850-75c4d88c-e654-409d-be63-493e039cb73a.png 100% %}

- onInvalidate 作为回调的第三个参数

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="changeCount">change</button>
  </div>
</template>
<script>
import { ref, watch } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);

    const changeCount = () => {
      console.log('点击按钮后');
      count.value++;
    }

    watch(() => {
      return count.value;
    }, (newCount, oldCount, onInvalidate) => {
      console.log(newCount, oldCount);
      onInvalidate(() => {
        console.log('onInvalidate is triggered');
      });
    });

    return {
      count,
      changeCount
    }
  }
}
</script>
```

- 注意下方第一次点击后并没有触发 onInvalidate
- 说明第一次才注册，第二次追踪依赖变化，再变化前执行

{% asset_img 1647094035226-10558a09-1500-40f0-a5a5-87aaf23e8a37.png 100% %}

- 显示调用 stop 函数

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="changeCount">change</button>
  </div>
</template>
<script>
import { ref, watch } from 'vue';
export default {
  name: 'App',
  setup() {
    const count = ref(0);

    const changeCount = () => {
      console.log('点击按钮后');
      count.value++;
    }

    const stop = watch(() => {
      return count.value;
    }, (newCount, oldCount) => {
      console.log(newCount, oldCount);
    });

    setTimeout(() => {
      stop();
    }, 5000);

    return {
      count,
      changeCount
    }
  }
}
</script>
```

{% asset_img 1647094146064-017510d8-071c-48da-ae9f-2224072627c3.png 100% %}

## isProxy

- 检查一个对象是否是被 **reactive 或者 readonly** 代理的对象

- - 普通对象为 false
  - **自己 new 的 Proxy 对象为 false**

```vue
<template>
  
</template>

<script>
import { reactive, readonly, isProxy } from 'vue';
export default {
  name: 'App',
  setup() {
    const state = reactive({
      name: 'Lance'
    });
    const state2 = readonly({
      name: 'GC'
    });
    const state3 = {
      name: 'Sherry'
    };
    const state4 = new Proxy({
      name: 'Summer'
    }, {});
    console.log("reactive对象为:", isProxy(state));
    console.log("readonly对象为:", isProxy(state2));
    console.log("普通对象为:", isProxy(state3));
    console.log("自己new的Proxy对象为:", isProxy(state4));
  }
}
</script>
```

{% asset_img 1647135720121-3519692c-1980-4504-91fc-a1b651e2cafb.png 100% %}

## isReactive

- 是否是通过 reactive 包装代理的对象
- 注意
  - readonly 包裹的普通对象为 false
  - readonly 包裹的 reactive 对象为 true

```vue
<template></template>
<script>
import { reactive, isReactive, readonly, isProxy, isReadonly } from 'vue';
export default {
  name: 'App',
  setup() {
    const obj = reactive({
      name: 'Lance'
    });
    const obj2 = readonly({
      name: 'GC'
    });
    const obj3 = readonly(obj);
    const obj4 = reactive(1);
    console.log(isProxy(obj), isReactive(obj), isReadonly(obj));
    console.log(isProxy(obj2), isReactive(obj2), isReadonly(obj2));
    console.log(isProxy(obj3), isReactive(obj3), isReadonly(obj3));
    console.log(isProxy(obj4), isReactive(obj4), isReadonly(obj4));

  }
}
</script>
```

{% asset_img 1647137350474-7b2fcf97-69ce-4938-aa26-3343c5ba771b.png 100% %}


## shallowReactive

- reactive 其实可以理解为 `deepReactive` ，即深度代理
- 而 `shallowReactive` 只代理最外层，类似浅拷贝

```vue
<template>
  <div>
    <p>{{ name }}</p>
    <p>{{ info.grade }}</p> <!-- 此处无法监听到 button 改变 grade 后的更新 -->
    <button @click="change">change</button>
  </div>
</template>
<script>
import { reactive, toRefs, shallowReactive, watchEffect } from 'vue'
export default {
  name: 'App',
  setup() {
    const state = shallowReactive({
      name: 'Lance', // 这一层能够监听到
      info: {
        grade: 100, // 第二层开始就无法监听到了
      }
    });
    const change = () => {
      state.info.grade += 10;
    }
    watchEffect(() => {
      console.log(state.info.grade); // 这里无法监听到
    });
    return {
      ...toRefs(state),
      change
    }
  }
}
</script>
```

## shallowReadonly

- 区别于 readonly 的深度遍历，shallowReadonly 只会 readonly 对象的第一层属性

```vue
<template></template>
<script>
import { readonly, shallowReadonly, isReadonly } from 'vue';
export default {
  name: 'App',
  setup() {
    const obj = readonly({
      name: 'Lance',
      info: {
        grade: 100
      }
    });
    const shallowObj = shallowReadonly({
      name: 'Lance',
      info: {
        grade: 100
      }
    });
    console.log(isReadonly(obj), isReadonly(shallowObj)); // true true
    console.log(isReadonly(obj.info), isReadonly(shallowObj.info)); // true false
  }
}
</script>
```

## toRaw

- 把 reactive 或者 readonly 变成最初的普通对象

```vue
<template></template>
<script>
import { reactive, toRaw } from '@vue/reactivity'
export default {
  name: 'App',
  setup() {
    const obj = {
      name: 'Lance'
    };
    const reactiveObj = reactive(obj);
    const rawObj = toRaw(reactiveObj);
    console.log(rawObj);
    console.log(rawObj === obj); // 和原对象是一个对象
  }
}
</script>
```

{% asset_img 1647140581392-6d78b44c-b12a-4cae-bbdf-b03d5efed7be.png 100% %}

## markRaw

- 标记一个对象，使其永远不会转换为 proxy。返回对象本身。

```vue
<template></template>
<script>
import { markRaw, reactive } from 'vue';
export default {
  name: 'App',
  setup() {
    const obj = {
      name: 'Lance',
      info: {
        grade: 100
      }
    };
    const rawObj = markRaw(obj);
    console.log(obj, rawObj);
    console.log(obj === rawObj);
    // 等于原对象，且给原对象添加了一个 __v_skip: true 标识，用来标记无法被 reactive

    const proxyObj = reactive(rawObj);
    console.log(proxyObj); // 返回原对象
  }
}
</script>
```

{% asset_img 1647141911211-b3fe9c17-814d-41c8-aade-f2173bdc2552.png 100% %}


- markRow 和 `shallowXXX` API 默认都只作用于对象的第一层对象，第二层就失效了
  - 例如
    - markRow 只作用于目标对象的第一层
    - shallowReactive 只对目标对象的第一层有响应式作用，深层就失去响应式了

```vue
<template></template>
<script>
import { markRaw, reactive } from 'vue';
export default {
  name: 'App',
  setup() {
    const obj = {
      name: 'Lance',
      info: {
        grade: 100
      }
    };
    const rawObj = markRaw(obj);

    const proxyObj = reactive({
      info: rawObj.info
    });
    console.log(proxyObj, rawObj);
    // rawObj 会被标记为 _v_skip: true
    // 但旗下 info 对象并没有被标记为 _v_skip: true
    
    
    
    console.log(proxyObj.info === obj.info); 
  }
}
</script>
```

{% asset_img 1647144014708-a83d5991-7580-42f9-be61-c1dde72c4a49.png 100% %}
