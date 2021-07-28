---
title: 转载-Vuetify与Vue-i18n整合踩坑指南
tags:
  - vuetify
  - i18n
categories:
  - 前端
  - UI
  - VuetifyJS
abbrlink: 32560
date: 2021-07-26 16:36:26
---

文章来源: <https://pangwu86.com/posts/1360575077/>

项目中使用了 [Vuetify](https://vuetifyjs.com/) 这个 UI 库，现在要加上多国语言功能，踩了几个坑记录下。

## 使用 Vuetify 内置 i18n

---

Vuetify 的[国际化文档链接](https://vuetifyjs.com/zh-Hans/features/internationalization/)

<!-- more -->

### 初始化

```js
// 引用vue,vuetify
import Vue from "vue";
import Vuetify from "vuetify/lib";
Vue.use(Vuetify);

// 选择需要的语言
// 例如：简体中文 + 日文
import zhHans from "vuetify/es5/locale/zh-Hans";
import ja from "vuetify/es5/locale/ja";

// 设置lang相关参数
const vuetify = new Vuetify({
  lang: {
    current: "zhHans",
    locales: { zhHans, ja },
  },
});
const app = new Vue({
  vuetify,
}).$mount("#app");
```

### 使用 t 函数

```html
<div class="my-component">{{ $vuetify.lang.t("$vuetify.hello") }}</div>
```

### 切换语言

```js
// 触发切换时
this.$vuetify.lang.current = "zhHans";
```

## 使用 Vuetify 整合 Vue-i18n

---

Vue-i18n 的[官方文档链接](https://kazupon.github.io/vue-i18n/zh/started.html)

Vuetify 内置国际化功能比较简陋，官方也推荐使用整合的方式，后续添加自定义的国际化文本也更方便些。

### 初始化

```js
// 引用vue,vuetify,vue-i18n
import Vue from "vue";
import Vuetify from "vuetify/lib";
import VueI18n from "vue-i18n";

Vue.use(Vuetify);
Vue.use(VueI18n);

// 选择需要的语言
// 例如：简体中文 + 日文
import zhHans from "vuetify/es5/locale/zh-Hans";
import ja from "vuetify/es5/locale/ja";

// 整合自定义的信息
// 如果使用 $vuetify.lang.t 则需要把内容定义在 $vuetify 命名空间下
const zhHansUser = {
  ...zhHans,
  hello: "你好",
  $vuetify: {
    hello: "你好",
  },
};
const jaUser = {
  ...ja,
  hello: "こんにちは",
  $vuetify: {
    hello: "こんにちは",
  },
};

// 创建 VueI18n 实例
const i18n = new VueI18n({
  locale: "zhHans",
  messages: {
    zhHans: zhHansUser,
    ja: jaUser,
  },
});

// Vue-i18n的t方法替换Vuetify的默认实现
const vuetify = new Vuetify({
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
});
const app = new Vue({
  vuetify,
  i18n,
}).$mount("#app");
```

### 使用 t 函数

```html
<!-- 使用 $t 没有规则限制 -->
<div class="my-component">{{ $t("hello") }}</div>
<div class="my-component">{{ $t("$vuetify.hello") }}</div>

<!-- 使用 $vuetify.lang.t 只能获取 $vuetify 命名空间下的内容 -->
<div class="my-component">{{ $vuetify.lang.t("$vuetify.hello") }}</div>
```

### 切换语言

```js
// 触发切换时
this.$i18n.locale = "zhHans";
```

## 总结

---

- `Vuetify` 自带了一套国际化配置，但实现的 `t` 函数的功能相对简陋，所以实际项目中更适合加入 `Vue-i18n` 整合使用。
- `Vuetify` 国际化文本都放在 `$vuetify` 这个命名空间下。
- 整合 `Vue-i18n`后，实际上就是使用 `Vue-i18n` 来实现国际化，把 `Vuetify` 的文本导入并且托管了 `Vuetify` 的 `t` 函数。

## 资源

- [Vue 国际化 vue-i18n 相关用法、实践总结](http://www.zuo11.com/blog/2021/5/vue-i18n_use.html)
