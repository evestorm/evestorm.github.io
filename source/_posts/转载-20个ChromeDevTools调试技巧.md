---
title: 转载-20个ChromeDevTools调试技巧
tags:
  - 转载
  - 技巧
categories:
  - 前端
  - 浏览器
abbrlink: 709
date: 2019-11-17 15:38:03
---

**译者按：** Chrome DevTools 很强大，甚至可以替代 IDE 了！

- 原文: [Art of debugging with Chrome DevTools](https://medium.com/frontmen/art-of-debugging-with-chrome-devtools-ab7b5fd8e0b4)
- 译者: [Fundebug](https://www.fundebug.com/)

<!-- more -->

**为了保证可读性，本文采用意译而非直译。另外，本文版权归原作者所有，翻译仅用于学习。**

**小编推荐：[Fundebug](https://www.fundebug.com/)专注于 JavaScript、微信小程序、微信小游戏，Node.js 和 Java 线上 bug 实时监控。真的是一个很好用的 bug 监控服务，众多大佬公司都在使用。**

谷歌开发者工具提供了一系列的功能来帮助开发者高效 Debug 网页应用，让他们可以更快地查找和修复 bug。在谷歌的开发者工具中，有非常多有用的小工具，但是很多开发者并不知道。通过这篇文章，我把我常用的那些高效 Debug 的 Chrome 开发者工具的功能分享给大家。

_简洁起见，接下来我会使用`开发者工具`来指代`谷歌开发者工具`_。

在我们开始之前，你需要做一些准备工作。

### **使用金丝雀版**

如果你想使用谷歌最新的版本和开发者工具，你可以下载[金丝雀版本](https://www.google.com/chrome/canary/)，甚至把它设置为开发默认打开的浏览器。金丝雀版本旨在为早期接受者提供最新的更新。它可能不稳定，但是大多数时候是没问题的。你要习惯去使用最新最强的谷歌浏览器。

**1. 开启开发者工具的实验性功能**

你可以到`chrome://flags`页面，然后开启`Developer Tools experiments`选项。

当开启后，在开发者工具的设置页面，可以发现多了一个`Experiments`选项。如果我使用的一些功能你没有看到，那么请到`Experiments`窗口打开。

**2.超级实验性功能**

如果我使用到的功能在`Experiments`列表没有，那么它可能是一个 WIP 功能(WIP 指 working in progress)。你可以这样开启：页面处在`Experiments`界面，连续敲击`shift`键 6 次来开启 WIP 功能。

{% asset_img Experiments.gif Experiments %}

### **Console**

当 Debug 的时候，我们绝大部分时间是在和 Console 打交道。我们往往在代码中插入很多 Console logs，通过打印变量值来 debug。鉴于 Console 对于我们这么重要，很有必要了解所有开发者工具提供的相关的 APIs 和快捷键。

**3. 总是打印对象**

我的第一个建议其实和开发者工具没有关系，而是我一直使用的一个技巧。在使用`console.log();`的时候，不仅仅打印变量，而是要打印对象，用大括号(`{}`)将变量包围起来。这样的优点是不仅会把变量的值打印，同时还会将变量名打印出来。

{% asset_img log.png log %}
{% asset_img superlog.png superlog %}

**4. 使用 console.table 来打印多条目数据**

如果你要打印的变量是一个数组，每一个元素都是一个对象。我建议你使用`console.table`来打印，其表格化的呈现更加美观易读。

{% asset_img logtable.png logtable %}

**5. 给 log 加点颜色**

log 有时候变得非常多，包含你自己的、一些第三方扩展或者浏览器的 logs。除了使用过滤器(filter)以外，你还可以使用颜色来更好地区分。

{% asset_img logcolor.png logcolor %}

**6. $ 和 $$**

如果你在 console 下没有任何库使用`$`和`$$`，那么你可以使用它们分别作为`document.querySelector()` 和 `document.querySelectorAll()`的快捷键。

除了提供了一个更加快捷的方式外，还有一个好处，`$$`返回一个数组，而不是[array-like](http://2ality.com/2013/05/quirk-array-like-objects.html)的[NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList). 所以你可以直接使用[map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)和[filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 函数。

你可以使用`$$`检查页面中的无效链接：

```js
Promise.all(
  $$('a')
    .map(link => link.href)
    .map(href => fetch(href))
)
  .then(() => console.log('All links working'))
  .catch(() => console.error('Some links are broken'));
```

**7. $0**

如果你想引用某个 DOM 元素，使用`$0`。`$0`指向你当前在 Element 中选中的元素。如果指定了`$0`，`$1`指向之前选中的元素。以此类推，直到`$4`都可以使用。

**8. $\_**

`$_`记录了最后一次在 Console 计算的表达式。

**9. getEventListeners()**

`getEventListeners(domElement)` 返回在 DOM 元素上注册的所有的事件。请看下面的例子：

{% asset_img getEventListeners.gif getEventListeners %}

你也许注意到了，当我在 console 里输入表达式的时候，其结果立即被计算出来了。你可以看到我并没有敲击 Enter 键，而结果已经显示出来。这个是金丝雀版本的一个新功能，叫做”Eager Evaluation”。

{% asset_img EagerEvaluation.png EagerEvaluation %}

**10. debug(fn)**

在上面的例子中，如果你想在点击按钮后的执行过程中暂停，你可以使用`debug`函数。`debug(fn)`接收一个函数作为参数，当每次该函数被调用时，Debugger 就会在该函数的第一行中断执行。

想象一下你要 debug 一个按钮的问题，但是你不知道这个按钮对应的事件函数在代码中什么位置。除了去大量的源代码中慢慢寻找之外，还有一个巧妙的方法。使用`getEventListeners`函数，然后将`debug`方法注入进去。这样，当你点击按钮的时候，就会在该函数的第一行停下来。

**11. copy(obj)**

`copy(anything)` 是一个很有用的工具函数方便你将任何东西拷贝到系统的粘贴板暂存。

给`copy`函数传入一个没有格式的 JSON，会返回格式化的结果：

{% asset_img copy.gif copy %}

**12. Top-level await**

`async/await` 使得异步操作变得更加容易和可读。唯一的问题在于`await`需要在 async 函数中使用。如果我们要在 DevTools 的控制台使用，需要一些特殊的处理，使用**I**mmediately **I**nvoked **A**sync **F**unction **E**xpression (IIAFE). 一点都不方便。好在 DevTools 已经支持直接使用 await 了。

{% asset_img await.png await %}

### Debugging in the Sources panel

在 source 面板，使用 breakpoints，stepping-into, stepping-over 等方式，你可以很好地掌控程序的执行状态，来发现代码问题。接下里我不会介绍大家都知道的基础内容，而是一些我经常使用的建议和技巧。

**13. 开启 auto-pretty print**

在金丝雀版本的实验模式下，你可以开启自动美化代码模式。

{% asset_img autopre.png autopre %}

**14. 使用条件断点在生产环境中注入 console logs**

断点是一个很棒的功能。但还有一个更棒的：条件断点。只有当设定的条件满足的时候，中断才会执行。也就是说 DevTools 并不会每次都中断程序的执行，而只是在你想要它中断的时候才中断。想了解更多：查看[这里](https://developers.google.com/web/updates/2015/07/set-a-breakpoint-based-on-a-certain-condition).

在生产环境下，因为不能修改源代码，我喜欢使用条件断点来注入 console.log。如果我的断点仅仅是一个 console.log，DevTools 不会中断，因为 console.log 返回 undefined,，是一个 false 的值。但是它会执行我注入的表达式，可以看到输出结果。

[![img](【转载】20个ChromeDevTools调试技巧/insertlog.gif)](https://gitee.com/evestorm/various_resources/raw/master/tools/insertlog.gif)
{% asset_img insertlog.gif insertlog %}

为什么不直接使用普通的断点，并且查看变量呢？有时候我并不想这样做。比如，当我在分析那些频繁执行的操作，例如触摸或则滑动。我并不想每一次都导致 Debugger 触发程序中断，但是我想看到程序输出的结果。

**15. 暂停 UI 在 Hover 状态下的展示结果**

我们很难去检查一个只有在 Hover 状态下展示的元素。比如，如何去检查一个 tooltip？如果你右键并选择检查，元素已经消失了。那么有办法吗？

我是这么操作的：

1. 打开 sources 面板
2. 显示 tooltip
3. 使用快捷键来暂停脚本执行(将鼠标停留在暂停的图标上查看快捷键)
4. 回到 Elements 面板，然后像通常一样去检查元素

[![img](【转载】20个ChromeDevTools调试技巧/tooltips.gif)](https://gitee.com/evestorm/various_resources/raw/master/tools/tooltips.gif)
{% asset_img tooltips.gif tooltips %}

**16. XHR breakpoints**

如果想要理解一个请求是如何执行的，可以使用 sources 面板的 XHR breakpoints。

**17. 使用 DevTools 作为 IDE**

DevTools 的 source 面板可以说相当强大。你可以快速查找，跳转到某一行，某个函数，执行一段代码，使用多行光标等等。这些功能在[这篇 medium 文章中有详细描述](https://medium.com/google-developers/devtools-tips-for-sublime-text-users-cdd559ee80f8)。

既然如此，为啥不把整个开发都搬到这里呢。这样就不需要浪费时间切换 IDE 和浏览器了。

如果你有一个使用[create-react-app](https://github.com/facebook/create-react-app)或则[vue-cli](https://github.com/vuejs/vue-cli)构建的项目，你可以直接把整个文件夹拖到 Sources 面板下。DevTools 会自动对所有文件做映射。所以，你可以在 DevTools 下修改文件并立即查看。这样，整个开发效率，特别是 Debugging 效率绝对提高了。

{% asset_img ide.gif ide %}

**18. 使用 network overrides 来简单调试生产代码**

如果你正在 Debugging 一个生产环境下面的 bug，你可以使用`network overrides`来调试，而不用在本地搭建整个配置。

你可以很容易将任何远程的资源下载一份本地的版本，然后可以在 DevTools 下编辑，并且 DevTools 会更新展示你编辑后的文件。

{% asset_img networkoverrides.gif networkoverrides %}

在生产环境下，也可以很容易 Debugging，并且做一些性能上的测试也变得容易。

### **19. Nodejs debugging**

如果你想使用 DevTools 的 Debugger 来 debug Node.js 应用，你可以使用`--inspect-brk` flag 来开启：

```shell
node --inspect-brk script.js
```

跳转到`chrome://inspect`页面，在`Remote Target`选项，可以看到 Node 程序。

并且，在 DevTools 中你会看到一个绿色的 Node 图标，点击图标会打开针对 Node 的 Chrome Debugger。

[![img](【转载】20个ChromeDevTools调试技巧/node-debuger.gif)](https://gitee.com/evestorm/various_resources/raw/master/tools/node-debuger.gif)
{% asset_img node-debuger.gif node-debuger %}

如果你想要用 DevTools Debugger 来 debug 你的单元测试，你需要这样调用：

```
copynode --inspect-brk ./node_modules/.bin/jest
```

不过这样做其实很麻烦，我们需要自己找到相应的路径。 GoogleChromeLabs 最近发布了一个新的工具非常好用，叫做：[ndb](https://github.com/GoogleChromeLabs/ndb)。使用 ndb，你只需要：

```js
ndb npx jest
```

如果你有一个自定义的脚本，你可以这样调用：

```js
ndb npm run unit
```

更妙的是，如果你在一个有配置`package.json`的项目下调用`ndb`，他甚至会自动分析 package.json 中的脚本，方便你直接使用 DevTools。

**20. 使用 Snippets 来辅助 Debugging**

DevTools 提供了一个可以创建和保存小段代码的工具，我很喜欢用它们来加速我的工作。比如 lodashify —  可以快速给任何应用添加 lodash。

```js
(function () {
  'use strict';

  var element = document.createElement('script');
  element.src =
    'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.15.0/lodash.min.js';
  element.type = 'text/javascript';
  document.head.appendChild(element);
})();
```

另一个小的工具函数式用来增强对象的属性，每次被访问或则修改，它都会提供给我充分的信息，比如谁访问了，谁更改了它。在 Debugging 的时候，非常有用。

```js
const traceProperty = (object, property) => {
  let value = object[property];
  Object.defineProperty(object, property, {
    get() {
      console.trace(`${property} requested`);
      return value;
    },
    set(newValue) {
      console.trace(`setting ${property} to `, newValue);
      value = newValue;
    }
  });
};
```

[![img](【转载】20个ChromeDevTools调试技巧/methodtools.gif)](https://gitee.com/evestorm/various_resources/raw/master/tools/methodtools.gif)
{% asset_img methodtools.gif methodtools %}

还有很多非常有用的[devtools 代码片段](http://bgrins.github.io/devtools-snippets/)，你可以直接拿去使用。

### 关于 Fundebug

[Fundebug](https://www.fundebug.com/)专注于 JavaScript、微信小程序、微信小游戏、支付宝小程序、React Native、Node.js 和 Java 实时 BUG 监控。 自从 2016 年双十一正式上线，Fundebug 累计处理了 6 亿+错误事件，得到了 Google、360、金山软件等众多知名用户的认可。欢迎免费试用！

版权声明:
转载时请注明作者 Fundebug 以及本文地址：
https://blog.fundebug.com/2018/08/22/art-of-debugging-with-chrome-devtools/
