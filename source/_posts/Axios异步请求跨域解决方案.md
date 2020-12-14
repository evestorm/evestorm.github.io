---
title: Axios异步请求跨域解决方案
tags:
  - axios
  - 跨域
categories:
  - 前端
  - JS
abbrlink: 29963
date: 2019-04-16 16:05:12
---

## 场景

> 后端 127.0.0.1（默认 80）；前端 127.0.0.1:8081

在 vue 开发过程中使用 axios 发起 POST 请求：

```js
axios({
  method: 'GET',
  url: 'http://127.0.0.1'
}).then(data => {});
```

会报跨域错误：

[![跨域](Axios异步请求跨域解决方案/跨域.png)](https://gitee.com/evestorm/various_resources/raw/master/ajax/跨域.png)

原因是浏览器同源策略，只有 **同协议、同域名、同端口** 三同的地址才能互相通过 AJAX 的方式请求。而上面情形虽然协议（http）和域名（127.0.0.1）都相同，但端口不同（80 和 8081），所以无法正常请求。

## 解决方案

### 方案一

服务端添加响应头，以 Koa 为例，在 `app.js` 中添加响应头：

```js
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  await next();
});
```

这样设置会允许任何来源（\*）的跨域。

但往往后端的某些接口是需要身份验证的，比如用户对文章、商品之类的进行评论或点赞，就需要用户登录才能操作。这种情况下就需要使用到 cookie 或者 session ，所以还得设置 `Access-Control-Allow-Credentials` 为 true ，表示在 CORS 请求中允许客户端发送 cookie 。然而一旦这样设置，`Access-Control-Allow-Origin` 就不能再是通配符 `*` ，必须指定具体的域，所以服务端最终的 header 设置为：

```js
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8081');
  ctx.set('Access-Control-Allow-Credentials', true);
  await next();
});
```

后端这样设置后，前端就能够实现跨域请求了。

### 方案二

如果服务端不加 `ctx.set("Access-Control-Allow-Origin", "*");` 这一段。可以在 `@vue-cli` 中 [配置代理](https://cli.vuejs.org/zh/config/#devserver-proxy) 。也就是 **前端设置代理** 的解决方案。

#### 原理

利用后端不存在跨域问题，而让 vue 服务器代为获取数据。因为启动 vue 项目本质上也是用 node 启了个服务器（127.0.0.1:8080），配置了代理后，就不再是浏览器直接请求我们在 axios 中配置的 http://127.0.0.1/（默认80端口） ，而是用 vue 启动的这个服务器去请求 http://127.0.0.1/ 这个接口，由于后端相互之前请求不存在跨域问题，所以能获取数据，获取后给到前端。

在前端项目根目录下新建 `vue.config.js` 文件：

```js
module.exports = {
  devServer: {
    proxy: {
      // 前端 axios 发这样的请求：http://127.0.0.1:8081/api/ (8081是启动vue项目时的端口)，会被此处捕获，然后代为请求真正的服务器API地址 `http://127.0.0.1`
      '/api': {
        target: 'http://127.0.0.1', // 此处是服务端API接口，不写端口默认80
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};
```

### 前端发送 POST 跨域请求

上面也提到了，前端有时候往往不止需要发送 GET 请求，POST 请求也是常有的事儿。所以还需要对 Axios 进行如下配置：

> vue 项目下的 main.js 中全局配置 axios

```js
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1';
axios.defaults.withCredentials = true; // 让 ajax 携带 cookie
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'; // 设置post请求的头部格式

Vue.prototype.$ajax = axios;
```

> 由于需要把请求时的数据序列化为 url 的形式，所以要下载 qs 包

```js
npm i qs
```

> 在具体页面中发送 POST 请求

```js
import qs from 'qs'

let loginInfo = {
    username: '',
    password: '',
},

this.$ajax({({
    method: 'post',
    url: 'http://127.0.0.1/login',
    data: qs.stringify(login_info),
})
```
