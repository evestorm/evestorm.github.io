---
title: 转载-Webpack4 如何优雅打包缓存文件
tags:
  - Webpack
  - 转载
categories:
  - 前端
  - 构建工具
abbrlink: 64694
date: 2019-03-14 10:34:04
---

一般来说，对于静态资源，我们都希望浏览器能够进行缓存，那样以后进入页面就可以直接使用缓存资源，页面直接直逼火箭速度打开，既提高了用户的体验也节省了宽带资源。

当然浏览器缓存方法有很多种，这里只简单讨论下 webpack 利用 hash 方式修改文件名，以达到缓存目的。

## webpack hash

webpack 内置了多种可使用 hash，官网解释分别如下：

- `hash`：the hash of the module identifier
- `chunkHash`：the hash of the chunk content
- `contentHash`：the hash of extracted content

注：hash 的默认长度为 20 个字符，可通过 `output.hashDigestLength` 全局配置，或使用 `[hash:16]` 方式配置，还可以通过 `output.hashDigest` 配置何时生成 hash。

那么问题来了，这么多种 hash 该如何选择呢？

<!-- more -->

## 实战 hash

基础的配置文件如下（基于 webpack 4，入口文件分别为 index 和 detail，其中每个文件中引入了一个图片）：

```js
module.exports = {
  mode: 'none', // 设置为 none，避免 development 或 production 默认设置的一些影响
  entry: {
    index: './src/index.js',
    detail: './src/detail.js'
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

### hash（the hash of the module identifier）

首先，我们来解释下 the module identifier。webpack 默认为给各个模块分配一个 id 以作标识，用来处理模块之间的依赖关系。而默认的 id 命名规则是根据模块引入的顺序，赋予一个整数(1、2、3……)。如下图就是使用 hash 的打包，index 和 detail 作为 entry 的两个入口，可以看到其 hash 值是一样的，而另外两个图片的 hash 值是不同的。

{% asset_img hash.png hash %}

由于该 hash 是基于整个 module identifier 序列计算得到的，所以 JS 或 CSS 文件如果使用该 hash，则所有值都一样，而任意增添或删减一个模块的依赖，都会对整个 id 序列造成影响，从而改变 hash 值。这样的话 JS 或 CSS 文件是不适合使用该 hash 值的。

当然对于图片、字体、PDF 等资源该 hash 还是可以生成一个唯一值的。

#### runtime & manifest

假如我们什么都不改动，只是重新跑一次构建，会惊奇的发现 index 和 detail 的 hash 值居然变了（图片的 hash 是不变的），如下图：

{% asset_img runtimehash.png runtimehash %}

这究竟是怎么回事呢？webpack 官方解释为：

> This is because webpack includes certain boilerplate, specifically the [runtime and manifest](https://webpack.js.org/concepts/manifest/), in the entry chunk.

为了解决这个不稳定的因素，webpack 4 提供了一个配置可以直接把 boilerplate 给单独抽离出来，配置如下：

```js
optimization: {
  runtimeChunk: 'single';
}
```

这样我们就能得到一个 runtime 的 js 文件，如下图：

{% asset_img runtimejs.png runtimejs %}

### chunkhash（the hash of the chunk content）

现在我们把 hash 改成 chunkhash ，如下：

```js
output: {
  filename: '[name].[chunkhash].js',
  path: path.resolve(__dirname, 'dist')
}
```

重新跑下构建，会发现打包出来的三个 JS 文件的 chunkhash 值是不一样的了，如下：

{% asset_img chunkhash.png chunkhash %}

现在我们在 index 文件中再引入一个 JS 模块，重新打包如下：

{% asset_img chunkhash.png chunkhash %}

我们会发现 index 和 detail 文件的 chunkhash 都变了，这就奇怪了，按理来说 detail 文件我们根本没有改变啊，为什么它的 chunkhash 值变了呢？

其实根本原因还是 module identifier，因为 index 新引入的模块改变了以后所有模块的 id 值，所以 detail 文件中引入的模块 id 值发生了改变，于是 detail 的 chunkhash 也随着发生改变。

解决方案是将默认的数字 id 命名规则换成路径的方式。webpack 4 中当 mode 为 development 会默认启动

```js
optimization: {
  namedModules: true;
}
```

当然如果是生产环境的话，全路径是有点太长，所以我们可以换成使用[HashedModuleIdsPlugin](https://webpack.js.org/plugins/hashed-module-ids-plugin/) 插件来根据路径生成的 hash 作为 module identifier。

```js
plugins: [
    new webpack.HashedModuleIdsPlugin(),
],
```

这样最后 chunkhash 改变的就只有修改的文件了，也达到了我们想要的效果。

### contenthash（the hash of extracted content）

现在我们将 CSS 样式单独抽离生成文件（使用了 [MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/) 插件），会发现其 chunkhash 值跟该 entry 的 js 文件的 chunkhash 是一样的，如下图：

{% asset_img contenthash.png contenthash %}

现在如果只改变 CSS 文件，会发现对应的 entry JS 和 CSS 文件的 chunkhash 都会改变。（注意：可能以前 [ExtractTextWebpackPlugin](https://webpack.js.org/plugins/extract-text-webpack-plugin/) 不会改变，所以只能对抽离的 CSS 文件使用 contenthash）。

反正不管同时变或不变，可能都不是我们想要的效果，我们需要应该是改变了什么就反应到什么文件上。而不是 CSS 和 JS 文件的 chunkhash 同时改变或不变，无法区分 CSS 和 JS 的更新。

所以这里抽离出来的 CSS 文件将使用 contenthash，以区分 CSS 文件和 JS 文件的更新。

### Chunks ID

然而这还没有结束，还有个问题，那就是目前我们的 chunks ID 还是以自增的数字命名的，这当我们的 entry 文件发生改变（新增或删除）的时候，原先的 chunks ID 就有可能发生变化。于是我们也需要把数字改掉就好，webpack 4 在 `optimization` 新增了一个 `namedChunks` 配置，该配置开发环境为 `true`，生产环境为 `false`，所以在生产环境的时候我们为了构建稳定的 hash 时，还是需要把该选项设置为 `true`，如下：

```js
module.exports = {
  //...
  optimization: {
    namedChunks: true
  }
};
```

## 总结

为了一份理想的缓存文件，我们需要做这些事情：

- 抽离 boilerplate（[runtime & manifest）
- 将 module identifier 默认的数字标识方式转成使用路径标识
- JS 文件使用 chunkhash
- 抽离的 CSS 样式文件使用 contenthash
- gif|png|jpe?g|eot|woff|ttf|svg|pdf 等使用 hash
- 设置 `namedChunks` 为 true

## 原文地址

[Webpack4 如何优雅打包缓存文件](https://imweb.io/topic/5b6f224a3cb5a02f33c013ba)
