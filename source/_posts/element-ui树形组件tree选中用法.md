---
title: element-ui树形组件tree选中用法
tags:
  - element-ui
categories:
  - 前端
  - UI
  - element-ui
abbrlink: 50700
date: 2022-06-16 09:00:21
---

tree选中笔记

<!-- more -->

```html
<el-tree
  :data="permissionForm.treeData"
  :props="permissionForm.defaultProps"
  show-checkbox
  node-key="id"
  ref="permissionTreeRef"
  default-expand-all
  :default-checked-keys="permissionForm.selectedList"
>
</el-tree>
```

```js
const permissionForm = reactive({ // 预案查看权限表单
  preplanId: null, // 预案id
  treeData: [], // 数据源
  selectedList: [], // 选中用户数组 e.g. ['1', '2', '5']
  defaultProps: {
    children: 'children',
    label: 'name'
  }
});


// 设置查看权限
async onPermissionAction({ row }) {
  console.log('设置查看权限');
  permissionDialogRef.value.show();      
  permissionForm.preplanId = row.id;
  const res = await service.getPermissionById({ id: row.id });
  const permissionList = res.data;
  if (Array.isArray(permissionList)) {
    if (permissionList.length) { // 设置了权限
      permissionTreeRef.value.setCheckedKeys(permissionList.map(v => v.userId));
    } else { // 默认为空, 代表没有设置权限, 要全选
      permissionTreeRef.value.setCheckedKeys(permissionForm.selectedList);
    }
  }
},
```