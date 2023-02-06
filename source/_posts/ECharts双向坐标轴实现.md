---
title: ECharts双向坐标轴实现
tags:
  - ECharts
categories:
  - 前端
  - UI
  - ECharts
abbrlink: 23353
date: 2022-12-01 15:56:59
---

这里记录下如何用 ECharts 实现双向坐标轴，地址:[双向坐标轴排名](http://chartlib.datains.cn/detail?id=x2rZBP-jbs)

<!-- more -->

代码如下:

```js
option = {
    tooltip: {},
    legend: {},
    xAxis: [
        {
            type: 'value',
            inverse: true,
            splitLine: { show: false },
            axisLabel: { show: false },
        },
        {
            type: 'value',
            inverse: false,
            gridIndex: 1,
            splitLine: { show: false },
            axisLabel: { show: false },
        },
    ],
    yAxis: [
        {
            position: 'right',
            data: ['1号线', '2号线', '3号线', '4号线', '5号线', '14号线', '城郊线'],
            type: 'category',
            axisLabel: { show: true },
            axisLine: { show: true },
            axisTick: { show: false },
            inverse: true,
        },
        {
            type: 'category',
            data: ['1号线', '2号线', '3号线', '4号线', '5号线', '14号线', '城郊线'],
            axisLabel: { color: 'transparent' },
            axisLine: { show: true },
            axisTick: { show: false },
            inverse: true,
            gridIndex: 1,
        },
    ],
    grid: [
        {
            left: 0,
            width: '47%',
            // containLabel: true,
        },
        {
            left: '52%',
            width: '47%',
            // containLabel: true,
        },
    ],
    series: [
        {
            name: '进-预测',
            type: 'bar',
            label: {
                show: true,
                position: 'inside',
            },
            data: [5, 20, 36, 10, 10, 20, 4],
        },
        {
            name: '进-实际',
            type: 'bar',
            label: {
                show: true,
                position: 'inside',
            },
            data: [5, 20, 36, 10, 10, 20, 4],
        },
        {
            yAxisIndex: 1,
            xAxisIndex: 1,
            name: '出-预测',
            type: 'bar',
            label: {
                show: true,
                position: 'inside',
            },
            data: [5, 20, 36, 10, 10, 20, 4],
        },
        {
            yAxisIndex: 1,
            xAxisIndex: 1,
            name: '出-实际',
            type: 'bar',
            label: {
                show: true,
                position: 'inside',
            },
            data: [5, 20, 36, 10, 10, 20, 4],
        },
    ],
};
```

另一种写法: [对比图](http://chartlib.datains.cn/detail?id=x4Rf-AM42c)

```js
var data1 = [{
        name: '学院',
        value: 30
    },
    {
        name: '专业',
        value: 100
    },{
        name: '附属医院',
        value: 18
    },{
        name: 'ESI前1%学科',
        value: 50
    },{
        name: '国家重点学科',
        value: 70
    },{
        name: '广西一流学科',
        value: 88
    },
    {
        name: '第四轮评估A/B/C',
        value: 60
    },
    {
        name: '总在校人数',
        value: 4000
    },
    {
        name: '本科生',
        value: 3000
    },
    {
        name: '硕士研究生',
        value: 120
    },
    {
        name: '博士生',
        value: 50
    },
    {
        name: '留学生',
        value: 200
    },
    {
        name: '高职生',
        value: 200
    },
    {
        name: '教工',
        value: 300
    },
    {
        name: '专任教师',
        value: 100
    },
    {
        name: '高层次人才',
        value: 15
    },
    {
        name: '国家实验室含重点',
        value: 30
    },
    {
        name: '国家重大科研项目',
        value: 20
    },
    {
        name: '生师比',
        value: 150
    }
];

var data2 = [{
        name: '学院',
        value: 40
    },
    {
        name: '专业',
        value: 120
    },{
        name: '附属医院',
        value: 30
    },{
        name: 'ESI前1%学科',
        value: 35
    },{
        name: '国家重点学科',
        value: 50
    },{
        name: '广西一流学科',
        value: 70
    },
    {
        name: '第四轮评估A/B/C',
        value: 50
    },
    {
        name: '总在校人数',
        value: 4500
    },
    {
        name: '本科生',
        value: 3500
    },
    {
        name: '硕士研究生',
        value: 100
    },
    {
        name: '博士生',
        value: 20
    },
    {
        name: '留学生',
        value: 400
    },
    {
        name: '高职生',
        value: 100
    },
    {
        name: '教工',
        value: 100
    },
    {
        name: '专任教师',
        value: 400
    },
    {
        name: '高层次人才',
        value: 100
    },
    {
        name: '国家实验室含重点',
        value: 50
    },
    {
        name: '国家重大科研项目',
        value: 50
    },
    {
        name: '生师比',
        value: 200
    }
];




let data1New = []
let data2New = []
let largeColorRight = {
    type: 'linear',
    x: 1,
    y: 0,
    x2: 0,
    y2: 0,
    colorStops: [{
        offset: 0,
        color: 'rgba(0, 204, 255, 1)'
    }, {
        offset: 1,
        color: 'rgba(101, 105, 255, 1)'
    }]
}
let largeColorLeft = {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 1,
    y2: 0,
    colorStops: [{
        offset: 0,
        color: 'rgba(0, 204, 255, 1)'
    }, {
        offset: 1,
        color: 'rgba(101, 105, 255, 1)'
    }]
}
let normalColor = {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [{
        offset: 0,
        color: 'rgba(0, 204, 255, 0.3)'
    }, {
        offset: 1,
        color: 'rgba(101, 105, 255, 0.3)'
    }]
}

data1.map((item, index) => {
    let isLarge = data1[index].value > data2[index].value
    data1New.push({
        name: data1[index].name,
        value: data1[index].value,
        itemStyle: {
            normal: {
                color: isLarge ? largeColorRight : normalColor
            }
        }
    })
    data2New.push({
        name: data2[index].name,
        value: data2[index].value,
        itemStyle: {
            normal: {
                color: isLarge ? normalColor : largeColorLeft
            }
        }
    })
})
getArrByKey = (data, k) => {
    let key = k || "value";
    let res = [];
    if (data) {
        data.forEach(function(t) {
            res.push(t[key]);
        });
    }
    return res;
};
option = {
    backgroundColor:'#051523',
    grid: [{
            show: false,
            left: '2%',
            top: '0%',
            bottom: '8%',
            width: '39%',

        },
        {
            show: false,
            left: '50%',
            top: '0%',
            bottom: '8%',
            width: '0%',

        }, {
            show: false,
            right: '2%',
            top: '0%',
            bottom: '8%',
            width: '40%',
        }
    ],
    tooltip: {
        show: true,
        formatter: '{b} : {c}'
    },
    xAxis: [{
            type: 'log',
            inverse: true,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            position: 'bottom',
            axisLabel: {
                show: false,
            },
            splitLine: {
                show: false
            }
        },
        {
            gridIndex: 1,
            show: false,
        },
        {
            gridIndex: 2,
            show: true,
            type: 'log',
            inverse: false,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            position: 'bottom',
            axisLabel: {
                show: false,
            },
            splitLine: {
                show: false
            }
        }
    ],
    yAxis: [{
            gridIndex: 0,
            triggerEvent: true,
            show: true,
            inverse: true,
            data: data1,
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            }
        },
        {
            gridIndex: 1,
            type: 'category',
            inverse: true,
            position: 'center',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                interval: 0,
                align: 'auto',
                verticalAlign: 'middle',
                textStyle: {
                    color: 'rgba(195, 240, 255, 1)',
                    fontSize: 16,
                    align: 'center',

                },

            },
            data: getArrByKey(data1, 'name'),
        },
        {
            gridIndex: 2,
            triggerEvent: true,
            show: true,
            inverse: true,
            data: data1,
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false,
            }
        }
    ],
    series: [
        {
            type: 'bar',
            gridIndex: 0,
            showBackground: false,
            backgroundStyle: {
                barBorderRadius: 4,
            },
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: data1New,
            barWidth: 20,
            itemStyle: {
                normal: {
                    show: true,
                    color: 'rgba(59, 126, 170, 1)',
                    barBorderRadius:4
                },
            },

            label: {
                show: false,
            }
        },
        {
            type: 'bar',
            xAxisIndex: 2,
            yAxisIndex: 2,
            gridIndex: 2,
            showBackground: false,
            backgroundStyle: {
                barBorderRadius: 4,
            },
            data: data2New,
            barWidth: 20,
            itemStyle: {
                normal: {
                    show: true,
                    color: 'rgba(59, 126, 170, 1)',
                    barBorderRadius:4

                },
            },
            label: {
                show: false
            }
        }
    ]
};
```
