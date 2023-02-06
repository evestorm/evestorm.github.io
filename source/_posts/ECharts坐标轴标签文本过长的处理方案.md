---
title: ECharts坐标轴标签文本过长的处理方案
tags:
  - ECharts
categories:
  - 前端
  - UI
  - ECharts
abbrlink: 12531
date: 2022-12-01 21:31:31
---

实现 ECharts Y轴文本过长，设置超出隐藏，然后显示省略号，并且鼠标悬浮上之后显示全部

<!-- more -->

```js
series : [{
  name : 'xxxx',
  type : 'bar',
  stack : '总量',
  barWidth : 3,
  label : {
      normal : {
          show : false,
          position : 'insideRight',
          formatter : function(params) {
              if (params.value > 0) {
                  return params.value;
              } else {
                  return '';
              }
          }
      }
  },
  data : [123]
}]
```

```js
function extension(chart){
  // 判断是否创建过div框,如果创建过就不再创建了
  // 该div用来盛放文本显示内容的，方便对其悬浮位置进行处理
  const id = document.getElementById("extension");
  if(!id) {
    const div = "<div id='extension' style='display: block;'></div>";
    $("html").append(div);
  }
  chart.on('mouseover', function(params) {
    // 注意这里，我是以Y轴显示内容过长为例，如果是x轴的话，需要改为xAxis
    if (params.componentType === "yAxis") {
      // 设置悬浮文本的位置以及样式
      $('#extension').css({
        "position": "absolute",
        "color": "black",
        "background":"white",
        "font-family": "Arial",
        "font-size": "12px",
        "padding": "5px",
        "display": "inline"
      }).text(params.value);
      $("html").mousemove(function(event) {
        const xx = event.pageX - 10;
        const yy = event.pageY + 15;
        $('#extension').css('top', yy).css('left', xx);
      });
    }
  });
  chart.on('mouseout', function(params) {
    // 注意这里，我是以Y轴显示内容过长为例，如果是x轴的话，需要改为xAxis
    if (params.componentType === "yAxis") {
      $('#extension').css('display', 'none');
    }
  });                
} 
```
