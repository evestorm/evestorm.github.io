---
title: 对HTML语义化的理解
categories:
  - 前端
  - HTML
abbrlink: 2906
date: 2018-09-21 20:08:10
tags:
---

## 对HTML语义化的理解

核心：用正确的标签做正确的事情

1. 利与开发：方便代码的阅读和维护
2. 利于SEO：方便爬虫根据 语义标签 确定 页面结构 和 关键字 的权重

<!-- more -->

## 常见语义化标签

一图胜千言：

{% asset_img f8442d9e-e30d-11e6-85aa-3e3fb75f9695.jpg 语义化demo %}


元素细节：

- [main](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/main) 存放每个页面独有的内容。每个页面上只能用一次 `<main>`，且直位于 [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/body)中。最好不要把它嵌套进其它元素。
- [article](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/article) 包围的内容即一篇文章，与页面其它部分无关（比如一篇博文）。
- [section](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/section) 与 `<article>` 类似，但 `<section>` 更适用于组织页面使其按功能（比如迷你地图、一组文章标题和摘要）分块。一般的最佳用法是：以 [标题](https://developer.mozilla.org/en-US/Learn/HTML/Howto/Set_up_a_proper_title_hierarchy) 作为开头；也可以把一篇 `<article>` 分成若干部分并分别置于不同的 `<section>` 中，也可以把一个区段 `<section>` 分成若干部分并分别置于不同的 `<article>` 中，取决于上下文。
- [aside](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/aside) 包含一些间接信息（术语条目、作者简介、相关链接，等等）。
- [header](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/header) 是简介形式的内容。如果它是 [body](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/body) 的子元素，那么就是网站的全局页眉。如果它是 [article](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/article) 或[section](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/section) 的子元素，那么它是这些部分特有的页眉（此 `<header>` 非彼 [标题](https://developer.mozilla.org/zh-CN/docs/learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML#增加一个标题)）。
- [nav](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/nav) 包含页面主导航功能。其中不应包含二级链接等内容。
- [footer](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/footer) 包含了页面的页脚部分。

来源：[文档与网站架构](https://developer.mozilla.org/zh-CN/docs/learn/HTML/Introduction_to_HTML/文件和网站结构)