---
title: null 和 undefined 的区别
categories:
  - 前端
  - JS
abbrlink: 63928
date: 2018-12-21 23:41:25
tags:
---

## 含义

- null 表示一个对象是“没有值”的值，也就是值为“空”
- undefined 表示一个变量声明了没有初始化(赋值)

## 类型

- undefined 的类型(typeof)是 undefined
- null 的类型(typeof)是 object

<!-- more -->

## 双等三等

另外，在验证 null 时，一定要使用 `===` ，因为 `==` 无法分辨 null 和 undefined ：

```
copynull == undefined // true 
null === undefined // false
```



## 总结

### undefined

1. 变量提升：只声明未定义默认值就是 undefined
2. 严格模式下：没有明确的执行主体，this 就是 undefined
3. 对象没有这个属性名，属性值是 undefined
4. 函数定义形参不传值，默认就是 undefined
5. 函数没有返回值（没有 return 或者 return; ），默认返回的就是 undefined
6. 数组越界取值也是 undefined （arr=[1,2]; arr[10] => undefined）
7. …

### null

1. 手动设置变量的值或者对象某个属性值为null（此时不赋值，后面会赋值）
2. 在 JS 的 DOM 元素获取中，如果没有获取到指定的元素对象，结果一般都是null
3. Object.prototype.**proto** 的值也是 null
4. 正则捕获的时候，如果没有捕获到结果，默认也是null
5. …

## 其他

Javascript会将未赋值的变量默认值设为undefined；Javascript从来不会将变量设为null。它是用来让程序员表明某个用var声明的变量时没有值的。