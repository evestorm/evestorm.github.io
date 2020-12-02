---
title: CSS3伪元素实现自定义复选框
tags:
  - CSS3
  - 转载
categories:
  - 前端
  - CSS
abbrlink: 3583
date: 2020-06-19 15:11:54
---

我们都知道原生的复选框控件样式极难自定义，这对于工程师实现设计稿的难度加大了一大截。css3 的出现，增加了:checked 选择器，因此我们可以利用:checked 和 label 来实现各式各样的表单选择控件，接下来让我们来看看如何实现吧！

<!-- more -->

我们来看看如何实现上述自定义的复选框：

```html
<style>
  .check-wrap {
    text-align: center;
  }
  .checkbox {
    position: absolute;
    clip: rect(0, 0, 0, 0);
  }
  .checkbox[type='checkbox']:focus + label::before {
    box-shadow: 0 0 0.6em #06c;
  }
  .checkbox[type='checkbox'] + label::before {
    content: '\a0'; /* 不换行空格 */
    display: inline-block;
    margin-right: 0.3em;
    width: 2em;
    height: 2em;
    border-radius: 0.3em;
    vertical-align: middle;
    line-height: 2em; /* 关键 */
    font-size: 20px;
    text-align: center;
    color: #fff;
    background: gray;
  }
  .checkbox[type='checkbox']:checked + label::before {
    content: '\2713'; /* 对勾 */
    background: black;
  }

  label {
    margin-right: 40px;
    font-size: 20px;
  }
</style>
<div class="check-wrap">
  <input type="checkbox" class="checkbox" id="check-1" />
  <label for="check-1">生男孩</label>
  <input type="checkbox" class="checkbox" id="check-2" />
  <label for="check-2">生女孩</label>
</div>
```

{% asset_img checkbox-effect.png checkbox-effect %}

这里为了隐藏原生的 checkbox 控件，我们用了 clip: rect(0,0,0,0)进行截取，然后使用 checkbox 的伪类:checked 来实现交互。

接下来扩展一下，我们来实现自定义开关：

{% asset_img checkbox-effect2.png checkbox-effect2 %}

这里原理是一样的，只不过样式做了改动，直接上代码：

```html
<style>
  .check-wrap {
    margin-bottom: 20px;
    text-align: center;
  }
  .switch {
    position: absolute;
    clip: rect(0, 0, 0, 0);
  }

  .switch[type='checkbox'] + label {
    width: 6em;
    height: 3em;
    padding: 0.3em;
    border-radius: 0.3em;
    border: 1px solid rgba(0, 0, 0, 0.2);
    vertical-align: middle;
    line-height: 2em; /* 关键 */
    font-size: 20px;
    text-align: center;
    color: #fff;
    box-shadow: 0 1px white inset;
    background-color: #ccc;
    background-image: linear-gradient(#ddd, #bbb);
  }
  .switch[type='checkbox']:checked + label {
    box-shadow: 0.05em 0.1em 0.2em rgba(0, 0, 0, 0.6) inset;
    border-color: rgba(0, 0, 0, 0.3);
    background: #bbb;
  }

  label {
    margin-right: 40px;
    font-size: 14px;
  }

  .switch-an {
    position: absolute;
    clip: rect(0, 0, 0, 0);
  }

  .switch-an[type='checkbox'] + label {
    position: relative;
    display: inline-block;
    width: 5em;
    height: 2em;
    border-radius: 1em;
    color: #fff;
    background: #06c;
    text-align: left;
  }

  .switch-an[type='checkbox'] + label::before {
    content: '';
    width: 2em;
    height: 2em;
    position: absolute;
    left: 0;
    border-radius: 100%;
    vertical-align: middle;
    background-color: #fff;
    transition: left 0.3s;
  }
  .switch-an[type='checkbox'] + label::after {
    content: 'OFF';
    margin-left: 2.6em;
  }
  .switch-an[type='checkbox']:checked + label::before {
    transition: left 0.3s;
    left: 3em;
  }
  .switch-an[type='checkbox']:checked + label::after {
    content: 'NO';
    margin-left: 0.6em;
  }
</style>
<div class="check-wrap">
  <input type="checkbox" class="switch" id="switch-1" />
  <label for="switch-1">生男孩</label>
  <input type="checkbox" class="switch" id="switch-2" />
  <label for="switch-2">生女孩</label>
</div>

<div class="check-wrap">
  <input type="checkbox" class="switch-an" id="switch-an-1" />
  <label for="switch-an-1"></label>
</div>
```
