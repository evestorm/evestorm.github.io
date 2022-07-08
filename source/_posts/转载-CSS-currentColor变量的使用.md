---
title: 转载-CSS-currentColor变量的使用
tags:
  - 技巧
  - CSS
  - 转载
categories:
  - 前端
  - CSS
abbrlink: 30008
date: 2020-12-30 10:24:10
---

转载自：https://www.cnblogs.com/Wayou/p/css-currentColor.html

CSS 中存在一个神秘的变量，少有人知自然也不怎么为人所用。它就是`currentColor`变量（或者说是 CSS 关键字，但我觉得称为变量好理解些）。

<!-- more -->

# 初识

它是何物？具有怎样的功效？它从哪里来？带着这些疑问我们继续。

下面是来自[MDN 的解释](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentColor_keyword)：

> `currentColor`代表了当前元素被应用上的`color`颜色值。 使用它可以将当前这个颜色值应用到其他属性上，或者嵌套元素的其他属性上。

你这可以这么理解，CSS 里你可以在任何需要写颜色的地方使用`currentColor`这个变量，这个变量的值是当前元素的`color`值。如果当前元素没有在 CSS 里显示地指定一个`color`值，那它的颜色值就遵从 CSS 规则，从父级元素继承而来。

到此似乎解决了上面三个哲学式的提问，但依然有些模糊。程序员之间的交流，还是上码才好。

- 场景 1

```html
<p>约么？</p>
p{ color: red; }
```

此时，`<p>`标签`currentColor`的值为`red`。

- 场景 2

```html
<div class="container">
  <p>约么？</p>
</div>
.container{ color: #00ff00; }
```

现在，我们没有给`<p>`标签指定颜色，它的`color`从父级容器也就是`class`为`container`的`div`继承而来，换句话说此时`p`标签的`color`为`#00ff00`，`currentColor`又是直接去取元素的`color`值，所以此时`p`标签的`currentColor`值也为`#00ff00`。

{% asset_img 071703026553532.png 071703026553532 %}

- 场景 3

如果父级元素也没有写`color`呢？其实这里都还是 CSS 规则的范畴，跟本文的主角关系不太大。但本着不啰嗦会死的原则，就展开了讲。

如果父级元素也没有指定颜色，那它的父级元素就会从父级的父级去继承，直到文档的根结点`html`标签都还没显示指定一个颜色呢，就应用上浏览器默认的颜色呗~

```html
<!DOCTYPE html>
<html>
  <head>
    <title>我来组成头部</title>
  </head>
  <body>
    <p>约么？</p>
  </body>
  <footer>战神金钢，宇宙的保护神！</footer>
</html>
/** * 无CSS */
```

{% asset_img 071703151234623.png 071703151234623 %}

那，这个时候的黑色其实是浏览器默认给的。此时`p`标签的`currentColor`自然也跟`color`值一样，为黑色，纯黑的`#000`。

# 如何用？

了解它是怎样的物品后，下面问题来了，如何用？有额外的`buff`效果么，耗蓝多么，CD 时间长么。。。

前面说道，它就是一个 CSS 变量，存储了颜色值，这个值来自当前元素的`color`CSS 属性。当你需要为该元素其他属性指定颜色的时候，它就可以登上舞台了。

```html
<div class="container">好好说话，有话好好说</div>
.container{ color: #3CAADB; border: 4px solid currentColor; }
```

这里我们第一次领略了`currentColor`的奇效。在指定边框颜色的时候，我们直接使用`currentColor`变量，而没有写一个传统的颜色值。

你似乎也知道了该如何用了。不只是`border`，其他能够使用颜色的地方，比如`background`，`box-shadow`等等。

# 带你装逼带你飞

新技能就是如此炫酷。大开脑洞任性地去使用吧！

## 与渐变混搭

你可能无法想象到的是，除了可以将`currentColor`用到普通需要颜色的场景，它同样可以被用在渐变中。

```html
<div class="container"></div>
.container{ height:200px; color: #3CAADB; background-image: linear-gradient(to
right, #fff, currentColor 100%); }
```

甚至也可用于填充 svg，下面会有相应示例。

## 与 CSS 动画结合

当与 CSS `animation`结合，可以得到更加有创意的效果，比如[这个来自 codepen 的示例](http://codepen.io/scottkellum/pen/Fhxql)

See the Pen [currentColor](http://codepen.io/scottkellum/pen/Fhxql/) by Scott Kellum ([@scottkellum](http://codepen.io/scottkellum)) on [CodePen](http://codepen.io/).

## 更加简洁的 CSS

其实，新技能不只是装逼那么单纯，合理的使用`currentColor` 变量会让你的 CSS 代码变得简洁。这才是我们想要达到的目的。以炫技为目的技能是没有生产意义的。

看下面这个例子（这个示例灵感来自[这里](http://osvaldas.info/keeping-css-short-with-currentcolor)）

{% asset_img 071703343112594.png 071703343112594 %}

我们在按钮中使用了一个 svg 图标。你是一个负责任的 FE，所以，对这个按钮的各种状态`:focus`，`:hover`，`:active`都作了样式上的处理。同时，为了让图标也跟着保持一致的姿态变更，需要把对`<a>`标签的样式处理同样就到到`<svg>`标签上。于是你的 CSS 代码看起来就是下面这样的了。

```css
/*a 标签*/
.button {
  color: #117b6f;
  font-size: 1.2em;
}
.button:hover,
.button:focus {
  color: #01b19a;
}
.button:active {
  color: #02d7bb;
}

/*svg 标签*/
.button svg {
  height: 17px;
  width: 17px;
  fill: #117b6f;
}
.button:hover svg,
.button:focus svg {
  fill: #01b19a;
}
.button:active svg {
  fill: #02d7bb;
}
```

你也发现了，代码有点冗余。接下来，我们用`currentColor`来将它简化一下。于是成了下面这样：

```css
/*a 标签*/
.button {
  color: #117b6f;
  font-size: 1.2em;
}
.button:hover,
.button:focus {
  color: #01b19a;
}
.button:active {
  color: #02d7bb;
}

/*svg 标签*/
.button svg {
  height: 17px;
  width: 17px;
  fill: currentColor;
}
```

## 更好维护的 CSS

仔细想想不难发现，当使用`currentColor`后，我们的 CSS 也变得更加好维护了。

还拿上面的按钮示例来说，优化之前不但代码冗余，而且哪天 PM 来劲了说这颜色饱看，给换个其他色。于是你得把`<a>`标签和`<svg>`一起换了。

但优化后就不一样了，因为`<svg>`使用的填充是`currentColor`，你只需要改变`<a>`标签的颜色，它也就跟着变了。真正做到了牵一发而不动全身。这不正是众码友们毕生所追求的理想编程境界么。

# 浏览器兼容性

一提到浏览器兼容性，FE 同学们或许就不敢那么任性了。之前你可能是这样的：

{% asset_img 071703530141880.gif 071703530141880 %}

当听到 IE 传来的噩耗，你可能是这样的：

{% asset_img 071704166706318.gif 071704166706318 %}

经查，[can i use](http://caniuse.com/#search=currentcolor) 没有关于它的数据。

经测，

- 本机 Win7 搭载的 IE8 不支持
- 本机安装的火狐 31 发来战报表示支持
- Chrome，你猜？
- 本机 Safari 5.1.7 也表示支持
- 本机 Opera 26 同样表示支持

根据[这篇文章](http://demosthenes.info/blog/908/The-First-CSS-Variable-currentColor)的描述，它是可以很好地工作在在所有现代浏览器和 IE9+上的，甚至是各浏览器对应的移动版本。所以，在 IE 不是主要客户对象的情况下，还是可以放心使用的。

# 参考

- [css-tricks currentColor](http://css-tricks.com/currentcolor/)
- [Keeping CSS short with currentColor](http://osvaldas.info/keeping-css-short-with-currentcolor)
- [The First CSS Variable: currentColor](http://demosthenes.info/blog/908/The-First-CSS-Variable-currentColor)
