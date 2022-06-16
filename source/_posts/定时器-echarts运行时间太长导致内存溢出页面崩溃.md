---
title: 定时器+echarts运行时间太长导致内存溢出页面崩溃
tags:
  - 笔记
  - 转载
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 9959
date: 2021-06-06 20:19:56
---

转载自：https://www.cnblogs.com/zdd2017/p/11777822.html


最近做的项目需要在页面上展示echarts图表，且数据每隔10s刷新一次，然后发现时间长了以后chorme浏览器会显示页面崩溃。一开始以为是定时器的原因，试了网上的很多方法，比如把setInterval改成setTimeout，及时清除定时器，设置为null释放内存等，甚至还有在get请求的参数里加上时间戳……发现都没有作用，页面依然崩溃。最后发现是echarts的问题。（内存泄漏可用chorme浏览器的memory排查，具体排查方法可以在网上搜到）

<!-- more -->

通过init方法创建echarts实例，如果不及时清理就会越来越多，占用大量内存，有两种方法可以避免这种情况：一种是在init之前先判断echarts实例是否存在

```js
var chart
if (chart == undefined) {
    chart = echarts.init(document.getElementById(dom));
}
```

另一种方法是在init之前销毁已经存在的echarts实例，可用clear()和dispose()手动清理变量，区别是clear()不会销毁实例，只是重新绘制图形，而dispose()会销毁实例，需要重新构建ECharts对象

```js
var chart
if (chart) {
    echarts.dispose(chart)
    chart = echarts.init(document.getElementById(dom))
}
```

本来以为这样就ok了，过段时间切回来一看又崩溃了，诡异的是停留在当前页面查看内存一直没有涨，切换到其他网页再回来看从一个很高的内存又降到了正常值，相当于你看着它它不涨，不看它的时候一直在涨。。后来才知道chrome浏览器只有打开页面，内存才会释放，那么问题来了，如果我们想长时间查看其他页面，仍在后台运行的echarts页面很可能悄无声息地崩溃了。因此我们需要在切换到其他页面时停止自动刷新，切回来时再开启，那么有没有什么浏览器事件能在切换页面时被触发呢？答案是有的：

浏览器标签页被隐藏或显示的时候会触发visibilitychange事件 (可参考 https://www.jianshu.com/p/e905584f8ed2）

我们可以监听visibilitychange事件，页面隐藏时清除定时任务，页面显示时重新开启定时任务。

```js
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        // 清除定时任务
    } else {
        // 开启定时任务
    }
});
```

这样就不会发生切换到其他页面后echarts页面崩溃的情况了。
