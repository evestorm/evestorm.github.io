---
title: 解决elementUI的table里包含表单验证的问题
tags:
  - element-ui
categories:
  - 前端
  - UI
  - element-ui
abbrlink: 13510
date: 2022-05-27 15:18:00
---

项目中，需要在 table 里做表单的验证：

{% asset_img table-rules.png 100% %}

## 解决方案

el-form-item 动态绑定 prop

`:prop="'tableData.' + scope.$index + '.字段名'"`

## 示例

```vue
<template>
  <el-form :rules="model.rules" :model="model" label-position="right" label-width="120px" ref="form">
    <el-form-item label="请选择备份点: ">
      <el-table
        :data="model.appBackupList"
        style="width: 500px; margin: 0 auto;"
        max-height="300">
        <el-table-column
          label="应用">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.applicationName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="备份点选择">
          <template slot-scope="scope">
            <el-form-item :prop="'appBackupList.' + scope.$index + '.backupId'" :rules='model.rules.backupId'>
              <el-select
                v-model="scope.row.backupId"
                placeholder="请选择备份点"
                @change="backupChange($event, scope.row)">
                <el-option
                  v-for="item in scope.row.backupList"
                  :key="item.backupId"
                  :label="item.backupName"
                  :value="item.backupId">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      model: {
        rules: {
          backupId: [
            {
              required: true,
              message: '请选择备份点',
              trigger: 'change'
            }
          ],
        },
        appBackupList: [{
          applicationId: 1,
          applicationName: '应用A',
          backupId: null,
          backupList: [{
            backupId: '1',
            backupName: '备份点1'
          }, {
            backupId: '2',
            backupName: '备份点2'
          }, {
            backupId: '3',
            backupName: '备份点3'
          }]
        }], // 备份点列表
      }
    }
  }
}
</script>
```