---
title: ubuntu下开启/关闭防火墙及端口的命令(笔记)
tags:
  - 笔记
  - Ubuntu
categories:
  - 后端
  - 服务器
abbrlink: 60660
date: 2019-06-21 20:33:40
---

## 开启防火墙

```shell
sudo ufw enable
```

## 关闭防火墙

```shell
sudo ufw disable
```

<!-- more -->

## 重启防火墙

```shell
sudo ufw reload
```

## 查看端口开启状态

```shell
sudo ufw status
```

## 开启某个端口

```shell
sudo ufw allow 8001/tcp
```

## 禁止外部某个端口

```shell
sudo ufw delete allow 8001/tcp
```

## 查看端口 ip

```shell
netstat -ltn
```
