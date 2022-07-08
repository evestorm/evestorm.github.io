---
title: >-
  mac安装homebrew出错-Failed to connect to raw.githubusercontent.com port
  443/Connection refused error
tags:
  - macOS
categories:
  - 操作系统
  - macOS
abbrlink: 24685
date: 2020-10-21 00:00:28
---

## 问题原因

安装 homebrew 时总是报错：（Failed to connect to raw.githubusercontent.com port 443:Connection refused error）

原因是 github 的 raw.githubusercontent.com 域名解析被污染了。

<!-- more -->

## 解决方案

修改 hosts 文件

### 步骤

查询真实 ip

到 [https://www.ipaddress.com](https://www.ipaddress.com/) 查询 raw.githubusercontent.com 的真实 ip。

修改 hosts ：

```shell
sudo vim /etc/hosts
```

添加如下内容：

```shell
199.232.68.133 raw.githubusercontent.com
```
