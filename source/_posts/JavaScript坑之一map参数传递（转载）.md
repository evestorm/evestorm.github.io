---
title: JavaScript坑之一map参数传递（转载）
tags:
  - 转载
categories:
  - 前端
  - JS
abbrlink: 27648
date: 2019-04-11 22:59:40
---

## 转载文章

博客源：[JavaScript 坑之一 map 参数传递](https://blog.csdn.net/drafting_dreams/article/details/77684580)

map()方法定义在 JavaScript 的 Array 中，他是一个高阶函数。我们向这个函数传入我们自己定义的回调函数（callback），然后 map 会对数组当中每一个元素去调用回调函数。

通常，我们只在回调函数里用一个参数，因为大多数回调函数只需要一个参数，或者一个必须参数和多个可选参数。这样的习惯会有时导致很诡异的行为。

<!-- more -->

```js
['1', '2', '3'].map(parseInt); //[1, NaN, NaN]
```

我们所希望看到的结果其实是[1, 2, 3]，原因是 parseInt 一般我们用的时候都是习惯性用一个参数，但他可以接收两个参数，第二个参数用来做基数。而 map 向回调函数传参有三个，数组中的元素，元素的下标和这个数组。第三个参数被 parseInt 忽略掉，前两个参数被接收。
parseInt(‘0’, 0); //基数为 0，或者 undefined，用 10 进制

parseInt(‘1’, 1); //没有 1 进制，返回 NaN

parseInt(‘2’, 2); //二进制不能出现 2，返回 NaN

这里关键是要知道回调函数接收的参数有三个，那么如何解决上面的问题呢？

```js
function myParseInt(intString) {
  return parseInt(intString, 10);
}
['1', '2'].map(myParseInt);
```

或者，用更简单的写法

```js
['1', '2'].map(str => parseInt(str));
```

或者，最简单的写法

```js
['1', '2'].map(Number);
```
