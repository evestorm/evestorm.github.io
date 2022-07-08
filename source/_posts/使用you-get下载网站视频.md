---
title: 使用you-get下载网站视频
tags:
  - you-get
  - 工具
categories:
  - 效率
  - 工具
abbrlink: 21487
date: 2019-11-09 23:12:30
---

## 介绍

`you-get` 是 `GitHub` 上的一个开源项目，可以帮助我们下载大多主流网站上的视频、图片及音频。

**GitHub Repo 地址：** [soimort/you-get](https://github.com/soimort/you-get)

<!-- more -->

## 起因

有时候希望能在 B 站下载在线视频到本地，然而 B 站只支持在手机端缓存。所以 Google 了下发现了一个插件：「[bilibili 哔哩哔哩下载助手](https://chrome.google.com/webstore/detail/bilibili哔哩哔哩下载助手/bfcbfobhcjbkilcbehlnlchiinokiijp?utm_source=chrome-ntp-icon)」（点击左侧链接在 google 应用商店直接下载），下载完成后打开你要下载的 B 站 视频链接，右下角就会出现一个按钮：

{% asset_img 打开b站助手.png 打开b站助手截图 %}

点击后就弹出下载详情，直接按下图配置点击合并下载即可：

{% asset_img b站下载助手.png b站下载助手使用截图 %}

扯远了，其实到目前为止一切都非常顺利，但这个助手插件有个问题就是有时候下载特别快有时候又特别慢，慢起来一个 200M 视频要下载 1 两个小时。所以我又开始了找工具征程。最后就发现了今天的主角————「you-get」。

## 安装

首先你需要安装 python3 最新版。（没有 python 的需要前往 python [官方](https://www.python.org/)按照教程下载）。

然后在本地安装 you-get：

### Windows 用户

按住键盘「win+R」打开运行窗口，输入 `cmd` 点确定，然后键入如下命名：

```shell
pip3 install you-get
pip3 install --upgrade you-get
python -m pip install --upgrade pip
```

执行完上面三步并没有报错就代表安装成功了。

### Mac 用户

mac 这边更简单，快捷键「Ctrl+空格」输入 Terminal 回车启动，键入下方命名（和 Windows 一样，前提是安装最新版 python3.7+ ）：

```shell
pip3 install you-get
```

## 使用

安装完成后咱们就能愉快的下载视频了。示例如下：

```shell
you-get https://www.bilibili.com/video/av8106130?p=2
```

### 下载目录

视频下载后存储在本地的地址就是你执行下载命名时所在的目录。
