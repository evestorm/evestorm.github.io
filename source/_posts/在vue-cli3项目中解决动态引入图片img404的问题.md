---
title: 在vue-cli3项目中解决动态引入图片img404的问题
abbrlink: 39457
date: 2020-12-17 23:05:27
tags:
categories:
---

## 需求

最新需要在项目中动态显示侧边栏菜单的图标。

## 问题

按照一般的开发模式，静态图片路径是相对路径还是绝对路径都可以，因为图片路径是静态的是死的，所以 webpack 去找这个图片路径的时候是能找到的。

但是我的这个路径是动态的，我在 `computed` 给出一个拼接了变量的路径，项目启动在浏览器下死活出不了这个图片，死活都是 404。

```js
computed: {
  fullURL() {
    return `../assets/icc-icon/${this.customIcon}.png`;
  }
}
```

上述这样的路径是不行的，一直是 404，原因也讲了点，vue-cli3 中内置的 webpack 会把图片当做一个模块引用，然后打包等等，路径就不对了，我们的静态资源是不需要打包等等的，。

静态资源是直接被 webpack copy 到对应的静态资源文件夹下，所以根本原因就在于，用了动态路径的图片，webpack 将它认作为一个模块打包了，路径错乱，所以 404。

找到了原因就很简单了，解决这个动态路径图片 404 的方案其实 vue-cli3 官网就有写过：[vue-cli3 的官方解决方案](https://cli.vuejs.org/zh/guide/html-and-static-assets.html#%E5%A4%84%E7%90%86%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90)

## 解决方案

> Sidebar.vue

```js
export default {
  data() {
    return {
      customIcon: '',
      baseUrl: process.env.BASE_URL // 项目根目录路径前缀
    };
  }
};
```

把你所用的动态图片 img 放到 public 目录下:

```shell
.
├── favicon.ico
├── index.html
└── sidebar-icon
    ├── hc-control.png
    ├── hc-list.png
    ├── home.png
    ├── material.png
    ├── package.png
    ├── repo.png
    ├── secure.png
    ├── sys-arg.png
    └── sys-manage.png
```

修改你的动态路径图片地址:

```js
computed: {
  fullURL() {
    return `${this.baseUrl}sidebar-icon/${this.customIcon}.png`;
  }
}

<img :src="fullURL" />
```
