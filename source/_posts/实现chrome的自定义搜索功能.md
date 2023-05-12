---
title: 实现chrome的自定义搜索功能
tags:
  - Highlight
  - '::selection'
abbrlink: 14922
date: 2023-04-06 13:37:29
categories:
---

## 起因

接到一个需求是实现 Chrome 浏览器自带的「Ctrl+F」搜索功能。起初想当然的以为直接正则+replace 不就搞定了么。但后边发现直接粗暴的 innerHTML + replace 会导致 Vue 的响应式以及事件绑定都失效。所以得想其他的法子。

<!-- more -->

## 寻求方案

Google 之后发现一篇文章：[CSS Custom Highlight API: The Future of Highlighting Text Ranges on the Web](https://css-tricks.com/css-custom-highlight-api-early-look/)

我根据文章内容提炼了两种方案以及相应方案的优缺点：

- `new Range()` + `document.getSelection()` + `::selection`
  - 优点：
    - 兼容性强，基本所有浏览器都支持
  - 缺点：
    - 创建的选择会重置用户已经手动选择的内容，反过来也一样
    - 除了 Firfox 外，Chrome 等浏览器只支持通过 `addRange` 创建一个选择范围，不支持添加多个选择
- `new Highlight`
  - 优点：
    - 可以自定义的创建选择，支持不同 range 不同颜色
    - 支持创建多个选择范围
  - 缺点：兼容性比较差，Chrome、Edge 只支持 105+ 的版本

## 实现 DEMO

### 正则 + innserHTML.replace

```vue
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

### new Highlight 的方案

> mixin.js

```js
export default {
  data() {
    return {
      searchText: '', // 用户输入的查询文本
      matches: [], // 匹配到的文本对象数组
      currentMatch: -1, // 当前目标索引
      isShowCustomSearch: false // 是否显示搜索框
    }
  },
  created() {
    this.initCustomSearch()
  },
  methods: {
    reset(isShowCustomSearch = false) {
      this.searchText = ''
      this.matches = []
      this.currentMatch = -1
      this.isShowCustomSearch = isShowCustomSearch
      CSS.highlights.clear()
    },
    goPrev() {
      if (!this.matches.length) return
      if (this.currentMatch > 0) {
        this.currentMatch--
      } else {
        this.currentMatch = this.matches.length - 1
      }
      this.highlightMatch()
    },
    goNext() {
      if (!this.matches.length) return
      if (this.currentMatch < this.matches.length - 1) {
        this.currentMatch++
      } else {
        this.currentMatch = 0
      }
      this.highlightMatch()
    },
    highlightMatch() {
      const range = new Range()
      const { word, parentNode, offset } = this.matches[this.currentMatch]
      range.setStart(parentNode, offset)
      range.setEnd(parentNode, offset + word.length)
      document.getSelection().removeAllRanges()
      document.getSelection().addRange(range)
      // 滚动到匹配位置
      const targetSelector = document.getSelection()
      if (targetSelector && targetSelector.focusNode && targetSelector.focusNode.parentElement) {
        targetSelector.focusNode.parentElement.scrollIntoView()
      }
    },
    highlightAllMatches() {
      const ranges = []
      for (const item of this.matches) {
        const range = new Range()
        const { word, parentNode, offset } = item
        range.setStart(parentNode, offset)
        range.setEnd(parentNode, offset + word.length)
        ranges.push(range)
      }
      const highlight = new Highlight(...ranges)
      CSS.highlights.set('custom-search-highlight', highlight)
    },
    search() {
      this.matches = []
      this.currentMatch = -1
      // 1. 获取页面中的所有文本节点
      const treeWalker = document.createTreeWalker(this.$refs.qbContent, NodeFilter.SHOW_TEXT)
      const allTextNodes = []
      let currentNode = treeWalker.nextNode()
      while (currentNode) {
        // 忽略不显示的内容
        if (getComputedStyle(currentNode.parentNode).display !== 'none') {
          allTextNodes.push(currentNode)
        }
        currentNode = treeWalker.nextNode()
      }
      console.log(allTextNodes)

      // 2. 遍历它们，每次将它们分成单独的单词，并为每个节点创建单词列表
      const allWords = []
      const reg = new RegExp(`(?![^<]*>)(${this.searchText})`, 'gi')
      for (const textNode of allTextNodes) {
        for (const word of textNode.textContent.matchAll(reg)) {
          allWords.push({
            word: word[0],
            parentNode: textNode,
            offset: word.index
          })
        }
      }
      console.log(allWords)
      this.matches = allWords
      if (this.matches.length > 0) {
        this.currentMatch = 0
        this.highlightMatch()
      }
      this.highlightAllMatches()
    },
    initCustomSearch() {
      document.addEventListener('keydown', this.preventBrowserDefaultSearch)
    },
    removeCustomSearch() {
      document.removeEventListener('keydown', this.preventBrowserDefaultSearch)
    },
    preventBrowserDefaultSearch(event) {
      if (event.keyCode === 114 || ((event.ctrlKey || event.metaKey) && event.keyCode === 70)) {
        this.isShowCustomSearch = true
        event.preventDefault()
        // 在此处添加您希望在按下搜索快捷键时执行的代码
      }
    },
    closeCustomSearch() {
      this.reset()
    },
    handleCustomSearchChange(val) {
      if (val && !this.isLoading) {
        this.search()
      }
      if (!val) {
        this.reset(true)
      }
    }
  },
}
```

> 组件

```vue
<template>
  <div v-show="isShowCustomSearch" class="custom-search">
      <el-input type="text" size="small" v-model="searchText" placeholder="输入关键字" @input="handleCustomSearchChange" />
      <span v-show="currentMatch >= 0">{{ currentMatch + 1 }}/{{ matches.length }}</span>
      <span @click="goPrev"><i class="el-icon-arrow-left"></i></span>
      <span @click="goNext"><i class="el-icon-arrow-right"></i></span>
      <span @click="closeCustomSearch"><i class="el-icon-circle-close"></i></span>
    </div>
</template>

<script>
import CustomSearchMixin from './mixin.js'

export default {
  //...,
  mixins: [CustomSearchMixin],
}
</script>
```

## 资源

- [CSS Custom Highlight API: The Future of Highlighting Text Ranges on the Web](https://css-tricks.com/css-custom-highlight-api-early-look/)
- [Selection and Range](https://javascript.info/selection-range)
- [记一次由::selection引起的小小bug](https://juejin.cn/post/7128298322292375582)
- [padolsey/findAndReplaceDOMTextPublic](https://github.com/padolsey/findAndReplaceDOMText)
- [全文关键词查找（关键词高亮） vue](https://juejin.cn/post/6844904197024907271)
