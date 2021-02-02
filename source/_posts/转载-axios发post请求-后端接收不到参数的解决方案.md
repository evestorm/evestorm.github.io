---
title: 转载-axios发post请求-后端接收不到参数的解决方案
tags:
  - axios
  - 转载
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 32468
date: 2020-04-25 16:15:57
---

转载自：https://blog.csdn.net/csdn_yudong/article/details/79668655

## 问题场景

下面一个正常的 axios post 请求，后端说没有接收到你的传参：

```js
axios({
  headers: {
    deviceCode: 'A95ZEF1-47B5-AC90BF3'
  },
  method: 'post',
  url: '/api/lockServer/search',
  data: {
    username,
    pwd
  }
});
```

## 问题原因

### 要点一

原因就是这次的接口使用 java spring mvc
并且在这个方法上使用了注解 @RequestParam

那么这个是什么意思呢，这个是只能从请求的地址中取出参数，也就是只能从 username=admin&password=admin 这种字符串中解析出参数。

### 要点二

我们还可以看到我们这次请求的 Content-Type：

```json
application/json;charset=UTF-8
```

axios 会帮我们 **转换请求数据和响应数据** 以及 **自动转换 JSON 数据**

## Features

- Make [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) from the browser
- Make [http](http://nodejs.org/api/http.html) requests from node.js
- Supports the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- Intercept request and response
- <mark>Transform request and response data</mark>
- Cancel requests
- Automatic transforms for JSON data
- Client side support for protecting against [XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery)

在 axios 源码中发现下面这段内容：

```js
transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    // ========= 如果data是object，就会转 ========
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],
```

我们知道在做 post 请求的时候，我们的传参是 data: {...} 或者直接 {...} 的形式传递的，嗯，就是下面这两种形式：

【第一种】

```js
axios
  .post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(() => {})
  .catch(() => {});
```

【第二种】

```js
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```

非常的刺激，这两种形式无一例外都触发了 axios 源码中【很关键】的那一段代码

## 问题分析

也就是说，我们的 `Content-Type` 变成了 `application/json;charset=utf-8`
然后，因为我们的参数是 JSON 对象，axios 帮我们做了一个 stringify 的处理。
而且查阅 axios 文档可以知道：axios 使用 post 发送数据时，默认是直接把 json 放到请求体中提交到后端的。

那么，这就与我们服务端要求的 `'Content-Type': 'application/x-www-form-urlencoded'` 以及 `@RequestParam` 不符合。

## 解决方法

### 方案一

【用 URLSearchParams 传递参数】

```js
let param = new URLSearchParams();
param.append('username', 'admin');
param.append('pwd', 'admin');
axios({
  method: 'post',
  url: '/api/lockServer/search',
  data: param
});
```

> 需要注意的是： URLSearchParams 不支持所有的浏览器，但是总体的支持情况还是 OK 的，所以优先推荐这种简单直接的解决方案

### 方案二

_网上有很多方案说使用_

```js
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';
```

或者

```js
{
  "headers": {
      "Content-Type": "application/x-www-form-urlencoded"
    }
}
```

_我试了一下，其实这样还是不行的_

【还需要额外的操作，（我们要将参数转换为 query 参数）】

引入 qs ，这个库是 axios 里面包含的，不需要再下载了。

```js
import Qs from 'qs';
let data = {
  username: 'admin',
  pwd: 'admin'
};

axios({
  headers: {
    deviceCode: 'A95ZEF1-47B5-AC90BF3'
  },
  method: 'post',
  url: '/api/lockServer/search',
  data: Qs.stringify(data)
});
```

### 方案三

在请求中添加 `transformRequest` :

```js
import Qs from 'qs';
axios({
  url: '/api/lockServer/search',
  method: 'post',
  transformRequest: [
    function (data) {
      // 对 data 进行任意转换处理
      return Qs.stringify(data);
    }
  ],
  headers: {
    deviceCode: 'A95ZEF1-47B5-AC90BF3'
  },
  data: {
    username: 'admin',
    pwd: 'admin'
  }
});
```

### 方案四

```js
axios.post('/api/lockServer/search', "userName='admin'&pwd='admin'");
```
