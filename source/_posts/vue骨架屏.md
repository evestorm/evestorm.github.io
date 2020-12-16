---
title: vue骨架屏
tags:
  - Vue
  - 用户体验
  - 骨架屏
categories:
  - 前端
  - CSS
abbrlink: 7260
date: 2019-08-03 22:06:56
---

## 什么是骨架屏

骨架屏就是在页面尚未加载之前先给用户展示出页面的大致结构，直到页面请求数据后渲染页面。
骨架屏和 loading 相比较还是骨架屏用户体验感更好。
原理其实非常简单，就是在页面还没加载完成时展示一张图片（一般是 Base64 编码），类似下方效果：

{% asset_img skeleton-1.png 骨架屏效果 %}

<!-- more -->

## 安装骨架屏插件

```shell
npm install vue-skeleton-webpack-plugin
```

## Skeleton 组件

在 `src/components` 下新建 `Skeleton.vue` 组件：

```html
<template>
  <div class="skeleton">
    <!-- 我是首页骨架屏图片 -->
    <div class="home-skeleton">
      <img src="../assets/skeleton.jpg" alt="skeleton" />
    </div>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="css" scoped>
  .home-skeleton {
    width: 100%;
  }
</style>
```

## 导出 js

根目录下新建 `skeleton.js` 文件用来导出骨架组件

```js
import Vue from 'vue';
import Skeleton from './components/Skeleton.vue';

export default new Vue({
  components: {
    Skeleton
  },
  template: `<Skeleton></Skeleton>`
});
```

## 单页骨架屏

在根目录下新建 `vue.config.js` 配置骨架屏插件：

```js
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');
const path = require('path');

module.exports = {
  configureWebpack: {
    plugins: [
      new SkeletonWebpackPlugin({
        webpackConfig: {
          entry: {
            app: path.resolve(__dirname, 'src/skeleton.js')
          }
        }
      })
    ]
  }
};
```

搞定 OK~

## 多页骨架屏

假如现在我们希望首页加载时出现骨架屏（上面单页的例子），还要在切换到 about 页面后也有个骨架屏。就需要再新建一个 `Skeleton` 组件了。

在 `src/components/` 下新建 `SkeletonAbout.vue` 组件：

```html
<template>
  <div class="skeleton-wrapper">
    <header class="skeleton-header"></header>
    <section class="skeleton-block">
      <img
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTA4MCAyNjEiPjxkZWZzPjxwYXRoIGlkPSJiIiBkPSJNMCAwaDEwODB2MjYwSDB6Ii8+PGZpbHRlciBpZD0iYSIgd2lkdGg9IjIwMCUiIGhlaWdodD0iMjAwJSIgeD0iLTUwJSIgeT0iLTUwJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48ZmVPZmZzZXQgZHk9Ii0xIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+PGZlQ29sb3JNYXRyaXggaW49InNoYWRvd09mZnNldE91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAuOTMzMzMzMzMzIDAgMCAwIDAgMC45MzMzMzMzMzMgMCAwIDAgMCAwLjkzMzMzMzMzMyAwIDAgMCAxIDAiLz48L2ZpbHRlcj48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEpIj48dXNlIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNhKSIgeGxpbms6aHJlZj0iI2IiLz48dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNiIi8+PHBhdGggZmlsbD0iI0Y2RjZGNiIgZD0iTTIzMCA0NGg1MzN2NDZIMjMweiIvPjxyZWN0IHdpZHRoPSIxNzIiIGhlaWdodD0iMTcyIiB4PSIzMCIgeT0iNDQiIGZpbGw9IiNGNkY2RjYiIHJ4PSI0Ii8+PHBhdGggZmlsbD0iI0Y2RjZGNiIgZD0iTTIzMCAxMThoMzY5djMwSDIzMHpNMjMwIDE4MmgzMjN2MzBIMjMwek04MTIgMTE1aDIzOHYzOUg4MTJ6TTgwOCAxODRoMjQydjMwSDgwOHpNOTE3IDQ4aDEzM3YzN0g5MTd6Ii8+PC9nPjwvc3ZnPg=="
      />
      <img
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTA4MCAyNjEiPjxkZWZzPjxwYXRoIGlkPSJiIiBkPSJNMCAwaDEwODB2MjYwSDB6Ii8+PGZpbHRlciBpZD0iYSIgd2lkdGg9IjIwMCUiIGhlaWdodD0iMjAwJSIgeD0iLTUwJSIgeT0iLTUwJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48ZmVPZmZzZXQgZHk9Ii0xIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+PGZlQ29sb3JNYXRyaXggaW49InNoYWRvd09mZnNldE91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAuOTMzMzMzMzMzIDAgMCAwIDAgMC45MzMzMzMzMzMgMCAwIDAgMCAwLjkzMzMzMzMzMyAwIDAgMCAxIDAiLz48L2ZpbHRlcj48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEpIj48dXNlIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNhKSIgeGxpbms6aHJlZj0iI2IiLz48dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNiIi8+PHBhdGggZmlsbD0iI0Y2RjZGNiIgZD0iTTIzMCA0NGg1MzN2NDZIMjMweiIvPjxyZWN0IHdpZHRoPSIxNzIiIGhlaWdodD0iMTcyIiB4PSIzMCIgeT0iNDQiIGZpbGw9IiNGNkY2RjYiIHJ4PSI0Ii8+PHBhdGggZmlsbD0iI0Y2RjZGNiIgZD0iTTIzMCAxMThoMzY5djMwSDIzMHpNMjMwIDE4MmgzMjN2MzBIMjMwek04MTIgMTE1aDIzOHYzOUg4MTJ6TTgwOCAxODRoMjQydjMwSDgwOHpNOTE3IDQ4aDEzM3YzN0g5MTd6Ii8+PC9nPjwvc3ZnPg=="
      />
    </section>
  </div>
</template>

<script>
  export default {};
</script>

<style lang="css" scoped>
  .skeleton-header {
    height: 40px;
    background: #1976d2;
    padding: 0;
    margin: 0;
    width: 100%;
  }
  .skeleton-block {
    display: flex;
    flex-direction: column;
    padding-top: 8px;
  }
</style>
```

然后回到 `src/skeleton.js` 中进行改造：

```js
import Vue from 'vue';
import Skeleton from './components/Skeleton.vue';
import SkeletonAbout from './components/SkeletonAbout.vue';

export default new Vue({
  components: {
    Skeleton,
    SkeletonAbout
  },
  // 默认都隐藏，通过在 vue.config.js 中的插件配置中根据id进行判断
  template: `<div>
      <Skeleton style="display: none;" id="skeleton-home"></Skeleton>
      <SkeletonAbout style="display: none;" id = "skeleton-about"></SkeletonAbout>
    </div>
    `
});
```

修改 `vue.config.js` 中骨架屏配置：

```js
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');
const path = require('path');

module.exports = {
  configureWebpack: {
    // 给webpack新增配置
    plugins: [
      new SkeletonWebpackPlugin({
        webpackConfig: {
          entry: {
            app: path.resolve(__dirname, 'src/skeleton.js')
          }
        },
        router: {
          mode: 'history',
          routes: [
            {
              path: '/',
              skeletonId: 'skeleton-home'
            },
            {
              path: '/about',
              skeletonId: 'skeleton-about'
            }
          ]
        }
      })
    ]
  }
};
```

现在刷新首页，就会先显示首页骨架屏，切换到 about 页面刷新，会首先显示 about 页面的骨架屏。

## 骨架屏插件原理

骨架屏插件的原理也非常简单，我们只要在 webpack 的 `html-webpack-plugin` 插件处理 html 之前对 app 根节点下的内容进行替换就 OK 了，下面是一个简化版插件写法：

> vue.config.js

```js
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');
const path = require('path');

// 骨架屏插件原理
class MyPlugin {
  apply(compiler) {
    // compiler 表示当前整个webpack对象
    compiler.plugin('compilation', compilation => {
      // compilation 表示当前这次webpack打包的对象（也就是说多次打包会产生多个）
      compilation.plugin(
        // 当前webpack插件在html处理之前，把html替换
        'html-webpack-plugin-before-html-processing',
        data => {
          data.html = data.html.replace(
            `<div id="app"></div>`,
            `
              <div id="app">
                  <div id="home" style="display:none">首页骨架屏</div>
                  <div id="about" style="display:none">about页骨架屏</div>
              </div>
              <script>
                  if(window.hash == '#/about' ||  location.pathname=='/about'){
                      document.getElementById('about').style.display="block"
                  }else{
                      document.getElementById('home').style.display="block"
                  }
              </script>
          `
          );
          return data;
        }
      );
    });
  }
}

module.exports = {
  configureWebpack: {
    // 给webpack新增配置
    plugins: [
      // 使用自己的插件
      new MyPlugin()
      // new SkeletonWebpackPlugin({
      //   webpackConfig: {
      //     entry: {
      //       app: path.resolve(__dirname, 'src/skeleton.js')
      //     }
      //   },
      //   router: {
      //     mode: 'history',
      //     routes: [{
      //         path: '/',
      //         skeletonId: 'skeleton-home'
      //       },
      //       {
      //         path: '/about',
      //         skeletonId: 'skeleton-about'
      //       },
      //     ]
      //   },
      // })
    ]
  }
};
```
