---
title: attributes的传递与继承
tags:
  - 笔记
  - Vue
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 3873
date: 2021-11-12 09:06:39
---


- 传递给子组件的属性，如果不被子组件的 `props` 显示声明，都会存放进子组件的 `this.$attrs` 中
  - 直接给子组件传递事件，就能被父组件监听到，不需要通过子组件 `$emit` 触发

## 常规父传子，父监听子组件方案

App.vue

```vue
<template>
  <div>
    <my-selector
      :value="selectorValue"
      @changeOption="changeOption"
    ></my-selector>
  </div>
</template>

<script>
import MySelector from './components/MySelector.vue';
export default {
  name: 'App',
  components: {
    MySelector
  },
  data() {
    return {
      selectorValue: '3'
    }
  },
  methods: {
    changeOption(val) {
      console.log(val);
    }
  }
}
</script>
```

<!-- more -->

MySelector.vue

```vue
<template>
  <select
    v-model="selectValue"
    @change="changeOption"
  >
    <option value="1">选项1</option>
    <option value="2">选项2</option>
    <option value="3">选项3</option>
  </select>
</template>

<script>
export default {
  name: 'MySelector',
  props: {
    value: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      selectValue: this.value
    }
  },
  methods: {
    changeOption() {
      this.$emit('changeOption', this.selectValue);
    }
  }
}
</script>
```

## attributes 方案

### 单个根元素的组件，使用组件传值的所有属性，都会增加到子组件的根元素上

我们删除父组件的自定义事件绑定以及子组件的

emit监听，只传值：

App.vue

```vue
<template>
  <div>
    <my-selector
      :value="selectorValue"
      model="123"
      id="mySelector"
      class="my-selector"
    ></my-selector>
  </div>
</template>

<script>
import MySelector from './components/MySelector.vue';
export default {
  name: 'App',
  components: {
    MySelector
  },
  data() {
    return {
      selectorValue: '3'
    }
  },
}
</script>
```

MySelector.vue

```vue
<template>
  <!-- <select
    v-model="selectValue"
    @change="changeOption"
  > -->
  <select>
    <option value="1">选项1</option>
    <option value="2">选项2</option>
    <option value="3">选项3</option>
  </select>
</template>

<script>
export default {
  name: 'MySelector',
  // props: {
  //   value: {
  //     type: String,
  //     default: '1'
  //   }
  // },
  // data() {
  //   return {
  //     selectValue: this.value
  //   }
  // },
}
</script>
```

我们此刻会发现，页面上默认vue就帮我们把父传子的值传过来了，而且给组件 `<my-selector>` 绑定的 model 属性，也自动传给了组件内部的 `select` 标签：

- value是select原生特性，所以没显示在下图中

{% asset_img 1639717574033-bc4d7fa7-1a3e-42aa-b9e5-291a977cc74b.png 100% %}



我们可以验证下标题的结论：

MySelector.vue

```vue
<template>
  <select>
    <option value="1">选项1</option>
    <option value="2">选项2</option>
    <option value="3">选项3</option>
  </select>
</template>

<script>
export default {
  name: 'MySelector',
  created() {
    console.log(this.$attrs);
  }
}
</script>
```

{% asset_img 1639717555407-bdf98009-f37e-4f57-97e8-5134050bf6f6.png 100% %}

### 现在父组件给子组件绑定事件、而子组件不 $emit

App.vue

```vue
<template>
  <div>
    <my-selector
      :value="selectorValue"
      model="123"
      id="mySelector"
      class="my-selector"
      @change="changeOption"
    ></my-selector>
  </div>
</template>

<script>
import MySelector from './components/MySelector.vue';
export default {
  name: 'App',
  components: {
    MySelector
  },
  data() {
    return {
      selectorValue: '3'
    }
  },
  methods: {
    changeOption(e) {
      console.log(e.target.value); // 子组件不监听 @change 事件，此处也能监听到
    }
  }
}
</script>
```

{% asset_img 1639717734168-79cb4dd6-4d7d-496a-bc43-74a2221ebf8c.png 100% %}

### 禁用子组件的根组件的继承

MySelector.vue

```vue
<template>
  <select>
    <option value="1">选项1</option>
    <option value="2">选项2</option>
    <option value="3">选项3</option>
  </select>
</template>

<script>
export default {
  name: 'MySelector',
  inheritAttrs: false, // 禁用根组件 select 继承父组件传递过来的属性
  created() {
    console.log(this.$attrs);
  }
}
</script>
```

这样标签就不会继承属性了，切换selector也没法触发事件：

{% asset_img 1639717889677-eee6ee8a-1021-4a12-9a7c-f8ae222d0432.png 100% %}

#### 但是 `this.$attrs` 依然有值：

{% asset_img 1639717925512-b2e9fdd8-0159-4fc6-af18-044530646bc6.png 100% %}



如果我们此时手动给 `select` 标签绑定 `$attrs` （平铺属性），就又能继承了（事件也能生效）：

```vue
<template>
  <select v-bind="$attrs">
    <option value="1">选项1</option>
    <option value="2">选项2</option>
    <option value="3">选项3</option>
  </select>
</template>

...
```

{% asset_img 1639718022178-213769f3-562e-4328-ab73-60c3734c3465.png 100% %}

#### 什么情况下需要禁止继承（input 的 autofocus）

想要实现让子组件 input 聚焦：

LoginBox.vue

```vue
<template>
  <div>
    <input type="text" placeholder="Username">
    <input type="password" placeholder="Password">
    <button>Login</button>
  </div>
</template>

<script>
export default {
  name: 'LoginBox'
}
</script>
```

App.vue

```vue
<template>
  <div>
    <my-selector
      :value="selectorValue"
      model="123"
      id="mySelector"
      class="my-selector"
      @change="changeOption"
    ></my-selector>

    <login-box autofocus></login-box>
  </div>
</template>

<script>
import MySelector from './components/MySelector.vue';
import LoginBox from './components/LoginBox.vue';
export default {
  name: 'App',
  components: {
    MySelector,
    LoginBox
  },
  ...
}
</script>
```

我们会发现 input 并没有聚焦，而是把 autofocus 属性设置给了组件的根元素 div：

{% asset_img 1639718378090-4312e150-03e6-4ad9-b3c4-74d77eed4974.png 100% %}

此时我们就需要禁止默认继承来达到目的：

```vue
<template>
  <div>
    <input type="text" :autofocus="$attrs.autofocus" placeholder="Username">
    <!-- 或者 -->
    <input type="text" v-bind="$attrs" placeholder="Username">
    <input type="password" placeholder="Password">
    <button>Login</button>
  </div>
</template>

<script>
export default {
  inheritAttrs: false, // 其实不写这个，上边的 :autofocus="$attrs.autofocus" 也能生效
  name: 'LoginBox'
}
</script>
```

{% asset_img 1639718481993-531ceadc-1713-475b-a003-7f5eff9a9d7d.png 100% %}


## 多个根组件选择性传递 $attrs

App.vue

```vue
<template>
  <div>
    <my-selector
      :value="selectorValue"
      model="123"
      id="mySelector"
      class="my-selector"
      @change="changeOption"
    ></my-selector>

    <login-box autofocus></login-box>

    <my-list-container :listTitle="listTitle">
      <my-list :myList="myList" data-show="123" @click="bookSubscribe"></my-list>
    </my-list-container>
  </div>
</template>

<script>
import MySelector from './components/MySelector.vue';
import LoginBox from './components/LoginBox.vue';

import MyList from './components/MyList.vue';
import MyListContainer from './components/MyListContainer.vue';
export default {
  name: 'App',
  components: {
    MySelector,
    LoginBox,
    MyList,
    MyListContainer
  },
  data() {
    return {
      selectorValue: '3',
      listTitle: '小说订阅列表',
      myList: [
        {
          id: 1,
          title: '悲惨世界',
          isSubscribable: true,
          subscribed: false
        },
        {
          id: 2,
          title: '傲慢与偏见',
          isSubscribable: false,
          subscribed: false
        },
        {
          id: 3,
          title: '呼啸山庄',
          isSubscribable: true,
          subscribed: false
        }
      ]
    }
  },
  methods: {
    changeOption(e) {
      console.log(e.target.value);
    },
    bookSubscribe(e) {
      const id = e.target.dataset.id;
      this.myList = this.myList.map(item => {
        if (item.id == id) {
          item.subscribed = !item.subscribed;
        }
        return item;
      });
    }
  }
}
</script>

<style>

</style>
```

MyList.vue

- 只有 `v-if="item.isSubscribable"` 为真，才会给 li 元素绑定上 `v-bind="$attrs"`
- 否则就不会把父组件的 `@click="bookSubscribe"` 绑定到 li 元素上去

```vue
<template>
  <!-- 多个根组件，n个li元素 -->
  <template
    v-for="item of myList">
    <li
      v-if="item.isSubscribable"
      :key="item.id"
      v-bind="$attrs"
    >
      <span>{{ item.title }}</span>
      <button :data-id="item.id">{{ item.subscribed ? '已订阅' : '订阅' }}</button>
    </li>
    <li v-else :key="item.id">
      <span>{{ item.title }}</span>
      <button disabled>不可订阅</button>
    </li>
  </template>
</template>

<script>
export default {
  name: 'MyList',
  props: {
    myList: Array
  },
  created() {
    console.log(this.$attrs);
  }
}
</script>
```
