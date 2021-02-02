---
title: 转载-Sass/SCSS:让CSS书写更高效
tags:
  - scss
  - 技巧
  - 转载
categories:
  - 前端
  - CSS
  - SCSS
abbrlink: 47379
date: 2021-01-20 10:40:34
---

转载自：https://blog.csdn.net/qq_41694291/article/details/105529166

# 一、Sass/SCSS 使用简介

## 1. Sass 和 SCSS 的关系

没有用过 Sass 的人很可能会有这样一个疑惑，Sass 和 SCSS 是一个东西吗？

其实本文的标题已经给出了暗示，它们本质上是一个东西。具体来说，SCSS 是 Sass 版本 3 使用的语法。Sass 1.xx 和 Sass 2.xx 采用的是基于缩进的语法，如：

```js
body
  color: red;
  font-size: 12px;
```

显然，这与 CSS 的写法有很大出入，原生 CSS 是下面这种基于大括号的语法：

```css
body {
  color: red;
  font-size: 12px;
}
```

这也就意味着早期版本的 Sass 是不能直接兼容原生 CSS 的（即 CSS 代码直接粘贴进 Sass 文件无法编译）。很多前端开发者认为这种语法带来了使用上的不便，为此还催生了兼容原生 CSS 语法的 Less，并且抢占了 Sass 相当多的市场份额。

后来到了版本 3，Sass 团队决定改变之前的缩进风格，改为完全兼容 CSS3 语法的风格，同时把之前的文件后缀`.sass`改成`.scss`，以表明该版本已经完全兼容了 CSS3 语法。所以 SCSS 指代的是 Sass 从版本 3 之后开始使用的语法规范，本质上仍然是 Sass 框架。

鉴于 Sass 的版本 3 已经成为其主流版本，因此本文所介绍的内容都将基于 SCSS 语法，除了对一些早期项目维护的需求外，已经没有必要学习早期的 Sass 语法。

<!-- more -->

## 2. Sass 简介

从概念上来说，Sass 是一个 CSS 的预处理器，用于辅助进行 CSS 开发。

Sass 为 CSS 开发引入了变量、嵌套、运算、混入、继承、指令控制等一系列接近常规编程语言的语法特性，使得 CSS 开发变得更加简洁和高效。经过编译，Sass 代码可以被转化为原生的 CSS 代码。比如下面是一个符合 scss 语法的文件：
style.scss

```css
.container .main-body {
  div {
    color: black;
  }
  p {
    font-size: 14px;
  }
}
```

这里`div`和`p`位于`.container .main-body`内表示它们是该选择器的子选择器，它会被编译为以下的 css 文件：
style.css

```css
.container .main-body div {
  color: black;
}

.container .main-body p {
  font-size: 14px;
}
```

这种嵌套的写法不仅可以减少代码量，还可以清晰地表明它们的包含关系，使得代码的逻辑性更强，非常有利于提升 css 的开发效率。

Sass 是用 Ruby 语言开发的，因此想要编译`.scss`文件，一般来说应该首先安装 Ruby。不过 Nodejs 社区提供了一个非常好用的模块：node-sass，同样可以直接编译`.scss`文件。node-sass 之所以不依赖 Ruby 环境，是因为它将 Nodejs 绑定到了 C 语言版本的 Sass 库：LibSass，而 C 语言环境几乎是各大操作系统的标配。比如：

```shell
// 安装node-sass，对于单独的项目也可以局部安装
npm install node-sass -g

// 切换到style.scss所在路径
// 输入以下命令，将style.scss编译为css文件
node-sass style.scss style.css
```

如果你使用的编辑器是 vs code，官方还推荐了一个非常好用的实时编译插件：Live Sass Compiler。通过对`.scss`文件进行监视，它可以在每次保存时自动将其编译为 css 文件。

关于 scss 语法，第二部分会有详细的介绍，因此这里暂不深入讲解。

## 3. 在项目中编译 Sass

前端项目中编译 Sass 文件，本质上还是借助 node-sass 模块，它可以看做是 Sass 代码的解析引擎。我们这里简单介绍一下 webpack 是如何调用 node-sass 模块进行代码编译的。

我们知道，webpack 运行于 Nodejs 环境下，因此它只能直接解析 JavaScript 代码。对于其他类型的文件，webpack 无法读取和识别，于是就需要借助对应的 loader 来加载这些文件。webpack 提供了`sass-loader`来读取和编译 sass 文件，这个 loader 在读取到`.scss`文件的内容后，会调用 node-sass 对这些代码进行编译，生成对应的 css 代码。

生成了 css 代码后，本质上 scss 代码的解析任务就完成了。不过现在你只是得到了普通的 css 代码，为了使 webpack 能识别这些 css 代码，你仍然需要使用解析样式时需要的两个 loader：css-loader 和 style-loader。css-loader 可以把 css 代码解析为 js 模块，这样就可以用 import 直接导入到其他模块中。style-loader 的作用是将 css 代码添加到 style 标签内，内嵌到页面中。因此 webpack.config.js 中应该是下面的写法：
webpack.config.js

```js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.scss$/,
          use:['style-loader', 'css-loader', 'sass-loader']
       }
    ]
  }
}
```

webpack 将先调用 sass-loader 将 scss 代码编译为 css 代码（sass-loader 完成该过程依赖的是 node-sass 模块）；然后调用 css-loader 将 css 代码封装成合法的 js 模块（这样才可以通过 require 或者 import 导入）；最后使用 style-loader 将样式内嵌到页面的 style 标签内。

## 4. Sass/SCSS、Less 还是 stylus？

相比于 Less 和 stylus，Sass 的历史最为悠久。由于早期的 Sass 语法没有得到广泛接受，社区诞生了更为轻量，兼容原生 css 语法的 Less，并因此被 Twitter 的著名前端框架 Bootstrap 所采用。一时间，Less 名声大噪，甚至有取代 Sass 的趋势。

不过后来，Sass 在其版本 3 中推出了兼容原生 css 语法的 SCSS，Less 最重要的优势已不复存在。另外，Sass 的功能相对 Less 来说更加强大，也更成熟。因此在 Bootstrap 4 中，依赖的框架已经从 Less 切换为 Sass，这几乎标志着 Sass 与 Less 的竞争已经以 Sass 的胜利告终（另外，即将发布<截止到 2020/4/16>的 Bootstrap 5 已经确定将完全移除对 jQuery 的依赖，转而使用原生的 JavaScript，这一举动也基本预示着 jQuery 的退场）。

相比于 Sass 和 Less，stylus 诞生时间相对较短，暂时没有足够的影响力，不过据说其功能已经可以媲美 Sass，所以关于 Sass 和 stylus 孰优孰劣，本文暂不给出评价。不过如果你希望使用一款更加成熟的预处理器，那么推荐 Sass（SCSS 语法）。

# 二、Sass（基于 SCSS 语法）详解

## 1. CSS 功能拓展

### (1). 嵌套规则

这可能是最典型，也最常见的可以体现 sass 是如何提高 css 开发效率的特性之一了。

嵌套规则可以允许你像数学中提取公因式一样，把多个选择器相同的父选择器提取到外部，从而有效地减少选择器的书写量。比如在编写 css 时，我们可能会写出下面的样式：
index.css:

```css
.head {
  margin: 0;
}
.head h1 {
  color: red;
}
.head a {
  color: #555;
  cursor: pointer;
}
.head .content p {
  color: #333;
}
.head .content span {
  font-size: 14px;
}
```

可以看到，为了定义`.head`选择器下面的 h1、a、p、span 等元素，我们需要把`.head`书写四遍，而且你并不能非常直观地看出这四个元素都是`.head`的子元素（这需要一定的归纳）。

但是使用 SCSS 语法，你可以写成下面的格式：
index.scss

```css
.head {
  margin: 0;

  h1 {
    color: red;
  }
  a {
    color: #555;
    cursor: pointer;
  }

  .content {
    p {
      color: #333;
    }
    span {
      font-size: 14px;
    }
  }
}
```

它经过编译之后，就是之前的 css 代码。但显然，用 scss 语法，你可以避免书写大量重复的父选择器。它的另一个优势是，你可以非常直观地看出各个选择的嵌套关系，这可以有效提高修改样式的效率。所以，嵌套语法不可谓不优雅！

### (2). 父选择器&

在使用嵌套语法的时候可能会遇到这样一个问题，如：

```css
.head a {
  color: #555;
}
.head a:hover {
  color: red;
}
```

你可能会想到下面的写法，但它与上述 css 是不等价的：

```css
.head a {
  color: #555;
  :hover {
    color: red;
  }
}

// 它会被编译成
.head a {
  color: #555;
}
.head a :hover {
  color: red;
}
```

显然，这时`:hover`不再是选择器`a`的伪类了，它会导致 a 标签下的所有元素在鼠标悬停时都变成红色。

因此你只能采用下面的写法：

```css
.head {
  a {
    color: #555;
  }
  a:hover {
    color: red;
  }
}
```

我们认为这看起来并不优雅，因为这并没有达到最大程度的复用，而父选择器则为我们解决了这个问题：

```css
.head a {
  color: #555;
  &:hover {
    color: red;
  }
}
```

这里的`&`我们称为父选择器，在这里它指代的就是外部选择器`.head a`。sass 引擎在解析这个代码时，会直接用外部选择器替换这个字符，这样你就得到了`.head a:hover`这样的选择器。

值得注意的是，sass 引擎是基于字符串来处理 scss 文件的，在解析过程中，只是简单地把`&`替换成其父选择器对应的字符串。所以你完全可以把&看做普通的占位字符与其他字符串拼接，如：

```css
.main {
  margin: 0;
  &-content {
    padding: 0;
  }
}
```

编译为：

```css
.main {
  margin: 0;
}
.main-content {
  padding: 0;
}
```

可以看出，引擎是直接把`&`替换成了字符串`.main`，因此得到了选择器`.main-content`。

另外，存在更深层次的嵌套时，&指代的是所有的外部选择器，如：

```css
.head {
  a {
    &:hover {
    }
  }
}
```

这里的`&`指代`.head a`。

需要注意的是，`&`必须作为第一个字符，而不能被拼接到其他字符后面，如`.main-&`，这样会报错。

### (3). 属性嵌套

这是嵌套语法的变体。我们上面介绍的嵌套语法指的是选择器的嵌套，除此之外，sass 还支持有相同前缀的属性的嵌套，如：

```css
button {
  font: {
    family: fantasy;
    size: 16px;
    weight: bold;
  }
}
```

等价于：

```css
button {
  font-family: fantasy;
  font-size: 16px;
  font-weight: bold;
}
```

另外，前缀属性也可以有自己的值，如：

```css
button {
  // 会在上述css代码中额外生成font: 20px/24px
  font: 20px/24px {
    family: fantasy;
    size: 16px;
    weight: bold;
  }
}
```

### (4). 占位选择器%foo

占位选择器是 sass 提供的一种特殊选择器，以`%`开头。带有占位选择器的选择器只能被`@extend`语句（这是 sass 的继承机制，第三节 SassScript 中会讲到）引用，单独使用时不会被编译为原生 css。如：

```css
.btn%extreme {
  color: blue;
}
```

直接编译 scss 文件时，上述样式会被忽略，因为`%extreme`表明这个样式只能被继承。当使用下面的`@extend`语句时，这个样式就会被继承下来：

```css
.primary-btn {
  @extend %extreme;
}
```

现在`.primary-btn`的文字颜色会被置为蓝色。关于继承的语法，SassScript 部分会有进一步介绍。

### (5). 注释

除了原生 css 所支持的多行注释`/* */`，sass 还支持类似于 js 的单行语法`//`，但是多行注释会被输出到生成的 css 文件中，而单行注释在编译的过程中会被去除。因此单行注释应该只用于解释 sass 语句，如：

```css
/* 这是符合css的注释，
 * 它会被保留 */
// 这行代码会被去除
.head {
  a: {
    color: #555;
  }
}
```

编译后：

```css
/* 这是符合css的注释，
 * 它会被保留 */
.head a {
  color: #555;
}
```

一般来说，压缩模式下会去掉所有注释，但如果多行注释的第一个字符是`!`，那么即使在压缩模式下它也会被保留，如`/*! version: 1.0 */`，常用于添加版权信息。

另外，注释中允许插入变量（SassScript 部分会讲到变量）：

```css
$version: '1.0';
/* 当前版本为：#{$version} */
```

## 2. SassScript

直译为 sass 脚本。

css 的全写是 Cascading Style Sheets（层叠样式表），它只是用声明的方式去定义一组规则，不支持像变量、函数、数据结构定义等编程语法，因此我们一般不把 css 当成一门变成语言看待。

而 SassScript 的设计目的就是将 css 脚本化，使开发者可以像写 js 脚本一样去写样式，从而使 css 代码的编写更加高效和科学。为了使 css 脚本化，sass 提供了以下语法支持：

### (1). 变量

变量可谓是编程语言最基础的语法特性之一了。sass 为 css 也引入了变量。

sass 中的变量是以`$`开头的，如：

```css
$primary-color: #0066ff;
```

这里的`$primary-color`就被 sass 视为一个变量，它的值是`#0066ff`，现在你可以像下面一样引用这个变量：

```css
$primary-color: #0066ff;
.btn {
  color: $primary-color;
}
```

编译为：

```css
.btn {
  color: #0066ff;
}
```

如果你把 sass 引擎看做一个字符串处理函数，那它其实就是把`$primary-color`替换成`#0066ff`而已。

此外，变量还可以参与构成其他变量，如：

```css
$primary-color: #0066ff;
$primary-border: 1px solid $primary-color;
```

使用变量的好处是，当某个值在多个地方用到时，一旦需要修改这个值，你只需要修改对应变量的值就可以了。如果你编写的是原生 css，那么你需要挨个找到这些值去修改，不仅费时，还容易发生遗漏。

另外，变量还可以用于运算和函数传值，因此它是 css 脚本化的一个很重要的基石。

### (2). 数据类型

原生 css 没有数据类型的概念，你可以把所有的值都仅视为字符串。为了将 css 脚本化，sass 为 css 引入了数据类型的概念，包括以下 7 种数据类型：

1. **数字**：1，10，5px 等
2. **字符串**：有引号与无引号字符串，如"foo"、‘bar’、solid 等
3. **颜色**：red、#0066ff、rgba(0, 0, 0, 0.5)等
4. **布尔值**：true 和 false
5. **空值**：null
6. **数组**：用空格或逗号隔开的一组数据，如`1px 5px`、`Helvetica, Arial, sans-serif`等
7. **maps**：可以理解为 js 的对象，格式为`(key1: value1, key2: value2)`

需要特别注意的是，在 sass 中，`5px`这样的值被视为数字，因此可以直接参与运算，sass 会在必要时对单位进行类型转换。

数据类型是为其他语法服务的，我们后面会讲到这些数据类型的使用。

### (3). 运算

sass 支持数字运算、颜色值运算、字符串运算、布尔运算等。

#### 数字运算

包括加减乘除和取模（`+、-、*、/、%`）五种，必要时会进行单位转换。如：

```css
p {
  width: 1in + 8pt;
}
```

编译为：

```css
p {
  width: 1.111in;
}
```

关系运算符中`<、>、<=、>=`可以用于数值之间，而`==、!=`可以用于任何数据类型。

其中除法运算比较特殊，因为它同样是原生 css 支持的标识符，所以在遇到`/`时，sass 引擎必须区分它是 css 标识符，还是除法运算。当遇到以下情况，sass 引擎会将其视为除法运算：

1. 运算符两侧的值包含变量或函数返回值
2. 整个值被一个圆括号包裹
3. 值是某个算术表达式的一部分

```css
p {
  font: 10px/8px; // 不符合上述三种情况，是原生css

  $width: 1000px;
  width: $width/2; // 运算符两侧包含变量
  width: round(1.5) / 2; // 包含函数返回值
  height: (500px/2); // 值被圆括号包裹
  margin-left: 5px + 8px/2px; // 是某个表达式的一部分
}
```

编译为：

```css
p {
  font: 10px/8px;
  width: 500px;
  height: 250px;
  margin-left: 9px;
}
```

如果表达式中包含变量，但希望将`/`当做原生 css 标识符，可以用`#{}`插值，如：

```css
font: #{$font-size}/#{$line-height};
```

#### 颜色值运算

颜色值分 red（红）、green（绿）、blue（蓝）三种颜色，在进行颜色运算时，也是对三个颜色分别运算得到最后结果。比如：

```css
color: rgb(100, 100, 100) + rgb(100, 100, 100)
=> rgb(200, 200, 200)

color: #222222 + #333333;
=> #555555;

color: rgb(100, 100, 100) + #111111;
=> rgb(117, 117, 117);

```

可以看到，红、绿、蓝三种颜色的值都是 0-255，分别进行运算即可。假如颜色中包含透明度参数，则只有在透明度相同的情况下才可以直接运算。不同透明度的颜色值需要经过 `opacify`或 `transparentize`这两个函数转化才能参与运算。

颜色值的运算还可以使用 sass 提供的[颜色函数](https://sass-lang.com/documentation/modules)。

#### 字符串运算

与 JavaScript 一样，字符串也可以用加号拼接。不过拼接结果是否带引号，取决于等号左边的值是否带引号。如：

```css
p:before {
  content: 'Foo ' + Bar;
  font-family: sans- + 'serif';
}
```

编译为

```css
p:before {
  content: 'Foo Bar';
  font-family: sans-serif;
}
```

#### 布尔运算

SassScript 支持`and`、`or`和`not`等布尔运算。布尔运算主要用于流程控制中，与 JavaScript 中的写法是一致的。

不过值得注意的是，在 sass 中没有真正意义上的布尔值。在早期的 sass 语法中，1 表示 true，0 表示 false。而在后来的 SCSS 语法中新增了关键字`True`和`False`，不过可以看到，它们被划为数值类，也就是说，它们的值本质上还是 1 和 0，只是有了更明显的语义。

### (4). 函数

函数当是大多数编程语言最基本的概念之一了（在函数式编程中，函数是一等公民），sass 为 css 也引入了函数。

首先，sass 内置了相当多的函数，用于各种运算和转换，请参考这份函数列表：[Sass::Script::Functions ](https://sass-lang.com/documentation/modules)。使用内置函数时，需要首先用`@use`导入函数对象，如：

```css
@use "sass:color";

.button {
  $primary-color: #6b717f;
  color: $primary-color;
  border: 1px solid color.scale($primary-color, $lightness: 20%);
}
```

sass 也允许自定义函数，这需要`@function`和`@return`这两个特殊指令，格式如下：

```css
@function column-width($col, $total) {
  @return percentage($col/$total);
}
```

现在你可以像调用普通函数一样调用这个函数。

### (5). 插值 #{ }

为了解决字符串与变量拼接带来的不变，sass 引入了模板引擎，使用`#{}`作为插值语法。

选择器、属性名、属性值等都可以使用插值，如：

```css
$name: foo;
$attr: border;
$content: world;
p.#{$name} {
  #{$attr}-color: blue;
}
p:before {
  content: 'hello #{$content}';
}
```

### (6). 导入@import

css 中允许使用`@import`从其他 css 文件中导入样式。但是这个功能在 css 中使用并不多，因为 css 的`@import`是同步的，也就是说只有在解析到这个语句时，浏览器才会去下载对应的 css 文件。这种同步的方式会影响到前端的使用体验。

而 sass 对@import 语句进行了扩展，在引入 sass/scss 文件时，不再使用同步的方式去下载对应的文件，而是使用异步的方式，也就是会进行静态分析，提前下载和编译好对应的文件：

```css
@import 'foo.scss';
```

对于下面四种情况，sass 会将其视为原生的 css，不会进行编译：

1. 文件拓展名是 .css；
2. 文件名以 http:// 开头；
3. 文件名是 url()；
4. @import 包含 media queries。

如：

```css
@import 'foo.css';
@import 'foo' screen;
@import 'http://foo.com/bar';
@import url(foo);
```

它们会被原样输出到 css 代码中。

如果导入的文件与当前文件存在同名变量，一般来说当前文件的变量优先级更高（因为一般导入语句会写在最前面，所以当前文件的变量会将其覆盖）。但是如果你希望优先使用引入文件的变量，但不确定该变量是否存在时，可以使用`!default`定义变量：

```css
@import 'foo.scss';
$width: 100px !default;
```

这时如果`foo.scss`定义了`$width`，则以它优先，如果没有，才使用这里的`100px`默认值。

另外，sass 的`@import`是有作用域概念的，也就是说如果你是在某个作用域内导入的 scss 文件，那么它的代码将被插入到这个作用域内。

如果某个 scss 文件不需要单独编译成 css，只需要通过其他 scss 作为公共文件导入，可以在命名前加下划线：`_color.scss`。这样这个文件就不会被编译了，而你可以在其他 scss 文件中将其导入，注意，导入的时候不需要带下划线：

```css
@import 'color.scss';
```

### (7). 控制指令

包括`@if`(`@else if`，`@else`)，`@for`，`@each`，`@while`等。

`@if`与 JavaScript 的`if`用法类似：

```css
p {
  @if 1 + 1 == 2 {
    border: 1px solid;
  } @else if 5 < 3 {
    border: 2px dotted;
  } @else {
    border: 3px double;
  }
}
```

`@for`包括两种语法格式：`@for $var from <start> through <end>`和`@for $var from <start> to <end>`。这里的变量$var 是任意的，只是作为临时变量使用，start 和 end 都必须是整数。两种语法的差异在于，前者的取值区域是`start ~ end`，而后者的取值区域是`start ~ end-1`，即`to`语法不包含`end`的值。

`@each`用于遍历数组或对象。遍历数组的语法是：`@each $var in <list>`，如：

```css
@each $animal in puma, sea-slug, egret {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
  }
}
```

编译为：

```css
.puma-icon {
  background-image: url('/images/puma.png');
}
.sea-slug-icon {
  background-image: url('/images/sea-slug.png');
}
.egret-icon {
  background-image: url('/images/egret.png');
}
```

遍历对象的语法为：`@each $var1, $var2, ... in <maps>`，如：

```css
@each $animal, $color, $cursor in (puma, black, default), (sea-slug, blue, pointer)
{
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
    border: 2px solid $color;
    cursor: $cursor;
  }
}
```

编译为：

```css
.puma-icon {
  background-image: url('/images/puma.png');
  border: 2px solid black;
  cursor: default;
}
.sea-slug-icon {
  background-image: url('/images/sea-slug.png');
  border: 2px solid blue;
  cursor: pointer;
}
```

`@while`也是很常见的循环指令，当条件为假时退出循环，如：

```css
$i: 6;
@while $i > 0 {
  .item-#{$i} {
    width: 2em * $i;
  }
  $i: $i - 2;
}
```

### (8). 混入@mixin

混入的本意是将一组常使用的样式提取出来，然后在使用的时候直接使用`@mixin`语句导入即可，这样可以避免重复书写这些样式。它最简单的用法如下：

```css
@mixin large-text {
  font: {
    size: 20px;
    weight: bold;
  }
  color: #ff0000;
}
```

这里定义了一组样式，包括`font-size`，`font-weight`和`color`，我们将这样一组样式命名为`large-text`。现在当我们想在某个元素上应用大文本样式时，就可以导入这段样式：

```css
p {
  @include large-text;
  display: inline-block;
  ...;
}
```

这种方式可以不用为元素定义大量的类名来应用不同的样式，而是从编程的角度来提取公共样式，从而提升开发效率。

类似于函数，mixin 也可以传入参数，也可以给参数设置默认值，如：

```css
@mixin sexy-border($color, $width: 1in) {
  border: {
    color: $color;
    width: $width;
    style: dashed;
  }
}
p {
  @include sexy-border(blue);
}
```

编译为：

```css
p {
  border-color: blue;
  border-width: 1in;
  border-style: dashed;
}
```

传参时可以指定参数名，这样就不需要严格按照参数顺序了：

```css
h1 {
  @include special-border($color: blue, $width: 2in);
}
```

当传入的参数数量不确定时，可以使用省略号语法来接收：

```css
@mixin box-shadow($shadows...) {
  -moz-box-shadow: $shadows;
  -webkit-box-shadow: $shadows;
  box-shadow: $shadows;
}
.shadows {
  @include box-shadow(0px 4px 5px #666, 2px 6px 10px #999);
}
```

传参的时候同样可以使用省略号语法：

```css
@mixin colors($text, $background, $border) {
  ...;
}
$values: #ff0000, #00ff00, #0000ff;
.primary {
  @include colors($values...);
}
```

### (9). 继承 @extend

基于`Nicole Sullivan`面向对象的 css 的理念，选择器继承是说一个选择器可以继承为另一个选择器定义的所有样式。比如 bootstrap 中的`btn-primary`就可以认为是继承自`btn`。语法如下：

```css
//通过选择器继承继承样式
.error {
  border: 1px solid red;
  background-color: #fdd;
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
```

不同于混入，`@extend`并不是直接把`.error`的样式直接复制过来，而是给所有添加了`seriousError`的标签同时加上`error`类。这样，所有与`error`类相关的选择器，现在都与`seriousError`有关。也就是说，此时 sass 相当于进行了下面的转化：

```html
<p class="seriousError">error</p>

<p class="error seriousError">error</p>
```

因此，像`.error a`这样的选择器，现在对`seriousError`内的`a`元素也是有效的。

关于继承，在实际使用中有很多的细节需要注意，这里暂不详述，有需要的可以参考[sass 中文网](https://www.sass.hk/guide/)。

# 总结

本文涉及了大部分 sass 的基本用法，但仍然不够全面，如果在使用中遇到了其他问题，建议参考[sass 中文网](https://www.sass.hk/guide/)。
