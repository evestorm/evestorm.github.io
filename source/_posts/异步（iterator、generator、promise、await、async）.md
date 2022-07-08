---
title: 异步（iterator、generator、promise、await、async）
tags:
  - 笔记
  - Promise
  - ES6+
categories:
  - 前端
  - JS
  - ES6+
top: true
abbrlink: 62468
date: 2021-10-19 14:07:49
---


# 前置知识：循环、遍历、迭代

- 循环：语言层面上的语法 -> 重复执行一段程序的方案
- 遍历：业务层面上的做法 -> 观察或者获取集合中的元素的一种做法
- 迭代：实现层面上的概念 -> 实现遍历的底层方案其实就是迭代

<!-- more -->

- ECMAScript3：没有针对可迭代对象的具体的遍历方法
- ECMAScript5：
- - 针对数组遍历：7个遍历方法
- - - forEach、map、filter、reduce、reduceRight、some、every
- - 针对对象遍历：
- - - for-in（对 array（不建议），object 有效。map、set等无效）

# iterator 迭代器

## 介绍、基本使用

对数据结构读取的一种方式，有序的，连续的，基于拉取的一种消耗数据的组织方式

```javascript
let arr = [1,2,3,4];
console.log(arr);
```

{% asset_img 1636445059739-9bec2718-1d54-4eff-a6d4-4d80c438f36f.png 100% %}

```javascript
var arr1 = [1,2,3,4,5];
var ite = arr1[Symbol.iterator]();
console.log(ite);
```

{% asset_img 1636445072464-d60c1250-4f96-4e42-a18c-de93863ab8f3.png 100% %}

```javascript
var arr1 = [1,2,3,4];
var ite = arr1[Symbol.iterator]();
console.log(ite.next());
console.log(ite.next());
console.log(ite.next());
console.log(ite.next());
console.log(ite.next());
console.log(ite.next());
```

{% asset_img 1636445085688-8ca31ef1-c451-44cf-a218-2cf41860bf8e.png 100% %}

## 部署了迭代器接口的数据结构

- [] 数组
- arguments、nodeList、Map、Set、WeakMap、WeakSet 类数组、string
- TypeArray 二进制数据的缓存区，有点像数组

```javascript
var tArr = new Int8Array(5);
tArr[0] = 100;
```

{% asset_img 1636446082753-218f9632-24d9-4e51-941c-d0f25cbb1cc7.png 100% %}

## 🌈实现iterator

```javascript
function myIterator(arr) {
  let index = 0;
  return {
    next() {
      return index < arr.length 
          ? { value: arr[index++], done: false }
          : { value: undefined, done: true }
    }
  }
}

var iter = myIterator([1,2,3,4,5]);
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
```

{% asset_img 1636445921236-0f27b3c3-2428-451c-b693-ce917c5b0702.png 100% %}

## for...of 应用

```javascript
var arr = [1,2,3,4];
for (let i of arr) {
	console.log(i); // 获取值
}
for (let i in arr) {
	console.log(i); // 获取下标
}
```

{% asset_img 1636446115402-d678a71f-8f7d-4ac5-8576-4eefc8143ded.png 100% %}

### 在对象上部署iterator，使其可以使用for...of

```javascript
const obj = {
	start: [8,6,1,2,3,4],
  end: [5,6,7,2,3],
	[Symbol.iterator]() {
    let index = 0,
        arr = [...this.start, ...this.end],
        len = arr.length;
  	return {
    	next() {
      	return index < len ?
          { value: arr[index++], done: false } :
          { value: undefined, done: true }
      }
    }
  }
}
for(let i of obj){
	console.log(i);
}

const arr1 = [...obj]; // 部署了迭代器接口的对象可以使用...运算符
console.log(arr1);
```

{% asset_img 1636446728412-2ca2a7af-c7f8-4c6b-aa88-edb9c72cbb58.png 100% %}

## 🌈让对象可以迭代

```javascript
var map = new Map(['a', 1], ['b', 2])
for(let [key, value] of map){
	console.log(key, value)
}

var obj = {
	a: 1, 
  b: 2,
  c: 3,
  [Symbol.iterator](){
  	let map = new Map();
    // 转成map
    for(let [key, value] of Object.entries(this)){
    	map.set(key, value);
    }
    // 转成数组
    let mapEntries = [...map];
    let nextIndex = 0;
    return {
    	next: function(){
        if(nextIndex < mapEntries.length){
        	return {
          	value: mapEntries[nextIndex ++],
            done: false
          }
        }
      	return {
        	value: undefined,
          done: true
        }
      }
    }
  }
}

for(let i of obj){
	console.log(i)
}
```

# 🌈generator 生成器

## 如何返回一个迭代对象

```javascript
function * foo() {
	yield 'Hello world';
}

const iter = foo();
console.log(iter);
```

{% asset_img 1636705020022-21c2e40c-e4b0-416c-8b92-12bca4c51515.png 100% %}

## yield（产出），每次暂停函数执行，有记忆功能

```javascript
function * foo() {
	console.log(1);
  yield 'Hello';
  console.log(2);
  yield 'world';
  console.log(3);
  return '!!!';
}

const iter = foo();

console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
```

{% asset_img 1636705311293-0a48e083-a8be-496d-9cdd-2a1e9d552144.png 100% %}

## return会结束函数执行

```javascript
function * test(){
	yield 'a';
  yield 'b';
  yield 'c';
  return 'd'
}
var iter = test();
console.log(iter);
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next()); // return 返回
console.log(iter.next());
```

{% asset_img 1636705429320-6de38d15-6f34-45fc-8636-39c1bda3689b.png 100% %}

## yield 本身不产出值

```javascript
function * test(){
	var a = yield 'a';
  console.log('a==>>', a);
  return 'd'
}
var iter = test();
console.log(iter);
console.log(iter.next());
console.log(iter.next());
```

{% asset_img 1636705511139-d192fb43-ea46-4f4a-8766-3d98a258f2d2.png 100% %}

## yield的值可以通过next函数指定

```javascript
function * test(){
	var a = yield 'a';
  console.log('a==>>', a);
  return 'd'
}
var iter = test();
console.log(iter);
console.log(iter.next(10));
console.log(iter.next(20));
```

{% asset_img 1636706343033-4bce0389-9c29-4fd0-a80d-3d6ba9197fc5.png 100% %}

## yield在表达式中，要用括号括起来充当表达式

```javascript
function * demo(){
	console.log('hello' + (yield 123));
}
```

## yield作为参数

```javascript
function * demo(){
	foo(yield 'a', yield 'b');
}
function foo(a, b){
	console.log(a, b);
}
var iter = demo();
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
```

{% asset_img 1636706441397-5670eda7-1600-42c9-a073-88da71c9861e.png 100% %}

```javascript
function * demo(){
	foo(yield 'a', yield 'b');
}
function foo(a, b){
	console.log('foo--', a, b);
}
var iter = demo();
console.log(iter.next());
console.log(iter.next(1));
console.log(iter.next(2));
```

{% asset_img 1636706476177-60a0caf5-e052-40cf-a1c5-50436a3fc2a2.png 100% %}

## yield产生迭代器对象，可以迭代， 不会包含return的值

```javascript
function * foo(){
	yield 1;
	yield 2;
	yield 3;
	yield 4;
  return 5;
}
for(let i of foo()){
	console.log(i); // 不会打印出return的5
}
```

{% asset_img 1636706500483-a5f7268b-88ed-4e37-98ed-4b76ec8eb8e9.png 100% %}

## yield 产出值, next()方法的参数表示上一个yield表达式的返回值

- 在第一次使用next()方法时，传递参数是无效的。
- 从语义上讲，第一个next()方法用来启动遍历器对象，所以不用带有参数。
- next()方法的参数表示上一个yield表达式的返回值

```javascript
function * foo(){
	let v1 = yield 1;
  console.log('v1-', v1);
	let v2 = yield 2;
  console.log('v2-', v2);
	let v3 = yield 3;
  console.log('v3-', v3);
	let v4 = yield 4;
  console.log('v4-', v4);
}
var iter = foo();
console.log(iter.next('A'));
console.log(iter.next('B'));
console.log(iter.next('C'));
console.log(iter.next('D'));
console.log(iter.next('E'));
console.log(iter.next('F'));
```

{% asset_img 1636706531165-68a0a41a-ce54-4976-b1a7-cc2db368599d.png 100% %}

由于next()方法的参数表示上一个yield表达式的返回值，所以在第一次使用next()方法时，传递参数是无效的。V8 引擎直接忽略第一次使用next()方法时的参数，只有从第二次使用next()方法开始，参数才是有效的。从语义上讲，第一个next()方法用来启动遍历器对象，所以不用带有参数。

## 优化 iterator.next 代码

```javascript
var obj = {
	start: [1,2,3],
  end: [7,8,9],
  [Symbol.iterator]: function * (){
  	var nextIndex = 0,
        arr = [...this.start, ...this.end];
    while(nextIndex < arr.length){
    	yield arr[nextIndex ++]
    }
  }
}
for(let i of obj){
	console.log(i);
}
```

{% asset_img 1636706580340-d0b16ffa-8c44-4e68-8c57-34645d07cca3.png 100% %}

## generator配合异步使用

### promise

```javascript
let fs = require('fs')
function promisify(fn){
    return function(...args){
        return new Promise((resolve,reject)=>{
            fn(...args,(err,data)=>{
                if(data){
                    resolve(data)
                }else{
                    reject(err)
                }
            })
        })
    }
}    
let readFile = promisify(fs.readFile);
readFile('./name.txt', 'utf-8')
	.then(res => readFile(res, 'utf-8'))
	.then(res => readFile(res, 'utf-8'))
	.then(res => console.log(res))
```

### generator

```javascript
let fs = require('fs')
function promisify(fn){
    return function(...args){
        return new Promise((resolve,reject)=>{
            fn(...args,(err,data)=>{
                if(data){
                    resolve(data)
                }else{
                    reject(err)
                }
            })
        })
    }
}    
var readFile = promisify(fs.readFile);
function * read(){
	let value1 = yield readFile('./name.txt', 'utf-8')
	let value2 = yield readFile(value1, 'utf-8')
	let value3 = yield readFile(value2, 'utf-8')
  console.log(value3)
}
var iter = read();
let {value, done} = iter.next();
value.then(res => {
	console.log(res)
  let {value, done} = iter.next(res); // res 会赋值给value1
  value.then(val => {
  	let {value, done} = iter.next(val); // val 会赋值给value2
    value.then(val3 => {
  		console.log(val3);
  	})
  })
})
```

### co 提纯函数

```javascript
let fs = require('fs')
function promisify(fn){
    return function(...args){
        return new Promise((resolve,reject)=>{
            fn(...args,(err,data)=>{
                if(data){
                    resolve(data)
                }else{
                    reject(err)
                }
            })
        })
    }
}    
var readFile = promisify(fs.readFile);
function * read(){
	let value1 = yield readFile('./name.txt', 'utf-8')
	let value2 = yield readFile(value1, 'utf-8')
	let value3 = yield readFile(value2, 'utf-8')
  console.log(value3)
}
function Co(iter){
	return new Promise((resolve, reject)=>{
  	let next = (data) => {
    	let {value, done} = iter.next(data);
      if(done){
      	resolve(value)
      }else{
      	value.then((val)=>{
        	next(val)
        })
      }
    }
    next();
  })
}

let promise = Co(read())
promise.then(val => console.log(val))
const fs = require('fs');

const promisify = (fn) => {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (data) {
          resolve(data)
        } else {
          reject(err)
        }
      })
    });
  }
}

const readFile = promisify(fs.readFile);

function * read() {
  const value1 = yield readFile('./first.txt', 'utf-8');
  const value2 = yield readFile(value1, 'utf-8');
  const value3 = yield readFile(value2, 'utf-8');
  return value3;
}

function Co(iter) {
  return new Promise((resolve, reject) => {
    const next = (data) => {
      const { value, done } = iter.next(data);
      if (done) {
        resolve(value);
      } else {
        value.then(val => next(val))
      }
    }
    next();
  })
}

const p = Co(read());
p.then(val => console.log(val));
```

## return

```javascript
function * gen() {
	yield 1;
  yield 2;
  yield 3;
}

var g = gen();

console.log(g);
```

{% asset_img 1636966679026-56eab1bc-4647-4e02-bf30-3c9435e82ad4.png 100% %}

### return会终止产出

```javascript
function * gen() {
	yield 1;
  yield 2;
  yield 3;
}

var g = gen();

console.log(g.next());
console.log(g.next());
console.log(g.return());
console.log(g.next());
console.log(g.next());
```

{% asset_img 1636966715782-1fb7d521-ec5b-42c1-b7d3-05b0551d21e1.png 100% %}

### return()传值，结果和在generator中直接return效果一样

```javascript
function * gen() {
	yield 1;
  yield 2;
  yield 3;
}

var g = gen();

console.log(g.next());
console.log(g.next());
console.log(g.return(10));
console.log(g.next());
console.log(g.next());
```

{% asset_img 1636966768170-1a2839aa-539a-4adb-aa7f-08993cd7bb0a.png 100% %}

```javascript
function * gen() {
	yield 1;
  yield 2;
  return 10;
  yield 3;
}

var g = gen();

console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());
```

{% asset_img 1636966783958-bafc0199-7163-4bcf-9730-b43a4f8f7b95.png 100% %}

## throw

### try-catch无法捕获异步异常

```javascript
var g = function * (){
	try{
  	yield;
  }catch(e){
  	console.log('生成器异常：', e)
  }
  console.log(1);
}
var i = g();
console.log(i.throw('a'))
```

{% asset_img 1636966814571-7b7d4417-0463-45d8-9896-ba477ea84cd2.png 100% %}

```javascript
var g = function * (){
	try{
  	yield;
  }catch(e){
  	console.log('生成器异常：', e)
  }
  console.log(1);
}
var i = g();
console.log(i.next())
console.log(i.throw('a'))
```

{% asset_img 1636966834048-e992d35e-637e-4b3a-9658-fbfd66fde29b.png 100% %}

### throw还会等同于next操作，会执行一次yield

```javascript
var g = function * (){
  yield 1;
	try{
  	yield 2;
  }catch(e){
  	console.log('生成器异常：', e)
  }
  yield 3;
}
var i = g();
console.log(i.next())
console.log(i.next())
console.log(i.throw('a')) // 相当于执行了第三次next
console.log(i.next()) 
```

{% asset_img 1636966906180-12e218ca-3a77-4175-9ad8-e4044694465e.png 100% %}

### 在生成器函数中try catch是可以捕获到异步异常的，普通函数中是不可以得

```javascript
const fs = require('fs');
const util = require('util');
const co = require('co');

const readFile = util.promisify(fs.readFile);

function * read(){
  try {
    let value1 = yield readFile('./first.tx','utf-8');
    let value2 = yield readFile(value1,'utf-8');
    let value3 = yield readFile(value2,'utf-8');
    return value3;
  } catch (error) {
    console.log('15'+error)
  }
  console.log('hello world');
}

const p = co(read());
p.then(val => console.log(val))
```

{% asset_img 1636967602032-7578c10a-f7bb-40cf-9c87-2d4839f36cc6.png 100% %}

# Promise

## Promise状态

- 状态不受外界影响

- - pending 进行中
  - resolve 已成功

- - reject 已失败

- 状态不可逆

- - promise 固化以后，再对promise对象添加回调，是可以直接拿到这个结果的，如果是事件的话，一旦错过了就错过了

```javascript
var promise = new Promise(function(resolve, reject) {
  setInterval(function() {
  	Math.random() * 100 > 60 ? resolve('ok') : reject('no')
  })
})
promise.then(val => {
	console.log(val);
}, reason => {
	console.log(reason);
})
```

## Promise特性

### then的返回值作为下一次then的执行参数

```javascript
var promise = new Promise(function(resolve, reject){
  setInterval(function(){
  	Math.random() * 100 > 60 ? resolve('ok') : reject('no')
  })
})
promise.then(val => {
	console.log(val);
  return 1
}, reason => {
	console.log(reason);
  return 2
}).then(val => {
	console.log('then2-', val);
}, reason => {
	console.log('then2-', reason);
})
```

{% asset_img 1636600387201-46bae95f-fe68-44b9-b8c9-2ee6166ca9d2.png 100% %}

```javascript
var promise = new Promise(function(resolve, reject) {
  setInterval(function() {
  	Math.random() * 100 > 60 ? resolve('ok') : reject('no')
  })
})
promise.then(val => {
	console.log(val);
  return new Promise((resolve, reject) => {
  	resolve('new promise')
  })
}, reason => {
	console.log(reason);
  return 2
}).then(val => {
	console.log('then2-', val);
}, reason => {
	console.log('then2-', reason);
})
```

{% asset_img 1636600400264-58f32f54-f90c-4b00-bdbd-d17189c1ecd0.png 100% %}

### resolve导致抛出错误会被reject接收

```javascript
var promise = new Promise((resolve, reject) => {
	resolve(a);
})

promise.then((val) => {
	console.log('resolve', val);
}, (reason) => {
	console.log('reject', reason);
})
```

{% asset_img 1636619033572-54afd1e5-b0cc-48e6-a825-404ff8d6d53d.png 100% %}

### catch等同于：then第一个参数为null，第二个参数为reject的回调函数

```javascript
var promise = new Promise((resolve, reject) => {
	resolve(a);
})

promise.then(null, (reason) => {
	console.log('reject', reason);
})

promise.catch((reason) => {
	console.log('reject', reason);
})
```

{% asset_img 1636619086928-c4847ea6-af35-40db-a09b-fc09666c26c7.png 100% %}

### pormise 状态一旦固化，就无法再改变

```javascript
var promise = new Promise((resolve, reject) =>{
	resolve('ok');
  console.log(a); // 这个报错因为状态固化，无法被捕获
})

promise.then((val)=>{
	console.log('res', val);
}).catch((reason)=>{
	console.log('reject', reason);
})
```

{% asset_img 1636619135581-ab7a8747-0072-402d-97b3-98215ed6511e.png 100% %}

### catch 冒泡（可以捕获多层then的异常），then() 不传参数会被直接忽略

```javascript
var promise = new Promise((resolve, reject) => {
  console.log(1);
})

promise.then((val) => {
	console.log('res', val);
}).then()
  .then()
  .catch((reason)=>{
	console.log('reject', reason);
})
```

{% asset_img 1636619215319-c81681d6-afae-4f45-882c-eb11854b512c.png 100% %}

### then中捕获到异常后不会传递给catch

- then中捕获到异常后不会传递给catch

```javascript
let promise = new Promise((resolve, reject) => {
	resolve('First resolve');
});

promise.then(value => {
	return value;
})
.then((value) => {
	return new Promise((resolve, reject) => {
  	setTimeout(() => {
    	reject('ERROR');
    }, 2000);
  });
})
.then(value => {
	console.log(value);
}, reason => {
	console.log('Rejected: ' + reason); // Rejected: ERROR
})
.then(value => {
  throw new Error('Throw Error');
})
.then(value => {
  console.log(value);
}, reason => {
	console.log('Then: ' + reason); // Then: Error: Throw Error
})
.catch(err => {
	console.log('Catch: ' + err);
});
```

{% asset_img 1644990818997-31e0801b-62bd-4fb2-a469-c1e7f4e6cd7a.png 100% %}

### catch 之后再 then

- catch 之后再 then

```javascript
let promise = new Promise((resolve, reject) => {
	resolve('First resolve');
});

promise.then(value => {
	return value;
})
.then((value) => {
	return new Promise((resolve, reject) => {
  	setTimeout(() => {
    	reject('ERROR');
    }, 2000);
  });
})
.then(value => {
	console.log(value);
}, reason => {
	console.log('Rejected: ' + reason); // Rejected: ERROR
})
.then(value => {
  throw new Error('Throw Error');
})
.then(value => {
  console.log(value);
})
.catch(err => {
	console.log('Catch: ' + err); // Catch: Error: Throw Error
  return 'Catch Error';
})
.then(value => {
	console.log('Then: ' + value); // Then: Catch Error
});
```

{% asset_img 1644990903019-8899d317-6eca-4887-bd3a-8c3b07c181b4.png 100% %}

### p2依赖于p1的状态，会导致p2的状态无效，会等待p1的状态

```javascript
var p1 = new Promise((resolve, reject) => {
	setTimeout(function(){
  	reject(new Error('fail'));
  }, 3000);
})

var p2 = new Promise((resolve, reject) => {
	setTimeout(function(){
  	resolve(p1);
  }, 1000);
})

p2.then(res => console.log('res', res))
	.catch(err => console.log('p2-err-', err))
```

{% asset_img 1644979022269-97568ff4-742b-4612-91b5-d22229ab1bfa.png 100% %}

### 状态固化后面的代码依然会执行，但是resolve、reject后面的错误无法被捕获

```javascript
var p1 = new Promise((resolve, reject) => {
	resolve(1);
  console.log(a) // resolve 后的错误不会被捕获
})

p1.then(res => console.log(res))
	.catch(err => console.log('p1-err-', err))

console.log(3);
```

{% asset_img 1636619469541-99fdbb49-ee68-434e-8448-f8650ab998fb.png 100% %}

但如果resolve、reject之后的代码不报错，还是会正常执行：

```javascript
var p1 = new Promise((resolve, reject) => {
	resolve(1);
  console.log(233)
})

p1.then(res => console.log(res))
	.catch(err => console.log('p1-err-', err))

console.log(3);
```

{% asset_img 1636619551659-bc2b627a-8ddc-4842-adfc-333bcca98f21.png 100% %}

```javascript
var p1 = new Promise((resolve, reject) => {
	reject(new Error());
  console.log(2)
})

p1.then(res => console.log(res))
	.catch(err => console.log('p1-err-', err))

console.log(3);
```

{% asset_img 1636619572661-413cdd3f-f894-42e2-9624-492c8739bf03.png 100% %}

```javascript
var p1 = new Promise((resolve, reject) => {
	reject(new Error());
  console.log(a); // reject后的错误不会被捕获
})

p1.then(res => console.log(res))
	.catch(err => console.log('p1-err-', err))

console.log(3);
```

{% asset_img 1636619590908-0a6849b6-394a-4f97-8b14-4f52997c32d0.png 100% %}

## Promise 方法

### Promise.all()

#### 处理多个promise

```javascript
const fs = require('fs');
var p1 = new Promise((resolve, reject) => {
	fs.readFile('./name.txt', 'utf-8', function(err, data){
  	if(err){
    	console.log(err);
    }
    resolve(data);
  })
})
var p2 = new Promise((resolve, reject) => {
	fs.readFile('./number.txt', 'utf-8', function(err, data){
  	if(err){
    	console.log(err);
    }
    resolve(data);
  })
})
var p3 = new Promise((resolve, reject) => {
	fs.readFile('./score.txt', 'utf-8', function(err, data){
  	if(err){
    	console.log(err);
    }
    resolve(data);
  })
})
var p = Promise.all([p1, p2, p3]);
```

#### 会返回新的promise对象数组

```javascript
var p1 = new Promise((resolve, reject) => {
	setTimeout(function(){
		resolve('p1: 1000')  
  }, 1000)
})
var p2 = new Promise((resolve, reject) => {
	setTimeout(function(){
		resolve('p2: 2000')  
  }, 2000)
})
var p3 = new Promise((resolve, reject) => {
	setTimeout(function(){
		resolve('p3: 3000')  
  }, 3000)
})
var p = Promise.all([p1, p2, p3]);
p.then(res => console.log('res', res))
	.catch(err => console.log('err', err))
```

{% asset_img 1636619707447-7da65132-5188-47e0-9c17-e6b22acee6db.png 100% %}

#### 有一个失败就返回第一个失败的返回值

```javascript
var p1 = new Promise((resolve, reject) => {
	setTimeout(function(){
		reject('p1: 1000')  
  }, 1000)
})
var p2 = new Promise((resolve, reject) => {
	setTimeout(function(){
		reject('p2: 2000')  
  }, 2000)
})
var p3 = new Promise((resolve, reject) => {
	setTimeout(function(){
		reject('p3: 3000')  
  }, 3000)
})
var p = Promise.all([p1, p2, p3]);
p.then(res => console.log('res', res))
	.catch(err => console.log('err', err))
```

{% asset_img 1636619787283-436fcdf7-0678-4e05-8c6b-b2f51eb26742.png 100% %}


```javascript
var p1 = new Promise((resolve, reject) => {
	setTimeout(function(){
		resolve('p1: 1000')  
  }, 1000)
})
var p2 = new Promise((resolve, reject) => {
	setTimeout(function(){
		reject('p2: 2000')  
  }, 2000)
})
var p3 = new Promise((resolve, reject) => {
	setTimeout(function(){
		reject('p3: 3000')  
  }, 3000)
})
var p = Promise.all([p1, p2, p3]);
p.then(res => console.log('res', res))
	.catch(err => console.log('err', err))
```

{% asset_img 1636619804911-592f352b-1fdd-4308-8e4b-3d8f6355f08f.png 100% %}

### Promise.race()

#### 任意一个promise失败或者成功, 就会返回这个promise的结果

```javascript
var p1 = new Promise((resolve, reject) => {
	setTimeout(function(){
		resolve('p1: 1000')  
  }, 1000)
})
var p2 = new Promise((resolve, reject) => {
	setTimeout(function(){
		reject('p2: 2000')  
  }, 2000)
})
var p = Promise.race([p1, p2]);
p.then(res => console.log('res', res))
	.catch(err => console.log('err', err))
```

{% asset_img 1636619884815-2c9cfca2-fda7-4d33-bfe3-794fd8104497.png 100% %}

```javascript
var p1 = new Promise((resolve, reject) => {
	setTimeout(function(){
		reject('p1: 1000')  
  }, 1000)
})
var p2 = new Promise((resolve, reject) => {
	setTimeout(function(){
		reject('p2: 2000')  
  }, 2000)
})
var p = Promise.race([p1, p2]);
p.then(res => console.log('res', res))
	.catch(err => console.log('err', err))
```

{% asset_img 1636619902800-124dfd3b-e1b5-4898-a0f9-b58a06d7a810.png 100% %}

### Promise.resolve()

#### thenable 能把对象转为promise

```javascript
var thenable = {
	then: function (resolve, reject) {
  	resolve(1);
  }
}
var p = Promise.resolve(thenable)
p.then(function(value) {
	console.log(value)
})
```

{% asset_img 1636619946862-fb8f912e-0ef5-4886-84a6-c682812899ca.png 100% %}

```javascript
setTimeout(function() {
	console.log(2);
})

Promise.resolve().then(function() {
	console.log(1);
})
console.log(3);
```

{% asset_img 1636619964967-761d941c-5923-4944-8f86-fbc1c42fbb5f.png 100% %}

## 🌈手写 Promise

```javascript
const PENDING = 'PENDING',
      FULFILLED = 'FULFILLED',
      REJECTED = 'REJECTED'; // 三种状态

class MyPromise {
  constructor(executor) { // 实例化时传参：executor 执行器
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;

    this.onFulfilledCallbacks = []; // 订阅池
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      // 处理 resolve 传入的值也是 Promise 的情况
      if (value instanceof MyPromise) {
        value.then(resolve, reject);
        return; // 递归调用，阻止向下继续执行
      }

      if (this.status === PENDING) {
        // 必须得在 status 为 PENDING 状态下时，才能改变状态
        this.status = FULFILLED;
        this.value = value;

        // 发布
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        
        // 发布
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      // 如果在 executor 中直接抛出错误，得用 try-catch 捕获下，并走 reject
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    // 防止 .then() 不传参
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
    // then 每次都返回一个新的 Promise
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            // onFulfilled 有可能返回一个普通值，也有可能返回一个 Promise
            // 所以需要一个函数来判断和处理这个返回值 x
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        }, 0);
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        }, 0);
      }
      if (this.status === PENDING) {
        // 订阅
        this.onFulfilledCallbacks.push(() => {
          // PENDING状态下回调也要异步
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
  
  // catch() 相当于.then(null, () => {})
  catch(errorCallback) {
  	return this.then(null, errorCallback);
  }

  // 1. finally 无论外边的Promise成功还是失败，都要走finally的回调，并且回调不带参数
  // 2. finally 不返回 Promise 时， 走 then 或者 catch 取决于外边 Promise
  // 3. 如果 finally 内部有 promise 并且有延迟处理，整个finally会等待
  // 4. finally的promise如果是reject，优先级更高
  // 5. finally的promise如果是resolve，则外边优先级更高
  finally(finallyCallback) {
    // finally是实例方法，得 return this.then
    return this.then(value => {
      // finally 能执行异步，所以 return 一个 MyPromise.resolve
      // finally 本身没有状态
      // 所以执行完cb后，再调用 then 返回 finally 之前的 resolve 情况下的 value
      return MyPromise.resolve(finallyCallback()).then(() => value);
    }, reason => {
      // onRejected也得调用 MyPromise.resolve
      // 因为 finally本身不影响外边的状态
      // 在 finally 中return Promise 且 返回 rejected 的情况下
      // MyPromise.resolve一个rejected的Promise，最终状态也会是这个新的Promise的rejected状态
      return MyPromise.resolve(finallyCallback()).then(() => {
        throw reason;
      });
    });
  }

  // Promise 的 静态方法 resolve、reject
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }

    return new MyPromise((resolve, reject) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  static all(promiseArr) {
    let resArr = [],
        count = 0;

    return new MyPromise((resolve, reject) => {
      promiseArr.map((promise, index) => {
        if (isPromise(promise)) {
          promise.then(value => {
            formatResArr(value, index, resolve);
          }, reject);
        } else {
            formatResArr(promise, index, resolve);
        }
      });
    });

    // value是返回值，index是数组索引，resolve是回调
    function formatResArr(value, index, resolve) {
      resArr[index] = value; // 保证结果和数组顺序一致

      if(++count === promiseArr.length) { // 保证全部结果都成功返回后再返回最终结果
        resolve(resArr);
      }
    }
  }

  static allSettled(promiseArr) {
    if (!isIterator(promiseArr)) {
      throw new TypeError(promiseArr + ' is not iterable (cannot read property Symbol(Symbol.iterator))');
    }
    
    let resArr = [],
        count = 0;

    return new MyPromise((resolve, reject) => {
      // 数组为空的时候，返回空数组
      if (promiseArr.length === 0) {
        resolve([]);
      } else {
      	promiseArr.map((promise, index) => {
          if (isPromise(promise)) {
            promise.then(value => {
              formatResArr('fulfilled', value, index, resolve);
            }, reason => {
              formatResArr('rejected', reason, index, resolve);
            });
          } else {
            formatResArr('fulfilled', promise, index, resolve);
          }
        });
      }
    });

    function formatResArr(status, value, index, resolve) {
      switch (status) {
        case 'fulfilled':
          resArr[index] = {
            status,
            value
          }
          break;
        case 'rejected':
          resArr[index] = {
            status,
            reason: value
          }
          break;
        default:
          break;
      }
      if (++count === promiseArr.length) {
        resolve(resArr);
      }
    }
  }

  static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
        if (promiseArr.length === 0) {
          resolve();
        } else {
          promiseArr.map(promise => {
            // if (isPromise(promise)) {
            //     promise.then(resolve, reject);
            // } else {
            //     resolve(promise);
            // }
            MyPromise.resolve(promise).then(resolve, reject);
          });
        }
    });
  }
}

// 判断是否为 Promise
function isPromise(x) {
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let then = x.then;
    return typeof then === 'function';
  }
  return false;
}

// 判断是否为可迭代对象
function isIterator(value) {
  return value !== undefined && value !== null && typeof value[Symbol.iterator] === 'function';
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
  	reject(new TypeError('Chaining cycle detected for promise #<MyPromise>'));
  }
  
  let called = false; // 防止 resolve、reject 都调用的情况
  
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try { // 防止 then 抛错 throw Error
    	let then = x.then;

      if (typeof then === 'function') { // 认定为 Promise
				then.call(x, y => {
          if (called) return;
          called = true;
        	resolvePromise(promise2, y, resolve, reject);
        }, r => {
          if (called) return;
          called = true;
        	reject(r);
        });
      } else {
        resolve(x);
      }
    } catch(err) {
      if (called) return;
      called = true;
    	reject(err);
    }
  } else {
  	resolve(x);
  }
}

MyPromise.defer = MyPromise.deferred = function() {
	let deferred = {};
  
  deferred.promise = new MyPromise((resolve, reject) => {
  	deferred.resolve = resolve;
    deferred.reject = reject;
  });
  
  return deferred;
}

module.exports = MyPromise;
```

## 实现 promisify 与 promisifyAll

### 原生 readFile

```javascript
const fs = require('fs');

fs.readFile('./index.text', 'utf-8', (err, data) => {
	if (err) {
  	console.log(err);
  } else {
  	console.log(data);
  }
});
```

### bluebird 库

```javascript
const fs = require('fs');
const bluebird = require('bluebird');

const readFile = bluebird.promisify(fs.readFile);

readFile('./index.test', 'utf-8').then(value => {
	console.log(value);
}, reason => {
	console.log(reason);
});
```

### 🌈实现代码

```javascript
module.exports = {
	function promisify(fn) {
    return function(...args) {
      return new Promise((resolve, reject) => {
        fn.call(null, ...args, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
  },
  function promisifyAll(fns) {
  	Object.keys(fns).map(fnName => {
    	if (typeof fns[fnName] === 'function') {
      	fns[fnName + 'Async'] = this.promisify(fns[fnName]);
      }
    });
    return fns;
  }
}
```

### 测试代码

```javascript
const fs = require('fs');
const util = require('./util');

const readFile = util.promisify(fs.readFile);

readFile('./data/user.json', 'utf-8').then(value => {
  console.log('value', value);
}, reason => {
  console.log('reason', reason);
});

const fsFunctions = util.promisifyAll(fs);

fsFunctions.readFileAsync('./data/class.json', 'utf-8').then(value => {
  console.log('valueAsync', value);
}, reason => {
  console.log('reasonAsync', reason);
});
```

## 为什么Promise执行是同步，p.then是异步

- promise存在的目的不是单纯的为了解决回调地狱
- 异步的原因是，不希望去阻塞除 promise 相关外的其他代码

为的是解决下面问题：

1. 把 jquery 的 async 改为 false 会导致下边的同步代码 `I am a crazy guy.` 得等异步请求数据返回之后才会执行，而这不是我们想要的
2. 我们不但想让 `I am a crazy guy.`同步执行，还想把数据请求返回后的数据处理逻辑（jquery的success回调）分离出来，promise的优势就出来了


jquery:

{% asset_img 1641538233484-46e32537-6307-43b4-bedb-9abeea282882.png 100% %}

promise包裹：

- 把数据处理逻辑分离出来了
- 同步代码不用等待了

{% asset_img 1641538521338-2f237e69-3fcf-4e50-aa6c-dd4c3497e27e.png 100% %}

## 🌈 宏任务、微任务

- 微任务
- - promise，process.nextTick() 优先级更高，优先执行
- 宏任务
- - setTimeout等
- 执行宏任务之前，**会先把队列中的微任务一个个执行**

```javascript
Promise.resolve().then(() => {
	console.log(1);
  setTimeout(() => {
  	console.log(2);
  }, 0)
})
console.log(3);
setTimeout(() => {
	console.log(4);
  Promise.resolve().then(() => {
  	console.log(5);
  })
}, 0)
```

{% asset_img 1636600295305-1762e468-690c-41eb-a56e-d304263980a4.png 100% %}

# async/await

- 内置执行期 co 函数封装到了 await 内部
- 更好的语义，更广的适应性

## 返回值一定是promise对象

- async 函数return的值会被隐式转换为promise对象，使用 Promise.resolve(xxx) 或 reject()

```javascript
async function read(){
   let value1 = await readFile('./name.txt','utf-8');
   let value2 = await readFile(value1,'utf-8');
   let value3 = await readFile(value2,'utf-8');
   console.log('hello world');
   return value3;
}

let promise = read()
promise.then((val) => {
	console.log(val);
})
```

## 错误捕获

### 无错误

```javascript
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function read(){
 	try {
    let value = await readFile('./first.txt','utf-8');
    console.log("await 拿到的value", value);
    return 'async read 返回值'; // 走 resolve
   } catch (err) {
      console.log('try-catch捕获的错误', err);
      return Promise.reject(err); // 走 reject
   }
   console.log('try-catch后边代码');
   // try、catch中如果都return，上面一行代码就不执行了
}

let promise = read()
promise.then(val => {
	console.log("then success:", val);
}, err => {
  console.log('then fail', err)
})

console.log(1111)
```

{% asset_img 1636969208092-2c32387d-c5ed-401e-9320-b42b88ae3a7e.png 100% %}

### 有错误

```javascript
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function read(){
 	try {
    let value = await readFile('./first.tt','utf-8');
    console.log("await 拿到的value", value);
    return 'async read 返回值';
   } catch (err) {
      console.log('try-catch捕获的错误', err);
      return Promise.reject(err); // 走 reject
   }
}

let promise = read()
promise.then(val => {
	console.log("then success:", val);
}, err => {
  console.log('then fail', err)
})

console.log(1111)
```

{% asset_img 1636969288024-895440ce-c537-43e8-a23c-598a5cecf82d.png 100% %}

### try 或者 catch 不显示return值，默认走resolve

```javascript
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function read(){
 	try {
    let value = await readFile('./first.tt','utf-8');
    console.log("await 拿到的value", value);
   } catch (err) {
    console.log('try-catch捕获的错误', err);
   }
   console.log('try-catch后边代码'); // 这里会执行
}

let promise = read()
promise.then(val => {
	console.log("then success:", val);
}, err => {
  console.log('then fail', err)
})

console.log(1111)
```

{% asset_img 1636969363627-91608d77-1b84-4914-8015-cb86a7f4f7d5.png 100% %}

# 迭代器与生成器的应用

## 迭代器 -> 生成器

### ES6写法

写一个 generator 生成器 -> 调用后生成一个 迭代器 iterator

```javascript
function * test(arr) {
	for (const value of arr) {
  	yield value;
  }
}

const iterator = test([1,2,3]);
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

{% asset_img 1637051332003-4f4caea8-861a-4717-839c-41c096f0520a.png 100% %}


### ES5写法

```javascript
function generator(arr) {
	let nextIdx = 0,
      len = arr.length;
  
  return {
  	next() {
    	return nextIdx < len
      	? { value: arr[nextIdx++], done: false }
      	: { value: undefined, done: true }
    }
  }
}

const iterator = generator([1,2,3]);
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

## 中间件为啥最后每次要执行next()

{% asset_img 1637056362682-048e87ee-9118-49c9-bc62-f59ac8818d8b.png 100% %}

为的是能够进一步执行后边中间件的逻辑，一旦当前中间件走不通，就不调用next，从而阻断继续执行后续代码

```javascript
;((functions) => {
  function * generator(arr) {
    for (let i = 0; i < arr.length; i++) {
      yield arr[i];
    }
  }

  const iterator = generator(functions);

  const init = () => {
    nextDo(iterator.next());
  }

  function nextDo(n) {
    n.value(function() { // 第一次迭代时，test1接收的参数next就是此处的匿名函数
      const n = iterator.next();
      if (!n.done) {
        nextDo(n);
      } else {
        return;
      }
    });
  }

  init();
})([
  function test1(next) {
    console.log('test1');
    console.log(next); //这里的next就是上边 n.value 中的匿名函数
    next();
  },
  function test2(next) {
    console.log('test2');
    next();
  },
  function test3(next) {
    console.log('test3');
    next();
  },
  function test4(next) {
    console.log('test4');
    next();
  },
  function test5(next) {
    console.log('test5');
    next();
  },
]);
```

{% asset_img 1637056293342-7cfb74c3-b03c-4f13-acb9-1a1246ef4b41.png 100% %}

### 随时暂停中间件执行 - 类似于安检

```javascript
;((functions) => {
  function * generator(arr) {
    for (let i = 0; i < arr.length; i++) {
      const func = arr[i];
      yield func;
    }
  }

  const iterator = generator(functions);

  const init = () => {
    nextDo(iterator.next());
  }

  function nextDo(n) {
    n.value(function() { // 第一次迭代时，test1接收的参数next就是此处的匿名函数
      const n = iterator.next();
      if (!n.done) {
        nextDo(n);
      } else {
        return;
      }
    });
  }

  init();
})([
  function test1(next) {
    console.log('test1');
    let username = '233'
    if (username.length > 6) {
      next();
    }
  },
  function test2(next) {
    console.log('test2');
    next();
  },
  function test3(next) {
    console.log('test3');
    next();
  },
  function test4(next) {
    console.log('test4');
    next();
  },
  function test5(next) {
    console.log('test5');
    next();
  },
]);
```

{% asset_img 1637058110189-1c0a6d43-be5b-4379-8697-7fca71c92cb6.png 100% %}

### demo

{% asset_img 1637058146021-4fcbb732-0d47-4798-b6ec-2f0c2151293d.png 100% %}

## 应用

### 日志打印

```javascript
;(function(doc) {
  function Log() {
    this.oInput = doc.getElementsByTagName("input")[0];
    this.oBtn = doc.getElementsByTagName("button")[0];
    this.oList = doc.getElementsByClassName("logs")[0];
    this.logs = [];
    this.iterator = generator(this.logs);
    this.init();
  }

  Log.prototype.init = function() {
    this.bindEvent();
  }

  Log.prototype.bindEvent = function() {
    this.oBtn.addEventListener('click', handleBtnClick.bind(this), false);
  }

  function handleBtnClick(e) {
    const val = this.oInput.value;
    this.logs.push({
      date: new Date(),
      value: val,
    })

    _addLog.call(this, this.iterator.next().value);
  }

  function _addLog(log) {
    const oLi = doc.createElement("li");
    oLi.innerHTML = `
      操作内容: ${log.value}
      操作时间: ${log.date}
    `;

    this.oList.appendChild(oLi);
  }

  function * generator(arr) {
    for (const value of arr) {
      yield value;
    }
  }

  window.Log = Log;
})(document);
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>日志打印</title>
</head>
<body>
  <div class="container">
    <input type="text" placeholder="输入操作">
    <button>执行</button>
    <ul class="logs"></ul>
  </div>
  <script src="./index.js"></script>
  <script>
    new Log();
  </script>
</body>
</html>
```

{% asset_img 1637059492403-e1e77a35-95c5-4791-a862-6dd9fe997800.png 100% %}

# generator + co 实现 async + await

generator + co异步迭代函数 === async函数 + await

generator生成器函数 + yield + co === async + await => 语法糖

- 通过 generator 里边的 yield 模拟 await
- **用 co 解决异步迭代问题**

## generator 实现根据学生id找课程

generator2.js

```javascript
const fs = require('fs').promises; // promise化fs下所有异步方法

function * getUserClasses(uid) {
                  // 返回一个promise,看到yield就停止了，下次next才会把这次yield产出值赋值给userDatas
  let userDatas = yield fs.readFile('./data/user.json', 'utf-8');
  userDatas = JSON.parse(userDatas);
  const userData = userDatas.find(user => user.id === uid);
  let classDatas = yield fs.readFile('./data/class.json', 'utf-8');
  classDatas = JSON.parse(classDatas);

  let userClassData = {
    id: userData.id,
    name: userData.name,
    classes: []
  };

  classDatas.map(c => {
    const studentsArr = JSON.parse(c.students);
    studentsArr.map(s => {
      if (s === uid) {
        userClassData.classes.push({
          id: c.id,
          name: c.name
        });
      }
    });
  });

  return userClassData;
}

module.exports = {
  getUserClasses
}

// 最终期望的结果
// [
//   {
//     "id": 1,
//     "name": "蕾姆",
//     classes: [
//       {
//         "id": 1,
//         "name": "前端"
//       },
//       {
//         "id": 2,
//         "name": "后端"
//       }
//     ]
//   }
// ]
```

index2.js

```javascript
const { getUserClasses } = require('./generator2');

const uid = 1;
const it = getUserClasses(uid);
const { value, done } = it.next();
value.then(res => {
  const { value, done } = it.next(res);
  value.then(res => {
    const { value, done } = it.next(res);
    console.log(value)
  });
});

// {
//   id: 1,
//   name: '雷姆',
//   classes: [ { id: '1', name: '前端' }, { id: '2', name: '后端' } ]
// }
```

太繁琐，又是个回调地狱。

## 期望写法

```javascript
getUserClasses(uid).then(res => {
	console.log(res); 
})
.catch(err => {
	console.log(err);
});
```

## 编写co迭代器递归函数

generator2.js

```javascript
...
function co(iterator) { // 异步迭代函数
  // co最终要.then拿到最终值，所以要return一个promise实例
  return new Promise((resolve, reject) => {
    // 迭代器递归函数 参数：传给next的数据
    function walk(data) {
      // 执行 next => value done 对象
      const { value, done } = iterator.next(data);
      if (!done) {
        // value 有可能不是个 Promise，为了能往下走，再用 Promise.resolve 包一下
        // value -> then -> 拿到新的迭代时 程序执行的结果
        Promise.resolve(value).then(res => {
          // 肯定要继续执行迭代器递归函数
          walk(res);
          // promise出错了 -> 本次返回的Promise的reject
        }, reject);
      } else {
        // done === true，迭代结束，成功抛出value
        resolve(value);
      }
    }
    walk();
  });
}
...
```

index2.js

```javascript
const { getUserClasses, co } = require('./generator2');

const uid = 1;

co(getUserClasses(uid)).then(res => {
  console.log(res);
});

// {
//   id: 1,
//   name: '雷姆',
//   classes: [ { id: '1', name: '前端' }, { id: '2', name: '后端' } ]
// }
```

## async/await

1. 把之前 yield 改为 await ，把 * 改为 async
2. 把 getUserClasses 改名为 asyncGetUserClasses

1. 把上边的 co(getUserClasses(uid)) 改为 asyncGetUserClasses(uid)

generator2.js

```javascript
async function asyncGetUserClasses(uid) {
                  // 返回一个promise,看到yield就停止了，下次next才会把这次yield产出值赋值给userDatas
  let userDatas = await fs.readFile('./data/user.json', 'utf-8');
  userDatas = JSON.parse(userDatas);
  const userData = userDatas.find(user => user.id === uid);
  let classDatas = await fs.readFile('./data/class.json', 'utf-8');
  classDatas = JSON.parse(classDatas);

  let userClassData = {
    id: userData.id,
    name: userData.name,
    classes: []
  };

  classDatas.map(c => {
    const studentsArr = JSON.parse(c.students);
    studentsArr.map(s => {
      if (s === uid) {
        userClassData.classes.push({
          id: c.id,
          name: c.name
        });
      }
    });
  });

  return userClassData;
}
```

index2.js

```javascript
const { getUserClasses, co, asyncGetUserClasses } = require('./generator2');

const uid = 1;

asyncGetUserClasses(uid).then(res => {
  console.log(res);
});

// {
//   id: 1,
//   name: '雷姆',
//   classes: [ { id: '1', name: '前端' }, { id: '2', name: '后端' } ]
// }
```

### 结论

generator + co异步迭代函数 === async函数 + await

generator生成器函数 + yield + co === async + await => 语法糖

- 通过 generator 里边的 yield 模拟 await
- 用 co 解决异步迭代问题