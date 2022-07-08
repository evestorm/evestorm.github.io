---
title: select标签样式调整技巧
tags:
  - 技巧
  - 笔记
categories:
  - 前端
  - CSS
abbrlink: 46310
date: 2019-11-11 00:15:05
---

## 重置丑陋样式

项目中使用到了 select 标签，但在 Android 和 iOS 上默认展示的效果都很丑而且不一致，网上搜到一个 css 样式可以重置效果，这里记下笔记：

<!-- more -->

```css
select {
  /*移除浏览器默认特殊样式*/
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  -ms-appearance: none;
  /*移除轮廓样式*/
  outline: none;
  /*移除点击元素时出现的高亮颜色*/
  -webkit-tap-highlight-color: #fff;
  border: rem(1) solid #ebebeb;
  border: none;
  width: rem(100);
  height: rem(50);
  line-height: rem(50);
  /*设置一个块元素首行文本内容之前的缩进量，防止紧紧靠在边上*/
  text-indent: rem(4);
  background-color: transparent;
}
```

### 选中项右对齐

```css
select {
  direction: rtl;
}
/* 默认左对齐属性值为 ltr */
```

## select 默认选中项

### 原生

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <select name="framework" id="framework">
      <option value="vue">VueJS</option>
      <option value="react" selected>ReactJS</option>
      <option value="angular">AngularJS</option>
      <option value="jquery">jQuery</option>
    </select>
    <script>
      document
        .querySelector('#framework')
        .addEventListener('change', function (e) {
          console.log(e.target.value);
        });
    </script>
  </body>
</html>
```

### vue

> template

```html
<template>
  <div>
    <select v-model="selected" @change="selectChange" class="select">
      <option v-for="(search, key) in searchList" :key="key" :value="search.id">
        {{search.name}}
      </option>
    </select>
  </div>
</template>
```

> js

```js
data(){
  return{
    searchList:[
      {
        id:'1',name:'中国'
      },
      {
        id:'2',name:'美国'
      },
      {
        id:'3',name:'日本'
      },
    ],
    selected:'2'
  }
}
```

在写 vue select 的时候应注意以下几点：

- v-model 是 select 的指定显示文本，如果没有，当选中 option 中的内容时 select 标签将不会显示出文本。
- @change 应尽量写在 select 标签上。

## onchange 事件获取选中项的 value 和 text

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <div class="num">
      <select id="xuanze">
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="30">30</option>
        <option value="35">35</option>
        <option value="40">40</option>
      </select>
    </div>
    <script type="text/javascript">
      window.onload = function () {
        var obj = document.getElementById('xuanze'); //定位id
        obj.addEventListener('change', () => {
          var index = obj.selectedIndex; // 选中索引
          var value = obj.options[index].value; // 选中值
          var text = obj.options[index].text; // 选中展示的文字
          console.log(index, value);
        });
      };
    </script>
  </body>
</html>
```
