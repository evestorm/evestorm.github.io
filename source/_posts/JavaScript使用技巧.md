---
title: JavaScript使用技巧
tags:
  - 技巧
categories:
  - 前端
  - JS
abbrlink: 64741
date: 2020-06-08 22:56:38
---

### 转 Boolean 类型

```js
!!0; // false
!!1; // true
```

<!-- more -->

通过两个取反，可以强制转换为 Boolean 类型。

### 转 Number 类型

```js
+'233' + // 233
  new Date(); // 13位时间戳
```

会自动转化为 Number 类型的。日期取时间戳不用 new Date().getTime()。

### 短路求值

```js
let a = b || 1; // b为真，a=b; b为假，a=1;
let c = b && 1; // b为真，c=1; b为假，c=b;
```

用来简化 `if-else`

### 变量声明简写

```js
let x = 1;
let y;
let z = 3;

// 简写:

let x = 1,
  y,
  z = 3;
```

### 条件语句简写

```js
if (result === true)
if (result !== true)

// 简写:

if (result)
if (!result)
```

### 十进制乘方简写

```js
for (let i = 0; i < 10000000; i++) {}

// 简写:

for (let i = 0; i < 1e7; i++) {}

// e.g.
// 1e0 === 1;
// 1e1 === 10;
// 1e2 === 100;
// 1e3 === 1000;
// 1e4 === 10000;
// 1e5 === 100000;
```

这是一个省略大数字后面零的写法，例如 1e7 本质上就是 1 后面接着 7 个零，也就是十进制的 10000000。

### 对象属性简写

ES6 提供了一种及其简单的方式去分配一个属性给对象，如果属性名与键名（key）相同，则可以采用 ES6 的方法：

```js
const obj = { x: x, y: y };

// 简写:

const obj = { x, y };
```

### 箭头函数简写

这个没什么好说的，写出来是为了给后面的隐式返回值做铺垫：

```js
function sayHello(name) {
  console.log('Hello', name);
}

setTimeout(function () {
  console.log('Loaded');
}, 2000);

list.forEach(function (item) {
  console.log(item);
});

// 简写:

sayHello = name => console.log('Hello', name);

setTimeout(() => console.log('Loaded'), 2000);

list.forEach(item => console.log(item));
```

### 隐式返回值简写

箭头函数能隐式返回其值这大家都知道，下面要说的是再返回多行语句下，如何省略 return 关键字：

```js
function calcCircumference(diameter) {
  return Math.PI * diameter;
}

var func = function func() {
  return { foo: 1 };
};

// 简写:
calcCircumference = diameter => Math.PI * diameter;

var func = () => ({ foo: 1 });
```

为返回多行语句（例如对象字面量），则需要使用()包围函数体，这也保证了这段代码是单独的声明。

### 默认参数值简写

以前为了判断传递给方法参数的默认值，需要用到 if 语句，而在 ES6 中可以直接在参数声明直接定义函数默认值：

```js
function volume(l, w, h) {
  if (w === undefined) w = 3;
  if (h === undefined) h = 4;
  return l * w * h;
}

// 简写:
volume = (l, w = 3, h = 4) => l * w * h;

volume(2); //output: 24
```

### 解构赋值简写

```js
const observable = require('mobx/observable');
const action = require('mobx/action');
const runInAction = require('mobx/runInAction');

const store = this.props.store;
const form = this.props.form;
const loading = this.props.loading;
const errors = this.props.errors;
const entity = this.props.entity;

// 简写:

import { observable, action, runInAction } from 'mobx';

const { store, form, loading, errors, entity } = this.props;
```

也可以分配变量名：

```js
const { store, form, loading, errors, entity: contact } = this.props;
```

### 冻结 const 声明的对象，避免更改其中的属性

```js
'use strict';
const HOST = {
  url: 'https://www.bilibili.com/api',
  port: 443
};
Object.freeze(HOST); // 冻结/锁住对象
HOST.port = 80; // 控制台会报错，且无法更改port
console.log(HOST);
```

### 美化 JSON.stringify 的输出

#### 第二个参数：函数或数组

```js
const Udacity = {
  title: '优达学城',
  url: 'https://www.udacity.com',
  lessons: [{ name: 'Front-End' }, { name: 'Back-End' }]
};
// 只取 Udacity 中的 title 和 url 字段
let json = JSON.stringify(
  Udacity,
  function (key, value) {
    if (key === 'title') {
      value = 'I love ' + value;
    }
    return value;
  },
  2
); // 对象

let json = JSON.stringify(Udacity, ['title', 'url'], 2); // 数组
console.log(json);
```

#### 第三个参数：指定缩进用的空白字符串

```js
let obj = {
  name: 'Lance',
  age: 26,
  weight: 120
};
console.log(JSON.stringify(obj, null, 2));

// 第三个参数代表：指定缩进用的空白字符串

// {
//   "name": "Lance",
//   "age": 26,
//   "weight": 120
// }
```
