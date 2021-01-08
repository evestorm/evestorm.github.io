---
title: 优化ECharts+定时器定时刷新数据导致的内存溢出问题
tags:
  - element-ui
  - Vue
categories:
  - 前端
  - UI
  - element-ui
abbrlink: 55651
date: 2021-01-08 15:16:06
---

## 问题描述

项目需要使用 ECharts 绘制行车库区 3d 图，并且需要定时刷新数据：

{% asset_img echarts-repo-3d.png echarts-repo-3d %}

然而数据量太大，导致页面长时间停留后会卡顿：

{% asset_img resp-data.png resp-data %}

## 解决思路

1. 不要把 ECharts 实例或者配置项挂到 vue 下面，Vue 会深度遍历监听所有属性，数据量一大就卡了
2. 对定时器的清除
3. 保证页面中同一个图表只有一个实例，而不是每次刷新数据都新建 ECharts 实例

<!-- more -->

## 具体代码

```html
<template>
  <div class="chart" :style="{height:'800px',width:'100%'}" />
</template>

<script>
  import echarts from 'echarts';
  import 'echarts-gl';
  require('echarts/theme/macarons'); // echarts theme
  import resize from '@/components/Charts/mixins/resize';
  import $reservoir from '@/api/reservoir'; // api

  // echarts 实例, 定时器
  let chart = null;
  let timer = null;

  export default {
    mixins: [resize],
    data() {
      return {
        playground: [] // 3d库区图数据
      };
    },
    mounted() {
      // 初始化echarts
      this.initChart();
      // 数据请求
      this.get3DPlayground();
      // 设置定时器
      timer = setInterval(() => {
        this.get3DPlayground();
      }, 10000);
    },
    // 页面销毁时移除定时器，销毁echarts实例
    beforeDestroy() {
      if (!chart) {
        return;
      }
      chart.dispose();
      clearInterval(timer);
    },
    methods: {
      // 获取3d图数据
      async get3DPlayground() {
        let data = await $reservoir.get3DPlayground();
        data = data || [];
        this.playground = data.map(element => {
          return [
            element.ypos / 1000,
            element.xpos / 1000,
            20 - element.zpos / 1000
          ];
        });
        data = null;
      },
      // 更新图表
      updateChart() {
        chart.setOption({
          series: [
            {
              type: 'surface',
              data: this.playground,
              label: {
                show: false,
                position: 'top',
                margin: 8
              },
              shading: 'realistic'
            }
          ]
        });
      },
      // 初始化图表
      initChart() {
        chart = echarts.init(this.$el, 'white', { renderer: 'canvas' });
        chart.setOption({
          animation: true,
          animationThreshold: 2000,
          animationDuration: 1000,
          animationEasing: 'cubicOut',
          animationDelay: 0,
          animationDurationUpdate: 300,
          animationEasingUpdate: 'cubicOut',
          animationDelayUpdate: 0,
          color: [],
          series: [
            {
              type: 'surface',
              data: [],
              label: {
                show: false,
                position: 'top',
                margin: 8
              },
              shading: 'realistic'
            }
          ],
          legend: [
            {
              data: [''],
              selected: {},
              show: true,
              padding: 5,
              itemGap: 10,
              itemWidth: 25,
              itemHeight: 14
            }
          ],
          tooltip: {
            show: true,
            trigger: 'item',
            triggerOn: 'mousemove|click',
            axisPointer: {
              type: 'line'
            },
            showContent: true,
            alwaysShowContent: false,
            showDelay: 0,
            hideDelay: 100,
            textStyle: {
              fontSize: 14
            },
            borderWidth: 0,
            padding: 5
          },
          visualMap: {
            show: true,
            type: 'continuous',
            min: 0,
            max: 20,
            inRange: {
              color: ['#f05b72', '#ef5b9c', '#f47920', '#fab27b']
            },
            calculable: true,
            inverse: false,
            splitNumber: 5,
            orient: 'vertical',
            showLabel: true,
            itemWidth: 20,
            itemHeight: 150,
            borderWidth: 0
          },
          xAxis3D: {
            name: 'X',
            type: 'value',
            max: 'dataMax'
          },
          yAxis3D: {
            name: 'Y',
            type: 'value',
            max: 'dataMax'
          },
          zAxis3D: {
            name: 'Z',
            type: 'value',
            max: '20'
          },
          grid3D: {
            boxWidth: 20,
            boxHeight: 20,
            boxDepth: 150,
            viewControl: {
              autoRotate: false,
              autoRotateSpeed: 20,
              rotateSensitivity: 1
            }
          },
          title: [
            {
              padding: 5,
              itemGap: 10
            }
          ]
        });
      }
    },
    watch: {
      playground: {
        immediate: false,
        deep: true,
        handler(newValue, oldValue) {
          // 数据更新时，更新echarts
          this.updateChart();
        }
      }
    }
  };
</script>
```

## 参考

- [ECharts 折现更新卡顿](https://github.com/apache/incubator-echarts/issues/12449)
- [定时器+echarts 运行时间太长导致内存溢出页面崩溃](https://blog.csdn.net/weixin_47711357/article/details/110945362)
- [chrome 内存泄露分析](https://juejin.cn/post/6844904082918899720)
