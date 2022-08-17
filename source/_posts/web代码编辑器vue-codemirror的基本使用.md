---
title: web代码编辑器vue-codemirror的基本使用
tags:
  - 代码编辑器
  - codemirror
categories:
  - 前端
  - JS
abbrlink: 29038
date: 2022-08-04 18:16:19
---

## 前景提要

业务中需要展示代码编辑器，每行代码前面要显示行号

<!-- more -->

## 相关库

- [CodeMirror](https://codemirror.net/) 代码编辑器
- [vue-codemirror](https://github.com/surmon-china/vue-codemirror) 基于 codemirror 封装的 vue 组件

## vue-codemirror 基本使用

我用的 4.0.6 版本, npm 地址如下：

https://www.npmjs.com/package/vue-codemirror/v/4.0.6

里边有基本使用方法，这里不赘述

### 使用注意点

记得页面中务必加载样式，类似这样:

```js
import { codemirror } from 'vue-codemirror'
// 下边第一个必须引入 第二个如果要自定主题 也得引入
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/erlang-dark.css'
```

配置中可指定 `erlang-dark` 主题：

```js
option: {
  tabSize: 2,
  mode: 'text/javascript',
  theme: 'erlang-dark',
  ...
}
```

若不加载样式，一定会出现编辑器渲染出来的代码跟预期不符

---

另外我在一个页面使用了多个 code-mirror ，且是用 element-ui 的 tabs 组件切换展示的，但会出现切换时 代码不更新的情况，这个时候可以给 code-mirror 组件上添加类似 `:key="computedKey"` 的属性，在监听 tab 切换时，手动更新 computedKey 值来强制 code-mirror 更新

## 更多资源

- [npm vue-codemirror 4.0.6 版本](https://www.npmjs.com/package/vue-codemirror/v/4.0.6)
- [github surmon-china/vue-codemirror](https://github.com/surmon-china/vue-codemirror)
- [The editor has has a weird behavior](https://github.com/sparksuite/simplemde-markdown-editor/issues/425)
  