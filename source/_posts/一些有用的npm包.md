---
title: 一些有用的npm包
tags:
  - 笔记
categories:
  - 前端
  - 构建工具
  - npm
abbrlink: 44396
date: 2020-12-02 09:19:02
---

## runjs

> 已改名为 tasksfile ，`npm install tasksfile` 代替

### 介绍

一个小型构件工具

### 安装

```shell
npm install runjs -D
```

<!-- more -->

### 使用

在根项目目录中创建 `runfile.js`

```js
const { run } = require('runjs');

function hello(name = 'Mysterious') {
  console.log(`Hello ${name}!`);
}

function makedir() {
  run('mkdir somedir');
}

module.exports = {
  hello,
  makedir
};
```

在你的终端中执行：

```shell
$ npx run hello Tommy
Hello Tommy!
$ npx run makedir
mkdir somedir
```

## chalk

### 介绍

给 `终端` 字符串设置样式

### 安装

```shell
npm install chalk
```

### 使用

```js
const chalk = require('chalk');

console.log(chalk.blue('Hello world!'));
```

## connect

### 介绍

Connect 是一个可扩展的 HTTP 服务器框架，用于 node，使用称为中间件的“插件”。

### 安装

```shell
npm install connect
```

### 使用

```shell
var connect = require('connect');
var http = require('http');

var app = connect();

// gzip/deflate outgoing responses
var compression = require('compression');
app.use(compression());

// store session state in browser cookie
var cookieSession = require('cookie-session');
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// respond to all requests
app.use(function(req, res){
  res.end('Hello from Connect!\n');
});

//create node.js http server and listen on port
http.createServer(app).listen(3000);
```

## serve-static

### 介绍

一款静态资源管理器

### 安装

```shell
npm install serve-static
```

### 使用

```js
var http = require('http'),
  url = require('url'),
  fs = require('fs');
var serveStatic = require('serve-static'),
  //finalhandler 是 serveStatic 的依赖，不需要特意安装。
  finalhandler = require('finalhandler');

//配置静态资源服务 ("要静态化的文件路径",{默认主页的配置});
var serve = serveStatic('public', { index: ['index.html', 'index.htm'] });
http
  .createServer(function (req, res) {
    //路由清单
    if (req.url == '/music') {
      //也让其显示 根目录public 下的主页
      fs.readFile('./public/index.html', function (err, data) {
        if (err) {
          res.end('没有此文件!');
          return;
        }
        console.log(data.toString());
        res.end(data.toString());
      });
      //读取并呈递完毕之后,在路由中加上return,
      //否则下面的静态资源服务里面会一直寻找这个路由，
      //这个路由是虚拟出来的，因此不会呈递上面我们去读的文件
      return;
    }

    //使用静态资源服务，一般放在中间件最下方，不至于遮蔽中间件的路由
    serve(req, res, finalhandler(req, res));
  })
  .listen(8888);
console.log('ok');
```

## mockjs

### 介绍

生成随机数据，拦截 Ajax 请求

### 安装

```shell
npm install mockjs
```

### 使用

```js
// 使用 Mock
var Mock = require('mockjs');
var data = Mock.mock({
  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
  'list|1-10': [
    {
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'id|+1': 1
    }
  ]
});
// 输出结果
console.log(JSON.stringify(data, null, 4));
```
