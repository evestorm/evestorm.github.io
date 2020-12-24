---
title: Vue如何同时监听多个属性
tags:
  - Vue
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 13802
date: 2019-12-24 15:56:59
---

在使用 watch 监听属性的时候发现需要同时监听三个属性。

### 解决方案

```js
export default {
  data() {
    return {
      name1: '',
      name2: '',
      age: ''
    };
  },
  computed: {
    listenChange() {
      const { name1, name2 } = this;
      return { name1, name2 };
    }
  },

  watch: {
    listenChange(val) {
      console.log('listenChange :', val);
      if (val.name1 === val.name2) {
        this.$set(this, 'age', 1);
      } else {
        this.$set(this, 'age', null);
      }
    }
  }
};
```

如果不能直接监听多个属性的话，我们可以换个想法，先将多个属性放在一个对象中，直接监听这个对象就可以了，这时候返回的 val 将会打印出你输入的 name1，name2 的内容，可以同时监听到这两个属性。
