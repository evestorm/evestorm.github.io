---
title: 移动端input类型为date的placeholder不显示
tags:
  - 兼容性
  - 移动端
categories:
  - 前端
  - CSS
abbrlink: 23431
date: 2019-11-10 19:45:25
---

## 起因

在移动端项目开发中，DatetimePicker（时间选择器） 组件是非常常用的，并且市面上各大移动端 UI 框架也都帮我们封装了，然而绝大部分框架封装的该组件都是从底部弹出式滚动选择的（Android 和 iOS 真机上都如此），例如下面形式：

{% asset_img datepicker.png Vant-UI中的时间选择器组件 %}

<!-- more -->

然而这仅针对 iOS 用户友好，但对于用惯了 Android 手机的用户来说，下面形式的时间选择才是他们熟悉的形式：

{% asset_img android-datetime-picker.png 安卓默认时间选择器 %}

所以往往我们会放弃掉框架帮我们封装好的组件，自己用原始 `input[type=date]` 实现一个或者借助其他基于原始 input 标签封装的时间选择器。这里顺带提一个我感觉用起来还不错的库：[flatpickr](https://flatpickr.js.org/)，github 地址为：[flatpickr/flatpickr](https://github.com/flatpickr/flatpickr) 。

我在项目中就使用到了这个库，然而在开发中遇到了一个小问题，设计稿上要求，我们的时间选择器组件默认情况下显示一段 placeholder ，然而在真机上我发现，无论 iOS 还是 Android 下，input 始终为空，设置的 placeholder 无效。原本我以为这是 flatpickr 做了手脚，简单查看了源码后发现并不是它的锅。最后 Google 后才知道，这就是 `input[type=date]` 元素在手机端上的一个 feature ，不过我感觉就是个 bug ，我设置了你凭什么不给我显示？。

## 解决方案

前面铺垫了这么多，其实解决方案涉及到的代码量并不多，原理就是使用 css 伪类给 input[type=date] 设置默认 content 为 placeholder ，再设置 input 状态为 focus 时移除这个 placeholder 属性，最后在触发 blur 时把 placeholder 添加回来。具体代码如下：

> html

```html
<input class="text-date" type="date" placeholder="请选择日期" />
```

> css

```css
input[type='date']:before {
  content: attr(placeholder);
  color: #ccc;
}
```

> js

```js
$('text-date').focus(function () {
  $(this).removeAttr('placeholder');
});
$('text-date').blur(function () {
  if (this.value === '') {
    $(this).attr('placeholder', '请选择日期');
  }
});
```
