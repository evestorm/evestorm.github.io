---
title: ECharts图例的显示与隐藏
tags:
  - ECharts
categories:
  - 前端
  - UI
  - ECharts
abbrlink: 20315
date: 2022-12-01 21:20:59
---

## 需求

在图表加载的时候，默认只显示部分图例，只要图例显示部分，对应的柱状图图或者折线图也只显示对应的。点击一个按钮显示剩余的图例，或者点击置灰的图例让恢复显示。

<!-- more -->

## 核心

在legend里面的字段加个selected，然后设置不需要显示的数据标题：
以[官方案例](https://echarts.apache.org/examples/zh/editor.html?c=line-stack)为例：

```js
selected: {'邮件营销': false, '联盟广告': false}
```

使用按钮切换可以动态改变selected里面对象的键值即可：

```js
this.options.legend.selected = {'邮件营销': false, '联盟广告': false};
```

```js
legend: {
    data: ["昨日总人数", "今日实时人数", "昨日使用率"],
    top: "4%",
    textStyle: {
        color: "#1FC3CE",
        fontSize: 14
    },
    selected: {'昨日使用率': false} // 不需要显示的设置为false
},
```
