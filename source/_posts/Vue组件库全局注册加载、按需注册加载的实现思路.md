---
title: Vue组件库全局注册加载、按需注册加载的实现思路
tags:
  - 技巧
  - Vue
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 13177
date: 2021-09-07 08:58:13
---

- 插件方式，实现 `install(Vue, options)` 方法
- **组件库就是对象**

- - 实现 `install` 方法

<!-- more -->

# 全局注册加载组件库

思路：

1. 入口文件中 import 所有组件
2. 用 components 数组接收组件
3. 遍历 components 

1. 1. `Vue.component(component.name, component)`

my-ui/index.js

```javascript
import Select from './Select';
import Link from './Link';

const COMPONENTS = [
	Select,
  Link
];

const MyUI = {};

MyUI.install = (Vue, options) {
	COMPONENTS.forEach(component => {
  	Vue.component(component.name, component);
  });
}

export default MyUI;
```

main.js 使用

```javascript
import MyUI from './my-ui';
Vue.use(MyUI, {
}); // 这里的第二个参数： {} 作为整体，就是 options 接收
```

# 按需注册加载组件库

- 通过 Vue.use 第二个参数配置

- - 判断 `options.components` 是否有值

- - - 遍历按需加载用户需要的 components

- - 如果没有值

- - - 遍历全局加载所有组件

- 解构的方式实现

- - 入口文件导出多个对象

- - - 每个组件一个对象，实现一个 install 方法，单独 `Vue.component(...)`
    - 导出一个总对象，实现 install 方法，遍历全局加载所有组件
    - `export { MySelect, MyInput }`
    - `export default MyUI`

my-ui/index.js

```javascript
import Select from './Select';
import Link from './Link';

const COMPONENTS = [
	Select,
  Link
];

const MyUI = {};

MyUI.install = (Vue, options) {
	if (options && options.components) {
  	const components = options.components;
    
    components.forEach(componentName => {
    	COMPONENTS.forEach(component => {
      	if (componentName === component.name) {
        	Vue.component(component.name, component);
        }
      });
    });
  } else {
  	COMPONENTS.forEach(component => {
    	Vue.component(component.name, component);
    });
  }
}

export default MyUI;
```

main.js 使用

```javascript
import MyUI from './my-ui';

Vue.use(MyUI, {
	components: [
  	'MyButton',
    'MyInput'
  ]
});
```

## 解构的方式按需加载

```javascript
import Select from './Select';
import Link from './Link';

const COMPONENTS = [
	Select,
  Link
];

const MyUI = {};
const MySelect = {};
const MyLink = {};
MySelect.install = Vue => Vue.component(Select.name, Select);
MyLink.install = Vue => Vue.component(Link.name, Link);

export {
	MySelect,
  MyLink
}

MyUI.install = (Vue, options) {
	if (options && options.components) {
  	const components = options.components;
    
    components.forEach(componentName => {
    	COMPONENTS.forEach(component => {
      	if (componentName === component.name) {
        	Vue.component(component.name, component);
        }
      });
    });
  } else {
  	COMPONENTS.forEach(component => {
    	Vue.component(component.name, component);
    });
  }
}

export default MyUI;
```

使用：

```javascript
import { MySelect, MyLink } from './my-ui';

Vue.use(MySelect);
```