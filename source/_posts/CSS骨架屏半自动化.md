---
title: CSS骨架屏半自动化
tags:
  - 用户体验
  - 骨架屏
categories:
  - 前端
  - CSS
abbrlink: 24488
date: 2020-07-29 14:14:06
---

前几天写了个骨架屏组件，但是太定制化了，每次需要的时候都得重新手写骨架屏太麻烦。这次用 CSS 的伪类特性实现了骨架屏的半自动化，虽然还是有点繁琐，但相比以前的效率还是提升了一个档次。

<!-- more -->

## 核心代码（less）

```css
.skt-basic {
  position: relative;
  overflow: hidden;
  border: none !important;
  background-color: transparent !important;
  background-image: none !important;
  transform: scale(1, 0.9);
  transform-origin: left top;
}

.skt-main {
  /* 默认深色背景 */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9;
    width: 100%;
    height: 100%;
    background-color: #e6e6e6;
    display: block;
  }

  /* 想要圆角加 yyt-sk-round */
  &.yyt-sk-round::after {
    border-radius: 4rpx;
  }
  /* 不想要动画加 yyt-sk-not-ani */
  &:not(.yyt-sk-not-ani)::before {
    position: absolute;
    top: 0;
    width: 30%;
    height: 100%;
    content: '';
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-45deg);
    z-index: 99;
    animation: skeleton-ani 1s ease infinite;
    display: block;
  }
  /* 浅色背景 */
  &.yyt-light {
    &::after {
      background-color: #f8fafc;
    }
  }
}

// 骨架屏
.skt-loading {
  pointer-events: none; /* 加载中阻止事件 */
  .skeleton,
  .skeleton-25,
  .skeleton-50,
  .skeleton-75 {
    .skt-basic();
    .skt-main();
  }
  .skeleton-25 {
    transform: scale(0.25, 0.9);
  }
  .skeleton-50 {
    transform: scale(0.5, 0.9);
  }
  .skeleton-75 {
    transform: scale(0.75, 0.9);
  }
}

@keyframes skeleton-ani {
  /* 骨架屏动画 */
  from {
    left: -100%;
  }
  to {
    left: 150%;
  }
}
```

## 使用方式

> HTML 部分

```html
<template>
  <!-- 使用 skt-loading 包裹整个容器 -->
  <div :class="{'skt-loading': loading }">
    <!-- 给想要用骨架屏展示的容器添加 skeleton 类 -->
    <div class="skeleton"></div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: true // 默认loading为true，加载骨架屏
      };
    },
    mounted() {
      setTimeout(() => {
        this.loading = false;
      }, 3000);
    }
  };
</script>
```

## 使用注意

- after 伪元素无法插入到 `input`、`img` 等非容器元素中，所以如果需要添加 `.skleton`，则需要加一层元素将其包裹
- Vue 中使用到 v-for 动态渲染的类似列表数据，则需要先有 mock 数据来生成 dom

[ Vue](https://evestorm.github.io/tags/Vue/) [ 用户体验](https://evestorm.github.io/tags/用户体验/) [ 骨架屏](
