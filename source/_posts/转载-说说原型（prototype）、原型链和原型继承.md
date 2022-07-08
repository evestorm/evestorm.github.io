---
title: 转载-说说原型（prototype）、原型链和原型继承
tags:
  - 转载
  - 原型
categories:
  - 前端
  - JS
  - 原型
abbrlink: 12455
date: 2021-02-02 19:04:24
---

转载自：https://zhuanlan.zhihu.com/p/35790971

<!-- more -->

## 一、原型 `prototype` 和 `__proto__`

- 每个对象都有一个`__proto__`属性，并且指向它的`prototype`原型对象

- 每个构造函数都有一个`prototype`原型对象

- - `prototype`原型对象里的`constructor`指向构造函数本身

{% asset_img v2-e722d5325f7d4215169f1d04296e0f89_720w.png v2-e722d5325f7d4215169f1d04296e0f89_720w %}

**有的同学可能会问`prototype` 和 `__proto__`有什么用呢？**

实例对象的`__proto__`指向构造函数的`prototype`，从而实现继承。

`prototype`对象相当于特定类型所有实例对象都可以访问的公共容器

{% asset_img v2-1ae63b09f2f38aee29efc79f1400b8d3_720w.jpg v2-1ae63b09f2f38aee29efc79f1400b8d3_720w %}

**看一下代码就清楚了**

```js
function Person(nick, age) {
  this.nick = nick;
  this.age = age;
}
Person.prototype.sayName = function () {
  console.log(this.nick);
};

var p1 = new Person('Byron', 20);

var p2 = new Person('Casper', 25);

p1.sayName(); // Byron

p2.sayName(); // Casper

p1.__proto__ === Person.prototype; //true

p2.__proto__ === Person.prototype; //true

p1.__proto__ === p2.__proto__; //true

Person.prototype.constructor === Person; //true
```

> 注意
> \1. 当`Object.prototype.__proto__` 已被大多数浏览器厂商所支持的今天，其存在和确切行为仅在 ECMAScript 2015 规范中被标准化为传统功能，以确保 Web 浏览器的兼容性。为了更好的支持，建议只使用 `Object.getPrototypeOf()`。
> \2. Object.create(null) 新建的对象是没有**proto**属性的。

## 二、原型链

请看以下代码

```js
var arr = [1, 2, 3];

arr.valueOf(); //  [1, 2, 3]
```

我们再来看一张图

{% asset_img v2-baca413d5f93e3b7194c13a0b3c4621d_720w.jpg v2-baca413d5f93e3b7194c13a0b3c4621d_720w %}

按照之前的理论，如果自身没有该方法，我们应该去`Array.prototype`对象里去找，但是你会发现`arr.__proto__`上压根就没有`valueOf`方法，那它是从哪里来的呢？

**各位客官，请看这张图**

{% asset_img v2-cd7629e47fcb399e5f009c7dbb5149d8_720w.jpg v2-cd7629e47fcb399e5f009c7dbb5149d8_720w %}

很奇怪我们在`Array.prototype.__proto__`里找到了`valueOf`方法，为什么呢？

## 查找`valueOf`方法的过程

当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。

查找 valueOf 大致流程

1. 当前实例对象 obj，查找 obj 的属性或方法，找到后返回
2. 没有找到，通过`obj. __proto__`，找到 obj 构造函数的`prototype`并且查找上面的属性和方法，找到后返回
3. 没有找到，把`Array.prototype`当做 obj，重复以上步骤

当然不会一直找下去，原型链是有终点的，最后查找到`Object.prototype`时
`Object.prototype.__proto__ === null`，意味着查找结束

{% asset_img v2-78c74eec6cda54f09e10092a5080f739_720w.jpg v2-78c74eec6cda54f09e10092a5080f739_720w %}

我们来看看上图的关系

```js
arr.__proto__ === Array.prototype;
true;
Array.prototype.__proto__ === Object.prototype;
true;
arr.__proto__.__proto__ === Object.prototype;
true;

// 原型链的终点
Object.prototype.__proto__ === null;
true;
```

**原型链如下：**

```
arr ---> Array.prototype ---> Object.prototype ---> null
```

**这就是传说中的原型链，层层向上查找，最后还没有就返回 undefined**

## 三、JavaScript 中的继承

## 3.1 什么是继承？

> 继承是指一个对象直接使用另外一个对象的属性和方法

由此可见只要实现属性和方法的继承，就达到继承的效果

- 得到一个对象的属性
- 得到一个对象的方法

## 3.2 属性如何继承？

我们先创建一个`Person`类

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 方法定义在构造函数的原型上
Person.prototype.getName = function () {
  console.log(this.name);
};
```

此时我想创建一个`Teacher`类，我希望它可以继承`Person`所有的属性，并且额外添加属于自己特定的属性；

- 一个新的属性，subject——这个属性包含了教师教授的学科。

定义`Teacher`的构造函数

```js
function Teacher(name, age, subject) {
  Person.call(this, name, age);
  this.subject = subject;
}
```

**属性的继承是通过在一个类内执行另外一个类的构造函数，通过`call`指定`this`为当前执行环境，这样就可以得到另外一个类的所有属性。**

> Person.call(this, name, age)

我们实例化一下看看

```js
var teacher = new Teacher('jack', 25, Math);

teacher.age;
25;
teacher.name;
('jack');
```

很明显`Teacher`成功继承了`Person`的属性

## 3.3 方法如何继承？

我们需要让`Teacher`从`Person`的原型对象里继承方法。我们要怎么做呢？

我们都知道类的方法都定义在`prototype`里，那其实我们只需要把`Person.prototype`的备份赋值给`Teacher.prototype`即可

> Teacher.prototype = Object.create(Person.prototype)

[Object.create](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)简单说就是新建一个对象，使用现有的对象赋值给新建对象的`__proto__`

可能有人会问为什么是备份呢？

因为如果直接赋值，那会是引用关系，意味着修改`Teacher. prototype`，也会同时修改`Person.prototype`，这是不合理的。

另外注意一点就是，在给`Teacher`类添加方法时，应该在修改`prototype`以后，否则会被覆盖掉，原因是赋值前后的属性值是不同的对象。

最后还有一个问题，我们都知道`prototype`里有个属性`constructor`指向构造函数本身，但是因为我们是复制其他类的`prototype`，所以这个指向是不对的，需要更正一下。
如果不修改，会导致我们类型判断出错

> Teacher.prototype.constructor = Teacher

```js
Teacher.prototype = Object.create(Person.prototype)

Teacher.prototype.constructor
ƒ Person(name, age) {
    this.name = name
    this.age = age
}

---

Teacher.prototype.constructor = Teacher
ƒ Teacher(name, age, subject) {
    Person.call(this, name, age)
    this.subject = subject
}
```

**继承方法的最终方案：**

```js
Teacher.prototype = Object.create(Person.prototype);
Teacher.prototype.constructor = Teacher;
```

## 3.4 hasOwnProperty

在原型链上查询属性比较耗时，对性能有影响，试图访问不存在的属性时会遍历整个原型链。

遍历对象属性时，每个可枚举的属性都会被枚举出来。 要检查是否具有自己定义的属性，而不是原型链上的属性，必须使用`hasOwnProperty`方法。

[hasOwnProperty](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) 是 JavaScript 中唯一处理属性并且不会遍历原型链的方法。

## 四、总结

## `prototype` 和 `__proto__`

- 每个对象都有一个`__proto__`属性，并且指向它的`prototype`原型对象

- 每个构造函数都有一个`prototype`原型对象

- - `prototype`原型对象里的`constructor`指向构造函数本身

## 原型链

每个对象都有一个`__proto__`，它指向它的`prototype`原型对象，而`prototype`原型对象又具有一个自己的`prototype`原型对象，就这样层层往上直到一个对象的原型`prototype`为`null`

这个查询的路径就是`原型链`

## JavaScript 中的继承

- 属性继承

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 方法定义在构造函数的原型上
Person.prototype.getName = function () {
  console.log(this.name);
};

function Teacher(name, age, subject) {
  Person.call(this, name, age);
  this.subject = subject;
}
```

- 方法继承

```js
Teacher.prototype = Object.create(Person.prototype);
Teacher.prototype.constructor = Teacher;
```
