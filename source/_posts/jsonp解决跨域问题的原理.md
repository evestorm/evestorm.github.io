---
title: jsonp解决跨域问题的原理
tags:
  - 跨域
categories:
  - 前端
  - JS
abbrlink: 40160
date: 2019-04-14 23:01:54
---

## 介绍

> Jsonp(JSON with Padding) 是 json 的一种”使用模式”，可以让网页从别的域名（网站）那获取资料，即跨域读取数据。

———— [菜鸟教程-jsonp](https://www.runoob.com/json/json-jsonp.html)

<!-- more -->

## 原理

script 标签的 src 不受同源策略影响，允许跨域。但需要借助服务端的配合。

## 示例

> 前端 index.html

```html
<body>
  <h1>天气查询</h1>
  <input type="text" id="city" placeholder="请输入城市名称" />
  <input type="button" id="btn" value="查询" />
  <script>
    window.onload = function() {
        // 创建方法用来获取跨域数据（名称随意）
        window["foo"] = function(data) {
             // 打印获取的数据
             console.log(data);
        }
        const btn = document.querySelector("#btn");
        btn.onclick = function() {
            // 获取用户输入城市名
            const = city = document.querySelector("#city").value;
            // 动态创建script标签
            const script = document.createElement("script");
            // 把回调函数foo的名称 以及 城市名 传递给后端
            script.src = `http://127.0.0.1:8084/weather.php?callback=foo&city=${city}`;

            const body = document.querySelector("body");
            body.appendChild(script);
        }
    }
  </script>
</body>
```

> 后端 weather.php

```php
<?php
   // 获取前端回调函数名和城市名
   $cb = $_GET["callback"];
   $city = $_GET["city"];
   if ($city == "shanghai") {
       // 调用前端已经定义的函数，把数据当做参数传递给 foo
       echo $cb."('上海晴，无风')";
   } else {
       echo $cb."('没有查询到你所在城市天气')";
   }
?>
```

这样一来当前端请求 `http://127.0.0.1:8084/weather.php?callback=foo&city=${city}` 后，后端返回的内容就应该类似这种格式：

```js
foo('上海晴，无风');
```

本质就是在调用前端已经定义好的 `foo` 方法，这样就能够获取到后端返回给我们的数据了。

## 注意事项

由于 jsonp 解决跨域问题本质上是后端返回一个方法调用。所以不是任何接口都支持 jsonp 来获取到数据的，一旦接口不支持，返回的不是方法调用格式（foo(data)）而是 json 格式（{“msg”: “success”, “data”: {…}}）的话，就说明我们无法通过 jsonp 获取到数据。

### 第三方接口跨域数据获取

一旦第三方接口返回的是 json 格式的字符串，我们就无法通过 ajax 或者 jsonp 的方式获取跨域数据。这种情况下我们只能通过自己的服务器当做中转站帮我们前端获取三方接口数据了，因为服务端之间是不存在跨域问题的，所以出现这种情况后，你可以让公司的后端帮帮忙，写一个接口去获取三方接口数据，并暴露一个接口让你能够获取到数据~
