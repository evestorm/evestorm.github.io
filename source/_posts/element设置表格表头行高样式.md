---
title: element设置表格表头行高样式
tags:
  - Vue
  - element-ui
categories:
  - 前端
  - UI
  - element-ui
abbrlink: 63255
date: 2021-01-07 16:36:49
---

element-ui 设置表头地址：https://element.eleme.io/#/zh-CN/component/table#table-attributes

- max-height Table 的最大高度。合法的值为数字或者单位为 px 的高度。
- header-row-style 表头行的 style
- header-cell-style 表头单元格的 style
- row-style 行的 style
- cell-style 单元格的 style

```html
<el-table
  :max-height="196"
  :header-row-style="{height: '46px'}"
  :header-cell-style="{height: '46px'}"
  :row-style="{height: '50px'}"
  :cell-style="{height: '50px'}"
  stripe
>
  ...
</el-table>
```
