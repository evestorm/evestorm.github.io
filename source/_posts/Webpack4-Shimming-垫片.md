---
title: Webpack4-Shimming(垫片)
tags:
  - Webpack
categories:
  - 前端
  - 构建工具
  - Webpack
abbrlink: 29270
date: 2019-11-05 22:09:33
---

## 先举个栗子 🌰

假设我们一个用 webpack 打包的项目有以下场景

> index.js

```js
import $ from 'jquery';
import { initUI } from 'ui.js';

const $div = $('<div></div>');
$div.html('hello world!');
$('body').append($div);

initUI();
```

<!-- more -->

> ui.js

```js
export function initUI() {
  $('body').css('background', 'green');
}
```

此时我们直接打包代码是不能执行的，因为 `ui.js` 中没有引入 `jquery`，所以不能使用 `$` 。

按照正常思路我们会想，不是在 `index.js` 中一开始就引入了 jquery 么？为什么还会报错？这是因为 webpack 是基于模块打包的，当前模块下的变量只能在当前文件中起作用。所以引入的其他模块中如果也使用了这个变量就失效了。

这种问题场景其实还不止是本地文件，有可能第三方库中也引用了 jquery，但是我们直接去改库的代码是不太现实的。此时，就可以用 shimming（垫片）来解决这个问题。

## 如何使用垫片插件

首先要引入 webpack 模块，然后配置插件

> webpack.config.js

```js
const webpack = require('webpack');

...

plugins: [
  new webpack.ProvidePlugin({
    $: 'jquery'
  })
]
```

当我们加上这段代码后，模块在打包的时候，发现你使用了 `$` 就会在你模块顶部自动加入 `import $ from 'jquery'` 。

## 官方文档

- [ProvidePlugin（官网）](https://webpack.js.org/plugins/provide-plugin/)
- [ProvidePlugin（中文）](https://webpack.docschina.org/plugins/provide-plugin/)
