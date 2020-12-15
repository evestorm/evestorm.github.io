---
title: Event Loop 学习笔记
tags:
  - Node
  - EventLoop
categories:
  - 后端
  - Node
abbrlink: 10505
date: 2019-04-28 14:19:51
---

我们只关心打钩的的阶段：

1. timers
2. poll（此阶段会停留一段时间）
3. check（执行一些立即执行的函数【主要就是：setImmediate(fn) 函数】）

```
   ┌───────────────────────┐
┌─>│        timers   ✅    │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll    ✅    │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check    ✅    │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

<!-- more -->

## timers 和 poll

{% asset_img event-loop.png event-loop %}

根据 [官方文档](https://juejin.im/post/5ab7677f6fb9a028d56711d0) 的描述，事件循环应该是从 timers 开始的，但不一定。

NodeJS 的内部代码大概是这样写的：

- 开启 eventLoop()
- 执行 JS()

但由于启动 event loop 是开个进程，需要时间的，而执行 JS 也得启动 V8 引擎，也是需要时间的，所以不确定这两个谁快谁慢。所以：

- 有可能 setTimeout 先执行，后才进入 timers 阶段
- 也有可能先进入 timers 阶段，后执行 setTimeout

假设一段代码：

```js
setTimeout(fn, 1000);
```

{% asset_img poll.png poll %}p

当我们在执行这段代码时，会把 fn 放进 timers 中的一个队列中去（也可以认为是一个数组）。然后 JS 就做自己的事情去了。此时 timers 可能开启了，也可能没有开启。但最大的可能是，在执行 `setTimeout(fn, 1000);` 的时候，我们进入了 poll 阶段，poll 阶段就是等待（e.g. 等待 ajax 请求成功，或者读文件成功），大概几十毫秒。在等待期间，它会看时间，比如刚才 JS 让我 1000 毫秒后执行一个 fn，现在刚过去 500 毫秒，那我继续等，直到等到 1000 毫秒时，赶紧经过 check 阶段，进入 timers 阶段去执行 fn：

{% asset_img el2.png %}

执行完毕后，又进入 poll 阶段，什么都不做，继续等。这个等有个时间限制的，假设是 3s，那么 3s 后如果什么都没等到，就进入 check 阶段，然后再回到 timers 阶段，如此循环。

## check

check 阶段会执行一些立即执行的函数，主要就是 setImmediate(fn) 函数。该函数类似 setTimeout，但没有第二个参数。

```js
setTimeout(() => console.log('fn'), 1000);
setImmediate(() => console.log('fn2'));
```

所以在执行例如 setImmediate(fn2) 时，fn2 不会进入 timers，而会进入 check 阶段的一个队列中：

{% asset_img poll2.png poll2 %}

由于我们不确定 timers 这个一阶段结束了还是未结束，所以我们以二阶段 poll 来研究。

当执行 setTimeout 后，我们把 fn 扔进了 timers ，然后进入 poll 阶段开始等，现在又执行到了 setImmediate ，这是个立即执行函数，有事情开始做了，所以 poll 不等了，直接进入 check 阶段去执行 fn2。

然后又回到 timers 阶段，不执行 fn（因为没到 1000 毫秒），又进入 poll 阶段，等到 1000 毫秒后，进入 check 阶段，然后返回 timers 阶段，开始执行 fn （fn 只能在进入 timers 阶段才能执行）。

## 经典考题

```js
setTimeout(() => console.log('fn'), 0);
setImmediate(() => console.log('fn2'));
```

{% asset_img poll3.png 22 %}

按照理论（NodeJS 内部代码先调用的 event loop，再调用的执行 JS），应该 fn2 先执行，但实际结果是不一定的，有可能先打印 fn，再打印 fn2；也有可能先打印 fn2，再打印 fn。原因就在于 **开启 event loop** 和 **执行 JS** 的顺序是随机的。

如果先开启了 event loop ，那么就先从 poll 阶段开始，因为 timers 阶段没发现有任何函数，所以进入 poll 开始等。接着等到了 **执行 JS** ，执行第一段代码，就把 0s 延迟的 fn 放进了 timers 的队列，接着执行第二段代码，把 fn2 放进了 check 队列，此刻 **执行 JS** 完毕，event loop 说：你执行完了是吧？我可以开始做事了，然后 poll 发现有任务要执行了，就进入 check 阶段执行 fn2，再返回到 timers 阶段，发现有个 fn 已经过时间了（因为延迟 0s），马上执行 fn。所以这种情况下，先打印 fn2，再打印 fn。

但如果 event loop 开启的比较慢，执行 JS 这一步先开始了。那么就会先把 fn 扔进队列，再才开始进入 timers 的第一阶段，此刻 timers 发现已经有了个 fn，还是 0s 延迟执行，所以就执行了 fn，再进入 poll ，poll 发现还有个 fn2 在等我立即执行，就接着进入 check 然后执行 fn2。所以这种情况下，先打印 fn，再打印 fn2。

说到底，就是看 fn 是在第一次进入 timers 阶段前就存在，还是第一次进入 timers 阶段后才存在。

那怎样才能保证 fn2 先执行呢？解决方案把这两段代码放进一个 setTimeout 中去，然后延迟 1s 执行，为的就是等 event loop 开启后，进入 poll 阶段，再开始执行这两段代码：

```js
setTimeout(() => {
  setTimeout(() => console.log('fn'), 0);
  setImmediate(() => console.log('fn2'));
}, 1000);
```

## process.nextTick()

这个重要的异步 API 不属于 event loop 的任何一个阶段。nextTick 队列会在当前阶段后就被执行。

以下面代码为例：

```js
setTimeout(() => {
  setTimeout(() => console.log('fn'), 0);
  setImmediate(() => console.log('fn2'));
  process.nextTick(() => console.log('fn3'));
}, 1000);
```

由于三段代码被放进了一个 setTimeout 中，且在 1s 后再被执行。所以 1s 后 event loop 肯定已经存在，此时就从 poll 阶段开始，然后执行三段代码，第一段把 fn 放进 timers 的队列，第二段把 fn2 放进 check 队列，然后 poll 阶段执行完了，根据 nextTick 队列会在**当前阶段**后就被执行，所以此刻在马上要进入 check 阶段之前，就把 nextTick 中的代码执行掉了，所以先打印 fn3，然后进入 check 阶段后打印 fn2，最后重新进入 timers 打印 fn。

再来看下面这段代码：

```css
setTimeout(() => {
  setTimeout(() => {
    console.log("fn");
    process.nextTick(() => console.log("fn4"));
  }, 0);
  setImmediate(() => console.log("fn2"));
  process.nextTick(() => console.log("fn3"));
}, 1000);
```

由于 fn4 紧跟着 fn，所以在 timers 阶段完成后，就执行了 fn4（注意 fn4 不会放进 timers 的队列，而是在队列里函数执行完后，紧跟着执行 fn4），所以最终顺序为：

fn3, fn2, fn, fn4

## 面试题

```js
setTimeout(() => {
  setImmediate(() => {
    console.log('setImmediate1');
    setTimeout(() => {
      console.log('setTimeout1');
    }, 0);
  });

  setTimeout(() => {
    console.log('setTimeout2');
    setImmediate(() => {
      console.log('setImmediate2');
    });
  }, 0);
}, 1000);
```

{% asset_img el-test.png el-test %}

执行第 2 行 setImmediate 后，把 setImmediate 中的函数 f1 放进 check 中（此刻不执行 f1），然后执行第 9 行的 setTimeout ，把 setTimeout 中的函数 f2 放进 timers 中（此刻也不执行 f2），然后进入 poll 阶段等待，发现有 f1 待执行，所以执行 f1，打印 setImmediate1 ，接着把 f3 放进 timers 的队列。此刻 check 阶段完成，重回 timers 阶段，发现队列中的 f2，执行 f2，打印 setTimeout2 ，接着把 f4 扔进 check 队列，然后执行 f3， 打印 setTimeout1 ，执行完后，进入 poll 阶段，发现有 f4 没执行，进入 check 阶段，执行 f4，所以最后打印 setImmediate2 。

## 宏任务&微任务

### Event Loop

#### NodeJS：

- timers（setTimeout）
- poll
- check（setImmediate）

**注意：**nextTick 不属于任何阶段，但会在当前阶段后执行

如果强行问 NodeJS 中的宏任务微任务，那就是：

setTimeout 和 setImmediate 是宏任务，nextTick 是微任务。因为 nextTick 不用等到下个阶段，会在当前阶段完成后立即执行。

还有个 promise.then(fn)【注意是小写的 p，大写的 P 不能直接 then】，一般不考。Node 中的 promise.then 一般是用 nextTick 实现的，所以也按照当前阶段的后面来推。这里 then 里面的 fn 不是马上放队列（setTImeout，setImmediate 和 nextTick 都是里面的 fn 马上放队列），而是当你 resolve 以后，才放进当前阶段的后面执行。

#### chrome：

- 宏任务（一会儿）setTimeout
- 微任务（马上）.then(fn) **fn 放马上**
- 一会儿就是等会做，马上就是立即做；如果一会儿里面有个马上做的，还是马上做。

**注意：**

1. 遇到 await 把它转为 promise 再看，因为 await 本来就是 promise 的语法糖。
2. new Promise 是立即执行的，.then 才是微任务。

### 面试题

```js
async function async1() {
  console.log(1);
  await async2();
  console.log(2);
}

async function async2() {
  console.log(3);
}

async1();

new Promise(function (resolve) {
  console.log(4);
  resolve();
}).then(function () {
  console.log(5);
});
```

**画图！！！不画图做不出来！！！**

代码从上到下，先执行 11 行 async1，进入 async1，**先打印 1**。遇到 await 转为 promise =>

```jsx
async2(() => console.log(3)).then(() => console.log(2));
```

（**await 后面所有代码都属于 then 当中的，**比如第 4 行后面加个 console.log(“233”)，那么此行代码也属于 then）而 async2 本身的代码会被立即执行，**所以打印第 8 行中的 3**。打印完后**执行 then （**执行 then 其实是需要 resolve 的，但 async 会去看你函数中有没有 resolve，如果没有会自动加上 resolve，相当于 async 帮你干了这样一件事：**Promise.resolve(**async2()**)**.then(f1)**）**，**then 就是放队列**，我们把 `console.log(2)` 记做任务 f1 放进「马上」中去，但此刻不执行。此刻 async1 彻底执行完了。

接着执行 13 行的 new Promise，14 到 15 行代码会被立即执行（new Promise 中的函数会被立即执行，没有什么宏任务微任务，就相当于裸写 14 到 15 行代码），**所以打印 4**。在执行完 14 行 resolve 的时候，**会指明执行 then 后面的第一个函数，而不是第二个函数（reject 时所执行的）**，也就是 17 行代码的任务也放进「马上」中去，该任务记做 f2 ，至此当前代码全部执行完毕，然后看「马上」中的任务，执行 f1，**打印 2**。接着执行 f2， **打印 5**。

{% asset_img answer.png answer %}

**注意点**：上面的 resolve 只是决定执行 then 里面的成功回调函数，并不决定加入队列。**决定加入队列的是 then。**

### 总结

宏任务（一会儿）：setTimeout，setInterval，setImmediate（优先级比前两个高，因为是在 check 阶段）

微任务（马上）：promise.then，process.nextTick

宏任务微任务执行顺序：有微任务先执行微任务，微任务都执行完了，再执行宏任务

[![image.png](Event Loop 学习笔记/resize,w_984.png)](https://cdn.nlark.com/yuque/0/2019/png/260235/1557198825204-924929ec-1115-4e21-a771-cf18796f8f15.png?x-oss-process=image/resize,w_984)

[ Node](https://evestorm.github.io/tags/Node/) [ EventLoop](https://evestorm.github.io/tags/EventLoop/)
