---
title: 【翻译】Minification 压缩与 Gzip 压缩的区别
tags:
  - 翻译
categories:
  - 后端
  - 构建工具
abbrlink: 8214
date: 2019-03-14 10:43:53
---

> 原链接：https://css-tricks.com/the-difference-between-minification-and-gzipping/
> 作者：Chris Coyier

这两种方法都针对你网站上的资源（比如 .css 文件和 .js 文件）所使用。它们都用来压缩文件大小，使服务器和浏览器之间的网络更加通畅，提高网页性能。网络是网页的速度瓶颈所在，而压缩文件大小能够改善这一点。

但这两者也截然不同。如果之前你并不知道这一点，那么你应当花时间来了解它。

<!-- more -->

# Minification 能够删除空格符（whitespace）、注释符（comments）、无用的分号（semicolons）或是减少 hex 代码的长度…

……诸如此类。剩下的文件依然是有效代码。你不必尝试读取它或是使用它，它并没有违反任何规则。就像对原始文件那样，浏览器可以读取它和使用它。

Minification 能够创建你最终使用的新文件。比如当你创建了一个名为 `style.css` 的文件之后，你可以把它压缩为 `style.min.css`。

# Gizpping 能识别所有重复的字符串，并使用指代该字符串第一个实例的指针来代替。

Julia Evans 曾想出一个绝佳的方法来解释这一点（点击[这里](https://jvns.ca/blog/2013/10/24/day-16-gzip-plus-poetry-equals-awesome/)查阅她发布的内容和视频）。下面是一首诗的第一段：

```js
Once upon a midnight dreary, while I {pon}dered weak an{d wea}{ry,}
Over many{ a }quaint{ and }curious volume of forgotten lore,
W{hile I }nodded, n{ear}ly napping, su{dde}n{ly }th{ere} ca{me }a t{apping,}
As{ of }so{me o}ne gent{ly }r{apping, }{rapping} at my chamb{er }door.
`'Tis{ some }visitor,'{ I }mu{tte}r{ed, }`t{apping at my chamber door} -
O{nly th}is,{ and }no{thi}{ng }m{ore}.
```

Gzip 识别出括弧里的文字都是重复的，因此将会使用指针来代替它们，这样这些文字占用的空间将会比原来更小。

对于减少文件大小、尤其是代码而言，这种方法十分高效，因为代码中有大量重复的内容。设想一下一个 HTML 文件里有多少个 `<div`，一个 CSS 文件里又有多少 `{`。

你也可以创建某个文件的 Gzip 压缩版本，比如 style.css.zip。但你一般不会这样做，浏览器也不知道应该如何使用这个文件。

在网页中，Gzip 压缩直接通过服务器完成。因此你要做的是配置服务器。一旦完成配置，Gzip 压缩将会自动进行，你无需再做任何工作。服务器会压缩文件，并通过网络传送文件。浏览器则接受文件，并在使用之前进行解压。我从未听谁提到过压缩和解压的成本，因此在这里我假设这些成本可以忽略不计，并且我们获得的受益远大于成本。

点击[这里](https://css-tricks.com/snippets/htaccess/active-gzip-compression/)查看如何在 Apache 服务器中进行配置，这里使用了 `mod_deflate` 模块。H5BP 也为所有常见的服务器[提供了服务器配置](https://github.com/h5bp/server-configs)，包括 Gzipping。

# 示例

我们将用到 [Bootstrap](https://getbootstrap.com/) 中常见的 CSS 文件。

{% asset_img 3e99e9b284d401c365c5044bc715ba44c9246f83.jpg 3e99e9b284d401c365c5044bc715ba44c9246f83 %}

通过 Minification 来压缩这个 CSS 文件，你将节省 17% 的空间，而使用 Gzipping 能够节省 85%，将两种方法结合使用节省的空间是 86%。

下面是使用 DevTools 检查工作状况时的理想情况：

{% asset_img 997aee7f7378ac61ca5b36877a65f44c3ed70bc5.jpg 997aee7f7378ac61ca5b36877a65f44c3ed70bc5 %}

# Gzip压缩 要高效得多，而将两种方法结合起来更为理想。

Gzip 压缩节省的空间大概是 Minification 压缩的五倍。然而，通过 Minification 压缩，你也可以获得一些帮助，不过在构建步骤时你需要耗费一些额外的力气。

同样[有证据](http://carlos.bueno.org/2010/02/measuring-javascript-parse-and-load.html#minifi)证明浏览器在读取和解析 Minification 压缩的文件时速度更快：

> 正如预期的那样，除了缩短网络传输时间以外，Minification 压缩还有助于解析和加载。这也许是因为缺少注释符和额外的空白符。

微软也开始为此优化它们的语法分析器：

> 因此，在 Window 10 和 Microsoft Edge 中，我们新添加了快速路径，改善了在 Chakra 的 JIT 编译器中嵌入和优化部分探视程序的体验，以保证压缩代码的运行速度不低于原始版本。通过这些改变，通过 UglifyJS 压缩过的个体代码模式的性能提高了 20% 到 50%。

缓存资源同样与这段对话相关，没有什么比一个不需要请求任何资源的浏览器速度更快了！关于这一点，网上或者[书](https://www.amazon.com/Designing-Performance-Weighing-Aesthetics-Speed/dp/1491902515/ref=as_li_ss_tl?ie=UTF8&linkCode=sl1&tag=css-tricks-20&linkId=d4d794b5604a084164c8ba33d2540283)中还有许多相关知识，不过很快我们也许会发布一些有关使用技巧的内容。