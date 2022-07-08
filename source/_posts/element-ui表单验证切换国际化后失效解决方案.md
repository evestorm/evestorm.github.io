---
title: element-ui表单验证切换国际化后失效解决方案
tags:
  - element-ui
  - 转载
categories:
  - 前端
  - UI
  - element-ui
abbrlink: 42521
date: 2021-03-10 13:59:29
---

转载自：https://www.cnblogs.com/listen9436/p/10644527.html

<!-- more -->

```html
<el-form
  :model="ruleForm"
  :rules="rules"
  ref="ruleForm"
  label-width="100px"
  labelPosition="top"
  :inline="true"
  class="demo-ruleForm"
>
  <el-row :gutter="59">
    <el-col :span="12">
      <el-form-item :label="$t('joinUs.surname')" prop="surname">
        <el-input class="edit-input" v-model="ruleForm.surname"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item :label="$t('joinUs.givenName')" prop="givenName">
        <el-input class="edit-input" v-model="ruleForm.givenName"></el-input>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row :gutter="59">
    <el-col :span="12">
      <el-form-item :label="$t('joinUs.email')" prop="email">
        <el-input class="edit-input" v-model="ruleForm.email"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item :label="$t('joinUs.phone')" prop="phoneNumber" required>
        <el-row class="edit-tel">
          <el-col :span="8">
            <el-input class="edit-tel1" v-model="phone1"></el-input>
          </el-col>
          <el-col class="line" :span="2">—</el-col>
          <el-col :span="14">
            <el-input class="edit-tel2" v-model="phone2"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
    </el-col>
  </el-row>
</el-form>
```

需求：
必填：

surname givenName email phoneNumber

正则：

surname 只允许输入英文
givenName 只允许输入中文
phoneNumber 只允许输入 1-20 个数字，
email 邮箱

```js
data () {
  return {
    ruleForm: {
      surname: "",
      givenName: "",
      email: "",
      phoneNumber: ""
    }
    phone1: "",
    phone2: ""
  }
}
```

由于国际化问题，切换时在 data 中不起作用，需要将表达式放到 computed 属性中

```js
computed: {
  rules () {
    var validateSurnmae = (rule, value, callback) => {
      let reg = /^[A-Za-z]+$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('joinUs.surnameErr3')))
      } else {
        callback()
      }
    };
    var validateGivenName = (rule, value, callback) => {
      let reg = /^[\u4e00-\u9fa5]+$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('joinUs.givenNameErr3')))
      } else {
        callback()
      }
    };
    return {
      surname: [
        { required: true, message: this.$t('joinUs.surnameErr1'), trigger: "blur" },
        { validator: validateSurnmae, trigger: "blur" },
        { min: 1, max: 20, message: this.$t('joinUs.surnameErr2'), trigger: "blur" }
      ],
      givenName: [
        { required: true, message: this.$t('joinUs.givenNameErr1'), trigger: "blur" },
        { validator: validateGivenName, trigger: "blur" },
        { min: 1, max: 20, message: this.$t('joinUs.givenNameErr2'), trigger: "blur" }
      ]
      email: [
        { required: true, message: this.$t('joinUs.emailError'), trigger: "blur" },
        {
          type: "email",
          message: this.$t('joinUs.emailError'),
          trigger: ["blur", "change"]
        }
      ],
      phoneNumber: [
        { required: true, message: this.$t('joinUs.phoneNumberError1'), trigger: "blur" },
        { type: 'number', message: this.$t('joinUs.phoneNumberError2'), trigger: "blur" }
      ]
    }
  }
}
```
