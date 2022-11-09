---
title: SemVer规范
tags:
  - SemVer
categories:
  - 前端
  - 规范
abbrlink: 43605
date: 2022-09-20 14:42:11
---

`npm` 包中的模块版本都需要遵循 `SemVer` 规范——由 `Github` 起草的一个具有指导意义的，统一的版本号表示规则。实际上就是 Semantic Version（语义化版本）的缩写。

> SemVer规范官网：https://semver.org/

<!-- more -->

## 标准版本

`SemVer` 规范的标准版本号采用 `X.Y.Z` 的格式，其中 X、Y 和 Z 为非负的整数，且禁止在数字前方补零。X 是主版本号、Y 是次版本号、而 Z 为修订号。每个元素必须以数值来递增。

- 主版本号(major)：当你做了不兼容的API 修改
- 次版本号(minor)：当你做了向下兼容的功能性新增
- 修订号(patch)：当你做了向下兼容的问题修正。

例如：`1.9.1` -> `1.10.0` -> `1.11.0`


## 先行版本

当某个版本改动比较大、并非稳定而且可能无法满足预期的兼容性需求时，你可能要先发布一个先行版本。

先行版本号可以加到“主版本号.次版本号.修订号”的后面，先加上一个连接号再加上一连串以句点分隔的标识符和版本编译信息。

- 内部版本(alpha):
- 公测版本(beta):
- 正式版本的候选版本rc: 即 Release candiate

查看依赖的历史版本命令：

```shell
# 比如查看react的历史版本
npm view react versions
```

## 发布版本

在修改 `npm` 包某些功能后通常需要发布一个新的版本，我们通常的做法是直接去修改 `package.json` 到指定版本。如果操作失误，很容易造成版本号混乱，我们可以借助符合 Semver 规范的命令来完成这一操作：

- npm version patch : 升级修订版本号
- npm version minor : 升级次版本号
- npm version major : 升级主版本号