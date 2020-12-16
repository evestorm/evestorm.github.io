---
title: VSCode插件Sync-Settings同步失败-token失效
tags:
  - VSCode
categories:
  - 工具
  - IDE
abbrlink: 50280
date: 2020-02-01 21:25:56
---

VSCode 有款插件叫做 [Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)，它能将我们在 VSCode 中配置的所有插件上传到 github 的 gist 中去，这样不管我们是换电脑还是重装系统后，都能重新从云端下载一份之前配置好的插件库到电脑中去。

今天突然想到已经很久没更新过插件列表了，就想着把电脑上目前所用到的所有插件列表同步到 gist 中，但发现同步失败，token 过期。下面是解决方案：

<!-- more -->

1. 打开[github 官网](https://github.com/)，点击头像下的 Settings

{% asset_img home2settings.png home2settings %}

1. 点击左侧菜单下的 `Developer settings`

{% asset_img settings2developer.png settings2developer %}

1. 点击左侧菜单下的 `Personal access tokens` ，然后点击右侧 pannel 的 `Generate new token` 按钮新建一个 token

{% asset_img settings2generate.png settings2generate %}

1. 起给 token 名字外加功能限制，例如 Note 中填写 `settings sync` ，然后勾选「Select scopes」下的 gist 复选框，拉到页面最下方点击生成 token

{% asset_img setings2name.png setings2name %}

1. 你此时的新 token 就设置好了，复制 token 到剪切板待会用
2. 再次点击页面右上角头像进入 `Your gists`

{% asset_img settings2gist.png settings2gist %}

1. 在列表中找到你之前的配置并点击查看详情，复制详情页 url 中最后的一长传 id，这就是你该配置的 gist id，同样复制到剪切板

{% asset_img gist2list.png gist2list %}

{% asset_img gist2detail.png gist2detail %}

1. 回到 VSCode ，键盘快捷键「Shift + Option + P」打开 VSCode 的命令面板，搜索 sync 找到『Sync: 高级选项』点击进入，将刚才复制的 Gist ID 和 token 分别填入配置文件中保存

{% asset_img vscode2settings.png vscode2settings %}

{% asset_img vscode2detail.png vscode2detail %}

1. 最后，快捷键「Shift + Alt + U」上传你最新的 VSCode 插件配置。
