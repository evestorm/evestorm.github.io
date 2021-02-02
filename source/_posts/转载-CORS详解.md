---
title: 转载-CORS详解
tags:
  - 跨域
  - 转载
categories:
  - 前端
  - 浏览器
  - 跨域
abbrlink: 28096
date: 2019-04-15 13:18:05
---

## 转载文章

博客源：[CORS 详解](https://github.com/hstarorg/HstarDoc/blob/master/前端相关/CORS详解.md)

## 关于 CORS

说到 CORS，就不得不先了解跨站 HTTP 请求（Cross-site HTTP request）。

跨域 HTTP 请求是指发起请求的资源所在域不同于该请求所指向资源所在的域的 HTTP 请求。

正如大家所知，出于安全考虑，浏览器会限制脚本中发起的跨站请求。使用 XMLHttpRequest 发起 HTTP 请求必须遵守同源策略。 具体而言，Web 应用程序能且只能使用 XMLHttpRequest 对象向其加载的源域名发起 HTTP 请求，而不能向任何其它域名发起请求。

由于 Web 应用技术越来越丰富，我们非常渴望在不丢失安全的前提下，能够实现跨站请求。特别是现在的 Web 程序结构，一般是 HTML+REST API。在之前的实现中，我们一般采用 jsonp 来发起跨站请求，这其实是利用了 html 标签的特点。

W3C 的 Web 应用工作组推荐了一种新的机制，即跨域资源共享（Cross-Origin Resource Sharing），也就是当前我们提到的 CORS。

CORS 的核心，就是让服务器来确定是否允许跨域访问。

<!-- more -->

## 1、典型场景

### 1.1、简单请求

什么是简单请求？全部满足以下条件的请求可以称之为简单请求：

1. 只使用 GET、HEAD 或者 POST 请求方法。如果是 POST，则数据类型（Content-Type）只能是`application/x-www-form-urlencodeed`、`multipart/form-data`、`text/plain`中的一种。
2. 没有使用自定义的请求头（如 x-token）

按照这个规则，那我们的能实现跨域请求的情况如下：

Server 代码：

```js
'use strict';

var http = require('http');
var server = http.createServer((req, res) => {
  //之后设置了Access-Control-Allow-Origin，才会允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.write('abc');
  res.end();
});

server.listen(10000, () => {
  console.log('started.');
});
```

Client 代码：

```js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    console.log('Result：', xhr.responseText);
  }
};

//场景一：GET请求，不需要Header，允许跨域
xhr.open('GET', 'http://localhost:10000/', true);
xhr.send();

//场景二： POST请求，需要设置为指定Header（不设置content-type也可），允许跨域
xhr.open('POST', 'http://localhost:10000/', true);
//此处value必须是text/plain或者application/x-www-form-urlencoded或者multipart/form-data。
//此处也可以不设置
xhr.setRequestHeader('Content-Type', 'text/plain');
xhr.send();

//场景三：DELETE请求（不允许跨域）
xhr.open('DELETE', 'http://localhost:10000/', true);
xhr.send();

//场景四：POST请求，有自定义Header（不允许跨域）
xhr.open('POST', 'http://localhost:10000/', true);
xhr.setRequestHeader('x-token', 'a');
xhr.send();
```

### 1.2、预请求

不同于简单请求，预请求要求必须先发送一个 OPTIONS 请求给站点，来查明该站点是否允许跨域请求，这样做的原因是为了避免跨站请求可能对目的站点的数据造成的损坏。

如果请求满足以下任一条件，则会产生预请求：

1. 请求以 GET、HEAD、POST 之外的方法发起。或者，使用 POST，但数据类型为`application/x-www-form-urlencoded`, `multipart/form-data` 或者 `text/plain` 以外的数据类型。（注：之前的版本只有 text/plain 可以不用发起预请求）。
2. 使用了自定义请求头。

按照如上规则，我们来列举几个应用场景：

Server 端代码：

```js
'use strict';

var http = require('http');
var server = http.createServer((req, res) => {
  //之后设置了Access-Control-Allow-Origin，才会允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, GET');
  res.setHeader('Access-Control-Allow-Headers', 'x-token');
  //设置预请求缓存1天，1天内再次请求，可以跳过预请求
  //此功能需要客户端缓存支持，如果客户端禁用缓存，那么每次都会预请求
  res.setHeader('Access-Control-Max-Age', 60 * 60 * 24);
  res.write('abc');
  res.end();
});

server.listen(10000, () => {
  console.log('started.');
});
```

Client 端代码：

```js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    console.log('Result：', xhr.responseText);
  }
};

//场景一：DELETE请求，发送OPTIONS，匹配，允许跨域
xhr.open('DELETE', 'http://localhost:10000/', true);
xhr.send();

//场景二：PUT请求，发送OPTIONS，不匹配，不允许跨域
xhr.open('PUT', 'http://localhost:10000/', true);
xhr.send();

//场景三：DELETE请求匹配，使用自定义Header不匹配，不允许跨域
xhr.open('DELETE', 'http://localhost:10000/', true);
xhr.setRequestHeader('x-token1', 'aa');
xhr.send();

//场景四：POST请求，匹配的自定义Header，允许跨域
xhr.open('POST', 'http://localhost:10000/', true);
xhr.setRequestHeader('x-token', 'a');
xhr.send();
```

### 1.3、带凭证的请求

一般来说，对于跨站请求，浏览器是不会发送凭证（HTTP Cookies 和验证信息）的。如果要发送带凭证的信息，只需要给 XMLHttpRequest 设置一个特殊的属性`withCredentials = true`，通过这种方式，浏览器就允许发送凭证信息。

带凭证的请求可能是简单请求，也可以是会有预请求。是否允许跨域，会先判断简单请求和预请求的规则，然后还会带上带凭证的请求自己的规则。

在带凭证的请求中，后端的响应必须包含 Header`Access-Control-Allow-Credentials=true`，同时 Header `Access-Control-Allow-Origin`，不能再使用\*号这种匹配符。

具体示例如下：

服务端代码：

```js
'use strict';

var http = require('http');
var server = http.createServer((req, res) => {
  //要处理带凭证的请求，此Header不能使用*。
  res.setHeader('Access-Control-Allow-Origin', 'http://10.16.85.170:8000');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, GET');
  res.setHeader('Access-Control-Allow-Headers', 'x-token');
  res.setHeader('Access-Control-Max-Age', 60 * 60 * 24);
  //只有设置了该Header，才允许带凭证的请求。
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.write('abc');
  res.end();
});

server.listen(10000, () => {
  console.log('started.');
});
```

客户端代码：

```js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    console.log('Result：', xhr.responseText);
  }
};
//优先满足预请求，然后满足凭证请求，允许跨域。
xhr.open('POST', 'http://localhost:10000/', true);
xhr.withCredentials = true;
xhr.setRequestHeader('x-token', 'a');
xhr.send();
```

## 2、HTTP 响应头

### 2.1、 后端 HTTP 响应头

此处列举后端有关 CORS 的响应头：

1. Access-Control-Allow-Origin： | _允许的域名，只能有一个值。比如“_”或“abc.com”，”a.com,b.com”这种不允许
2. Access-Control-Expose-Headers: 允许的白名单 Header，多个用逗号隔开
3. Access-Control-Max-Age: 预请求缓存时间，单位秒，**禁用缓存**时无效哦！
4. Access-Control-Allow-Credentials: true | false 是否允许带凭证的请求，如果为 true，则 Origin 只能是具体的值
5. Access-Control-Allow-Methods: 允许的请求类型，多个用逗号隔开
6. Access-Control-Allow-Headers: 在实际请求中，允许的自定义 header，多个用逗号隔开

### 2.2、 浏览器发出跨域请求的响应头

此处列举出浏览器在发送跨域请求时，会带上的响应头：

1. Origin: 告诉服务器，请求来自哪里，仅仅是服务器名，不包含路径。
2. Access-Control-Request-Method: 预请求时，告诉服务器实际的请求方式
3. Access-Control-Request-Headers: 预请求时，告诉服务器，实际请求所携带的自定义 Header

## 3、参考资料

1. [MDN HTTP access control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Preflighted_requests)
2. [MDN HTTP 访问控制(CORS)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
