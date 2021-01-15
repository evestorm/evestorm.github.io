---
title: 更改element-ui分页组件的文字部分
tags:
  - element-ui
  - Vue
categories:
  - 前端
  - UI
  - element-ui
abbrlink: 19569
date: 2021-01-12 16:28:54
---

## 问题描述

UI 设计稿中，分页部分的文字和 element-ui 中的有点偏差。

> element-ui

{% asset_img page.png page %}

> 设计稿

{% asset_img page-ui.png page-ui %}

现在想要把「前往」改成「前往第」。然而 element-ui 文档中并没有给出跳转页面文字部分的配置。

<!-- more -->

## 解决方案

在 github 上搜了下相关 issue 后找到了一种方案：使用 element-ui 提供的国际化部分进行文字替换。地址为：https://github.com/ElemeFE/element/issues/16030

具体在 Vue 项目中如何做呢？

### 在 assets 文件夹中新增 `/locale/cn.js` 文件。

> locale/cn.js

```js
export default {
  el: {
    pagination: {
      goto: '前往第',
      pagesize: '条/页',
      total: `共 {total} 条`,
      pageClassifier: '页'
    }
  }
};
```

{% asset_img cn.png cn %}

### main.js 中配置国际化

> main.js

```js
...
import Element from 'element-ui';
import './styles/element-variables.scss'; // 覆盖一些element-ui样式风格
import locale from './assets/locale/cn';

// 引入 ECharts
import echarts from 'echarts';

Vue.use(Element, {
  locale
});

...
```

### 遇到的问题

上述步骤做完后确实能改分页组件的文字部分了，但发现了个新问题。el-table 组件在没有数据时，「暂无数据」这样的默认提示文字消失了。

所以我们还需要把 el-table 这部分缺失文字覆盖补全：

> locale/cn.js

```js
export default {
  el: {
    table: {
      emptyText: '暂无数据',
      confirmFilter: '筛选',
      resetFilter: '重置',
      clearFilter: '全部',
      sumText: '合计'
    },
    pagination: {
      goto: '前往第',
      pagesize: '条/页',
      total: `共 {total} 条`,
      pageClassifier: '页'
    }
  }
};
```

> main.js

```js
...
import Element from 'element-ui';
import './styles/element-variables.scss'; // 覆盖一些element-ui样式风格
import zhLang from 'element-ui/lib/locale/lang/zh-CN'; // 引入官方的中文国际化
import locale from './assets/locale/cn'; // 引入自己的

Vue.use(Element, {
  locale: { ...zhLang, ...locale }, // 使用本地的 locale 去覆盖官方的 zhLang
});
...
```
