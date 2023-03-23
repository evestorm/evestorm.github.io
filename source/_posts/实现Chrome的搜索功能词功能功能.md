---
title: 实现Chrome的搜索功能词功能功能
tags:
  - Vue
categories:
  - 前端
  - JS
abbrlink: 40642
date: 2023-03-22 17:53:15
---

最近接了个需求要实现 Chrome 的查找功能，也就是在当前页全局搜索高亮输入的关键词，可以上下翻阅，和 Chrome 自带的 Ctrl + F 功能一样。

<!-- more -->

这里 mark 下简单实现，用的 Vue :

```html
<template>
  <div>
    <input type="text" v-model="searchText" placeholder="输入关键字" />
    <button @click="goPrev">上一个</button>
    <button @click="goNext">下一个</button>
    <div ref="content" v-html="highlightedContent"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: ``,
      searchText: '',
      highlightedContent: `
      <div class="container">
          <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quas ut laboriosam temporibus fuga blanditiis, laborum alias debitis modi illum culpa amet qui similique assumenda aliquam error numquam, vel distinctio!</span>
          <div class="content">
            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quas ut laboriosam temporibus fuga blanditiis, laborum alias debitis modi illum culpa amet qui similique assumenda aliquam error numquam, vel distinctio!</span>
          </div>
          <div class="footer" title="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quas ut laboriosam temporibus fuga blanditiis, laborum alias debitis modi illum culpa amet qui similique assumenda aliquam error numquam, vel distinctio!">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quas ut laboriosam temporibus fuga blanditiis, laborum alias debitis modi illum culpa amet qui similique assumenda aliquam error numquam, vel distinctio!
          </div>
        </div>
      `,
      matches: [],
      currentMatch: -1
    };
  },
  mounted() {
    this.content = this.$refs.content.innerHTML;
  },
  methods: {
    goPrev() {
      if (this.currentMatch > 0) {
        this.currentMatch--;
      } else {
        this.currentMatch = this.matches.length - 1;
      }
      this.highlightMatch();
    },
    goNext() {
      if (this.currentMatch < this.matches.length - 1) {
        this.currentMatch++;
      } else {
        this.currentMatch = 0;
      }
      this.highlightMatch();
    },
    highlightMatch() {
      // 取消之前的高亮
      this.$refs.content.querySelectorAll('.highlighted').forEach((el) => {
        el.classList.remove('highlighted');
      });
      // 获取当前匹配位置
      const match = this.matches[this.currentMatch];
      // 将匹配关键词用span标签包裹并添加高亮样式
      const highlightedContent =
        this.content.substring(0, match.startPos) +
        '<span class="highlighted">' +
        match.text +
        '</span>' +
        this.content.substring(match.endPos);
      this.$refs.content.innerHTML = highlightedContent;
      // 滚动到匹配位置
      this.$refs.content.querySelectorAll('.highlighted')[0].scrollIntoView();
    },
    search() {
      this.matches = [];
      this.currentMatch = -1;
      // 忽略html标签属性中的关键词
      // const regex = new RegExp(this.searchText, 'gi');
      const regex = new RegExp(`(?![^<]*>)(${this.searchText})`, "gi");
      let match;
      while ((match = regex.exec(this.content))) {
        if (!match.input.substring(match.index - 1, match.index).match(/[\w\\-]/)) {
          this.matches.push({ startPos: match.index, endPos: regex.lastIndex, text: match[0] });
        }
      }
      if (this.matches.length > 0) {
        this.currentMatch = 0;
        this.highlightMatch();
      } else {
        this.$refs.content.innerHTML = this.content;
      }
    }
  },
  watch: {
    searchText() {
      this.highlightedContent = this.content;
      if (this.searchText) {
        this.search();
      }
    }
  }
};
</script>

<style>
.highlighted {
  background-color: yellow;
}
</style>
```

效果如下：

{% asset_img search.png 效果图 %}
