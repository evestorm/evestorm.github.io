---
title: 使用Xcode发布iOS-ad-hoc测试版本
tags:
  - iOS
  - Xcode
categories:
  - 移动端
  - iOS
abbrlink: 38926
date: 2020-08-11 23:01:40
---

## 必要准备

开发者账号（不需要企业级别的开发账号，公司级别的也可以），Xcode

<!-- more -->

## 证书创建

{% asset_img image-20200811210411909.png image-20200811210411909 %}

{% asset_img image-20200811210344729.png image-20200811210344729 %}

{% asset_img image-20200811210439870.png image-20200811210439870 %}

下载证书

{% asset_img image-20200811210609849.png image-20200811210609849 %}

双击添加到钥匙串：

{% asset_img image-20200811220051366.png image-20200811220051366 %}

双击它，设置永久信任：

{% asset_img image-20200811220154160.png image-20200811220154160 %}

填写 mac 密码更新后就 OK 啦。

## App ID 创建

{% asset_img image-20200811210734896.png image-20200811210734896 %}

## 添加好你的测试用户 iPhone X 的 uuid

{% asset_img image-20200811210916996.png image-20200811210916996.png %}

## 创建 Ad Hoc 类型的描述文件

{% asset_img image-20200811211011626.png image-20200811211011626 %}

{% asset_img image-20200811211102141.png image-20200811211102141 %}

选择你刚创建的证书：

{% asset_img image-20200811211213717.png image-20200811211213717 %}

勾选想要测试的 iPhone 手机：

{% asset_img image-20200811211324080.png image-20200811211324080 %}

给描述文件起个名字：

{% asset_img image-20200811211832315.png image-20200811211832315 %}

下载到本地：

{% asset_img image-20200811212455059.png image-20200811212455059 %}

## 添加到 Xcode

打开你的 Xcode，双击刚下载的描述文件，啥都没发生就说明 Xcode 添加成功了。

## 打包分发

{% asset_img image-20200811212805179.png image-20200811212805179 %}

点击 `Distribute App` 分发 App：

{% asset_img image-20200811213008715.png image-20200811213008715 %}

选择 Ad hoc 模式：

{% asset_img image-20200811213108027.png image-20200811213108027 %}

下一步，一定要勾选第三项：

{% asset_img image-20200811213236309.png image-20200811213236309 %}

下面重点来了：

{% asset_img image-20200811213531074.png image-20200811213531074 %}

上面四项分别为：

- 你要打包项目所起的 App 名称
- ipa 包下载地址（必须为 https）
- 在线图片地址 57\*57（必须为 https）
- 在线图片地址 512\*512（必须为 https）

下面选择手动设置签名：

{% asset_img image-20200811214652617.png image-20200811214652617 %}

选择刚生成的证书和描述文件：

{% asset_img image-20200811223021884.png image-20200811223021884 %}

然后点击下一步坐等：

{% asset_img image-20200811223138624.png image-20200811223138624 %}

最后需要输一次电脑开机密码，然后导出：

{% asset_img image-20200811224413574.png image-20200811224413574 %}

导出文件有这些：

然后把 `manifest.plist` `xxx.ipa` 包以及两张 app 的 png 图片上传到服务器就好了：

{% asset_img image-20200811225217241.png image-20200811225217241 %}

最后在 iPhone 的 Safari 上输入下面的模板链接就能下载到测试手机上了：

```js
itms-services://?action=download-manifest&url=你的服务器https地址/manifest.plist
```

## 可能遇到的问题

如果你访问上面地址，在确认地址无误的情况下 Safari 并没有下载，原因可能是服务器没有开启针对 `.plist` 和 `.ipa` 文件的访问识别。

如何判断为此种情况了？以 IIS 为例：

直接在浏览器输入你的 ipa 下载地址 `https:XXX/yyt_test.ipa`

出现下面类似截图：

{% asset_img image-20200811225556225.png image-20200811225556225 %}

就说明此文件类型没有配置 MIME 类型。我们去 IIS 管理器配置下就 OK 了：

{% asset_img image-20200811225748687.png image-20200811225748687 %}

选择添加

{% asset_img image-20200811225812700.png image-20200811225812700 %}

添加 .ipa 文件的 MIME：

文件扩展名：**.ipa**

MIME 类型：**application/octet-stream.ipa**

{% asset_img image-20200811225931403.png image-20200811225931403 %}

添加 .plist 文件的 MIME:

文件扩展名：**.plist**

MIME 类型：**text/xml**

{% asset_img image-20200811230001211.png image-20200811230001211 %}

添加完毕后再次访问，应该就 OK 了。

## 参考来源

[使用 XCODE 快速发布 IOS ad hoc 测试版本](https://segmentfault.com/a/1190000020617042)

[IIS - 解决 IPA 下载报错（应用程序“DEFAULT WEB SITE”中的服务器错误）](https://www.hangge.com/blog/cache/detail_1257.html)
