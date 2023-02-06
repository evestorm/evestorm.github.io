---
title: >-
  解决MAC下Navicat连接MySQL8报错：Authentication_plugin_caching_sha2_password_cannot_be_loaded
tags:
  - MySQL
  - Navicat
categories:
  - 后端
  - 数据库
  - MySQL
abbrlink: 23570
date: 2022-12-28 16:35:02
---

## 环境

MacOS Ventura 13.0.1
MySQL 8.0.31
Navicat Premium 12.0.22

## 错误信息

```shell
Authentication plugin 'caching_sha2_password' cannot be loaded: dlopen(/usr/local/mysql/lib/plugin/caching_sha2_password.so, 2): ...
```

<!-- more -->

## 原因

不是客户端 Navicat 的原因，是 MySQL 兼容问题，需要修改数据库的认证方式
MySQL8.0 版本默认的认证方式是 caching_sha2_password
MySQL5.7 版本则为 mysql_native_password。

官方文档：
<https://dev.mysql.com/doc/refman/8.0/en/upgrading-from-previous-series.html#upgrade-caching-sha2-password>

## 解决办法

用终端连接MySQL,然后执行以下命令：

```shell
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword';
```
