---
title: 转载-vue项目中枚举值统一维护管理
tags:
  - Vue
  - 技巧
  - 枚举
  - 转载
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 56971
date: 2020-12-28 10:32:45
---

转载自：https://www.jianshu.com/p/75516ec4f366

由于多页面有时需要共同的表单枚举选择，页面以及 table 需要显示枚举值 label 以及有时需要根据枚举值判断，故个人使用如下枚举方式进行统一管理。

<!-- more -->

### 在 common 或者个人模块下创建单独枚举 js,如 enums.js。然后导入@/common/Enum.js 并添加一个字面量对象。

```js
// 落户任务状态
settleTaskStatusEnum: new Enum()
  .add('ALL', '全部', null)
  .add('SETTLE', '待落户', 0)
  .add('SETTLED', '已落户', 1)
  .add('CANCEL', '已取消', 2);
```

### 如需要表单选择可如下使用：

```html
<el-select
  style="width: 99%"
  v-model="query.taskStatus"
  clearable
  placeholder="请选择"
>
  <-- 传统做法 -->
  <el-option value="0" :label="待落户 "></el-option>
  <el-option value="1" :label="已落户 "></el-option>
  <el-option value="2" :label="已取消"></el-option>

  <-- 基于枚举类的方法 -->
  <el-option
    v-for="item in enums.settleTaskStatusEnum"
    :key="item.value"
    :value="item.value"
    :label="item.label"
  ></el-option>
</el-select>
```

效果如：

{% asset_img element-select.jpg element-select %}

### 如需页面以及 table 显示枚举 label 可如下使用：

```html
<-- 可以避免为每个枚举值进行判断后，再取其label，后端返回taskStatus:1 -->
<el-table-column prop="taskStatus" label="任务状态">
  <template slot-scope="scope">
    <-- 传统做法：定义function通过switch或者if判断并返回label --> {{
    switch(scope.row.taskStatus) case 0:... case 1... case 2.... }} <--
    基于枚举类的方法 --> {{
    enums.settleTaskStatusEnum.getLabelByValue(scope.row.taskStatus) }}
  </template>
</el-table-column>
```

效果如：

{% asset_img status.jpg status %}

### 如需根据枚举值判断可如下使用：

```js
// 只能对【待落户】的数据点击
// 传统做法（硬编码）
if (item.taskStatus === 1) {
  this.settleBtnDisabled = false;
}
// 基于枚举类方法，可以防止硬编码
if (item.taskStatus === enums.settleTaskStatusEnum.SETTLE.value) {
  this.settleBtnDisabled = false;
}
```

### 以下为具体 Enum 类

```js
/**
 * 枚举类
 * @author meilin.huang
 */
export class Enum {
  /**
   * 添加枚举字段
   * field: 枚举字段
   * label: 界面显示
   * value: 枚举值
   */
  add(field, label, value) {
    this[field] = { label, value };
    return this;
  }

  /**
   * 根据枚举value获取其label
   */
  getLabelByValue(value) {
    // 字段不存在返回‘’
    if (value === undefined || value === null) {
      return '';
    }
    for (const [key, val] of Object.entries(this)) {
      if (val.value === value) {
        return val.label;
      }
    }

    return '';
  }
}
```
