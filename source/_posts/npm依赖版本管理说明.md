---
title: npm依赖版本管理说明
tags:
  - npm
categories:
  - 前端
  - 规范
abbrlink: 47554
date: 2022-09-20 14:47:43
---

我们经常看到，在 package.json 中各种依赖的不同写法：

```shell
"dependencies": {
  "signale": "1.4.0",
  "figlet": "*",
  "react": "16.x",
  "table": "~5.4.6",
  "yargs": "^14.0.0"
}
```

前面三个很容易理解：

<!-- more -->

- `"signale": "1.4.0"`: 固定版本号
- `"figlet": "*"`: 任意版本（>=0.0.0）
- `"react": "16.x"`: 匹配主要版本（>=16.0.0 <17.0.0）
- `"react": "16.3.x"`: 匹配主要版本和次要版本（>=16.3.0 <16.4.0）

## `~` 和 `^` 的区别

再来看看后面两个，版本号中引用了 `~` 和 `^` 符号：

- `~`: 当安装依赖时获取到有新版本时，安装到 `x.y.z` 中 `z` 的最新的版本。即保持主版本号、次版本号不变的情况下，保持修订号的最新版本。

- `^`: 当安装依赖时获取到有新版本时，安装到 `x.y.z` 中 `y` 和 `z` 都为最新版本。即保持主版本号不变的情况下，保持次版本号、修订版本号为最新版本。

在 `package.json` 文件中最常见的应该是 `"yargs": "^14.0.0"` 这种格式的 依赖, 因为我们在使用 `npm install package` 安装包时，npm 默认安装当前最新版本，然后在所安装的版本号前加 ^号。

注意，当主版本号为 `0` 的情况，会被认为是一个不稳定版本，情况与上面不同：

主版本号和次版本号都为 `0`: `^0.0.z`、`~0.0.z` 都被当作固定版本，安装依赖时均不会发生变化。

主版本号为 `0`: `^0.y.z` 表现和 `~0.y.z` 相同，只保持修订号为最新版本。

## 定期更新依赖

使用 `npm outdated` 可以帮助我们列出有哪些还没有升级到最新版本的依赖：

- 黄色表示不符合我们指定的语意化版本范围 - 不需要升级
- 红色表示符合指定的语意化版本范围 - 需要升级

执行 `npm update` 会升级所有的红色依赖。
