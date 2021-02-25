---
title: 转载-JavaScript扩展运算符的13个用法
tags:
  - 转载
  - ES6
categories:
  - 前端
  - JS
  - ES6
abbrlink: 46865
date: 2021-02-08 10:19:19
---

转载自：https://mp.weixin.qq.com/s/57rsKjxtXcmpOLz61u4l2g

我相信你一定或多或少的接触或使用过 `JS` 中的扩展操作符（Spread Operator），在基本形式中，扩展操作符看起来像三个点，比如如下这样：

```js
[...arr];
```

而实际上，它也就是这么用的，但是如果事情有这么简单，就不用我在这里写了。扩展操作符给我最大的印象就是，这玩意还挺方便的，然而最近写代码的时候经常性的遇到需要使用扩展操作符的场景，所以我干脆在网上找了些资料，把平时常见的应用场景给罗列了下，发现这个操作符是真的强大，有多强大？来看看下面这些用法吧。

## 字符串转数组

字符串转数组最普遍的做法是这样：

```js
let str = 'hello';
let arr = str.split('');
console.log(arr); // ['h', 'e', 'l', 'l', 'o']
```

而使用了扩展操作符后可以这样：

```js
let str = 'hello';
let arr = [...str];
console.log(arr); // ['h', 'e', 'l', 'l', 'o']
```

## 将类数组转换为数组

在 `JS` 中有一种数据结构叫做 `NodeList`，它和数组很相似，也被叫做“类数组”，类数组是什么？在 MDN 中是这么定义它的：

> 类数组：拥有一个 length 属性和若干索引属性的任意对象。

类数组有哪些呢？以下这些可以看成是类数组：

- `NodeList`：`document.querySelectorAll()` 返回的对象；
- `HTMLCollection`：`document.getElementsByTagName()` 返回的对象；
- `Arguments`：函数里的参数对象；

类数组没有数组的一些方法比如 `push`、`map` 等，所以经常需要将它们转成数组，而通常我们是这么转化的：

```js
let nodeList = document.querySelectorAll('div');
console.log(nodeList instanceof NodeList); // true

let arr = Array.apply(null, nodeList);
console.log(arr instanceof Array); // true

// 或者
let arr2 = [].slice.call(nodeList);
console.log(arr2 instanceof Array); // true

// 又或者
let arr3 = Array.from(nodeList);
console.log(arr3 instanceof Array); // true
```

而有了扩展操作符可以这么做：

```js
let nodeList = document.querySelectorAll('div');
let arr = [...nodeList];
console.log(arr instanceof Array); // true
```

## 向数组中添加项

往数组中添加几项通常这样操作：

```js
let arr = [5];

// 从头部添加
arr.unshift(1, 2);
console.log(arr); // [1, 2, 5]

// 从尾部添加
arr.push(6, 7);
console.log(arr); // [1，2, 5, 6, 7]

// 从任意位置添加
arr.splice(2, 0, 3, 4);
console.log(arr); // [1，2, 3, 4, 5, 6, 7]
```

使用扩展操作符后：

```js
let arr = [3, 4];
arr = [1, 2, ...arr, 5, 6];
console.log(arr); // [1, 2, 3, 4, 5, 6]
```

## 拷贝数组和对象

通常拷贝一个数组，可以这么做：

```js
let arr = [1, 3, 5, 7];
let arr2 = arr.concat();

// 或者
let arr3 = arr.slice();
arr[0] = 2;
console.log(arr); // [2, 3, 5, 7]
console.log(arr2); // [1, 3, 5, 7]
console.log(arr3); // [1, 3, 5, 7]
```

但是有了扩展操作符，拷贝数组就能写得很简单：

```js
let arr = [1, 3, 5, 7];
let arr2 = [...arr];
arr[0] = 2;
console.log(arr2); // [1, 3, 5, 7]
```

同样的，扩展操作符还能拷贝对象。拷贝对象的通常做法：

```js
let person = { name: '布兰', age: 12 };
let p2 = Object.assign({}, person);
person.age = 20;
console.log(person); // { name: '布兰', age: 20 }
console.log(p2); // { name: '布兰', age: 12 }
```

有了扩展操作符，拷贝一个对象就相当方便了：

```js
let person = { name: '布兰', age: 12 };
let p2 = { ...person };
person.age = 20;
console.log(person); // { name: '布兰', age: 20 }
console.log(p2); // { name: '布兰', age: 12 }

// 甚至还可以这么写
let { ...p3 } = person;
```

> 注意：扩展操作符只能深拷贝结构为一层的对象，如果对象是两层的结构，那么使用扩展操作符拷贝会是浅拷贝。

## 合并数组或对象

数组合并通常是这么做的：

```js
let arr1 = [1, 3, 5];
let arr2 = [2, 4, 6];
let arr3 = arr1.concat(arr2);
console.log(arr3); // [1, 3, 5, 2, 4, 6]
```

使用扩展操作符后，可以这么写：

```js
let arr1 = [1, 3, 5];
let arr2 = [2, 4, 6];
let arr3 = [...arr1, ...arr2];
console.log(arr3); // [1, 3, 5, 2, 4, 6]
```

对了，它除了能合并数组外还能合并对象呢。合并对象，通常的做法是：

```js
let p1 = { name: '布兰' };
let p2 = { age: 12 };
let p3 = Object.assign({}, p1, p2);
console.log(p3); // { name: '布兰', age: 12}
```

用扩展操作符合并对象：

```js
let p1 = { name: '布兰' };
let p2 = { age: 12 };
let p3 = { ...p1, ...p2 };
console.log(p3); // { name: '布兰', age: 12}
```

## 解构对象

经常我们给对象设置参数的时候会这么做：

```js
let person = {
  name: '布兰',
  age: 12,
  sex: 'male'
};
let name = person.name;
let age = person.age;
let sex = person.sex;
```

而有了扩展操作符，我们就可以这么写，不过其实如下这种写法并不是扩展操作符的写法 🤣，而是剩余操作符的写法，虽然写出来后看起来差不多，但就在操作对象这一点上，基本上可以认为它和扩展操作符是相反的操作，扩展操作符是用来展开对象的属性到多个变量上，而剩余操作符是用来把多个参数凝聚到一个变量上。

```js
let person = {
  name: '布兰',
  age: 12,
  sex: 'male'
};
let { name, ...reset } = person;
console.log(name); // '布兰'
console.log(reset); // { age: 12, sex: 'male' }
```

## 给对象添加属性

给对象加属性通常这样加：

```js
let person = { name: '布兰' };
person.age = 12;
console.log(person); // { name: '布兰', age: 12 }
```

使用扩展操作符给对象添加属性：

```js
let person = { name: '布兰' };
person = { ...person, age: 12 };
console.log(person); // { name: '布兰', age: 12 }
```

关于使用扩展操作符给对象添加属性，这里有 2 个小技巧：

-

- 1. 给新对象设置默认值：

```js
// 默认 person 对象的 age 属性值 为 12
let person = { age: 12, ...{ name: '布兰' } };
console.log(person); // { age: 12, name: '布兰' }
```

-

- 1. 重写对象属性

```js
let person = { name: '布兰', age: 12 };

// person 对象的 age 属性被重写为 20
person = { ...person, age: 20 };
console.log(person); // { name: '布兰', age: 20 }
```

## 设置对象 Getter

设置对象 `Getter` 通常做法是这样：

```js
let person = { name: '布兰' };
Object.defineProperty(person, 'age', {
  get() {
    return 12;
  },
  enumerable: true,
  configurable: true
});
console.log(person.age); // 12
```

而有了扩展操作符后可以这么写：

```js
let person = { name: '布兰' };
person = {
  ...person,
  get age() {
    return 12;
  }
};
console.log(person.age); // 12
```

## 将数组作为函数参数展开

如果我们有一个形参是多个参数的函数，但是当调用的时候发现入参却是一个数组，常规做法是这样：

```js
let arr = [1, 3, 5];
function fn(a, b, c) {}
fn.apply(null, arr);
```

使用扩展操作符后，就简单多了：

```js
let arr = [1, 3, 5];
function fn(a, b, c) {}
fn(...arr);
```

## 无限参数的函数

如果有这么一个累加函数，他会把所有传递进来的参数都加起来，普通做法是把参数都整合到数组里，然后这样做：

```js
function doSum(arr) {
  return arr.reduce((acc, cur) => acc + cur);
}
console.log(doSum([1, 3])); // 4
console.log(doSum([1, 3, 5])); // 9
```

如果参数不是数组，而是需要一个个传递，相当于函数必须支持无限参数，那可能会这么做：

```js
function doSum() {
  let sum = 0;
  for (let i = 0, l = arguments.length; i < l; i++) {
    sum += arguments[i];
  }
  return sum;

  // 或者
  // let args = [].slice.call(arguments)
  // return args.reduce((acc, cur) => acc + cur)
}
console.log(doSum(1, 3)); // 4
console.log(doSum(1, 3, 5)); // 9
console.log(doSum(1, 3, 5, 7)); // 16
```

而有了扩展操作符，就简单多了：

```js
function doSum(...arr) {
  return arr.reduce((acc, cur) => acc + cur);
}
console.log(doSum(1, 3)); // 4
console.log(doSum(1, 3, 5)); // 9
console.log(doSum(1, 3, 5, 7)); // 16
```

## 扩展函数的剩余参数

有的时候一个函数需要传递很多的参数，比如小程序页面（`WePY`）的 `onLoad` 生命周期函数里就可能有很多别的页面传递过来的参数，然后还需要在函数里进行一些数据初始化工作，这样一来就会显得很臃肿不美观，比如：

```js
function init(a, b, x, y) {
  // 进行一系列初始化数据工作
}
```

而使用了扩展操作符后，我们就可以按照业务把参数进行解构，把本该在一个函数里进行初始化的工作拆分成多个，可以这么做：

```js
function other(x, y) {}
function init(a, b, ...restConfig) {
  // 使用 a 和 b 参数进行操作
  // 其余参数传给原始函数
  return other(...restConfig);
}
```

## 结合 Math 函数使用

比如当需要对一个数组求最大值的时候，通常会这么做：

```js
let arr = [3, 1, 8, 5, 4];
function max(arr) {
  return [].concat(arr).sort((a, b) => b - a);
}
console.log(max(arr)[0]); // 8

// 或者
arr.reduce((acc, cur) => Math.max(acc, cur)); // 8

// 又或者
Math.max.apply(null, arr); // 8
```

但是使用扩展操作符后，能够把给数组求最大值写得更加简洁：

```js
let arr = [3, 1, 8, 5, 4];
let max = Math.max(...arr);
console.log(max); // 8
```

## 在 new 表达式中使用

假设有一个数组格式的日期，想要通过 Date 构造函数创建一个日期实例的话，可能会这么做：

```js
let arr = [2021, 1, 1];
let date = new Date([].toString.call(arr));
console.log(date); // 'Mon Feb 01 2021 00:00:00 GMT+0800 (中国标准时间)'

// 或者
let date2 = new (Function.prototype.bind.apply(Date, [null].concat(arr)))();
console.log(date2); // 'Mon Feb 01 2021 00:00:00 GMT+0800 (中国标准时间)'
```

而有了扩展操作符就简单多了：

```js
let arr = [2021, 1, 1];
let date = new Date(...arr);
console.log(date); // 'Mon Feb 01 2021 00:00:00 GMT+0800 (中国标准时间)'
```

## 总结

这个操作符真可谓使用简单无脑，但是功能效率上不得不说很强大，所以我们要做的就是只要记住在什么时候使用它就好了，于是乎为了让大家能更好的记住这 13 种使用场景，我特意做了一个图，方便大家记忆，是不是很贴？是的话请不要吝啬你的爱心，给个小星星 👍 吧，感谢感谢。以上这些只列了 13 种写法，我觉得作为一个这么强大的操作符，肯定有更多使用的场景，欢迎把你们知道的写到评论区吧。

{% asset_img comb.png comb %}
