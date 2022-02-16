---
title: 函数中的rest参数
tags:
  - ES6+
categories:
  - 前端
  - JS
  - ES6+
abbrlink: 29820
date: 2019-01-02 23:47:13
---

## 什么是 REST 参数

REST参数翻译过来就是剩余参数，[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters)上的定义是：

> 剩余参数语法允许我们将一个不定数量的参数表示为一个数组。

<!-- more -->

## 示例说明

```js
function sum(...theArgs) {
  return theArgs.reduce((previous, current) => {
    return previous + current;
  });
}

console.log(sum(1, 2, 3));
// expected output: 6

console.log(sum(1, 2, 3, 4));
// expected output: 10

// 下例中，剩余参数包含了从第二个到最后的所有实参，然后用第一个实参依次乘以它们
function multiply(multiplier, ...theArgs) {
  return theArgs.map(function (element) {
    return multiplier * element;
  });
}

var arr = multiply(2, 1, 2, 3); 
console.log(arr);  // [2, 4, 6]
```

## rest 参数和 arguments 对象的区别

剩余参数和 `arguments`对象之间的区别主要有三个：

- 剩余参数只包含那些没有对应形参的实参，而 `arguments` 对象包含了传给函数的所有实参。

- `arguments`对象不是一个真正的数组，而剩余参数是真正的 `Array`实例，也就是说你能够在它上面直接使用所有的数组方法，比如 `sort`，`map`，`forEach`或`pop`。

- ```
  arguments
  ```

  对象还有一些附加的属性 （如

  ```
  callee
  ```

  属性）。

  - arguments.callee 属性包含当前正在执行的函数。
