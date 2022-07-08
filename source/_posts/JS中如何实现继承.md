---
title: JS中如何实现继承
tags:
  - 继承
categories:
  - 前端
  - JS
abbrlink: 2751
date: 2019-01-01 23:45:23
---

总结 JavaScript 中如何实现继承

<!-- more -->

## 组合继承（原型链 + 借用构造函数）

```js
// 组合继承:原型继承+借用（调用）构造函数继承
function Person(name, age, sex) {
  this.name = name;
  this.age = age;
  this.sex = sex;
}
Person.prototype.sayHi = function () {
  console.log("Hello world");
};
function Student(name, age, sex, score) {
  // 借用构造函数
  Person.call(this,name,age,sex);
  this.score = score;
}
// 改变原型指向----继承
// 我们让 Student.prototype 指向一个Person的实例对象
// 这个对象的__proto__指向的是Person.prototype
// 所以我们就可以借助这个实例对象拿到sayHi方法，实现继承
Student.prototype=new Person();
Student.prototype.eat = function () {
  console.log("吃东西");
};
var stu = new Student("Lance", 20, "男", "100分");
stu.sayHi();
var stu2 = new Student("Jerry", 19, "男", "101分");
stu2.eat();

//属性和方法都被继承了
```

## 寄生组合继承（组合继承升级版）

```js
function object(o) {
  function F(){}
  F.prototype = o;
  return new F();
}

function inheritPrototype(subType, superType) {
    var prototype = object(superType.prototype); // 创建了父类原型的浅复制
    prototype.constructor = subType;             // 修正原型的构造函数
    subType.prototype = prototype;               // 将子类的原型替换为这个原型
}
 
function SuperType(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
}
 
SuperType.prototype.sayName = function() {
    alert(this.name);
};
 
function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}
// 核心：因为是对父类原型的复制，所以不包含父类的构造函数，也就不会调用两次父类的构造函数造成浪费
inheritPrototype(SubType, SuperType);
SubType.prototype.sayAge = function() {
    alert(this.age);
}
```

## ES6继承写法

```js
class Person {
  constructor(name, age) {this.name=name;this.age=age}
  sayHi() {}
}
class Student extends Person {
  constructor(name, age, weight) {
    super(name, age); this.weight = weight;
  }
  run() {}
}
```

## 在原型链继承时，为什么不直接 `Student.prototype = Person.prototype` ？

因为对象的赋值只是引用的赋值, 上面两者都指向同一个内存地址，只要随便通过1个途径就能修改该内存地址的对象，这样子类就无法单独扩展方法，而且会影响父类。

## 组合继承的缺点

缺点就是调用了两次父类的构造函数。
第一次给子类的原型添加了父类构造函数中的属性方法；第二次又给子类的构造函数添加了父类的构造函数的属性方法，从而覆盖了子类原型中的同名参数。这种被覆盖的情况造成了性能上的浪费：

```js
function SuperType() {
    this.name = 'parent';
    this.arr = [1, 2, 3];
}
 
SuperType.prototype.say = function() { 
    console.log('this is parent')
}
 
function SubType() {
    SuperType.call(this) // 第二次调用SuperType
}
 
SubType.prototype = new SuperType() // 第一次调用SuperType
```
