---
title: uniapp百度埋点
tags:
  - uniapp
categories:
  - 前端
  - 框架
  - uniapp
abbrlink: 35078
date: 2020-06-21 21:16:07
---

## 模板中添加百度统计脚本

> template.h5.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <title><%= htmlWebpackPlugin.options.title %></title>
    ...
  </head>
  <body>
    ...
    <div id="app"></div>
    <!-- built files will be auto injected -->
    <script>
      var _hmt = _hmt || [];
      (function () {
        var hm = document.createElement('script');
        hm.src = 'https://hm.baidu.com/hm.js?6e499418495097fcf7a57608d3613872';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(hm, s);
      })();

      // 控制上传的条件 https://tongji.baidu.com/web/help/article?id=324&type=0
      _hmt.push([
        '_requirePlugin',
        'UrlChangeTracker',
        {
          shouldTrackUrlChange: function (newPath, oldPath) {
            return false;
          }
        }
      ]);
    </script>
  </body>
</html>
```

上面的代码基本上就可以实现详情页的统计了。但是 vue 这种单页面应用是不支持刷新的，所以具体的统计还要在路由设置了进行设置，下面这段代码加在路由设置的主文件里。具体代如下：

<!-- more -->

## 在你的 utils.js 中添加通用方法

```js
// 获取当前界面和完整参数
function getCurrentPageUrl() {
  let pages = getCurrentPages(); // 获取加载的页面
  let currentPage = pages[pages.length - 1]; // 获取当前页面的对象
  let url = currentPage.route; // 当前页面url
  return url;
}

// 获取当前页带参数的url
function getCurrentPageUrlAndArgs() {
  let pages = getCurrentPages(); //获取加载的页面
  let currentPage = pages[pages.length - 1]; //获取当前页面的对象
  let url = currentPage.route; //当前页面url
  let options = currentPage.options || currentPage.$route.query; //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  let urlWithArgs = url + '?';

  for (let key in options) {
    let value = options[key];
    urlWithArgs += key + '=' + value + '&';
  }

  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
  return urlWithArgs;
}

/**
 * @description: 记录百度事件 https://tongji.baidu.com/web/help/article?id=236&type=0
 * @param {eventName} 事件名称 比如打电话 关单
 * @param {eventRemark} 事件备注  比如 首页底部打电话按钮触发
 * @example this.$util.baiduEvent('客户搜索','首页顶部客户搜索');
 */
function baiduEvent(eventName, eventRemark = '') {
  let pageUrl = getCurrentPageUrl();
  let userInfo = getApp().globalData.userInfo;
  if (userInfo) {
    let remark = {
      eventRemark: eventRemark,
      marketerId: userInfo.marketerId,
      userName: userInfo.userName,
      storeId: userInfo.currentStoreId,
      storeName: userInfo.currentStoreName
    };
    _hmt.push([
      '_trackEvent',
      remark.storeName,
      remark.userName,
      eventRemark,
      JSON.stringify(remark)
    ]);
  }
}

/**
 * @description: 用于发送某个指定URL的PV统计请求  https://tongji.baidu.com/web/help/article?id=235&type=0
 * @param {pageUrl} 页面的URl
 * @example this.$util.baiduPageView();
 */
function baiduPageView(pageUrl) {
  let userInfo = getApp().globalData.userInfo;
  if (userInfo) {
    // 加上storeId
    pageUrl = `${pageUrl}?storeId=${userInfo.currentStoreId}`;
    _hmt.push(['_setAutoPageview', false]);
    _hmt.push(['_trackPageview', pageUrl]);
  }
}
```

## 页面中使用

### 页面统计

```js
// 全局路由后置守卫
router.afterEach((to, from) => {
  // 控制页面加入百度统计 统计的需要关联当前门店的ID
  if (to.meta && to.meta.isBaiduCount) {
    Vue.prototype.$util.baiduPageView(to.path);
  }
});
```

### 事件统计

```js
// 去搜索页
gotoSearch() {
   this.$util.baiduEvent('客户搜索','首页顶部客户搜索');
   uni.navigateTo({
      url: `/pages/common/searchRecord/searchRecord`
   });
},
```
