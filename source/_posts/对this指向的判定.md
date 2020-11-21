---
title: 对this指向的判定
tags:
  - this
categories:
  - 前端
  - JS
abbrlink: 33207
date: 2018-12-29 23:44:19
---

## 对 this 的理解

对于this指向的判定，时刻记住下面两点就好：

- 普通函数的 this 指向是在函数的执行期间绑定的，换句话说 this 总是指向函数的**直接**调用者
- 箭头函数的 this 指向是在函数创建期间就绑定好了的，指向的是创建该箭头函数所在的作用域对象

<!-- more -->

## 普通函数中的this

这里直接引用 [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS) 中对 this 的判定步骤：

1. 函数是通过 `new` 被调用的吗（**new 绑定**）？如果是，`this` 就是新构建的对象。
   `var bar = new foo()`
2. 函数是通过 `call` 或 `apply` 被调用（**明确绑定**），甚至是隐藏在 `bind` *硬绑定* 之中吗？如果是，`this` 就是那个被明确指定的对象。
   `var bar = foo.call( obj2 )`
3. 函数是通过环境对象（也称为拥有者或容器对象）被调用的吗（**隐含绑定**）？如果是，`this` 就是那个环境对象。
   `var bar = obj1.foo()`
4. 否则，使用默认的 `this`（**默认绑定**）。如果在 `strict mode` 下，就是 `undefined`，否则是 `global` 对象。
   `var bar = foo()`

## 常见this指向

- 普通函数中this ——> window
- 构造函数中this ——> new出来的实例对象
- 方法中的this ——> 实例对象
- 原型中的方法中的this ——> 实例对象
- 定时器中的this ——> window

