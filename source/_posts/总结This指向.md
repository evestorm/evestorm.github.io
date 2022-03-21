---
title: 总结This指向
tags:
  - 笔记
categories:
  - 前端
  - JS
  - ECMAScript
abbrlink: 37195
date: 2021-05-20 15:08:07
---

# 前言

- this 是 JavaScript 的关键字
- 是 当前环境 执行期上下文对象 的 一个属性
- this明确指向的时机：**执行期**
- this 在不同环境、不同作用域下，表现不同

<!-- more -->

# 全局this

## 🌈获取全局对象this

- web 下的全局 this: `window、self、frames、this`
- node 下的全局 this: `global、globalThis`
- worker 下的全局 this: `self`
- 通用：`globalThis`

## web

- 全局 this = window
- 严格模式下
  - 未通过 var 声明的变量会报错
  - 函数自调用中 this 为 undefined

```javascript
var a = 1;
var b = function() { console.log('fun b中的this:', this) }
c = {};
console.log('this === window', this === window);
console.log('window.a === a:', window.a === a);
b();
console.log('window.c === this.c:', window.c === this.c);
```

{% asset_img 1640935990950-bd04b9bc-e2a7-450e-af6e-bdc449646aab.png 100% %}

严格模式下：

```javascript
"use strict";
c = 123;
```

{% asset_img 1640936166568-307bc8d7-fe38-48e9-89e8-844e54acc302.png 100% %}

```javascript
"use strict";
var b = function() { console.log('fun b中的this:', this) }
b();
```

{% asset_img 1640936233376-1f35d3c2-8251-422b-b9bd-eaf3919b3bf9.png 100% %}

```javascript
function test() {
  "use strict";
  return this;
}

window.test(); // window

// 谁调用函数，函数内部的this指向谁
```

## node

- 下面两种方式才能把变量挂载到 global 上
  - `global.a`
  - `a` （不通过 var、let、const，这些声明的变量会挂载到当前模块中而不是全局）
- 严格模式下
  - 函数自调用中 global 为 undefined

```javascript
var a = 1;
b = function() { console.log(this) };
global.c = 2;
console.log(a);
console.log(b);
console.log(c);
console.log(global.a);
console.log(global.b);
console.log(global.c);
b();
```

{% asset_img 1640936826388-bdc36e33-9a2c-43c0-8fdf-0a4e391116bb.png 100% %}

```javascript
"use strict";
var b = function() { console.log(this) };
b(); // undefined
```

# 🌈class 中 this

- super 做了什么：
  - 调用父类的 constructor
  - 生成 this ，并把 this 指向 子类
- 如果没有调用 super
  - 不会调用父类的 constructor 也就不生成父类的 this
- 子类 constructor 中，访问 this 前，必须得首先调用 super
- 类中是严格模式

```javascript
class Father {
  constructor(age) {
    this.age = age;
  }
  swim() {
    console.log('Go swimming!!!');
  }
}

class Son extends Father {
  constructor() {
    super(23);
    this.hobby = 'travel';
    console.log(this.age);
  }
  study() {
    console.log(this);
    this.swim();
  }
}

const son = new Son();
son.study();
```

{% asset_img 1640939032529-3f4c2c18-000f-4ffa-9277-a00426b3487f.png 100% %}

{% asset_img 1640939048469-9efa13fa-3be8-437c-93c3-70108ad34a65.png 100% %}



不能调换super顺序，得首先调用 super：

```javascript
class Son extends Father {
  constructor() {
    this.hobby = 'travel';
    super(23);
  }
}
```

{% asset_img 1640939537274-ef2fcc59-6f2a-4be5-94bc-7167a9f280b1.png 100% %}

原因是按照正常顺序：

1. super() 被调用
2. 调用父类 constructor
3. 实例化父类 this，给父类 this 挂上 age 属性
4. 再执行子类 constructor 中代码
5. 先把父类 this 指向子类实例化的 this
6. 给子类 this 添加上 hobby 属性
7. 现在子类上有两个属性了，分别是 age、hobby


而如果先执行子类 constructor 中代码，后执行 super，就会导致先实例化了子类 this，再实例化父类 this，这样逻辑就不对了。

## 类之间操作this

```javascript
class Father {
	get fruit() {
  	return 'apple';
  }
  eat() {
  	console.log('I am eating an ' + this.fruit);
  }
}

class Son {
	get fruit() {
  	return 'orange';
  }
}

const father = new Father();
const son = new Son();

father.eat(); // apple
son.eat = father.eat;
son.eat(); // orange
```

如果希望son调用eat时，还是拿的 father 中的 apple，可以在constructor中bind固定this：

```javascript
class Father {
  constructor() {
    // 让函数内部的this指向固定
    // 这样无论再把eat赋给谁，this都不会改变了
    this.eat = this.eat.bind(this);
  }
	get fruit() {
  	return 'apple';
  }
  eat() {
  	console.log('I am eating an ' + this.fruit);
  }
}

class Son {
	get fruit() {
  	return 'orange';
  }
}

const father = new Father();
const son = new Son();

father.eat(); // apple
son.eat = father.eat;
son.eat(); // apple
```

{% asset_img 1640969325138-0766e560-ef75-4802-8126-3b976e10c11a.png 100% %}

# 🌈 call、apply、bind 的 this

- call、apply、bind 都能改变 this 指向

```javascript
var obj = {
	a: 1
}
var a = 2;

function test(b, c) {
	console.log(this);
}

test();
test.call(obj, 3, 4);
test.apply(obj, [3, 4]);
```

{% asset_img 1640965304214-cade9585-e27d-4923-bea1-a46aa558ee41.png 100% %}



- **bind 绑定只能生效一次**

```javascript
var obj = {
	a: 1
}
var obj2 = {
	a: 100
}

function test(b, c) {
	console.log(this, b, c);
}

var test1 = test.bind(obj, 3, 4);
test1();
var test2 = test1.bind(obj2, 3, 4);
test2();
```

{% asset_img 1640965496284-3020ef26-ae32-4a7b-8873-7a3a25385f4c.png 100% %}

```javascript
var obj = {
	a: 1
}
var obj2 = {
	a: 100
}

function test(b, c) {
	console.log(this, b, c);
}

var test1 = test.bind(obj2, 3, 4).bind(obj, 3, 4);
test1();
```

{% asset_img 1640965575217-74f8cfbd-96c1-449d-a10f-b1f54010b93d.png 100% %}


# 箭头函数中 this

- 箭头函数本身没有 this
- 箭头函数内部 this 指向外层作用域 this
- **箭头函数中 this 不是在执行期确定，而是声明时就已确定，而且无法更改**
- 箭头函数忽略任何形式的this指向的改变（apply，call，bind）
- **箭头函数无法通过 new 实例化**



不管是否是严格模式，全局下箭头函数的this都为window

```javascript
const test = () => {
	console.log(this);
}
test(); // window
"use strict";
const test = () => {
	console.log(this);
}
test(); // window
```



箭头函数忽略任何形式的this指向的改变（apply，call，bind）：

```javascript
var obj = {
	a: 1
}

const test = () => {
	console.log(this.a);
}
test.call(obj); // undefined
test.apply(obj); // undefined
var test1 = test.bind(obj);
test1(); // undefined
```

箭头函数中 this 不是在执行期确定，而是声明时就已确定，而且无法更改：

```javascript
var obj = {
	a: 1
}

obj.test = () => {
	console.log(this);
}
obj.test(); // window
var obj = {
	a: 1
}

obj.test = function() {
	var t = () => {
  	console.log(this); // obj
  }
  t();
}
obj.test();
var obj = {
	a: 1
}

obj.test = function() {
	var t1 = () => {
  	var t2 = () => {
    	console.log(this); // obj
    }
    t2();
  }
  t1();
}
obj.test();
var obj = {
	a: 1
}

obj.test = function() {
	var t1 = function() {
  	var t2 = () => {
    	console.log(this);
    }
    t2();
  }
  t1();
}
obj.test();
```

{% asset_img 1640966314047-e656cf71-81ce-43f5-8e03-7b17f8e7aa7d.png 100% %}


# 对象中的 this

- this指向的基本原则：谁调用，this指向谁
- 对象方法内部的this：指向最近作用域的引用

```javascript
var obj = {
	a: 1,
  b: 2,
  test: function() {
  	console.log(this.a); // 1
  },
  test2: test2,
  c: {
  	d: 4,
    test3: function() {
    	console.log(this);
      console.log(this.d);
    }
  }
}
function test2() {
	console.log(this.b);
}
obj.test();
obj.test2();
obj.c.test3();
```

{% asset_img 1640967160797-5b63e55c-5a04-44ba-a164-4b910216e901.png 100% %}

```javascript
var obj2 = {
	a: 1,
  b: 2,
  test3: function() {
  	function t() {
      // 这个函数t是孤立的，不是 obj2 内部的成员
      // 并不存在 obj2.t,  t()自调用，默认this为window
    	console.log(this);
    }
    t(); // window
  }
}
obj2.test3();
var a = 8;
var o = {
	a: 10,
  b: {
  	fn: function() {
    	console.log(this.a);
    }
  }
}
o.b.fn(); // undefined
```

## 原型this

```javascript
var obj = {}
obj.__proto__ = {
	e: 20
}
console.log(obj.e); // 20 原型继承
var obj = Object.create({
	test4: function() {
  	console.log(this.a + this.b);
  }
});
obj.a = 1;
obj.b = 2;
obj.test4(); // 3
```

## 🌈构造函数 return this

- new做了什么

- - 实例化一个空对象
  - 把需要初始化的属性和方法挂载此对象上
  - 隐式的返回此 this

- 如果显示的 return 一个复杂类型的值，会把默认隐式return的实例化对象覆盖

```javascript
function Test() {
	this.a = 1;
  this.b = 2;
  console.log(this); // {a:1,b:2}
  
  return {
  	c: 3,
    d: 4
  }
}
var test1 = new Test();
console.log(test1); // {c:3,d:4}
```

# 🌈事件处理函数中的this

- onclick、addEventListener事件处理函数内部的this总是指向被绑定的DOM元素

```html
<body>
  <button id="btn">点我</button>
</body>
var btn = document.getElementById('btn');
btn.onclick = function() {
  console.log(this); // btn元素
}
btn.addEventListener('click', function() {
  console.log(this); // btn元素
}, false);
```

{% asset_img 1640968720944-9d2f456c-b356-4bb3-b5c7-4bc8e8b3cb61.png 100% %}


直接在元素上绑定，this还是btn：

```javascript
<button id="btn" onclick="console.log(this)">点我</button>
```

{% asset_img 1640968896015-1b0d5ce6-eb35-4275-97fe-a024a33710e6.png 100% %}

改变this指向：

{% asset_img 1640494512342-aeb9b2b5-6760-436a-9e8f-aad18b38d9dc.png 100% %}

如果绑定箭头函数，this就是window：

```javascript
<button id="btn" onclick="(function() { console.log(this) })()">点我</button>
```

{% asset_img 1640968939918-40472b0d-51c3-4175-82f0-850b4e02bb08.png 100% %}

# Promise中回调函数this还是window

{% asset_img 1640494541034-35314e9a-06b3-4028-88ba-caa53f529d11.png 100% %}

{% asset_img 1640494617021-81201173-cb2a-4495-a186-f736395ad30b.png 100% %}

# 练习

```javascript
var a = 8;
var o = {
  a: 10,
  b: {
    fn: function() {
      console.log(this.a);
    }
  }
}
o.b.fn();
```