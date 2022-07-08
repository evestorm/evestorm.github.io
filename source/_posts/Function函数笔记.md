---
title: Function函数笔记
tags:
  - 笔记
categories:
  - 前端
  - JS
  - ECMAScript
abbrlink: 47013
date: 2021-10-10 08:55:44
---

## 写法

### 函数声明

```javascript
function 函数名(参数) {
	// 执行语句
}
```

<!-- more -->

### 🌈 函数表达式（有名）

- 函数表达式**右侧**函数有**函数名**，也**会被系统忽略**。外部无法调用


```javascript
var test = function test1() {
  // 执行语句
  // test1 内部可见
  // test1(); // 能够执行
}

test.name; // test1

test(); // 可执行
test1(); //报错，test1函数外部不可见
```

### 函数表达式（匿名）

```javascript
// 整体是个匿名函数表达式，function匿名函数这个值，这个整体是字面量
var test = function() {
	var a = 1, b = 1; // 推荐
  // var a = b = 1; //不推荐，此时的 b 并没有被 var ，b 为全局变量
}

var a = 10; // 10这个值就是字面量
```

```javascript
var a = function b() {
  console.log(a, b); // [Function: b] [Function: b]
  console.log(a.name, b.name); // b b
}
a();
```

## 形参、实参

```javascript
function test(a, b) { // a, b 是形参

}
test(1, 2); // 1, 2 是实参
```

### 🌈 形参、实参个数可以不相等

- arguments.length 是 实参个数
- [function name].length 是 形参个数


```javascript
function test(a, b, c) {
	console.log(arguments.length); // 实参有 2 个：1 跟 2
  console.log(test.length); // 形参有3个：a, b, c
}
test(1, 2);
```

```javascript
(function() {}).length;							// 0
```

### 实参求和

```javascript
function sum() {
  return [...arguments].reduce((total, cur) => total += cur, 0);
}

sum(1, 2, 3);
```

### 🌈 arguments

- 函数内部可以修改实参的值
- 实参如果没有传入的形参，则这个形参在函数内部无法赋值


```javascript
function test(a, b) {
	a = 3;
  console.log(arguments[0]); // 值为3，修改形参会影响 arguments 映射的值
  
  b = 2;
  console.log(arguments[1]);
  // 值为undefined，由于没有传入形参对应的实参，导致更改形参无法改变 arguments 中对应的值
}

test(1);
```

### return

- 终止函数的执行，return 后边的语句不会被执行
- 返回相应的值


```javascript
function test() {
	console.log('1'); // 1
  return 123; // test函数返回123
  console.log('2'); // 未被执行，不会打印
}
```

## 函数参数默认值

- 函数参数默认值：undefined
- 可以在定义形参时赋值默认值


```javascript
function test(a, b) {
	console.log(a, b); // 1, undefined
}
test(1);
```

```javascript
function test(a = 1, b = 2) {
  console.log(a, b); // 1, 2
}
test();
```

- **不想传的值，可用 undefined 占位代替**


```javascript
function test(a = 1, b) {
	console.log(a, b); // 1, 2
}
test(undefined, 2);
```

- **兼容IE等旧版本浏览器**


```javascript
function test(a, b) {
	var a = typeof(arguments[0]) !== 'undefined' ? arguments[0] : 1;
  var b = typeof(arguments[1]) !== 'undefined' ? arguments[1] : 2;
  console.log(a, b);
}
test();
```
