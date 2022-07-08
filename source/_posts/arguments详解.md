---
title: arguments详解
tags:
  - 笔记
  - 技巧
categories:
  - 前端
  - JS
  - ECMAScript
abbrlink: 31289
date: 2021-09-10 10:44:40
---

## 特性

- 类数组
- 没有继承 Array.prototype
- 可迭代
- 箭头函数内部没有 arguments

<!-- more -->

```javascript
/**
 * callee: 宿主函数 test
 * Symbol.iterator 可迭代对象标志
 * 
 * 类数组 Array like
 * 	有 length 从 0 开始的属性下标
 *  没有数组的内置方法(build-in methods/object)
 *
 */
function test() {
	console.log(arguments);
  console.log(arguments.toString()); // [object Arguments]
  console.log(Array.isArray(arguments)); // false
  console.log(arguments.callee);
}

test();
```

{% asset_img 1630564426619-3ef4e202-80cf-465c-922a-4152b6387792-20220210104551744.png 100% %}

## 可迭代对象

### 普通对象没有迭代器无法迭代

```javascript
var obj = {
	a: 1,
  b: 2,
  c: 3
}

function * generator(args) {
	for (const item of args) {
  	yield item;
  }
}

var it = generator(obj);

it.next();
```

{% asset_img 1630566617444-b2b947a4-fa8d-4977-b34b-3d38807ea8cd-20220210104551733.png 100% %}


### 🌈 arguments可以迭代

```javascript
function * generator(args) {
	for (const item of args) {
  	yield item;
  }
}

function test() {
	var it = generator(arguments);
  
  console.log(it.next());
  console.log(it.next());
  console.log(it.next());
  console.log(it.next());
}

test(1, 2, 3);
```

{% asset_img 1630566775097-518a0699-5a7a-414b-96bf-e9f8a754d725-20220210104551723.png 100% %}

## 非箭头函数的其他函数的内置的局部变量

```javascript
var test = () => {
	console.log(arguments);
}
test();
```

{% asset_img 1630567415584-797bdace-f7d3-4d67-aa6b-883af2ec1f5b-20220210104551723.png 100% %}

改用剩余参数：

```javascript
var test = (...args) => {
	console.log(args);
  console.log(Array.isArray(args));
}
test(1, 2, 3);
```

{% asset_img 1630567550730-106ea47e-0e3e-4aba-9ce8-59863eebe336-20220210104551725.png 100% %}

```javascript
var test = (...args) => {
  // console.log(arguments.callee); // 直接拿 test 能拿到，不需要 .callee
  console.log(test);
}
test(1, 2, 3);
```

{% asset_img 1630567664813-e43cb07c-54f7-487d-9b34-b6706699100d-20220210104551723.png 100% %}

### arguments 转真数组

```javascript
function test() {
  // var params = Array.prototype.slice.call(arguments); // ↓简便写法
	var params = [].slice.call(arguments); // 把 arguments 当 [] 去调用 slice
  console.log(params);
}

test(1, 2, 3);
```

{% asset_img 1630567927350-4ecbea77-153f-4360-a886-043367a621ca-20220210104551747.png 100% %}

```javascript
function test() {
	var params = arguments.length === 1 
  				? [arguments[0]] 
  				: Array.apply(null, arguments); // Array是构造函数，传递null当this，参数是arguments
  console.log(params);
}

test(1, 2, 3);
```

{% asset_img 1630568671605-1fa9c0be-0e90-4fa6-8f12-c96d4c96b34d-20220210104551747.png 100% %}

## arguments作用

### 拿到实参 - 实参个数 > 形参个数

```javascript
function test(a, b, c) {
	console.log(arguments[3]);
}
test(1, 2, 3, 4);
```

{% asset_img 1630568822186-824b63b8-b92c-426e-be17-7404e0701d0d-20220210104551739.png 100% %}

### 不定参数

```javascript
function add() {
	return [...arguments].reduce((pre, cur) => pre + cur, 0);
}

const res = add(1, 2, 3);
console.log(res);
```

{% asset_img 1630568938687-1252fceb-1004-490f-b138-e90f1258f3d2-20220210104551739.png 100% %}

### 🌈 形实参的对应关系 - 共享关系

形参赋值的有内部作用域

#### 形实参默认情况下会有共享关系

```javascript
function test(a) {
	arguments[0] = 10;
  console.log(a, arguments[0]);
}

test(1);
```

{% asset_img 1630569071265-20d5ea33-a55e-4e0e-b177-769103207748-20220210104551757.png 100% %}

```javascript
function test(a) {
	a = 10;
  console.log(a, arguments[0]);
}

test(1);
```

{% asset_img 1630569135027-148160e9-6863-4a4a-88cb-959c7bfd01ef-20220210104551766.png 100% %}


#### 🌈 形参 - 只要有一个形参有默认值，arguments就不跟踪形参

```javascript
function test(a = 100) {
	arguments[0] = 10;
  console.log(a, arguments[0]);
}
test(1);
```

{% asset_img 1630569305727-836551f5-2cac-43f0-9c0e-4af627903cdc-20220210104551759.png 100% %}

```javascript
function test(a = 100) {
	a = 10000;
  console.log(a, arguments[0]);
}
test(1);
```

{% asset_img 1630569801590-4add3ee9-b527-49de-8cd9-26e81c084822-20220210104551782.png 100% %}

```javascript
function test(a, b, c = 10) {
	arguments[0] = 100;
	arguments[1] = 200;
	arguments[2] = 300;
  
  console.log(a, arguments[0]);
  console.log(b, arguments[1]);
  console.log(c, arguments[2]);
}
test(1, 2, 3);
```

{% asset_img 1630570030590-358f53e9-8142-48be-bcd9-75367506883a-20220210104551765.png 100% %}


#### 🌈 形参 - 剩余参数，arguments不跟踪

```javascript
function test(...args) {
	arguments[0] = 100;
	arguments[1] = 200;
	arguments[2] = 300;
  
  console.log(args[0], arguments[0]);
  console.log(args[1], arguments[1]);
  console.log(args[2], arguments[2]);
}
test(1, 2, 3);
```

{% asset_img 1630570098326-d2c7db08-67c7-4641-84c4-7e90253692e4-20220210104551763.png 100% %}

#### 🌈 形参 - 参数解构，arguments不跟踪

```javascript
function test({ a, b, c }) {
	arguments[0] = 100;
	arguments[1] = 200;
	arguments[2] = 300;
  
  console.log(a, arguments[0]);
  console.log(b, arguments[1]);
  console.log(c, arguments[2]);
}
test({
	a: 1,
  b: 2,
  c: 3
});
```

{% asset_img 1630570190730-a3cc17f4-4a30-4513-aaff-fac0dff19b8b-20220210104551775.png 100% %}


#### 🌈 严格模式下 - arguments不跟踪

```javascript
function test(a, b, c) {
	'use strict';
  
  a = 10;
  b = 20;
  c = 30;
  
  console.log(a, b, c);
  console.log([...arguments]);
}
test(1, 2, 3);
```

{% asset_img 1630570499438-8071b322-1b5c-43b5-8715-1c32bc049659-20220210104551781.png 100% %}

```javascript
function test(a, b, c) {
	'use strict';
  
  arguments[0] = 10;
  arguments[1] = 20;
  arguments[2] = 30;
  
  console.log(a, b, c);
  console.log([...arguments]);
}
test(1, 2, 3);
```

{% asset_img 1630570556247-92c1ca7f-a15c-438d-9039-bcca67a9da55-20220210104551779.png 100% %}


## 拓展

### 内置方法/对象 or 内部方法

- 内置方法、对象：build-in methods/object
- 内部方法：internal methods