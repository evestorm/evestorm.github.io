---
title: 转载-CSS子元素文本长度超过父元素宽度的文本居中方法
tags:
  - CSS
  - 技巧
categories:
  - 前端
  - CSS
abbrlink: 64832
date: 2023-05-12 13:52:09
---

转载地址：<https://segmentfault.com/a/1190000023362699>

```html
<span style="display: inline-block;width: 50px;>
    <p style="display: inline-block;white-space: nowrap;margin-left: 50%;transform: translateX(-50%);">
    黄浦哇哈哈乐百氏777哇哈哈很好的呀区
    </p>
</span>
```

要点：

1. 子元素要设置不换行，并且是个内联块级元素，这样文本就拥有了实际宽度。
2. 基于父元素50%宽度向右平移，将基准点定位在父元素中心点，即margin-left: 50%。
3. 基于文本自身的宽度向左偏移一半的文本长度，即transform: translateX(-50%)。
