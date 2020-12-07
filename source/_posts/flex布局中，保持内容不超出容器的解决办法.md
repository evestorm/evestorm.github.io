---
title: flex布局中，保持内容不超出容器的解决办法
tags:
  - 技巧
  - flex
categories:
  - 前端
  - CSS
  - Flex
abbrlink: 3930
date: 2020-03-14 16:37:57
---

在移动端，flex 布局很好用，它能够根据设备宽度来自动调整容器的宽度，用起来很方便，已经越来越离不开它，但是最近在做项目的时候发现一个问题。

就是在一个设置了 flex:1 的容器中，如果文字很长，这时候文字就会超出容器，而不是呆在设置好的动态剩余的空间中。由于实际项目的比较复杂，不好拿出来说，这里就把问题简化描述如下：

大致是有一个 main 容器是 flex 布局，左边一个 logo 固定宽高，右边 content 动态宽度。

```html
<div class="main">
  <img alt="" class="logo" src="pic.jpg" />
  <div class="content">
    <h4 class="name">a name</h4>
    <p class="info">a info</p>
    <p class="notice">This is notice content.</p>
  </div>
</div>
.main { display: flex; } .logo { width: 100px; height: 100px; margin: 10px; }
.content { flex: 1; } .content > * { white-space: nowrap; overflow: hidden;
text-overflow: ellipsis; }12345678910111213141516
```

.notice 可能会非常长，一些设备下需要隐藏显示，即不换行，并留下省略符…作标记。
这里会发现 text-overflow: ellipsis 不生效，省略符根本没有出现。而且因为设置了 nowrap 会发现文字会将 content 撑开，导致内容超出了屏幕。所以必须要解决这个问题。

> 尝试取消父元素.content 的 flex: 1，无效。
> 尝试取消.main 容器的 display: flex，省略号出现。

因此猜测是 flex 布局的问题，进一步猜测省略符需要对父元素限定宽度。
尝试对父元素.content 设置 width: 100%无效，但是设置 width: 0 可行。即：

```css
.content {
  flex: 1;
  width: 0;
}
```

如果不设置宽度，.content 可以被子节点无限撑开；因此.notice 总有足够的宽度在一行内显示所有文本，也就不能触发截断省略的效果。测试还有一种方法可以达到效果：

```css
.content {
  flex: 1;
  overflow: hidden；;
}
```

上面的二种方法都可以达到我们需要的效果，即给 content 设置了 flex 为 1 的时候，它会动态的获得父容器的剩余宽度，且不会被自己的子元素把内容撑开。

经过测试，以下的方法是无效的：

> 给 html, body 设置 max-width，元素似乎能强行撑开页宽；
> 给 body 设置 overflow，页宽不能被撑开了，但元素宽度还在，即元素本身还是溢出；
> 给 html, body 同时设置 max-width 和 overflow，页宽限定在 max-width 内，元素本身还是溢出；
> 给.main 容器设置 overflow: hidden，同理.main 是不溢出了，.notice 本身还是溢出；
> 给.notice 元素设置 width 或 max-width，虽然宽度受限，但在特定宽度下省略符…显示不全，有时只显示两个点..
