---
title: 转载-CSS整块文本溢出省略方案
tags:
  - 技巧
  - 转载
  - CSS
categories:
  - 前端
  - CSS
abbrlink: 43718
date: 2021-03-17 16:44:16
---

转载自：https://mp.weixin.qq.com/s/HF7s4m7gbiI50LNRqkuDUA

今天的文章很有意思，讲一讲整块文本溢出省略打点的一些有意思的细节。

<!-- more -->

## 文本超长打点

我们都知道，到今天（2021/03/06），CSS 提供了两种方式便于我们进行文本超长的打点省略。

对于**单行文本**，使用单行省略：

```css
 {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

{% asset_img 640-20210317164312187.png 640-20210317164312187 %}

而对于**多行文本**的超长省略，使用 `-webkit-line-clamp` 相关属性，兼容性也已经非常好了：

```css
 {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
```

{% asset_img 640-20210317164312698.png 640-20210317164312698 %}

**CodePen Demo -- inline-block 实现整块的溢出打点**[1]

## 问题一：超长文本整块省略

基于上述的超长打点省略方案之下，会有一些变化的需求。譬如，我们有如下结构：

```html
<section>
  <a href="/" class="avatar"></a>
  <div class="info">
    <p class="person-card__name">Sb Coco</p>
    <p class="person-card__desc">
      <span>FE</span>
      <span>UI</span>
      <span>UX Designer</span>
      <span>前端工程师</span>
    </p>
  </div>
</section>
```

{% asset_img 640-20210317164312696.png 640-20210317164312696 %}

对于上述超出的情况，我们希望对于超出文本长度的整一块 -- **前端工程师**，整体被省略。

如果我们直接使用上述的方案，使用如下的 CSS，结果会是这样，并非我们期待的整块省略：

```css
.person-card__desc {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

{% asset_img 640.png 640 %}

### 将 `display: inline` 改为 `display: inline-block` 实现整块省略

这里，如果我们需要实现一整块的省略，只需要将包裹整块标签元素的 `span` 的 `display`由 `inline` 改为 `inline-block` 即可。

```css
.person-card__desc span {
  display: inline-block;
}
```

{% asset_img 640-20210317164312683.png 640-20210317164312683 %}

这样，就可以实现，基于整块的内容的溢出省略了。完整的 Demo，你可以戳这里：

**CodePen Demo - 整块超长溢出打点省略**[2]

## 问题二：iOS 不支持整块超长溢出打点省略

然而，上述方案并非完美的。经过实测，上述方案在 **iOS** 和 **Safari** 下，没能生效，表现为这样：

{% asset_img 640-20210317164312228.png 640-20210317164312228 %}

查看规范 - **CSS Basic User Interface Module Level 3 - text-overflow**[3]，究其原因，在于 `text-overflow` 只能对内联元素进行打点省略。（Chrome 对此可能做了一些优化，所以上述非 iOS 和 Safari 的场景是正常的）

所以猜测是因为经过了 `display: inline-block` 的转化后，已经不再是严格意义上的内联元素了。

### 解决方案，使用多行省略替代单行省略

当然，这里经过试验后，发现还是有解的，我们在开头还提到了一种多行省略的方案，我们将多行省略的代码替换单行省略，只是行数 `-webkit-line-clamp: 2` 改成一行即可 `-webkit-line-clamp: 1`。

```css
.person-card__desc {
  width: 200px;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.person-card__desc span {
  display: inline-block;
}
```

这样，在 iOS/Safari 下也能完美实现整块的超长打点省略：

{% asset_img 640-20210317164312710.png 640-20210317164312710 %}

**CodePen Demo -- iOS 下的整块超长溢出打点省略方案**[4]

值得注意的是，在使用 `-webkit-line-clamp` 的方案的时候，一定要配合 `white-space: normal` 允许换行，而不是不换行。这一点，非常重要。

这样，我们就实现了全兼容的整块的超长打点省略了。

当然，`-webkit-line-clamp` 本身也是存在一定的兼容性问题的，实际使用的时候还需要具体去取舍。

## 最后

好了，本文到此结束，一个简单的 CSS 小技巧，希望对你有帮助 :)

更多精彩 CSS 技术文章汇总在我的 **Github -- iCSS**[5] ，持续更新，欢迎点个 star 订阅收藏。

如果还有什么疑问或者建议，可以多多交流，原创文章，文笔有限，才疏学浅，文中若有不正之处，万望告知。

### 参考资料

[1]CodePen Demo -- inline-block 实现整块的溢出打点: *https://codepen.io/Chokcoco/pen/JjbBpdN*
[2]CodePen Demo - 整块超长溢出打点省略: *https://codepen.io/Chokcoco/pen/XWNPdpK?editors=1100*
[3]CSS Basic User Interface Module Level 3 - text-overflow: *https://drafts.csswg.org/css-ui-3/#text-overflow*
[4]CodePen Demo -- iOS 下的整块超长溢出打点省略方案: *https://codepen.io/Chokcoco/pen/XWNPdpK?editors=1100*
[5]Github -- iCSS: *https://github.com/chokcoco/iCSS*
