---
title: vue-cli3配置多环境打包
tags:
  - vue-cli3
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 38395
date: 2020-05-13 22:01:35
---

由于公司项目需要多环境 —— dev、test、pre、prod，就看了下 vue-cli3 的多环境配置。通过官方 [vue-cli](https://cli.vuejs.org/zh/guide/mode-and-env.html) 文档知晓 vue-cli 提供了三种模式：

- test
- development
- production

而每种 NODE_ENV 下面可以配置多个环境变量。

<!-- more -->

我们可以通过 `.env` 文件增加后缀来设置某个模式下特有的环境变量。

例如我们可以在项目根目录下创建三个 `env` 文件：

```shell
.env.development # 开发
.env.prod # 发布
.env.test # 测试
```

> .env.development 开发环境

```js
NODE_ENV = 'development';
VUE_APP_API_URL = 'http://...';
```

> .env.test 测试环境

```js
NODE_ENV = 'test';
VUE_APP_API_URL = 'http://...';
```

> .env.production 发布环境

```js
NODE_ENV = 'production';
VUE_APP_API_URL = 'http://...';
```

如果需要其他环境，可以创建 `.env.[model]` 文件

例如创建 `.env.mock` 模拟数据环境，则改写 `package.json` 文件：

```json
"script": {
  "dev": "vue-cli-service serve",
  "mock": "vue-cli-service serve --mode mock",
}
```

这里 需要注意的是 `--mode` 后面的参数 需要是 `.env.[model]` 文件 对应的 [mode]

现在 `npm run mock` 就会执行 `vue-cli-service serve --mode mock` 脚本，环境变量 `VUE_APP_API_URL` 就会走 `.env.mock` 中的配置。
