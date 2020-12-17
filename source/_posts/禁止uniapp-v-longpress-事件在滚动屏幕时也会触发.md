---
title: 禁止uniapp"v-longpress"事件在滚动屏幕时也会触发
tags:
  - uniapp
categories:
  - 前端
  - 框架
  - uniapp
abbrlink: 27545
date: 2020-07-20 19:42:31
---

{% asset_img lock-table.png 锁台 %}

选中某个桌台滑动屏幕也会触发解锁弹窗。

### 解决方案

监听 `@touchstart` 和 `@touchmove` 事件

在 `@touchstart` 触发时保存当前选中的桌台，`@touchmove` 触发时移除 `@touchstart` 中保存的桌台，最后在 `v-longpress` 事件触发时，判断桌台是否存在，存在则弹出 modal，否则忽略。
