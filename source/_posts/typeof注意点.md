---
title: typeof注意点
tags:
  - 技巧
categories:
  - 前端
  - JS
  - ECMAScript
abbrlink: 45135
date: 2021-09-21 20:11:42
---

- 8种返回值：string、number、boolean、bigint、symbol、function、object(null, array)、undefined
- typeof 返回的值是**字符串类型**
- typeof 一个不存在（未定义）的值，不报错，返回**字符串undefined**

<!-- more -->

```js
typeof(123) // number
typeof('123') // string
typeof(true) // boolean
typeof({}) // object
typeof([]) // object
typeof(null) // object 空对象的一个指针/占位符
typeof(undefined) // undefined
typeof(function test() {}) // function
```

```js
console.log( typeof(1 - "1") ) // number
console.log( typeof("1" - "1") ) // number

console.log(a) // Uncaught ReferenceError: a is not defined.
console.log( typeof(a) ) // undefined
```

```js
console.log( typeof(typeof(a)) ) // string;  hint: typeof() 返回的是字符串
```