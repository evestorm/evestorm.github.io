---
title: 解决vue中v-html元素中标签样式
tags:
  - Vue
  - 技巧
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 42396
date: 2021-09-13 11:15:33
---

## 问题

需要把富文本编辑器中的 html 展示到前台：

<!-- more -->

```html
<div class="text-container container">
  <div class="section">
    <div class="title">Abstract</div>
    <div class="content" v-html="info.abstractContent"></div>
  </div>
  <div class="section">
    <div class="title">References</div>
    <div class="content" v-html="info.literature || 'empty'"></div>
  </div>
</div>
```

然而通过下面方式无法修改 a 标签样式:

```scss
.text-container {
  .section {
    .content {
      a {
        color: #1890ff !important;
      }
    }
  }
}
```

## 解决方案

网上搜了下有下面两种方案：

### ::v-deep

```scss
.text-container {
  .section {
    .content {
      ::v-deep a {
        color: #1890ff !important;
      }
    }
  }
}
```

但这种方式对我无效

### 新增一个不带 scoped 的 style 标签

```vue
// 之前的样式
<style lang="scss" scoped>
/*...*/
</style>

// 新增不带 scoped 的样式
<style lang="scss">
.text-container {
  .section {
    .content {
      a {
        color: #1890ff !important;
      }
    }
  }
}
</style>
```
