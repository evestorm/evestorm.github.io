---
title: vue项目element-ui消息提示框及确认弹框封装
tags:
  - element-ui
  - Vue
categories:
  - 前端
  - UI
  - element-ui
abbrlink: 8979
date: 2020-07-17 23:01:46
---

## utils 下新建封装文件

> src/utils/confirm.js

<!-- more -->

```js
import { MessageBox, Message } from "element-ui";

/**
 * @author 封装 element-ui 弹框
 * @param text
 * @param type
 * @returns {Promise}
 */
export function handleConfirm(text = "确定执行此操作吗？", type = "danger") {
  return MessageBox.confirm(text, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: type,
    center: true
  });
}

/**
 * @author 封装 element-ui 消息提示
 * @param text
 * @param type
 * @returns {Promise}
 */
export function handleAlert(text = "操作成功", type = "success") {
  return Message({
    showClose: true,
    message: text,
    type: type
  });
}
#页面vue文件中引用

import { handleConfirm, handleAlert } from '@/utils/confirm'
export default {
  data() {
    return {
      ...
    };
  },
  methods: {
    ...
    handleClose(formName) {
      handleConfirm('系统将不会保存您所做的更改，确定要离开吗？').then(res => {
        ...
      }).catch(err => {
        console.log('err', err)
      })
    },
    delConfirm(formName) {
      ...
      handleAlert('删除成功')
      ...
    }
  },
  ...
}
```
