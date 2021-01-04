---
title: 【转载】chrome调试技巧-汇总
tags:
  - chrome
  - 技巧
  - 转载
categories:
  - 效率
  - 工具
abbrlink: 62808
date: 2019-11-20 16:07:34
---

## 打印

### console.table

使用 `console.table()` 可以将传入的对象，或数组以表格形式输出。适合排列整齐的元素：

{% asset_img console_table.png console_table效果图 %}

### 让日志更易读

即使 `console.log` 一个简单变量，你都可能会忘记（或混淆）哪一个是那个。当你有不同的变量需要打印的时候，阅读起来会更费劲。

{% asset_img log-ugly.png 难以阅读的log %}

> “嗯？哪一个值对应哪一个变量来着？”

为了让它变得更加易读，你可以打印一个对象 - 只需将所有`console.log` 的参数包装在大括号中。感谢 ECMAScript 2015 中引入了 `enhanced object literal(增强对象文字面量)` ，所以这（加了个括号）就是你需要做的全部了：

{% asset_img log-nice.png 友好的日志 %}

<!-- more -->

## 触发伪类

右键单击 `Elements` 面板中的目标元素节点并选择「force state」。或者在 `Styles` 子窗格中单击「:hov」图标。可以触发元素上的伪类来研究元素在悬停时的效果和样式：

{% asset_img chromehover.gif 触发伪类 %}

## ALT+单击可以展开所有子节点

在 Elements 面板中,使用 Alt+单击可以展开该 Dom 节点下的所有 Dom 子节点：

{% asset_img 2019082016164342.gif alt+单击展开所有子节点 %}

## copy

### 拷贝资源

你可以通过全局的方法 `copy()` 在 `console` 里 `copy` 任何你能拿到的资源，例如：

{% asset_img copy_resource.gif copy资源 %}

### 拷贝 HTML (最快的方式)

可能你知道右击或者点击在 `html` 元素边上的省略号(…)就能将它 `copy` 到操作系统剪贴板中 但你同样可以用非常古老的 `[ctrl] + [c]` + `[ctrl] + [v]` 大法来实现同样的效果！

{% asset_img copy_html.gif copy_html %}

## snippet 代码块

作用：Chrome 开发者工具的 Snippets 提供了在 Chrome 里保存及运行或者调试一段 js 代码的功能
入口：Chrome 开发者工具-Sources 面板-Snippets 面板

直达：[你不知道的 Chrome 调试工具技巧 第二十一天：Snippets(代码块)](https://juejin.im/post/5c2653b4e51d457b8c1f5c41)

## 在控制台中引用上一次的执行结果

我们常常需要在控制台中调试代码。比如你想知道如何在 JavaScript 中反转字符串，然后你在网络上搜索相关信息并找到以下代可行代码。

```js
'abcde'.split('').reverse().join('');
```

{% asset_img split.jpg split %}

没问题，上面的代码确实对字符串进行了翻转。但你还想了解 split()、reverse()、join() 这些方法的作用以及运行他们的中间步骤的结果。因此，现在你想逐步执行上述代码，可能会编写如下内容：

{% asset_img chrome-split.jpg chrome-split %}

好了，经过上面这些操作，我们确实知道了每个方法运行的返回值，也就了解了各个方法的作用。

但是，这给人的感觉有点多此一举。上面的做法既容易出错，又难以理解。实际上，在控制台中，我们可以使用魔术变量$\_引用上一次操作的结果。

{% asset_img chrome-full.jpg chrome-full %}

$\_是一个特殊变量，它的值始终等于控制台中上一次操作的执行结果。它可以让你更加优雅地调试代码。

## 重新发送 XHR 请求

XHR，即 XMLHttpRequest，是一种创建 AJAX 请求的 JavaScript API 。
在我们的前端项目中，我们经常需要使用 XHR 向后端发出请求来获取数据。如果你想重新发送 XHR 请求，那么该怎么办呢？
对于新手来说，可能会选择刷新页面，但这可能比较麻烦。实际上，我们可以直接在“网络”面板中进行调试。

{% asset_img xhr.jpg xhr %}

## 将复制图像为 Data URI

处理网页上的图像的通常有两种方法，一种是通过外部资源链接加载它们，另一种是将图像编码为 Data URI。

> Data URL，即前缀为 data:协议的 URL，允许内容创建者在文档中嵌入小文件。在被 WHATWG 撤消该名称之前，它们被称为“Data URI”。

将这些小图像编码到 Data URL 并将它们直接嵌入到我们的代码中，可以减少页面需要发出的 HTTP 请求的数量，从而加快页面加载速度。

所以在 Chrome 浏览器中，我们该如何将图像转换为 Data URL 呢？可以参考下面的 gif 图像：

{% asset_img datauri.jpg datauri %}

## 改变颜色格式

在颜色预览中使用`Shift + Click` ，可以在`rgba`, `hsl` 和 `hexadecimal` 这三种格式中改变。

{% asset_img color-picker.gif color-picker %}

## 参考来源

- [Javascript 调试命令——你只会 Console.log() ?](https://segmentfault.com/a/1190000012957199)
- [【译】你不知道的 Chrome 调试工具技巧 第二十一天：Snippets(代码块)](https://juejin.im/post/5c2653b4e51d457b8c1f5c41)
- [20 个 Chrome DevTools 调试技巧（译）](https://blog.fundebug.com/2018/08/22/art-of-debugging-with-chrome-devtools/)
