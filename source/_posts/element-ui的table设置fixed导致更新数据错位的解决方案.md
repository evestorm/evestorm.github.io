---
title: element-ui的table设置fixed导致更新数据错位的解决方案
tags:
  - element-ui
  - 技巧
  - 解决方案
categories:
  - 前端
  - UI
  - element-ui
abbrlink: 53669
date: 2021-05-28 14:48:58
---

如题，一旦设置 table 中的某些列为 fixed ，可能会导致数据更新后表格显示错位的 bug。

<!-- more -->

## 解决方案

### 方法一:监听 table 数据每次数据得到或改变时重新渲染

```js
 /* 监听table数据对象 */
watch: {
  tableData(val) {
    this.doLayout();
  }
}
methods: {
 /* 重新渲染table组件 */
 doLayout(){
  let that = this
     this.$nextTick(() => {
       that.$refs.table.doLayout()
     })
 }
}

```

### 方法二:直接监听 element 的 table 所在滚动条的 div 设置滚动条永远不超出当前 div 高度

```js
mounted() {
    let _this = this
    this.$refs.table.$el.querySelector(".el-table__body-wrapper").addEventListener("scroll",function(event){
      let scrollTop = _this.$refs.table.$el.querySelector(".el-table__body-wrapper").scrollTop
      let scrollHeight = _this.$refs.table.$el.querySelector(".el-table__body-wrapper").scrollHeight
      let height = _this.$refs.table.$el.querySelector(".el-table__body-wrapper").offsetHeight
      if((scrollTop + height) >= scrollHeight) {
        _this.$refs.table.$el.querySelector(".el-table__body-wrapper").scrollTop = scrollHeight - height
      }
    })
  }
```

### 方法二的优化: 添加防抖

```js
mounted(){
    let _this = this
    this.$refs.table.$el.querySelector(".el-table__body-wrapper").addEventListener("scroll",function(event){
        _this.debounce(()=>{
            let scrollTop = _this.$refs.table.$el.querySelector(".el-table__body-wrapper").scrollTop
            let scrollHeight = _this.$refs.table.$el.querySelector(".el-table__body-wrapper").scrollHeight
            let height = _this.$refs.table.$el.querySelector(".el-table__body-wrapper").offsetHeight
            if((scrollTop + height) >= scrollHeight) {
            _this.$refs.table.$el.querySelector(".el-table__body-wrapper").scrollTop = scrollHeight - height
            }
        },500)
    })
}
methods:{
 debounce(fn,delay){
     let timer = null
     return function() {
         if(timer){
             clearTimeout(timer)
         }
         timer = setTimeout(fn,delay)
     }
 }
}

```
