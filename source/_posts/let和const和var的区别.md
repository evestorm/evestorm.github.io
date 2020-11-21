---
title: let和const和var的区别
tags:
  - ES6
categories:
  - 前端
  - JS
abbrlink: 37021
date: 2019-01-03 23:48:36
---

## const 和 let 异同

### 不同点

- let 定义变量可以只声明不赋值
- const 定义常量声明时必须赋值，一旦定义不可轻易改变

### 相同点

解决 var 没有块作用域,、变量提升、可以重复声明的问题。 let 和 const 有自己的块作用域, 不存在变量提升问题, 同一块作用域中不可重复声明（会报错）。

## let/const 和 var 区别

- var 有变量提升，let/const 没有
- let/const 的作用域是块，而 var 的作用域是函数
- let/const 有暂时性死区，只要 let/const 声明的变量，在未声明之前使用或者赋值都会报错（ReferenceError）
- let/const 不能被重复定义
