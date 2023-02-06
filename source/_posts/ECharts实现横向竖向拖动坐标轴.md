---
title: ECharts实现横向竖向拖动坐标轴
tags:
  - ECharts
categories:
  - 前端
  - UI
  - ECharts
abbrlink: 63533
date: 2022-12-01 21:27:54
---

文章原链接: [echarts柱状图实现横向拖动展示数据](https://www.cnblogs.com/cherylgi/p/13892776.html)

<!-- more -->

```js
dataZoom: [
    {
        id: 'dataZoomX',
        type: 'slider',
        xAxisIndex: [0],
        filterMode: 'filter'
    },
    {
        id: 'dataZoomY',
        type: 'slider',
        yAxisIndex: [0],
        filterMode: 'empty'
    }
],
```

官方说明dataZoom 组件就是用于区域缩放，可以关注细节的数据信息，或者概览数据整体

dataZoom 现有三种类型：[内置型](https://www.echartsjs.com/zh/option.html#dataZoom-inside)，[滑动条型](https://www.echartsjs.com/zh/option.html#dataZoom-slider)，[框选型](https://www.echartsjs.com/zh/option.html#toolbox.feature.dataZoom)。上图的效果选用的是滑动条型

```js
dataZoom: [
    //1.横向使用滚动条
    {
        type: 'slider',//有单独的滑动条，用户在滑动条上进行缩放或漫游。inside是直接可以是在内部拖动显示
        show: true,//是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
        start: 0,//数据窗口范围的起始百分比0-100
        end: 50,//数据窗口范围的结束百分比0-100
        xAxisIndex: [0],// 此处表示控制第一个xAxis，设置 dataZoom-slider 组件控制的 x轴 可是已数组[0,2]表示控制第一，三个；xAxisIndex: 2 ，表示控制第二个。yAxisIndex属性同理
        bottom: -10 //距离底部的距离
    },
    //2.在内部可以横向拖动
    {
        type: 'inside',// 内置于坐标系中
        start: 0,
        end: 30,
        xAxisIndex: [0]
    },
    //3.纵向使用滚动条
    {
        type: 'slider',
        show: true,
        yAxisIndex: [0],//设置组件控制的y轴
        left: '93%',//距离左侧的距离 可以使百分比，也可以是像素 left: '30'（30像素）
        start: 29,
        end: 36
    },
    //4.在内部可以纵向拖动
    {
        type: 'inside',
        yAxisIndex: [0],
        start: 29,
        end: 36
    }
],
```

dataZoom 组件的具体使用可以参考官方文档 <https://echarts.apache.org/zh/option.html#dataZoom>
