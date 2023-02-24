---
title: CSS检测系统的主题色
tags:
  - 技巧
categories:
  - 前端
  - CSS
abbrlink: 50976
date: 2023-02-22 10:11:49
---

今天创建 Vue 项目时，偶尔发现生成的默认页面能根据系统主题色做出相应改变。

{% asset_img light.png light-theme %}

{% asset_img dark.png dark-theme %}

<!-- more -->

然后我发现让其生效的代码在 `src/assets/base.css` 中：

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--vt-c-black);
    --color-background-soft: var(--vt-c-black-soft);
    --color-background-mute: var(--vt-c-black-mute);

    --color-border: var(--vt-c-divider-dark-2);
    --color-border-hover: var(--vt-c-divider-dark-1);

    --color-heading: var(--vt-c-text-dark-1);
    --color-text: var(--vt-c-text-dark-2);
  }
}
```

所以后期我们可以通过 `prefers-color-scheme: dark` 或者 `prefers-color-scheme: light` 来为用户定制不同主题的页面样式。

## 资源

- [prefers-color-scheme-MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-color-scheme)
- [prefers-color-scheme-caniuse](https://caniuse.com/?search=prefers-color-scheme)
