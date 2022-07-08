---
title: iOS的App语言设置为中文
tags:
  - iOS
categories:
  - 移动端
  - iOS
abbrlink: 64032
date: 2020-08-05 22:47:14
---

偶尔发现 App 的拍照弹窗显示的是英文：

{% asset_img language.jpeg 拍照为英文 %}

<!-- more -->

但我在 AppStore 上架的时候明明设置的语言是中文啊。后来网上查询后发现，还需要在项目的 plist 中添加 `Localization native development region` 为 `China` ：

{% asset_img plist.png plist设置 %}

效果：

{% asset_img plist-china.png 效果 %}
