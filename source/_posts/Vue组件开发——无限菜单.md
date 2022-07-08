---
title: Vue组件开发——无限菜单
tags:
  - Vue
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 23904
date: 2019-07-13 21:50:10
---

## @vue/cli-service-global 插件介绍

该 npm 包可以让你在零配置情况下，直接使用 `vue serve` 和 `vue build` 命令跑 `*.vue` 文件，并且可以把它编译打包成一个 Vue 插件。

<!-- more -->

## 全局安装

```shell
npm install -g @vue/cli-service-global
```

## 基本使用

在任意文件夹下新建一个 `.vue` 文件，例如 `App.vue` ：

```html
<template>
  <div>{{msg}}</div>
</template>

<script>
  export default {
    data() {
      return {
        msg: 'Hello world'
      };
    }
  };
</script>

<style lang="scss" scoped></style>
```

然后命令行中输入：

```shell
cd 该.vue文件路径
vue serve App.vue
```

最后打开浏览器输入 `http://localhost:8080/` 就能看到刚建的 `App.vue` 组件了。

## 无限菜单组件开发

### 文件结构

- Menu 一级菜单
  - MenuItem 成员
- SubMenu 含子菜单

↓

- 食品生鲜 -> Menu
  - 休闲食品 -> SubMenu
    - 零食大礼包 -> Menu
      - 肉松饼 -> MenuItem
  - 进口食品 -> Menu
    - 咖啡豆 -> MenuItem

### 文件成员

> App.vue

```html
<template>
  <div id="app">
    <menu>
      <menuitem>菜单1</menuitem>
      <menuitem>菜单2</menuitem>
      <menuitem>菜单3</menuitem>
      <SubMenu>
        <!-- <template v-slot:title> 等于 <template #title> -->
        <template #title>菜单4</template>
        <menuitem>菜单4-1</menuitem>
        <menuitem>菜单4-2</menuitem>
      </SubMenu>
    </menu>
  </div>
</template>

<script>
  import Menu from './Menu';
  import MenuItem from './MenuItem';
  import SubMenu from './SubMenu';
  export default {
    data() {
      return {
        msg: 'Hello world'
      };
    },
    components: {
      Menu,
      MenuItem,
      SubMenu
    }
  };
</script>
```

> Menu.vue

```html
<template>
  <ul class="menu">
    <slot></slot>
  </ul>
</template>

<script>
  export default {};
</script>
```

> MenuItem.vue

```html
<template>
  <li><slot></slot></li>
</template>

<script>
  export default {};
</script>
```

> SubMenu.vue

```html
<template>
  <div>
    <div class="title" @click="change">
      <slot name="title"></slot>
    </div>
    <div v-show="flag">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        flag: false
      };
    },
    methods: {
      change() {
        this.flag = !this.flag;
      }
    }
  };
</script>
```

这样一个基本的菜单结构就完成了，二级菜单默认被折叠，点击菜单名后可以展开菜单成员。

{% asset_img 二级菜单.gif 基础菜单结构 %}

### 增加虚拟数据

在 `App.vue` 下添加一个 menuList 数组来模拟多级菜单：

```js
menuList: [
  {
    title: '菜单1',
    children: [
      {
        title: '菜单1-1',
        children: [
          { title: '菜单1-1-1' },
          { title: '菜单1-1-2' },
          {
            title: '菜单1-1-3',
            children: [{ title: '菜单1-1-3-1' }, { title: '菜单1-1-3-2' }]
          }
        ]
      },
      { title: '菜单1-2' },
      { title: '菜单1-3' }
    ]
  },
  { title: '菜单2' },
  { title: '菜单3' }
];
```

### 仅有一层嵌套时的写法

> App.vue

```html
<menu>
  <template v-for="menu in menuList">
    <!-- 没有子菜单 -->
    <menuitem :key="menu.title" v-if="!menu.children">{{menu.title}}</menuitem>
    <!-- 有子菜单 -->
    <SubMenu :key="menu.title" v-else>
      <template #title>菜单4</template>
      <menuitem>菜单4-1</menuitem>
      <!-- 如果子菜单还有子菜单 -->
    </SubMenu>
  </template>
</menu>
```

我们当然不能像上面这样硬编码，否则不得累死，要是碰上夸张点的十几层嵌套不死定了嘛。所以遇到这种重复的内容，就需要抽离出去。在上面代码中，重复的内容就是下面这一部分：

```html
<!-- 有子菜单 -->
<SubMenu :key="menu.title" v-else>
  <template #title>菜单4</template>
  <menuitem>菜单4-1</menuitem>
  <!-- 如果子菜单还有子菜单 -->
</SubMenu>
```

所以我们新建一个 `ReSubMenu.vue` 来封装它：

```html
<template>
  <SubMenu>
    <template #title>{{data.title}}</template>
    <template v-for="child in data.children">
      <menuitem :key="child.title" v-if="!child.children">
        {{child.title}}
      </menuitem>
      <!-- 如果子菜单还有子菜单，就调用自己，并把当前对象传过去 -->
      <ReSub :key="child.title" :data="child" v-else></ReSub>
    </template>
  </SubMenu>
  <!-- {
title: '菜单1',
  children: [{title: '菜单1-1'},
    {title: '菜单1-2'},
    {title: '菜单1-3'}]
}, -->
</template>

<script>
  import SubMenu from './SubMenu';
  import MenuItem from './MenuItem';
  export default {
    name: 'ReSub', // 起名字可以使用递归组件
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    components: {
      SubMenu,
      MenuItem
    }
  };
</script>

<style lang="css" scoped></style>
```

这样一来我们就实现了无限菜单：

{% asset_img 无限菜单.png 无限菜单 %}

## 完整代码

> App.vue

```html
<template>
  <div id="app">
    <menu>
      <template v-for="menu in menuList">
        <menuitem :key="menu.title" v-if="!menu.children">
          {{menu.title}}
        </menuitem>
        <!-- 把重复的内容，抽离出去 -->
        <ReSubMenu :key="menu.title" v-else :data="menu"></ReSubMenu>
      </template>
      <!-- <SubMenu>
        <template v-slot:title> 等于 <template #title>
        <template #title>
          菜单4
        </template>
        <MenuItem>菜单4-1</MenuItem>
        <MenuItem>菜单4-2</MenuItem>
      </SubMenu> -->
    </menu>
  </div>
</template>

<script>
  import Menu from './Menu';
  import MenuItem from './MenuItem';
  import SubMenu from './SubMenu';
  import ReSubMenu from './ReSubMenu';
  export default {
    data() {
      return {
        menuList: [
          {
            title: '菜单1',
            children: [
              {
                title: '菜单1-1',
                children: [
                  {
                    title: '菜单1-1-1'
                  },
                  {
                    title: '菜单1-1-2'
                  },
                  {
                    title: '菜单1-1-3',
                    children: [
                      {
                        title: '菜单1-1-3-1'
                      },
                      {
                        title: '菜单1-1-3-2'
                      }
                    ]
                  }
                ]
              },
              {
                title: '菜单1-2'
              },
              {
                title: '菜单1-3'
              }
            ]
          },
          {
            title: '菜单2'
          },
          {
            title: '菜单3'
          }
        ]
      };
    },
    components: {
      Menu,
      MenuItem,
      SubMenu,
      ReSubMenu
    }
  };
</script>
```

> Menu.vue

```html
<template>
  <ul class="menu">
    <slot></slot>
  </ul>
</template>

<script>
  export default {};
</script>
```

> MenuItem.vue

```html
<template>
  <li><slot></slot></li>
</template>

<script>
  export default {};
</script>
```

> SubMenu.vue

```html
<template>
  <div>
    <div class="title" @click="change">
      <slot name="title"></slot>
    </div>
    <div v-show="flag" class="sub">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        flag: false
      };
    },
    methods: {
      change() {
        this.flag = !this.flag;
      }
    }
  };
</script>

<style lang="css" scoped>
  .sub {
    padding-left: 20px;
  }
</style>
```

> ReSubMenu.vue

```html
<template>
  <SubMenu>
    <template #title>{{data.title}}</template>
    <template v-for="child in data.children">
      <menuitem :key="child.title" v-if="!child.children">
        {{child.title}}
      </menuitem>
      <ReSub :key="child.title" :data="child" v-else></ReSub>
    </template>
  </SubMenu>
  <!-- {
title: '菜单1',
  children: [{title: '菜单1-1'},
    {title: '菜单1-2'},
    {title: '菜单1-3'}]
}, -->
</template>

<script>
  import SubMenu from './SubMenu';
  import MenuItem from './MenuItem';
  export default {
    name: 'ReSub', // 起名字可以使用递归组件
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    components: {
      SubMenu,
      MenuItem
    }
  };
</script>
```
