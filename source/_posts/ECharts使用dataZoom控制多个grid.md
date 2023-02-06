---
title: ECharts使用dataZoom控制多个grid
tags:
  - ECharts
categories:
  - 前端
  - UI
  - ECharts
abbrlink: 44529
date: 2022-12-01 15:40:44
---

项目中有个横柱图，需要用一个 dataZoom 去控制多轴数据范围，根据 [官方文档](https://echarts.apache.org/zh/option.html#dataZoom-slider.yAxisIndex) 查询到解决方案，在此记录下。

<!-- more -->

```js
const option = [
  xAxis: [
    {...},
    {..., gridIndex: 1 }
  ],
  yAxis: [
    {...},
    {..., gridIndex: 1 }
  ],
  grid: [
    {...},
    {...}
  ],
  dataZoom: {
    ...,
    yAxisIndex: [0, 1], // 如果只有一条数据时柱体没有垂直居中时，记得吧所有y轴gridIndex索引都放进此数组中
  },
  series: [
    {...},
    {...},
    {..., xAxisIndex: 1, yAxisIndex: 1 }
  ]
]
```

{% asset_img dataZoom.png 100% %}
