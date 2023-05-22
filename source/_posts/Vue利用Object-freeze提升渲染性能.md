---
title: Vue利用Object.freeze提升渲染性能
tags:
  - 技巧
  - 性能优化
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 8360
date: 2023-05-22 13:49:31
---

## 起因

后端表示实际生产环境下某个大屏页面经常 CPU 处于满负荷状态，页面呆太久还容易出现卡顿，需要排查下什么原因并解决。

<!-- more -->

## 排查问题

首先第一步使用到了 chrome dev tools 下的 [「Performance Monitor（性能监视器）」](https://hospodarets.com/chrome-devtools-performance-monitor) ，发现刚加载 CPU 就会直接拉满到100%，怀疑是 ws 数据推送的原因。然后查看代码，发现页面 mounted 时发送了 4 条 ws 请求。都是 10s 被动接受一次数据更新。

然后使用到了 chrome dev tools 的 [「Performance 性能」](https://developer.chrome.com/docs/devtools/performance/)。记录了60s的数据，发现其中一个 ws 推送消息后占用时间最大，通过代码调试后发现是因为该 ws 每次推送了一个对象，该对象包含 n 个数组，每个数组都有 6000 多条数据。下载本地后发现每次推送的数据量高达 4MB 。

又由于该数据最终还得经过处理后变成 ECharts 需要的数据格式，所以前端接收到数据后，还得经过几次遍历才能转成期望格式。大几万的数据可想而知又是一次性能损耗。

## 性能优化

1. 根儿上解决问题，把一次性推 4MB 数据的接口降低到每组数据300条左右，毕竟 ECharts 走势图只需要显示精确到小时的数据，并不需要精确到秒级的数据量。
2. 把图表对象 chart 和 options 对象从 data 中挪出来放在外边，避免响应式 getter/setter 劫持 ECharts 数据。
3. 把不好挪到 data 外的展示类的数据，添加上 `Object.freeze()` 冻结，也是为了避免 vue 劫持数据。
4. 再利用 [ECharts series-line.sampling](https://echarts.apache.org/zh/option.html#series-line.sampling) 优化了大数据量时 ECharts 的降采样策略。

## 效果

经过以上几点优化，CPU 降低到了峰值40%左右，现场交付人员表示很赞。

## 更多

- [优化ECharts+定时器定时刷新数据导致的内存溢出问题](https://evestorm.github.io/posts/55651)
- [定时器+echarts运行时间太长导致内存溢出页面崩溃](https://evestorm.github.io/posts/9959)
- [Vue的属性，为什么无法冻结？](https://blog.csdn.net/bbblllsss/article/details/125932276)
- [Vue利用Object.freeze提升渲染性能](https://www.cnblogs.com/goloving/p/13969685.html)
- [一文带你了解如何排查内存泄漏导致的页面卡顿现象](https://juejin.cn/post/6947841638118998029)
- [ECharts series-line.sampling](https://echarts.apache.org/zh/option.html#series-line.sampling)
