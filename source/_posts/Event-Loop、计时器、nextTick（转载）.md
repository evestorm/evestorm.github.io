---
title: Event Loop、计时器、nextTick（转载）
tags:
  - 转载
  - Node
  - EventLoop
categories:
  - 后端
  - Node
abbrlink: 61492
date: 2019-04-28 14:31:44
---

这是一篇转载文章，源地址是方应杭在掘金上发表的一篇译文：[Event Loop、计时器、nextTick](https://juejin.im/post/5ab7677f6fb9a028d56711d0)

原文：https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/

以下是译文：

## 什么是事件循环（Event Loop，注意空格）

JavaScript 是单线程的，有了 event loop 的加持，Node.js 才可以非阻塞地执行 I/O 操作，把这些操作尽量转移给操作系统来执行。

我们知道大部分现代操作系统都是多线程的，这些操作系统可以在后台执行多个操作。当某个操作结束了，操作系统就会通知 Node.js，然后 Node.js 就（可能）会把对应的回调函数添加到 poll（轮询）队列，最终这些回调函数会被执行。下文中我们会阐述其细节。

<!-- more -->

## Event Loop 详解

当 Node.js 启动时，会做这几件事

1. 初始化 event loop
2. 开始执行脚本（或者进入 REPL，本文不涉及 REPL）。这些脚本有可能会调用一些异步 API、设定计时器或者调用 process.nextTick()
3. 开始处理 event loop

如何处理 event loop 呢？下图给出了一个简单的概览：

```
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

其中每个方框都是 event loop 中的一个阶段。

每个阶段都有一个「先入先出队列」，这个队列存有要执行的回调函数（译注：存的是函数地址）。不过每个阶段都有其特有的使命。一般来说，当 event loop 达到某个阶段时，会在这个阶段进行一些特殊的操作，然后执行这个阶段的队列里的所有回调。 什么时候停止执行这些回调呢？下列两种情况之一会停止：

1. 队列的操作全被执行完了
2. 执行的回调数目到达指定的最大值 然后，event loop 进入下一个阶段，然后再下一个阶段。

一方面，上面这些操作都有可能添加计时器；另一方面，操作系统会向 poll 队列中添加新的事件，当 poll 队列中的事件被处理时可能会有新的 poll 事件进入 poll 队列。结果，耗时较长的回调函数可以让 event loop 在 poll 阶段停留很久，久到错过了计时器的触发时机。你可以在下文的 timers 章节和 poll 章节详细了解这其中的细节。

注意，Windows 的实现和 Unix/Linux 的实现稍有不同，不过对本文内容影响不大。本文囊括了 event loop 最重要的部分，不同平台可能有七个或八个阶段，但是上面的几个阶段是我们真正关心的阶段，而且是 Node.js 真正用到的阶段。

## 各阶段概览

- timers 阶段：这个阶段执行 setTimeout 和 setInterval 的回调函数。
- I/O callbacks 阶段：不在 timers 阶段、close callbacks 阶段和 check 阶段这三个阶段执行的回调，都由此阶段负责，这几乎包含了所有回调函数。
- idle, prepare 阶段（译注：看起来是两个阶段，不过这不重要）：event loop 内部使用的阶段（译注：我们不用关心这个阶段）
- poll 阶段：获取新的 I/O 事件。在某些场景下 Node.js 会阻塞在这个阶段。
- check 阶段：执行 setImmediate() 的回调函数。
- close callbacks 阶段：执行关闭事件的回调函数，如 socket.on(‘close’, fn) 里的 fn。

一个 Node.js 程序结束时，Node.js 会检查 event loop 是否在等待异步 I/O 操作结束，是否在等待计时器触发，如果没有，就会关掉 event loop。

## 各阶段详解

### timers 阶段

计时器实际上是在指定多久以后可以执行某个回调函数，而不是指定某个函数的确切执行时间。当指定的时间达到后，计时器的回调函数会尽早被执行。如果操作系统很忙，或者 Node.js 正在执行一个耗时的函数，那么计时器的回调函数就会被推迟执行。

注意，从原理上来说，poll 阶段能控制计时器的回调函数什么时候被执行。

举例来说，你设置了一个计时器在 100 毫秒后执行，然后你的脚本用了 95 毫秒来异步读取了一个文件：

```js
const fs = require('fs');

function someAsyncOperation(callback) {
  // 假设读取这个文件一共花费 95 毫秒
  fs.readFile('/path/to/file', callback);
}

const timeoutScheduled = Date.now();

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;

  console.log(`${delay}毫秒后执行了 setTimeout 的回调`);
}, 100);

// 执行一个耗时 95 毫秒的异步操作
someAsyncOperation(() => {
  const startCallback = Date.now();

  // 执行一个耗时 10 毫秒的同步操作
  while (Date.now() - startCallback < 10) {
    // 什么也不做
  }
});
```

当 event loop 进入 poll 阶段，发现 poll 队列为空（因为文件还没读完），event loop 检查了一下最近的计时器，大概还有 100 毫秒时间，于是 event loop 决定这段时间就停在 poll 阶段。在 poll 阶段停了 95 毫秒之后，fs.readFile 操作完成，一个耗时 10 毫秒的回调函数被系统放入 poll 队列，于是 event loop 执行了这个回调函数。执行完毕后，poll 队列为空，于是 event loop 去看了一眼最近的计时器（译注：event loop 发现卧槽，已经超时 95 + 10 - 100 = 5 毫秒了），于是经由 check 阶段、close callbacks 阶段绕回到 timers 阶段，执行 timers 队列里的那个回调函数。这个例子中，100 毫秒的计时器实际上是在 105 毫秒后才执行的。

注意：为了防止 poll 阶段占用了 event loop 的所有时间，libuv（Node.js 用来实现 event loop 和所有异步行为的 C 语言写成的库）对 poll 阶段的最长停留时间做出了限制，具体时间因操作系统而异。

### I/O callbacks 阶段

这个阶段会执行一些系统操作的回调函数，比如 TCP 报错，如果一个 TCP socket 开始连接时出现了 ECONNREFUSED 错误，一些 \*nix 系统就会（向 Node.js）通知这个错误。这个通知就会被放入 I/O callbacks 队列。

### poll 阶段（轮询阶段）

poll 阶段有两个功能：

1. 如果发现计时器的时间到了，就绕回到 timers 阶段执行计时器的回调。
2. 然后再，执行 poll 队列里的回调。

当 event loop 进入 poll 阶段，如果发现没有计时器，就会：

1. 如果 poll 队列不是空的，event loop 就会依次执行队列里的回调函数，直到队列被清空或者到达 poll 阶段的时间上限。
2. 如果 poll 队列是空的，就会：
   1. 如果有 setImmediate() 任务，event loop 就结束 poll 阶段去往 check 阶段。
   2. 如果没有 setImmediate() 任务，event loop 就会等待新的回调函数进入 poll 队列，并立即执行它。

一旦 poll 队列为空，event loop 就会检查计时器有没有到期，如果有计时器到期了，event loop 就会回到 timers 阶段执行计时器的回调。

### check 阶段

这个阶段允许开发者在 poll 阶段结束后立即执行一些函数。如果 poll 阶段空闲了，同时存在 setImmediate() 任务，event loop 就会进入 check 阶段。

setImmediate() 实际上是一种特殊的计时器，有自己特有的阶段。它是通过 libuv 里一个能将回调安排在 poll 阶段之后执行的 API 实现的。

一般来说，当代码执行后，event loop 最终会达到 poll 阶段，等待新的连接、新的请求等。但是如果一个回调是由 setImmediate() 发出的，同时 poll 阶段空闲下来了，event loop 就会结束 poll 阶段进入 check 阶段，不再等待新的 poll 事件。

（译注：感觉同样的话说了三遍）

### close callbacks 阶段

如果一个 socket 或者 handle 被突然关闭（比如 socket.destroy()），那么就会有一个 close 事件进入这个阶段。否则（译注：我没看到这个否则在否定什么，是在否定「突然」吗？），这个 close 事件就会进入 process.nextTick()。

## setImmediate() vs setTimeout()

setImmediate 和 setTimeout 很相似，但是其回调函数的调用时机却不一样。

setImmediate() 的作用是在当前 poll 阶段结束后调用一个函数。 setTimeout() 的作用是在一段时间后调用一个函数。 这两者的回调的执行顺序取决于 setTimeout 和 setImmediate 被调用时的环境。

如果 setTimeout 和 setImmediate 都是在主模块（main module）中被调用的，那么回调的执行顺序取决于当前进程的性能，这个性能受其他应用程序进程的影响。

举例来说，如果在主模块中运行下面的脚本，那么两个回调的执行顺序是无法判断的：

```js
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
});
```

运行结果如下：

```js
$ node timeout_vs_immediate.js
timeout
immediate

$ node timeout_vs_immediate.js
immediate
timeout
```

但是，如果把上面代码放到 I/O 操作的回调里，setImmediate 的回调就总是优先于 setTimeout 的回调：

```js
// timeout_vs_immediate.js
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```

运行结果如下：

```js
$ node timeout_vs_immediate.js
immediate
timeout

$ node timeout_vs_immediate.js
immediate
timeout
```

setImmediate 的主要优势就是，如果在 I/O 操作的回调里，setImmediate 的回调总是比 setTimeout 的回调先执行。（译者注：怎么总是把一个道理翻来覆去地说）

## process.nextTick()

你可能发现 process.nextTick() 这个重要的异步 API 没有出现在任何一个阶段里，那是因为从技术上来讲 process.nextTick() 并不是 event loop 的一部分。实际上，不管 event loop 当前处于哪个阶段，nextTick 队列都是在当前阶段后就被执行了。

回过头来看我们的阶段图，你在任何一个阶段调用 process.nextTick(回调)，回调都会在当前阶段继续运行前被调用。这种行为有的时候会造成不好的结果，因为你可以递归地调用 process.nextTick()，这样 event loop 就会一直停在当前阶段不走……无法进入 poll 阶段。

为什么 Node.js 要这样设计 process.nextTick 呢？

因为有些异步 API 需要保证一致性，即使可以同步完成，也要保证异步操作的顺序，看下面代码：

```js
function apiCall(arg, callback) {
  if (typeof arg !== 'string')
    return process.nextTick(
      callback,
      new TypeError('argument should be string')
    );
}
```

这段代码检查了参数的类型，如果类型不是 string，就会将 error 传递给 callback。

这段代码保证 apiCall 调用之后的同步代码能在 callback 之前运行。用于用到了 process.nextTick()，所以 callback 会在 event loop 进入下一个阶段前执行。为了做到这一点，JS 的调用栈可以先 unwind 再执行 nextTick 的回调，这样无论你递归调用多少次 process.nextTick() 都不会造成调用栈溢出（V8 里对应 RangeError: Maximum call stack size exceeded）。

如果不这样设计，会造成一些潜在的问题，比如下面的代码：

```js
let bar;

// 这是一个异步 API，但是却同步地调用了 callback
function someAsyncApiCall(callback) {
  callback();
}

//`someAsyncApiCall` 在执行过程中就调用了回调
someAsyncApiCall(() => {
  // 此时 bar 还没有被赋值为 1
  console.log('bar', bar); // undefined
});

bar = 1;
```

开发者虽然把 someAsyncApiCall 命名得像一个异步函数，但是实际上这个函数是同步执行的。当 someAsyncApiCall 被调用时，回调也在同一个 event loop 阶段被调用了。结果回调中就无法得到 bar 的值。因为赋值语句还没被执行。

如果把回调放在 process.nextTick() 中执行，后面的赋值语句就可以先执行了。而且 process.nextTick() 的回调会在 eventLoop 进入下一个阶段前调用。（译注：又是把一个道理翻来覆去地讲）

```js
let bar;

function someAsyncApiCall(callback) {
  process.nextTick(callback);
}

someAsyncApiCall(() => {
  console.log('bar', bar); // 1
});

bar = 1;
```

一个更符合现实的例子是这样的：

```js
const server = net.createServer(() => {}).listen(8080);

server.on('listening', () => {});
```

.listen(8080) 这句话是同步执行的。问题在于 listening 回调无法被触发，因为 listening 的监听代码在 .listen(8080) 的后面。

为了解决这个问题，.listen() 函数可以使用 process.nextTick() 来执行 listening 事件的回调。

## process.nextTick() vs setImmediate()

这两个函数功能很像，而且名字也很令人疑惑。

process.nextTick() 的回调会在当前 event loop 阶段「立即」执行。 setImmediate() 的回调会在后续的 event loop 周期（tick）执行。

（译注：看起来名字叫反了）

二者的名字应该互换才对。process.nextTick() 比 setImmediate() 更 immediate（立即）一些。

这是一个历史遗留问题，而且为了保证向后兼容性，也不太可能得到改善。所以就算这两个名字听起来让人很疑惑，也不会在未来有任何变化。

我们推荐开发者在任何情况下都使用 setImmediate()，因为它的兼容性更好，而且它更容易理解。

## 什么时候用 process.nextTick()？

There are two main reasons: 使用的理由有两个：

1. 让开发者处理错误、清除无用的资源，或者在 event loop 当前阶段结束前尝试重新请求资源
2. 有时候有必要让一个回调在调用栈 unwind 之后，event loop 进入下阶段之前执行

为了让代码更合理，我们可能会写这样的代码：

```js
const server = net.createServer();
server.on('connection', conn => {});

server.listen(8080);
server.on('listening', () => {});
```

假设 listen() 在 event loop 一启动的时候就执行了，而 listening 事件的回调被放在了 setImmediate() 里，listen 动作是立即发生的，如果想要 event loop 执行 listening 回调，就必须先经过 poll 阶段，当时 poll 阶段有可能会停留，以等待连接，这样一来就有可能出现 connect 事件的回调比 listening 事件的回调先执行。（译注：这显然不合理，所以我们需要用 process.nextTick）

再举一个例子，一个类继承了 EventEmitter，而且想在实例化的时候触发一个事件：

```js
const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);
  this.emit('event');
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```

你不能直接在构造函数里执行 this.emit(‘event’)，因为这样的话后面的回调就永远无法执行。把 this.emit(‘event’) 放在 process.nextTick() 里，后面的回调就可以执行，这才是我们预期的行为：

```js
const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);

  // use nextTick to emit the event once a handler is assigned
  process.nextTick(() => {
    this.emit('event');
  });
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```
