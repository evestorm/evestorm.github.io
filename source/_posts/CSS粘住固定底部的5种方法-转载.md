---
title: CSS粘住固定底部的5种方法(转载)
date: 2020-05-18 14:06:28
tags:
  - 技巧
  - 布局
  - 转载
categories:
  - 前端
  - CSS
---

译文地址：http://caibaojian.com/css-5-ways-sticky-footer.html
原文地址：https://css-tricks.com/couple-takes-sticky-footer/
译者：前端开发博客-Jack

### 方法一：全局增加一个负值下边距等于底部高度

有一个全局的元素包含除了底部之外的所有内容。它有一个负值下边距等于底部的高度，就像[这个演示链接](http://ryanfait.com/html5-sticky-footer/)。

<!-- more -->

[HTML](http://caibaojian.com/t/html)代码

```html
<body>
  <div class="wrapper">
    content

    <div class="push"></div>
  </div>
  <footer class="footer"></footer>
</body>
```

[CSS](http://caibaojian.com/css3/)代码：

```css
html,
body {
  height: 100%;
  margin: 0;
}
.wrapper {
  min-height: 100%;

  /* Equal to height of footer */
  /* But also accounting for potential margin-bottom of last child */
  margin-bottom: -50px;
}
.footer,
.push {
  height: 50px;
}
```

演示：

<iframe name="cp_embed_1" src="https://codepen.io/chriscoyier/embed/VjZmGj?height=392&amp;theme-id=1&amp;slug-hash=VjZmGj&amp;default-tab=result&amp;user=chriscoyier&amp;embed-version=2&amp;name=cp_embed_1" scrolling="no" frameborder="0" height="392" allowtransparency="true" allowfullscreen="true" allowpaymentrequest="true" title="CodePen Embed" class="cp_embed_iframe " loading="lazy" id="cp_embed_VjZmGj" style="margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; width: 688px; overflow: hidden; display: block;"></iframe>

这个代码需要一个额外的元素.push 等于底部的高度，来防止内容覆盖到底部的元素。这个 push 元素是智能的，它并没有占用到底部的利用，而是通过全局加了一个负边距来填充。

### 方法二：底部元素增加负值上边距

虽然这个代码减少了一个.push 的元素，但还是需要增加多一层的元素包裹内容，并给他一个内边距使其等于底部的高度，防止内容覆盖到底部的内容。

HTML 代码：

```html
<body>
  <div class="content">
    <div class="content-inside">content</div>
  </div>
  <footer class="footer"></footer>
</body>
```

[CSS](http://caibaojian.com/t/css)：

```css
html,
body {
  height: 100%;
  margin: 0;
}
.content {
  min-height: 100%;
}
.content-inside {
  padding: 20px;
  padding-bottom: 50px;
}
.footer {
  height: 50px;
  margin-top: -50px;
}
```

演示：

<iframe name="cp_embed_2" src="https://codepen.io/chriscoyier/embed/aZoBMb?height=300&amp;theme-id=1&amp;slug-hash=aZoBMb&amp;default-tab=result&amp;user=chriscoyier&amp;embed-version=2&amp;name=cp_embed_2" scrolling="no" frameborder="0" height="300" allowtransparency="true" allowfullscreen="true" allowpaymentrequest="true" title="CodePen Embed" class="cp_embed_iframe " loading="lazy" id="cp_embed_aZoBMb" style="margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; width: 688px; overflow: hidden; display: block;"></iframe>

## 方法三：使用 calc()计算内容的高度

HTML

```html
<body>
  <div class="content">content</div>
  <footer class="footer"></footer>
</body>
```

[CSS](http://caibaojian.com/t/css):

```css
.content {
  min-height: calc(100vh - 70px);
}
.footer {
  height: 50px;
}
```

演示：

<iframe name="cp_embed_3" src="https://codepen.io/chriscoyier/embed/jqRXBz?height=414&amp;theme-id=1&amp;slug-hash=jqRXBz&amp;default-tab=result&amp;user=chriscoyier&amp;embed-version=2&amp;name=cp_embed_3" scrolling="no" frameborder="0" height="414" allowtransparency="true" allowfullscreen="true" allowpaymentrequest="true" title="CodePen Embed" class="cp_embed_iframe " loading="lazy" id="cp_embed_jqRXBz" style="margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; width: 688px; overflow: hidden; display: block;"></iframe>

给 70px 而不是 50px 是为了为了跟底部隔开 20px，防止紧靠在一起。

### 方法四：使用[flexbox](http://caibaojian.com/t/flexbox)

关于 flexbox 的教程，还请查看之前的一篇[详细的教程](http://caibaojian.com/flexbox-guide.html)

HTML:

```html
<body>
  <div class="content">content</div>
  <footer class="footer"></footer>
</body>
```

CSS:

```css
html {
  height: 100%;
}
body {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
}
```

演示：

<iframe name="cp_embed_4" src="https://codepen.io/chriscoyier/embed/RRbKrL?height=488&amp;theme-id=1&amp;slug-hash=RRbKrL&amp;default-tab=result&amp;user=chriscoyier&amp;embed-version=2&amp;name=cp_embed_4" scrolling="no" frameborder="0" height="488" allowtransparency="true" allowfullscreen="true" allowpaymentrequest="true" title="CodePen Embed" class="cp_embed_iframe " loading="lazy" id="cp_embed_RRbKrL" style="margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; width: 688px; overflow: hidden; display: block;"></iframe>

### 方法五：使用 grid 布局

HTML：

```html
<body>
  <div class="content">content</div>
  <footer class="footer"></footer>
</body>
```

CSS：

```css
html {
  height: 100%;
}
body {
  min-height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
}
.footer {
  grid-row-start: 2;
  grid-row-end: 3;
}
```

演示：

<iframe name="cp_embed_5" src="https://codepen.io/chriscoyier/embed/YWKNrE?height=477&amp;theme-id=1&amp;slug-hash=YWKNrE&amp;default-tab=result&amp;user=chriscoyier&amp;embed-version=2&amp;name=cp_embed_5" scrolling="no" frameborder="0" height="477" allowtransparency="true" allowfullscreen="true" allowpaymentrequest="true" title="CodePen Embed" class="cp_embed_iframe " loading="lazy" id="cp_embed_YWKNrE" style="margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; width: 688px; overflow: hidden; display: block;"></iframe>

grid 早于 flexbox 出现，但并没有 flexbox 被广泛支持，你可能在 chrome Canary 或者 Firefox 开发版上才可以看见效果
