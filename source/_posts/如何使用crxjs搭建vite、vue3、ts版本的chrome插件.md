---
title: 如何使用 CRXJS 搭建vite+vue3+ts版本的chrome插件
tags:
  - Chrome插件
categories:
  - 前端
  - Chrome插件
abbrlink: 15570
date: 2023-02-13 14:49:13
---

## 介绍

这次是利用架子搭箭chrome插件，提高开发效率。这次使用到的插件是 [crxjs](https://crxjs.dev/vite-plugin/)，它能够快速、便利的帮我们搭好一个开发 chrome 插件的初始化项目。

<!-- more -->

## 安装 CRXJS

目前官网还是 vite3 的 beta 版本，建议后续根据[官网](https://crxjs.dev/vite-plugin/getting-started/vue/create-project) 教程安装，这里仅做记录。

```shell
npm init vite@latest
# select Vue and TS
npm i @crxjs/vite-plugin@beta -D
```

### 修改 viteConfig

> vite.config.ts

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
// @ts-ignore
import manifest from './manifest.json' assert { type: 'json' }; // Node >=17

export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest }),
  ],
});
```

## 添加 manifest.json

```json
{
  "manifest_version": 3,
  "name": "notion faster",
  "version": "1.0.0",
  "action": { "default_popup": "index.html" }
}
```

## 安装 Tailwind CSS UI组件库

p.s. 也推荐按照官网提示安装：<https://tailwindcss.com/docs/guides/vite#vue>

```shell
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 改变 tailwind.config.cjs

```ts
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 给 style 添加 tailwind 基础样式资源

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 静态文件位置

资源文件都放进 web_accessible_resources 中，在 js 中直接 import 导入即可。
