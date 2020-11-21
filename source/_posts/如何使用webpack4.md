---
title: 如何使用webpack4
tags:
  - Webpack
categories:
  - 前端
  - 构建工具
abbrlink: 47462
date: 2019-02-04 00:19:26
---

## 为什么要使用 webpack

### 网页中引用的常见静态资源

| 类型              | 静态资源                                                     |
| :---------------- | :----------------------------------------------------------- |
| JS                | .js .jsx .coffee .ts（TypeScript 类 C# 语言）                |
| CSS               | .css .less .sass .scss                                       |
| Images            | .jpg .png .gif .bmp .svg                                     |
| 字体文件（Fonts） | .svg .ttf .eot .woff .woff2                                  |
| 模板文件          | .ejs .jade .vue【这是在webpack中定义组件的方式，推荐这么用】 |

<!-- more -->

### 引入过多静态资源有什么问题？

1. 网页加载速度慢， 因此我们要发起很多的二次请求
2. 还要处理错综复杂的依赖关系

### 如何解决上述两个问题

1. 合并、压缩、精灵图、图片的 Base64 编码
2. 可以使用 requireJS、也可以使用 webpack 来解决各个包之间的复杂依赖关系

### 如何完美实现上述的2种解决方案

1. 使用 Gulp， 基于 task 任务
2. 使用 webpack， 基于整个项目进行构建
   - 借助于 webpack 这个前端自动化构建工具，可以完美实现资源的合并、打包、压缩、混淆等诸多功能

## 简介

webpack 是基于 Node.js 开发出来的一个前端项目打包工具。

## 安装 & 初步使用

1. 如果第一次安装，需要全局安装 『 webpack && webpack-cli 』:

   ```shell
   npm install -g webpack webpack-cli
   ```

2. 初始化项目

   ```shell
   # 创建文件夹
   mkdir webpack4-demo
   # 进入
   cd webpack4-demo
   # 初始化
   npm init -y
   ```

3. 以下面的目录结构创建文件

   ```shell
   ├── package.json
   └── src
       ├── css
       │   └── index.css
       ├── images
       │   └── temp.png
       ├── index.html
       ├── js
       │   ├── a.js
       │   ├── b.js
       │   └── index.js
       └── main.js
   ```

   > index.css

   ```css
   body {
      display: flex;
   }
   
   ul li {
       box-shadow: 2px 2px 2px rgba(31, 31, 31, 0.05);
   }
   ```

   > index.html

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
   </head>
   
   <body>
       <ul id="list">
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
       </ul>
   </body>
   </html>
   ```

   > js/a.js

   ```js
   import b from './b'
   import $ from 'jquery'
   const a = {
      init() {
         console.log("我是 a 模块，现在被初始化了")
      },
      binit() {
         b.init()
      }
   }
   export default a
   ```

   > js/b.js

   ```js
   const b = {
      init() {
         console.log("我是 b 模块，现在被初始化了")
      }
   }
   export default b
   ```

   > js/index.js

   ```js
   import $ from 'jquery'
   
   const index = {
      // init后执行隔行变色的代码
      init() {
         // 设置偶数行背景色，索引从0开始，0是偶数
         $('#list li:even').css('backgroundColor', 'lightblue')
         // 设置奇数行背景色
         $('#list li:odd').css('backgroundColor', 'pink')
      }
   }
   
   export default index
   ```

   > main.js

   ```js
   import a from './js/a'
   import b from './js/b'
   import index from './js/index'
   import './css/index.css'
   
   const main = () => {
      console.log('入口函数 main 被调用了')
      a.init()
      a.binit()
      b.init()
      index.init()
   }
   main()
   ```

4. 项目根文件夹下执行命令 `npm i webpack webpack-cli -D`

5. 使用 `npm i jquery` 安装 jQuery 类库

6. 直接在页面上引用 `main.js` 会报错，因为浏览器不认识 `import $ from 'jquery'` 这种JS语法，需要使用 webpack 进行处理，webpack 默认会把这种高级的语法转换为低级的浏览器能识别的语法：

   ```html
   <ul id="list">
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
   </ul>
   <!-- 直接引入会报错 -->
   <script src="./main.js"></script>
   ```

7. 运行 `webpack 入口文件路径 模式` 运行 `main.js` 入口文件：

   ```shell
   webpack src/main.js --mode development # 开发环境
   或者
   webpack src/main.js --mode production  # 生产环境
   ```

8. 不过每次都要输入这个命令，非常麻烦，我们可以在`package.json`的`scripts`中加入两个指令成员：

   ```json
   "scripts": {
      "dev": "webpack src/main.js --mode development",
      "build": "webpack src/main.js --mode production"
   },
   ```

   以后只需要在命令行执行 `npm run dev` 便相当于执行 `webpack --mode development` ，执行 `npm run build` 便相当于执行 `webpack --mode production`。

## 使用配置文件简化打包命令

1. 在项目根目录中创建 `webpack.config.js`

2. 由于运行 webpack 命令的时候，webpack 需要指定入口文件和输出文件的路径，所以我们需要在 `webpack.config.js` 中配置这两个路径：

   ```js
   // 导入处理路径的模块
   const path = require('path')
   
   // 导出一个配置对象，将来 webpack 在启动的时候，
   // 会默认来查找 webpack.config.js ，
   // 并读取这个文件中导出的配置对象，来进行打包处理
   module.exports = {
      // 配置入口文件，表示要使用 webpack 打包哪个文件
      // 若不配置 webpack 将自动查找 src 目录下的 index.js 文件
      entry: {
         main: path.join(__dirname, './src/main.js')
      },
      output: {
         filename: "[name].bundle.[hash].js", //输出文件名，[name]表示入口文件js名，[hash]会在后面生成随机hash值
         path: path.join(__dirname, "./dist") //输出文件路径
      }
   }
   ```

3. 由于此时已经配置了入口文件，`package.json` 中的脚本命令就可简化为：

   ```json
   "dev": "webpack --mode development",
   "build": "webpack --mode production"
   ```

## 实现 webpack 实时打包构建

webpack 提供了一个可选的本地开发服务器，这个本地服务器基于 node.js 构建，它是一个单独的插件，叫做 `webpack-dev-server` ，在 webpack 中进行配置之前需要单独安装它作为项目依赖。

devServer 作为 webpack 配置选项中的一项，以下是它的一些配置选项:

- `contentBase` ：设置服务器所读取文件的目录，当前我们设置为”./dist”
- `port` ：设置端口号，如果省略，默认为`8080`
- `inline` ：设置为`true`，当源文件改变时会自动刷新页面
- `historyApiFallback` ：设置为`true`，所有的跳转将指向`index.html`

1. 由于每次重新修改代码之后，都需要手动运行 webpack 打包的命令，比较麻烦，所以使用 `webpack-dev-server` 来实现代码实时打包编译，当修改代码之后，会自动进行打包构建。

2. 运行 `npm i webpack-dev-server -D` 安装到开发依赖

3. 安装完成之后，修改之前在 `package.json` 中添加的 dev 指令：

   ```json
   "dev": "webpack-dev-server --mode development"
   ```

4. 运行指令 `npm run dev` ，发现可以进行实时打包，但是 dist 目录下并没有生成 `main.bundle.js` 文件，这是因为 `webpack-dev-server` 将打包好的文件放在了内存中。

   - 把 `bundle.js` 放在内存中的好处是：由于需要实时打包编译，所以放在内存中速度会非常快

   - 这个时候访问 webpack-dev-server 启动的 `http://localhost:8080/` 网站，发现是一个文件夹的面板，需要点击到 src 目录下，才能打开我们的 index 首页，此时引用不到 `main.bundle.js` 文件，需要修改 index.html 中 script 的 src 属性为:`<script src="../main.bundle.js"></script>`

   - 为了能在访问 `http://localhost:8080/` 的时候直接访问到 index 首页，可以使用 `--contentBase src` 指令来修改dev指令，指定启动的根目录：

     ```json
     "dev": "webpack-dev-server --mode development --contentBase src",
     ```

## 插件（Plugins）

插件（Plugins）是用来拓展 webpack 功能的，它们会在整个构建过程中生效，执行相关的任务。
Loaders 和 Plugins 常常被弄混，但是它们其实是完全不同的东西，可以这么来说，loaders 是在打包构建过程中用来处理源文件的（JSX，Scss，Less..），一次处理一个，插件并不直接操作单个文件，它直接对整个构建过程其作用。

### 使用 `html-webpack-plugin` 插件配置启动页面

由于使用 `--contentBase` 指令的过程比较繁琐，需要指定启动的目录，同时还需要修改 index.html 中 script 标签的 src 属性，所以推荐使用 `html-webpack-plugin` 插件配置启动页面。

1. 运行 `npm i html-webpack-plugin -D` 安装到开发依赖

2. 修改 `webpack.config.js` 配置文件如下：

   ```js
   // 导入处理路径的模块
   const path = require('path')
   // 导入自动生成HTMl文件的插件
   const htmlWebpackPlugin = require('html-webpack-plugin')
   
   // 导出一个配置对象，将来 webpack 在启动的时候，
   // 会默认来查找 webpack.config.js ，
   // 并读取这个文件中导出的配置对象，来进行打包处理
   module.exports = {
       // 配置入口文件，表示要使用 webpack 打包哪个文件
       // 若不配置 webpack 将自动查找 src 目录下的 index.js 文件
       entry: {
           main: path.join(__dirname, './src/main.js')
       },
       output: {
           filename: "[name].bundle.js", //输出文件名，[name]表示入口文件js名
           path: path.join(__dirname, "./dist") //输出文件路径
       },
       plugins: [ // 添加plugins节点配置插件
           new htmlWebpackPlugin({
               template: path.join(__dirname, './src/index.html'), //模板路径
               filename: 'index.html', //自动生成的HTML文件的名称
               minify: { // 压缩HTML文件
                  removeComments: true, // 移除HTML中的注释
                  collapseWhitespace: true, // 删除空白符与换行符
                  minifyCSS: true // 压缩内联css
               },
           })
       ]
   }
   ```

3. 撤销 `package.json` 中 `script` 节点中的 dev 指令为：
   `dev": "webpack-dev-server --mode development"`

4. 将 index.html 中 script 标签注释掉，因为 `html-webpack-plugin` 插件会自动把 main.bundle.js 注入到 index.html 页面中。

### 实现自动打开浏览器、热更新和配置浏览器的默认端口号

#### 方式1：

修改 `package.json` 的 script 节点如下，其中 `--open` 表示自动打开浏览器， `--port 4321` 表示打开的端口号为 4321 ，`--hot` 表示启用浏览器热更新：

```json
"dev": "webpack-dev-server --open --port 4321 --hot  --mode development",
```

#### 方式2：(个人推荐)

1. 修改 `webpack.config.js` 文件，新增 `devServer` 节点如下：

   ```js
   devServer: {
        inline: true, //打包后加入一个 websocket 客户端
        hot: true, // 启用热更新 的 第1步
        open: true, // 自动打开浏览器
        contentBase: path.resolve(__dirname, 'dist'), // 指定托管的根目录，不注释的话，无法访问 src 以外的资源，比如 node_modules
        host: 'localhost', // 主机地址
        port: 4321, // 设置启动时候的运行端口
        compress: true // 开发服务器是否启动gzip等压缩
    },
   ```

2. 在头部引入 `webpack` 模块：

   ```js
   // 启用热更新的 第2步
   const webpack = require('webpack')
   ```

3. 在 `plugins` 节点下新增：

   ```js
   // 启用热更新的第 3 步
   new webpack.HotModuleReplacementPlugin()
   ```

## Loaders

loaders 是 webpack 最强大的功能之一，通过不同的 loader ，webpack 有能力调用外部的脚本或工具，实现对不同格式的文件的处理，例如把 `scss` 转为 `css` ，将 ES6 、ES7 等语法转化为当前浏览器能识别的语法，将 JSX 转化为 js 等多项功能。

loaders 需要单独安装并且需要在 `webpack.config.js` 中的 `modules` 配置项下进行配置，Loaders的配置包括以下几方面：

- `test`：一个用以匹配 loaders 所处理文件的拓展名的正则表达式（必须）
- `loader`：loader的名称（必须）
- `include/exclude`：手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；
- `options`：为loaders提供额外的设置选项（可选）

### 打包 css 文件

1. 运行`npm i style-loader css-loader --D`

2. 修改 `webpack.config.js` 这个配置文件：

   ```js
   module: { // 用来配置第三方loader模块的
       rules: [ // 文件的匹配规则
           {
               test: /\.css$/,
               use: ['style-loader', 'css-loader']
           } //处理css文件的规则
       ]
   },
   ```

3. 注意：`use` 表示使用哪些模块来处理 `test` 所匹配到的文件；`use` 中相关 loader 模块的调用顺序是从后向前调用的。

### 打包 less 文件

1. 如果你习惯使用 less ，可以执行命令 `npm i less-loader less -D` 来安装 less-loader 。

2. 修改 `webpack.config.js` 配置文件：

   ```js
   {
       test: /\.less$/,
       use: ['style-loader', 'css-loader', 'less-loader']
   }, //配置处理 .less 文件的第三方 loader 规则
   ```

### 打包 sass 文件

1. 例如我平常习惯用 scss，所以会安装 sass-loader ：执行命令 `npm i sass-loader node-sass --D`

2. 在 `webpack.config.js` 中添加处理 sass 文件的 loader 模块：

   ```js
   {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
   },
   // 配置处理 .scss 文件的 第三方 loader 规则（npm i sass-loader后还需要 npm i node-sass，否则编译报错）
   ```

### 处理 css 中的图片路径

> 预备工作：
>
> 1. 在 src/css/index.css 文件中给 body 添加：background-image: url(“../images/temp.png”);
> 2. 此时保存会编译报错，因为 webpack 无法处理 css 中的路径（此案例中为——图片资源）

1. 运行 `npm i url-loader file-loader --D`

2. 在 `webpack.config.js` 中添加处理 url 路径的 loader 模块：

   ```js
   {
       test: /\.(jpg|png|bmp|gif|jpeg)$/,
       use:[{
          loader:'url-loader',
          options:{
             outputPath:'images/',//输出到images文件夹
             //是把小于500B的文件打成 Base64 的格式，写入JS
             // 如果不小于，url-loader 就会使用 file-loader 处理图片
             // 所以必须安装file-loader
             limit:500
          }
       }]
   }, // 配置图片路径
   ```

### 处理 Bootstrap 字体的加载

**重要(更新)**：webpack4后的 bootstrap 字体加载已经不能使用下面该方法，如何使用可以参考这篇博客：[webpack 4.X版本的简单使用(处理js/css/less/scss/url(图片)/字体文件)](https://blog.csdn.net/hyt941026/article/details/82870466)

> 预备工作：
>
> index.html 写入
>
> 
>
> 来展示字体图片
>
> 
>
> main.js 导入 import ‘bootstrap/dist/css/bootstrap.css’
>
> 此时报错

在 `webpack.config.js` 中添加处理字体文件的 loader 模块：

```js
{
    test: /\.(ttf|eot|svg|woff|woff2)$/,
    use: 'url-loader'
}, // 处理 字体文件的 loader
```

### 提取css文件（插件！）

先安装 mini-css-extract-plugin 包：

```shell
npm install mini-css-extract-plugin -D
```

然后在 `webpack.config.js` 中修改对css文件处理的配置：

```js
// 提取css
var MiniCssExtractPlugin = require("mini-css-extract-plugin")

rules: [
    {
        test: /\.css$/,
        use: [
            process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader'] //处理css
    },
    ...
]
plugins: [
    new MiniCssExtractPlugin({
        filename: 'style.css'
    }),
    ...
]
```

### 添加浏览器css前缀

首先下载 loader ：

```shell
npm i postcss-loader autoprefixer -D
```

然后根目录添加 `postcss.config.js`

```js
module.exports = {
    plugins: {
        'autoprefixer': {
            browsers: 'last 5 version' // 代表意思为每个主流浏览器的最后5个版本
        }
    }
}
```

最后在 `webpack.config.js` 中添加配置：

```js
rules: [
    {
        test: /\.css$/,
        use: [
            process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1
                }
            },
            "postcss-loader"
        ] //处理css
    },
    ...
]
```

### 使用 babel 处理高级 JS 语法

1. 在 main.js 文件中添加 ES6 代码：

   ```js
   // class 关键字，是ES6中提供的新语法，是用来 实现 ES6 中面向对象编程的方式
   class Person {
       // 使用 static 关键字，可以定义静态属性
       // 所谓的静态属性，就是 可以直接通过 类名， 直接访问的属性
       // 实例属性： 只能通过类的实例，来访问的属性，叫做实例属性
       static info = {
           name: 'zs',
           age: 20
       }
   }
   
   // 访问 Person 类身上的  info 静态属性
   console.log(Person.info)
   // 在 webpack 中，默认只能处理 一部分 ES6 的新语法，一些更高级的ES6语法或者 ES7 语法，webpack 是处理不了的；这时候，就需要 借助于第三方的 loader，来帮助webpack 处理这些高级的语法，当第三方loader 把 高级语法转为 低级的语法之后，会把结果交给 webpack 去打包到 bundle.js 中
   // 通过 Babel ，可以帮我们将 高级的语法转换为 低级的语法
   ```

2. 运行如下两套命令，安装两套包，去安装 Babel 相关的loader功能：

   ```shell
   // 【相当于转换工具】
   npm i -D @babel/core babel-loader @babel/plugin-transform-runtime @babel/runtime @babel/plugin-proposal-class-properties
   // 【相当于字典】
   npm i -D @babel/preset-env
   
   // =====> 「转换工具」根据「字典」将 es6 转换
   ```

3. 打开 webpack 的配置文件，在 module 节点下的 rules 数组中，添加一个新的匹配规则：

   ```js
   {
       test: /\.js$/,
       use: 'babel-loader',
       exclude: /node_modules/
   } // 配置 Babel 来转换高级的ES语法
   ```

   > 2.2
   >
   > 注意： 在配置 babel 的 loader 规则的时候，必须 把 node_modules 目录，通过 exclude 选项排除掉：原因有俩：
   >
   > 2.2.1
   >
   > 如果 不排除 node_modules， 则Babel 会把 node_modules 中所有的 第三方 JS 文件，都打包编译，这样，会非常消耗CPU，同时，打包速度非常慢；
   >
   > 2.2.2
   >
   > 哪怕，最终，Babel 把 所有 node_modules 中的JS转换完毕了，但是，项目也无法正常运行！

4. 在项目的根目录中，新建一个叫做 `.babelrc` 的 Babel 配置文件，这个配置文件，属于 JSON 格式，所以，在写 `.babelrc` 配置的时候，必须符合 JSON 语法规范： 不能写注释，字符串必须用双引号：

   ```js
   {
       "presets": [
           ["@babel/preset-env", {
               "modules": false,
               "targets": {
                   "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
               },
               "useBuiltIns": "usage"
           }]
       ],
       "plugins": [
           "@babel/plugin-transform-runtime",
           "@babel/plugin-proposal-class-properties"
       ]
   }
   ```

#### [webpack.config.js配置遇到Error: Cannot find module ‘@babel/core’问题](https://www.cnblogs.com/soyxiaobi/p/9554565.html)

> **官方默认babel-loader | babel 对应的版本需要一致: 即babel-loader需要搭配最新版本babel**

两种解决方案:

1. 回退低版本

```shell
npm install -D babel-loader@7 babel-core babel-preset-env
```

1. 更新到最高版本:

```shell
npm install -D babel-loader @babel/core @babel/preset-env webpack
```

## 压缩和优化css文件

下载 `optimize-css-assets-webpack-plugin` 插件：

```shell
npm i optimize-css-assets-webpack-plugin -D
```

在 `webpack.config.js` 中引入插件并添加配置：

```js
// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

plugins: [
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g, //一个正则表达式，指示应优化/最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源CSS文件的文件名。默认为/\.css$/g
        cssProcessor: require('cssnano'), //用于优化\最小化CSS的CSS处理器，默认为cssnano
        cssProcessorOptions: {
            safe: true,
            discardComments: {
                removeAll: true
            }
        }, //传递给cssProcessor的选项，默认为{}
        canPrint: true //一个布尔值，指示插件是否可以将消息打印到控制台，默认为true
    }),
]
```

## 压缩和优化js文件

```js
yarn add webpack-parallel-uglify-plugin -D
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
plugins: [
new WebpackParallelUglifyPlugin({
      uglifyJS: {
        output: {
          beautify: false, //不需要格式化
          comments: false //不保留注释
        },
        compress: {
          warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
          drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
          collapse_vars: true, // 内嵌定义了但是只用到一次的变量
          reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
        }
      }
    })
]
```

## 提取公共文件

我们可看到 `src/js/a.js` 和 `src/main.js` 都引入了 `src/js/b.js` 文件，为什么要提取公共代码，简单来说，就是减少代码冗余，提高加载速度。和之前的 webpack 配置不一样：

```js
//之前配置
// new webpack.optimize.SplitChunksPlugin({
//     name: 'common', // 如果还要提取公共代码,在新建一个实例
//     minChunks: 2, //重复两次之后就提取出来
//     chunks: ['index', 'a'] // 指定提取范围
// }),
//现在配置
optimization: {
    splitChunks: {
        cacheGroups: {
            commons: {  // 抽离自己写的公共代码
                chunks: "initial",
                name: "common", // 打包后的文件名，任意命名
                minChunks: 2,//最小引用2次
                minSize: 0 // 只要超出0字节就生成一个新包
            },
            vendor: {   // 抽离第三方插件
                test: /node_modules/,   // 指定是node_modules下的第三方包
                chunks: 'initial',
                name: 'vendor',  // 打包后的文件名，任意命名
                // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                priority: 10
            },
        }
    }
},
```

## Source Maps 调试配置

作为开发，代码调试当然少不了，那么问题来了，经过打包后的文件，你是不容易找到出错的地方的，`Source Map`就是用来解决这个问题的。

通过如下配置，我们会在打包时生成对应于打包文件的 `.map` 文件，使得编译后的代码可读性更高，更易于调试。

```js
// webpack.config.js
...
module.exports = {
    ...
    devtool: 'source-map' // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
}
```

配置好后，我们再次运行 `npm run build` 进行打包，这时我们会发现在 `dist` 文件夹中多出了一个 `bundle.js.map`

如果我们的代码有 bug ，在浏览器的调试工具中会提示错误出现的位置，这就是 `devtool: 'source-map'` 配置项的作用。

## 开发环境 VS 生产环境

### npm run dev

**npm run dev** 是我们开发环境下打包的文件，当然由于 devServer 帮我们把文件放到内存中了，所以并不会输出打包后的 dist 文件夹。

### npm run build

通过 **npm run build** 之后会生成一个dist目录文件夹，里面有我们打包后的文件。

## 清理`/dist`文件夹(CleanwebpackPlugin)

你可能已经注意到，在我们删掉 `/dist` 文件夹之前，由于前面的代码示例遗留，导致我们的 `/dist` 文件夹比较杂乱。`webpack` 会生成文件，然后将这些文件放置在 `/dist` 文件夹中，但是 `webpack` 无法追踪到哪些文件是实际在项目中用到的。

通常，在每次构建前清理 `/dist` 文件夹，是比较推荐的做法，因此只会生成用到的文件，这时候就用到 `CleanWebpackPlugin` 插件了。

```js
npm i clean-webpack-plugin -D
// webpack.config.js
...
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 引入CleanWebpackPlugin插件

module.exports = {
    ...
    plugins: [
        ...
        new CleanWebpackPlugin(),  // 以前括号里面要传入数组([dist])来指定要删除的目录，新版 CleanWebpackPlugin 不需要传任何参数了
    ]
}
```

插件的使用方法都是一样的，首先引入，然后new一个实例，实例可传入参数。

现在我们运行 `npm run build` 后就会发现，webpack 会先将 `/dist` 文件夹删除，然后再生产新的 `/dist` 文件夹。

## webpack4.x 相关资源

- **[webpack4.x最详细入门讲解](https://www.cnblogs.com/BetterMan-/p/9867642.html)**
- [从基础到实战 手摸手带你掌握新版Webpack4.0详解 教你看文档](https://segmentfault.com/a/1190000018866232)

## webpack3 与 webpack4 使用差异

- [webpack4.x开发环境配置](https://blog.csdn.net/u012443286/article/details/79504289)
