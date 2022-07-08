---
title: uniapp路由拦截配置
tags:
  - uniapp
categories:
  - 前端
  - 框架
  - uniapp
abbrlink: 30988
date: 2020-06-21 21:22:13
---

项目的百度埋点需要做路由拦截，找了个路由插件 `uni-simple-router` 。下面是按照和基本使用步骤：

<!-- more -->

## 安装 uni-simple-router 插件

1. 如果是用 hbuilderX 创建的项目，就在插件库中找。

2. 如果是用 cli 创建的项目就如下操作：

   ```shell
   npm install uni-simple-router uni-read-pages
   ```

## App 下 main.js 中引用

```js
import Router, { RouterMount } from 'uni-simple-router';

//---------------------------处理路由配置-------------------------------
// 参考 http://hhyang.cn/src/router/api/routerInsatll.html#router-%E6%9E%84%E5%BB%BA%E9%80%89%E9%A1%B9
Vue.use(Router);
const router = new Router({
  routes: ROUTES, //路由表
  h5: {
    loading: false
  },
  routerBeforeEach(e) {},
  routerAfterEach(e) {}
});

// 全局路由前置守卫
router.beforeEach((to, from, next) => {
  next();
});

// 全局路由后置守卫
router.afterEach((to, from) => {
  // 控制页面加入百度统计 统计的需要关联当前门店的ID
  if (to.meta && to.meta.isBaiduCount) {
    Vue.prototype.$util.baiduPageView(to.path);
  }
});

const app = new Vue({
  store,
  ...App
});

// #ifdef H5
RouterMount(app, '#app');
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
```

## 配置 vue.config.js

```js
const TransformPages = require('uni-read-pages');
const tfPages = new TransformPages({
  includes: ['path', 'style', 'meta']
});
module.exports = {
  productionSourceMap: false, // 生产打包时不输出map文件，增加打包速度
  configureWebpack: config => {
    return {
      plugins: [
        new tfPages.webpack.DefinePlugin({
          ROUTES: JSON.stringify(tfPages.routes)
        })
      ]
    };
  }
};
```

## 对应 pages.json 添加 meta

```json
{
   "pages": [{
         "path": "pages/homePage/homePage",
         "style": {
            "navigationBarTitleText": "首页",
            "navigationStyle": "custom"
         },
         "meta": {
            "isBaiduCount": true
         }
      },
      ...
   ],
}
```

### 参考

- [uni-simple-router](http://www.hhyang.cn/)
- [uniapp H5 登录拦截—–uni-simple-router](https://blog.csdn.net/rookieWeb/article/details/106197046)
- [自动构建路由表](http://www.hhyang.cn/src/router/tutorial/rgRoutes.html#pages-json-中配置-routes)
- [uni-app 配置路由](https://www.jianshu.com/p/a37139ab5306)
