---
title: Vue+Koa实现cookie传输
tags:
  - Koa
  - Cookie
categories:
  - 后端
  - Node
abbrlink: 26486
date: 2019-04-17 21:33:26
---

## 后端

登录接口设置 cookie：

```js
router.post('/login', async ctx => {
    ...
    let user = {
      username: 'Lance',
      age: 20,
      ...
    }
    ctx.cookies.set('username', user.username), {
        // httpOnly：表示当前设置的cookie是否允许客户端进行操作（js）
        // 默认true，表示这个cookie能用于http协议的数据传输，但不允许js操作和篡改
        httpOnly: false,
    });
    ...
});
```

<!-- more -->

读取浏览器自动带上的 cookie：

```js
router.post('/like', async ctx => {
    ...
    // 从cookie中读取 username
    let username = ctx.cookies.get('username');
    ...
});
```

文档：[Koa - response](https://koajs.com/#response)

## 前端

```js
created() {
  // 从cookie中获取用户信息cookie
  // 如果有cookie
  if (document.cookie) {
      // cookie = "uid=1; username=admin;" => ['uid=1', 'username=admin']
      let arr1 = document.cookie.split("; ");
      let cookiesArr = arr1.map(item => {
          // item = "uid=1" => ['uid', 1]
          let arr2 = item.split("=");
          return {
              [arr2[0]]: arr2[1]
          }
      });
      // {uid: "6", username: "YWRtaW4"}
      let cookie = Object.assign({}, ...cookiesArr);
      ...
  }
},
```

## 后端 cookie 的加密

在 `app.js` 中添加密钥：

```js
const app = new Koa();
// 密钥
app.keys = ['sw_lance'];
```

然后在 `routers/main.js` 路由中的 cookie 设置中增加一个字段：

```js
// 设置cookie
ctx.cookies.set('username', user.username, {
  signed: true // 使用加密方式处理
});
```

这样就能加密了，但在前端 chrome 下查看 cookie 会发现，虽然有了加密 cookie，但明文的 cookie 仍然在：

{% asset_img 篡改cookie.png 明文cookie %}

## 后端 session 加密

首先仍然要在 `app.js` 中添加密钥：

```js
const app = new Koa();
// 密钥
app.keys = ['sw_lance'];
npm i koa-session
```

在 `app.js` 中引入：

```js
const session = require('koa-session');
const app = new Koa();
// 密钥
app.keys = ['sw_lance'];
const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false
};
app.use(Session(CONFIG, app));
```

在 `routers/main.js` 的 login API 中种下 cookie 和 session：

```js
router.post('/login', async ctx => {
    ...
    // uid用下面的session存，username没那么重要，可以用cookie
    ctx.cookies.set('username', new Buffer(user.get('username')).toString('base64'), {
        httpOnly: false,
        signed: true,
        // maxAge: 10000,
    });
    // uid用session存
    ctx.session.uid = user.get('id');
});
```

在 `routers/main.js` 的 `like` API 中获取 session：

```js
router.post('/like', async ctx => {
  let uid = ctx.session.uid;
});
```
