---
title: Promise用法
tags:
  - Promise
categories:
  - 前端
  - JS
abbrlink: 7878
date: 2019-01-07 23:50:07
---

## Promise是什么

Promise 是一种异步编程的解决方案，比传统的异步解决方案【回调函数】和【事件】更合理、更强大。

## 诞生的原因

异步网络请求的**回调地狱**，而且我们还得对每次请求的结果进行一些处理，代码会更加臃肿。一张图完美诠释：

{% asset_img call-back-hello.jpg 回调地狱 %}

不够？再加一张：

{% asset_img 8144ca8cgw1f2wc9ed35zj218g0p0tey.jpg 行为艺术 %}

<!-- more -->

## Promise的三种状态

- pedding 等待（默认状态。异步代码执行完毕后会转换为以下两种状态）
- resolve 成功
- reject 失败

## 基本用法

### 语法

- Promise:
  - 构造函数
  - 接受一个参数：callback，我们把要执行的异步任务放置在这个callback中
- then:
  - Promise对象下的一个方法：该方法在Promise对象的状态发生改变的时候触发then的回调

```js
//defined Promise async function
function asyncFun(){
    return new Promise((resolve, reject) => {
        if (resolve) {
            resolve(/*resolve parameter*/);
        }else{
            reject(new Error(/*Error*/));
        }
    })
}

//use Promise&then
asyncFun().then(/*function*/).then(/*function*/)...
```

## Promise特性

### 立即执行

```js
let p = new Promise((resolve, reject) => {
    // 当Promise被实例化的时候，callback的异步任务就会被执行
    console.log("一个Promise对象被创建出来");
    resolve("success");
});

console.log("flag");

p.then((data) => {
    console.log(data);
});

// 执行结果：
// 一个Promise对象被创建出来
// flag
// success
```

### 状态不可逆

```js
let p = new Promise((resolve, reject) => {
    resolve("success");
    reject("reject");
});

p.then((data) => {
    console.log(data);
});

// 执行结果：
// success
```

### 链式调用

```js
let p = new Promise((resolve, reject) => {
    // 通过传入的resolve, reject，去改变当前Promise任务的状态
    // resolve, reject 是两个函数，调用 resolve ，会把状态改成 resolved ，调用 reject 函数会把状态改成 rejected
    setTimeout(() => {
        console.log(1);
        reject();
    }, 1000);
});

// then接受两个参数：这两个参数都是回调，当对应的 promise 对象的状态变成了resolved，那么 then 的第一个 callback 就会被执行，如果状态变成了 rejected ，那么 then 的第二个 callback 就会被执行
p.then(() => {
    console.log('成功');
}, () => {
    console.log('失败');
} );

// 执行结果：
// 1
// 失败
```

### then的回调异步性

```js
let p = new Promise((resolve, reject) => {
    console.log("我是Promise的callback中的代码");
    setTimeout(() => {
        resolve("我1s后才会被执行");
    }, 1000);
});

p.then((data) => {
    console.log(data);
});

console.log("我是主线程中的同步代码");

// 执行结果：
// 我是Promise的callback中的代码
// 我是主线程中的同步代码
// 我1s后才会被执行
```

解释：Promise 的 callback 回调函数中的代码是立即执行的（setTimeout 这个定时器也是立即执行的，只是函数内的 resolve 被延迟1s执行，跟 Promise 本身的立即执行没关系），但 then 方法中的回调函数执行则是异步的，因此，`"我1s后才会被执行"` 会在最后输出。

### 异常的捕获

Promise的异常有两种方法可以捕获，一种是 then 的第二个回调；一种 `.catch()` 来捕获前一个 Promise 抛出的错误。

```js
let p = new Promise((resolve, reject) => {
    reject("error");
});

p.then(data => {
    console.log("success")
}, error => {
    console.log(error);
});

// 执行结果：
// error
let p = new Promise((resolve, reject) => {
    reject("error");
});

p.then(data => {
    console.log("success")
}).catch(error => {
    console.log("catch:" + error);
});

// 执行结果：
// catch:error
```

## Promise.all 和 Promise.race

### Promise.all

Promise.all 接收一个参数，它必须是可以迭代的，例如数组。
它通常用来处理一些并发的异步操作，即它们的结果互不干扰，但是又需要异步执行。当所有 Promise 都成功的时候，整个 Promise.all 才成功。成功调用后返回一个数组，数组的值是有序的，顺序就是传入参数的数组顺序：

> 成功的情况

```js
let arr = [1, 2, 3];
let tasks = arr.map(num => {
    return new Promise((resolve, reject) => {
        resolve(num * 5);
    });
});

Promise.all(tasks).then(data => {
    // 有序输出
    console.log(arr); // [1, 2, 3]
    console.log(data); // [5, 10, 15]
});
```

> 失败的情况

```js
let arr = [1, 2, 3];
let tasks = arr.map(num => {
    return new Promise((resolve, reject) => {
        if (num === 3) {
            reject('rejected');
        }
        resolve(num * 5);
    });
});

Promise.all(tasks).then(data => {
    // 这里不会执行
    console.log(arr);
    console.log(data);
}).catch(err => {
    console.log(err); // rejected
});
```

### Promise.race

Promise.race 和 Promise.all 类似，都接收一个可以迭代的参数，但是不同之处是 Promise.race 的状态变化不是全部受参数内的状态影响，一旦参数内有一个值的状态发生的改变，那么该 Promise 的状态就是改变的状态。就跟 race 单词的字面意思一样，谁跑的快谁赢。

```js
let p1 = new Promise((resolve, reject) => {
    setTimeout(resolve, 300, 'p1 doned');
});

var p2 = new Promise((resolve, reject) => {
    setTimeout(resolve, 50, 'p2 doned');
});

var p3 = new Promise((resolve, reject) => {
    setTimeout(reject, 100, 'p3 rejected');
});

Promise.race([p1, p2, p3]).then(data => {
    // 显然p2更快，所以状态变成了fulfilled
    // 如果p3更快，那么状态就会变成rejected
    console.log(data); // p2 doned
}).catch(function(err) {
    console.log(err); // 不执行
});
```
