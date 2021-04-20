---
title: WebStorm使用技巧
tags:
  - webstorm
  - 技巧
categories:
  - 工具
  - IDE
abbrlink: 33238
date: 2021-04-13 14:56:54
---

## JSON 文件编写注释报警告

错误警告：JSON standard does not allow comments. Use JSMin or similar tool to remove comments before parsing.

### 解决方案

文章：[WebStorm 2018.2 Early Access Preview: React code snippets, actions on Touch Bar, improvements in JSON support](https://blog.jetbrains.com/webstorm/2018/05/webstorm-2018-2-eap/)

> WebStorm 2018.2 now supports the JSON5 standard. By default, you can use the new syntax only in files with the .json5 extension, but you can extend it to all .json files. To do this, open Preferences | Editor | File types, find JSON5 in the list and add \*.json to the registered pattern for it.
