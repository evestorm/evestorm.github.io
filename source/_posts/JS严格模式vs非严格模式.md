---
title: JS严格模式vs非严格模式
categories:
  - 前端
  - JS
abbrlink: 15966
date: 2019-04-18 23:03:41
tags:
---

## 前言

以下为《JavaScript 高级程序设计（第 3 版）》中有关 `严格模式` 的笔记。

## 介绍

“严格模式” 是 ECMAScript5 最早引入的概念。可以在函数内部选择进行较为严格的全局或局部的错误条件检测。使用严格模式的好处是可以提早知道代码中存在的错误，及时捕获一些可能导致编程错误的 ECMAScript 行为。

<!-- more -->

## 如何使用

在 JS 文件代码的顶部或者函数中输入下面字符串来开启严格模式：

```js
"use strict";

or

function fn() {
    "use strict";
    ...
}
```

## 严格模式 VS 非严格模式

### 变量

在严格模式下，不允许意外的创建全局变量：

```js
// 未声明变量
message = 'Hello world';

// 非严格模式: 创建全局变量
// 严格模式: 抛出 ReferenceError
```

---

不能对变量调用 delete 操作符：

```
copyvar color = "red";
// 删除变量
delete color;

// 非严格模式: 静默失败
// 严格模式: 抛出 ReferenceError
```

---

严格模式下对变量名也有限制。

不能使用 implements、interface、let、package、 private、protected、public、static 和 yield 作为变量名。这些都是保留字，将来的 ECMAScript 版本中可能会用到它们。在严格模式下，用以上标识符作为变量名会导致语法错误。

### 对象

在严格模式下操作对象比在非严格模式下更容易导致错误。一般来说，非严格模式下会静默失败的 情形，在严格模式下就会抛出错误。因此，在开发中使用严格模式会加大早发现错误的可能性。

在下列情形下操作对象的属性会导致错误:

- 为只读属性赋值会抛出 TypeError;
- 对不可配置的(nonconfigurable)的属性使用 delete 操作符会抛出 TypeError;
- 为不可扩展的(nonextensible)的对象添加属性会抛出 TypeError。
- 使用对象的另一个限制与通过对象字面量声明对象有关。在使用对象字面量时，属性名必须唯一。

例如：

```js
// 重名属性
var person = {
  name: 'Nicholas',
  name: 'Greg'
};

// 非严格模式: 没有错误，以第二个属性为准
// 严格模式: 抛出语法错误
```

### 函数

#### 函数的命名参数

严格模式要求命名函数的参数必须唯一。例如：

```js
// 重名参数
function sum(num, num) {
  // do something
}

// 非严格模式: 没有错误，只能访问第二个参数
//严格模式: 抛出语法错误
```

在**非严格模式**下，这个函数声明不会抛出错误。通过参数名只能访问第二个参数，要访问第一个参数必须通过 `arguments` 对象。

#### arguments

arguments 对象的行为所不同。

- 在非严格模式下，修改命名参数的值也会反映到 arguments 对象中。
- 而严格模式下这两个值是完全独立的。

例如：

```js
// 修改命名参数的值
function showValue(value) {
  value = 'Foo';
  alert(value); //"Foo"
  alert(arguments[0]); // 非严格模式: "Foo" <---> 严格模式: "Hi"
}
showValue('Hi');
```

以上代码中，函数 showValue() 只有一个命名参数 value。调用这个函数时传入了一个参数”Hi”， 这个值赋给了 value。而在函数内部，value 被改为”Foo”。在非严格模式下，这个修改也会改变 arguments[0] 的值，但在严格模式下，arguments[0] 的值仍然是传入的值。

---

另一个变化是淘汰了 arguments.callee 和 arguments.caller。在非严格模式下，这两个属性一个引用函数本身，一个引用调用函数。而在严格模式下，访问哪个属性都会抛出 TypeError。

例如：

```js
// 访问 arguments.callee
function factorial(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * arguments.callee(num - 1);
  }
}
var result = factorial(5);

// 非严格模式: 没有问题
// 严格模式: 抛出 TypeError
```

类似地，尝试读写函数的 caller 属性，也会导致抛出 TypeError。所以，对于上面的例子而言， 访问 factorial.caller 也会抛出错误。

#### 函数名

与变量类似，严格模式对函数名也做出了限制，不允许用 implements、interface、let、package、private、protected、public、static 和 yield 作为函数名。

#### 函数声明的位置

只能在脚本的顶级和在函数内部声明函数。也就是说，在 if 语句中声明函数会导致语法错误：

```js
//在 if 语句中声明函数
if (true) {
  function doSomething() {
    //...
  }
}
// 非严格模式: 将函数提升到 if 语句外部
// 严格模式: 抛出语法错误
```

### eval()

eval 在包含上下文中不再创建变量或函数。例如：

```js
//使用 eval() 创建变量
function doSomething() {
  eval('var x=10');
  alert(x);
}
// 非严格模式: 弹出对话框显示 10
// 严格模式: 调用 alert(x) 时会抛出 ReferenceError
```

如果是在非严格模式下，以上代码会在函数 doSomething() 中创建一个局部变量 x，然后 alert() 还会显示该变量的值。但在严格模式下，在 doSomething() 函数中调用 eval() 不会创建变量 x，因此 调用 alert() 会导致抛出 ReferenceError，因为 x 没有定义。

---

可以在 eval() 中声明变量和函数，但这些变量或函数只能在被求值的特殊作用域中有效，随后就 将被销毁。因此，以下代码可以运行，没有问题：

```js
'use strict';
var result = eval('var x=10, y=11; x+y');
alert(result); //21
```

这里在 eval() 中声明了变量 x 和 y，然后将它们加在一起，返回了它们的和。于是，result 变 量的值是 21，即 x 和 y 相加的结果。而在调用 alert() 时，尽管 x 和 y 已经不存在了，result 变量的值仍然是有效的。

### eval 与 arguments

严格模式已经明确禁止使用 eval 和 arguments 作为标识符，也不允许读写它们的值。例如：

```js
// 把 eval 和 arguments 作为变量引用
var eval = 10;
var arguments = 'Hello world!';
// 非严格模式: 没问题，不出错
// 严格模式: 抛出语法错误
```

在非严格模式下，可以重写 eval，也可以给 arguments 赋值。但在严格模式下，这样做会导致语 法错误。不能将它们用作标识符，意味着以下几种使用方式都会抛出语法错误：

- 使用 var 声明
- 赋予另一个值
- 尝试修改包含的值，如使用++
- 用作函数名
- 用作命名的函数参数
- 在 try-catch 语句中用作例外名

### 抑制 this

在非严格模式下使用函数的 apply() 或 call() 方法时，null 或 undefined 值会被转换为全局对象。而在严格模式下，函数的 this 值始终是指定的值，无论指定的是什么值。例如：

```js
//访问属性
var color = 'red';
function displayColor() {
  alert(this.color);
}
displayColor.call(null);
// 非严格模式: 访问全局属性
// 严格模式: 抛出错误，因为 this 的值为 null
```

以上代码向 displayColor.call() 中传入了 null，如果在是非严格模式下，这意味着函数的 this 值是全局对象。结果就是弹出对话框显示”red”。而在严格模式下，这个函数的 this 的值是 null，因 此在访问 null 的属性时就会抛出错误。

### 其他变化

#### with

抛弃了 with 语句。非严格模式下的 with 语句能够改变解析标识符的路径，但在严格模式下，with 被简化掉了。因此，在严格模式下使用 with 会导致语法错误。例如：

```js
//with 的语句用法
with (location) {
  alert(href);
}
// 非严格模式: 允许
// 严格模式: 抛出语法错误
```

#### 八进制字面量

严格模式也去掉了 JavaScript 中的八进制字面量。以 0 开头的八进制字面量过去经常会导致很多错 误。在严格模式下，八进制字面量已经成为无效的语法了。例如：

```js
//使用八进制字面量
var value = 010;
// 非严格模式: 值为 8
// 严格模式: 抛出语法错误
```

---

ECMAScript5 也修改了严格模式下 parseInt() 的行为。如今，八进制字面量在严格模式下会被当作以 0 开头的十进制字面量。例如：

```js
//使用 parseInt() 解析八进制字面量
var value = parseInt('010');
// 非严格模式: 值为 8
// 严格模式: 值为 10
```
