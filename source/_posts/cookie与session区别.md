---
title: cookie与session区别
categories:
  - 前端
  - JS
abbrlink: 63891
date: 2019-01-10 00:16:15
tags:
  - Cookie
  - Session
---

## 保存状态

cookie 是通过在客户端记录信息确定用户身份的，而 session 则通过在服务器端记录信息来确定用户身份。下面是网上找到的两张图，能够对 cookie 以及 session 在客户端与服务端传递的过程有个较清晰的认识：

<!-- more -->

{% asset_img 1550245038963-b61378bb-65db-411e-9069-cf7d2b7a2908-20201119143043224.png cookie %}

{% asset_img 1550245194054-9e6b0a42-c09e-4a8b-8e7e-93ba715e6e5a-20201119143043424.png session %}


## 使用方式

cookie机制：

- 默认情况下，cookie 保存在内存中，**浏览器关闭**就没了；设置过期时间后，cookie 保存在硬盘上，关闭浏览器仍然存在，直到过期时间结束才消失。
- cookie 以**文本形式**保存在客户端，每次请求时都带上它。

session机制：

- 每次请求，服务器会检查是否有 sessionid
  - 有，服务器根据 id 返回对应 session 对象
  - 无，服务器创建新的 session 对象，并把 sessionid 在本次响应中返回给客户端。
- 通常使用 cookie 方式存储 sessionid 到客户端
  - 用户禁用 cookie 时，则服务端可以使用URL重写，可以通过 response.encodeURL(url) 进行实现

## 存储方式

- cookie 只能保存字符串类型，以文本的方式
- session 能支持任何类型的对象

## 存储大小

- cookie单个不超过4kb
- session没限制
