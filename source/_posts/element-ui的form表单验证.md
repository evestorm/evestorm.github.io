---
title: element-ui的form表单验证
tags:
  - element-ui
categories:
  - 前端
  - UI
  - element-ui
abbrlink: 38065
date: 2021-02-25 14:59:37
---

转载自：https://my.oschina.net/u/4374872/blog/3701890

## 普通输入验证

```html
<el-form-item label="活动名称" prop="name">
  <!-- validate-event属性的作用是: 输入时不触发表单验证.提交时再验证,你也可以设置成动态验证 -->
  <el-input v-model="registerData.name" :validate-event="false"></el-input>
</el-form-item>
```

```js
export default {
  data() {
    rules: {
      // 表单验证规则
      name: [
        { required: true, message: '请输入活动名称' }, // 'blur'是鼠标失去焦点的时候会触发验证
        { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
      ];
    }
  }
};
```

<!-- more -->

## 数字类型验证

```html
<el-form-item label="区域面积" prop="area">
  <!-- 输入的类型为Number时,需要加一个数字转换的修饰符,输入框默认的类型是String类型,但是我试了一下,发现并不能做验证,所以自己写了函数方法验证 -->
  <!-- <el-input v-model.number="registData.area" autocomplete="off"></el-input> -->
  <!-- keyup是鼠标弹起事件, autocomplete是input自带的原生属性,自动补全功能,on为开启,off为关闭 -->
  <el-input
    v-model="registData.area"
    @keyup.native="InputNumber('area')"
    autocomplete="off"
  ></el-input>
</el-form-item>
```

```js
export default {
  data() {
    return {
      area: [
        // 数字类型 'number', 整数: 'integer', 浮点数: 'float'
        // {type: 'number', message: '请输入数字类型', trigger: 'blur'},
        // {type: 'integer', message: '请输入数字类型', trigger: 'change'}, // 'change'是表单的值改变的时候会触发验证
        { required: true, message: '请输入区域面积', trigger: 'blur' }
      ]
    };
  },
  methods: {
    // 自己写的正则验证,限制用户输入数字以外的字符
    // 过滤输入的金额
    InputNumber(property) {
      this.registData[property] = this.limitInputPointNumber(
        this.registData[property]
      );
    },

    // 验证只能输入数字
    limitInputNumber(val) {
      if (val) {
        return String(val).replace(/\D/g, '');
      }
      return val;
    },

    // 限制只能输入数字(可以输入两位小数)
    limitInputPointNumber(val) {
      if (val === 0 || val === '0' || val === '') {
        return '';
      } else {
        let value = null;
        value = String(val).replace(/[^\d.]/g, ''); // 清除“数字”和“.”以外的字符
        value = value.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
        value = value
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.');
        value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
        return Number(value);
      }
    }
  }
};
```

## 嵌套验证（独立验证）

这种情况是一行里有多个输入框或选择的情况,这里有两种方法,第一种是 el-form 嵌套写法,验证是独立的

{% asset_img nest-form.png 嵌套验证 %}

```html
<el-form-item label="活动时间" required>
  <el-col :span="11">
    <el-form-item prop="date1">
      <el-date-picker
        type="date"
        placeholder="选择日期"
        v-model="registData.date1"
        style="width: 100%;"
      ></el-date-picker>
    </el-form-item>
  </el-col>
  <el-col class="line" :span="2">-</el-col>
  <el-col :span="11">
    <el-form-item prop="date2">
      <el-time-picker
        type="fixed-time"
        placeholder="选择时间"
        v-model="registData.date2"
        style="width: 100%;"
      ></el-time-picker>
    </el-form-item>
  </el-col>
</el-form-item>
```

```js
export default {
  data() {
    return {
      date1: [
        {
          type: 'date',
          required: true,
          message: '请选择日期',
          trigger: 'change'
        }
      ],
      date2: [
        {
          type: 'date',
          required: true,
          message: '请选择时间',
          trigger: 'change'
        }
      ]
    };
  }
};
```

## 嵌套验证（联动验证）

这种是联动验证,适用省级联动场景,先选国家后触发城市验证

{% asset_img nest-form-linkage.png 嵌套联动验证 %}

```html
<!-- region是一个对象,国家和城市是它的属性 -->
<el-form-item label="活动区域" prop="region">
  <el-select v-model="registData.region.country" placeholder="请选择国家">
    <el-option label="国家一" value="USA"></el-option>
    <el-option label="国家二" value="China"></el-option>
  </el-select>
  <el-select v-model="registData.region.city" placeholder="请选择城市">
    <el-option label="城市一" value="shanghai"></el-option>
    <el-option label="城市二" value="beijing"></el-option>
  </el-select>
</el-form-item>
```

```js
export default {
  data() {
    return {
      region: [
        {
          type: 'object',
          required: true,
          // 这里有两种处理,一种是自定义验证,拿到值后自己对属性进行验证,比较麻烦
          // validator: (rule, value, callback) => {
          //   console.log(55, value)
          //   if (!value.country) {
          //     callback(new Error('请选择国家'))
          //   } else if (!value.city) {
          //     callback(new Error('请选择城市'))
          //   } else {
          //     callback()
          //   }
          // },
          trigger: 'change',
          // 官网提供了对象的嵌套验证,只需要把需要验证的属性,放在fields对象里,就会按顺序进行验证
          fields: {
            country: { required: true, message: '请选择国家', trigger: 'blur' },
            city: { required: true, message: '请选择城市', trigger: 'blur' }
          }
        }
      ]
    };
  }
};
```

## 表单验证 model 绑定的是一个对象下的某个子对象属性的时候无法验证

如果 data 中定义的数据结构是这样的(组件上最终绑定的是 dataForm.name.value)：

```js
dataForm: {
  name: {
    value: '';
  }
}
```

那么 rules 中需要这样写：

```js
rules: {
  'name.value': {
    { required: true, message: '请输入项目名称', trigger: 'blur' }
  }
}
```

template 需要这么写：

````html
<el-form-item prop="name.value">
  <el-input v-model="dataForm.name.value"></el-input>
</el-form-item>
```

来自：https://github.com/ElemeFE/element/issues/1655#issuecomment-388538296

## 图片上传验证（手动触发部分验证方法）

有时候会需要在表单里上传图片,但是图片上传是一个异步过程,属性值改变后不会去触发验证规则

{% asset_img img-form.png 图片验证 %}

```html
el-form-item label="活动图片" prop="fileUrl">
    <el-upload
      :action="action"
      :on-success="handleSuccess"
      :data="uploadData"
      :limit="20"
      list-type="picture-card"
      :on-preview="handlePreview"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
  </el-form-item>
````

```js
export default {
  data() {
    return {
      fileUrl: [{ required: true, message: '请上传图片', trigger: 'change' }]
    };
  },
  methods: {
    // 删除图片
    handleRemove(file, fileList) {
      this.registData.fileUrl = '';
      // 文件删除后也要触发验证,validateField是触发部分验证的方法,参数是prop设置的值
      this.$refs.registerRef.validateField('fileUrl');
    },

    // 图片上传
    handleSuccess(res, file, fileList) {
      // 这里可以写文件上传成功后的处理,但是一定要记得给fileUrl赋值
      this.registData.fileUrl = 'fileUrl';
      // 文件上传后不会触发form表单的验证,要手动添加验证
      this.$refs.registerRef.validateField('fileUrl');
    }
  }
};
```

## 完整代码

```html
<template>
  <div>
    <p>shopInfo</p>
    <div class="company" id="company">
      <!-- model是验证的数据来源 -->
      <el-form :model="registData" :rules="rules" ref="registerRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="name">
          <!-- validate-event输入时不触发表单验证,提交时再验证,也可以设置成动态验证 -->
          <el-input v-model="registData.name" :validate-event="false"></el-input>
        </el-form-item>
        <el-form-item label="区域面积" prop="area">
          <!-- 输入的类型为Number时,需要加一个数字转换的修饰符,输入框默认的类型是String类型,但是我试了一下,发现并不能做验证,所以自己写了函数方法验证 -->
          <!-- <el-input v-model.number="registData.area" autocomplete="off"></el-input> -->
          <el-input v-model="registData.area" @keyup.native="InputNumber('area')" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="region">
          <el-select v-model="registData.region.country" placeholder="请选择国家">
            <el-option label="国家一" value="USA"></el-option>
            <el-option label="国家二" value="China"></el-option>
          </el-select>
          <el-select v-model="registData.region.city" placeholder="请选择城市">
            <el-option label="城市一" value="shanghai"></el-option>
            <el-option label="城市二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="registData.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker type="fixed-time" placeholder="选择时间" v-model="registData.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="registData.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="registData.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="registData.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动图片" prop="fileUrl">
          <el-upload
            :action="action"
            :on-success="handleSuccess"
            :data="uploadData"
            :limit="20"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input type="textarea" v-model="registData.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 提交的时候传入的是表单的ref -->
          <el-button type="primary" @click="submitForm('registerRef')">立即创建</el-button>
          <el-button @click="resetForm('registerRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style scoped>
  .company {
    padding: 30px;
    text-align: left;
    width: 600px;
  }
</style>
<script>
export default {
  name: 'shopInfo',

  data () {
    return {
      registData: {
        name: '', // 名称
        area: '', // 面积
        region: {}, // 地区
        date1: '', // 日期
        date2: '', // 时间
        delivery: false, // 即时配送
        type: [], // 活动性质
        resource: '', // 特殊资源
        fileUrl: '', // 活动图片
        desc: '' // 活动形式
      }, // 需要验证的表单属性,必须在data中定义
      rules: { // 表单验证规则
        name: [
          { required: true, message: '请输入活动名称' }, // 'blur'是鼠标失去焦点的时候会触发验证
          { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
        ],
        area: [
          // 数字类型
          // {type: 'number', message: '请输入数字类型', trigger: 'blur'},
          // {type: 'integer', message: '请输入数字类型', trigger: 'change'}, // 'change'是表单的值改变的时候会触发验证
          {required: true, message: '请输入区域面积', trigger: 'blur'}
        ],
        region: [
          {
            type: 'object',
            required: true,
            // validator: (rule, value, callback) => {
            //   console.log(55, value)
            //   if (!value.country) {
            //     callback(new Error('请选择国家'))
            //   } else if (!value.city) {
            //     callback(new Error('请选择城市'))
            //   } else {
            //     callback()
            //   }
            // },
            trigger: 'change',
            fields: {
              country: {required: true, message: '请选择国家', trigger: 'blur'},
              city: {required: true, message: '请选择城市', trigger: 'blur'}
            }
          }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        fileUrl: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      action: `https://jsonplaceholder.typicode.com/posts/`,
      uploadData: {userId: 1304, pathName: 'company'}
    }
  },

  created () {

  },

  methods: {
    // 过滤输入的金额
    InputNumber (property) {
      this.registData[property] = this.limitInputPointNumber(this.registData[property])
    },

    // 验证只能输入数字
    limitInputNumber (val) {
      if (val) {
        return String(val).replace(/\D/g, '')
      }
      return val
    },

    // 限制只能输入数字(可以输入两位小数)
    limitInputPointNumber (val) {
      if (val === 0 || val === '0' || val === '') {
        return ''
      } else {
        let value = null
        value = String(val).replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
        return Number(value)
      }
    },

    // 预览图片
    handlePreview (file) {

    },

    // 删除图片
    handleRemove (file, fileList) {
      this.registData.fileUrl = ''
      // 文件删除后也要触发验证,validateField是触发部分验证的方法,参数是prop设置的值
      this.$refs.registerRef.validateField('fileUrl')
    },

    // 图片上传
    handleSuccess (res, file, fileList) {
      // 这里可以写文件上传成功后的处理,但是一定要记得给fileUrl赋值
      this.registData.fileUrl = 'fileUrl'
      // 文件上传后不会触发form表单的验证,要手动添加验证
      this.$refs.registerRef.validateField('fileUrl')
    },

    submitForm (formName) {
      console.log(this.registData)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}


再补充两个错误显示的方法
有时候我们的数据在修改页面中,赋值为空会触发验证错误,这种在一个prop控制多个form-item时会出现.这时候希望页面加载时不验证,在特定时候验证,可以使用error这个属性
error初始值为空时不会展示错误信息,一旦有值就会在页面展示错误信息
<el-form-item class="region" label="" :error="nameError">
  <el-input v-model="registData.name" @change="changeName" :validate-event="false"></el-input>
</el-form-item>

methods: {
  data: {
    return () {
      nameError: ''
    }
  }
  changeName () {
    // 设置了单独的error时,不会触发el-form的验证,它只根据error是否有值来展示错误
    if (this.registData.name) {
      this.nameError = ''
    } else {
      this.nameError = '请输入名称'
    }
  }
}
```

## 再补充两个错误显示的方法

有时候我们的数据在修改页面中,赋值为空会触发验证错误,这种在一个 prop 控制多个 form-item 时会出现.这时候希望页面加载时不验证,在特定时候验证,可以使用 error 这个属性
error 初始值为空时不会展示错误信息,一旦有值就会在页面展示错误信息

```html
<el-form-item class="region" label="" :error="nameError">
  <el-input
    v-model="registData.name"
    @change="changeName"
    :validate-event="false"
  ></el-input>
</el-form-item>
```

```js
export default {
  data: {
    return() {
      nameError: '';
    }
  },
  methods: {
    changeName() {
      // 设置了单独的error时,不会触发el-form的验证,它只根据error是否有值来展示错误
      if (this.registData.name) {
        this.nameError = '';
      } else {
        this.nameError = '请输入名称';
      }
    }
  }
};
```

### 另一种场景: 自定义错误样式

el-form 的错误信息默认是在输入框底部一行展示,如果需要特地的样式,可以使用 slot

```html
<el-form-item label="" prop="password">
  <el-input
    v-model="perfectInfo.password"
    :placeholder="pwdPlaceholder"
    :maxlength="24"
    auto-complete="new-password"
  ></el-input>
  <template slot="error" slot-scope="slot">
    <div class="el-form_tip tt">
      <div class="item_tip">{{pwdFormatTips1}}</div>
      <div class="item_tip">{{pwdFormatTips2}}</div>
      <div class="item_tip">{{pwdFormatTips3}}</div>
      <div class="item_tip">{{pwdFormatTips4}}</div>
    </div>
  </template>
</el-form-item>
```
