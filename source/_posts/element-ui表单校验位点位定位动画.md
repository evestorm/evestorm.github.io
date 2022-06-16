---
title: element-ui表单校验位点位定位动画
tags:
  - element-ui
categories:
  - 前端
  - UI
  - element-ui
abbrlink: 34961
date: 2022-06-16 19:01:51
---

## 需求

期望在表单页面超出一页滚屏的情况下，校验表单时如果表单校验不通过，能够向上滚动到第一个未通过校验的 `<el-form-item` 处。

## 实现思路

1. 给 validate 回调函数中添加一个参数 object
2. 当校验不通过时收集所有未通过字段项提示信息，将其通过 push 方法添加到定义好的数组中（str）
3. 通过 `this.$refs[Object.keys(object)[0]]` 获取到首个字段校验不通过的提示信息
4. 利用 `Object.prototype.toString.call()` 方法判断 `this.$refs[Object.keys(object)[0]]` 的类型是否为对象的字符串形式
5. 最后通过 `scrollIntoView` 方法滚动到首个不通过校验字段项

## 示例代码

```js
/**
 * 添加或者更新预案
 */
const addOrUpdatePlan = async () => {
  return new Promise((resolve, reject) => {
    baseFormRef.value.$refs.planFormRef.validate(async (valid, object) => {
      if (valid) { // 验证通过
        // todo
      } else { // 验证不通过
        let noValidArr = [];
        for (const key in object) {
          object[key].map(item => {
            noValidArr.push(item.message);
          });
          let dom = baseFormRef.value.$refs[Object.keys(object)[0]];
          if (Object.prototype.toString.call(dom) !== '[object Object]') {
            dom = dom[0];
            break;
          }
          dom.$el.scrollIntoView({
            behavior: 'smooth'
          });
        }
        reject(false);
      }
    });
  });
}
```

注意: 需要校验的字段项的 `<el-form-item>` 需要添加 `ref` ，作用主要是用来定位（ref 的值建议与 prop 同名）。

```html
<el-form
  ref="planFormRef"
  :model="form.data"
  :rules="form.rules"
  ...
>
  <el-form-item
    label="预案名称"
    prop="name"
    ref="name"
  >
    ...
  </el-form-item>
  <el-form-item label="所属分类" prop="classificationId" ref="classificationId">
    ...
  </el-form-item>
  <el-form-item label="可用部门" prop="deptList" ref="deptList">
    ...
  </el-form-item>
  <el-form-item label="编写人" prop="writers" ref="writers">
    ...
  </el-form-item>
  ...
</el-form>
```