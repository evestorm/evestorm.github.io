---
title: Vue自定义表单校验组件(仿element-ui)
tags:
  - Vue
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 21485
date: 2020-01-31 21:58:54
---

相关代码见[github](https://github.com/evestorm/front-end-playground/tree/master/vue/vue-element-form)

<!-- more -->

## 准备工作

### 项目创建

```shell
vue create vue-element-form
```

### 按需引入 element-ui

```shell
npm i element-ui -S # 安装 element-ui
npm i babel-plugin-component -D # 准备按需引入
npm i async-validator -S # Form 表单校验
```

#### 修改 `babel.config.js`

```js
module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/preset-env', //添加 babel-preset-env 配置
      {
        modules: false
      }
    ]
  ],
  plugins: [
    // element官方教程
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ]
};
```

#### main.js 按需引入

```js
import {
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Col,
  DatePicker,
  TimePicker,
  Switch,
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio,
  Button
} from 'element-ui';

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Col);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Switch);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Button);
```

#### Home.vue 添加 Element 示例代码

```html
<template>
  <div class="home">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="活动区域" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.date1"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker
              placeholder="选择时间"
              v-model="ruleForm.date2"
              style="width: 100%;"
            ></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送" prop="delivery">
        <el-switch v-model="ruleForm.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="活动性质" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          立即创建
        </el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
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
          ],
          type: [
            {
              type: 'array',
              required: true,
              message: '请至少选择一个活动性质',
              trigger: 'change'
            }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style scoped>
  .demo-ruleForm {
    margin: 0 auto;
    width: 50%;
  }
</style>
```

### 修改路由

将 `view/About.vue` 改名为 `Custom.vue`

> index.js

```js
import Vue from 'vue' import VueRouter from 'vue-router' import Home from
'../views/Home.vue' Vue.use(VueRouter) const routes = [ { path: "/", name:
"home", component: Home }, { path: "/custom", name: "custom", // route level
code-splitting // this generates a separate chunk (about.[hash].js) for this
route // which is lazy-loaded when the route is visited. component: () =>
import(/* webpackChunkName: "custom" */ "../views/Custom.vue") } ]; const router
= new VueRouter({ mode: 'history', base: process.env.BASE_URL, routes }) export
default router
```

> App.vue

```html
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">ElementUI Form</router-link>
      |
      <router-link to="/custom">Custom Form</router-link>
    </div>
    <router-view />
  </div>
</template>

...
```

## 自定义 Form 组件（带校验）

### 组件结构

{% asset_img form组件.png 自定义Form表单组件 %}

在 `components` 文件夹下新建 `swForm` 文件夹作为自定义组件：

```shell
└── swForm
    ├── SwForm.vue
    ├── SwFormItem.vue
    ├── SwInput.vue
    └── index.vue
```

### 最终使用

> index.vue

```html
<template>
  <div>
    <h3>自定义Form表单组件</h3>
    <hr />
    <sw-form :model="model" :rules="rules" ref="loginForm">
      <sw-form-item label="用户名" prop="username">
        <sw-input
          v-model="model.username"
          autocomplete="off"
          placeholder="输入用户名"
        ></sw-input>
      </sw-form-item>
      <sw-form-item label="确认密码" prop="password">
        <sw-input
          type="password"
          v-model="model.password"
          autocomplete="off"
        ></sw-input>
      </sw-form-item>
      <sw-form-item>
        <button @click="submitForm('loginForm')">提交</button>
      </sw-form-item>
    </sw-form>
    {{model}}
  </div>
</template>

<script>
  import SwForm from './SwForm';
  import SwFormItem from './SwFormItem';
  import SwInput from './SwInput';

  export default {
    components: {
      SwForm,
      SwFormItem,
      SwInput
    },
    data() {
      return {
        model: {
          username: 'Lance',
          password: ''
        },
        rules: {
          username: [
            {
              required: true,
              message: '请输入用户名'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码'
            }
          ]
        }
      };
    },
    methods: {
      submitForm(form) {
        this.$refs[form].validate(valid => {
          alert(valid ? '开始请求登录!' : '校验失败');
        });
      }
    }
  };
</script>
```

### 预留插槽 slot

根据上面的表单组件结构图，可以分别给 `SwForm`、`SwFormItem` 设置 slot 插槽：

> SwForm

```html
<template>
  <div>
    <slot></slot>
  </div>
</template>
```

> SwFormItem

```html
<template>
  <div>
    <slot></slot>
  </div>
</template>
```

### 实现自定义 input 的双向数据绑定

#### 知识点 - v-model 本质

Vue 中对于 `v-model` 的解释： `v-model` 本质上不过是语法糖。它负责监听用户的输入事件以更新数据，并对一些极端场景进行一些特殊处理。`v-model` 会忽略所有表单元素的 「value」、「checked」、「selected」 特性的初始值而总是将 Vue 实例的数据作为数据来源。你应该通过 JavaScript 在组件的 data 选项中声明初始值。

**所以 `v-model` 其实只是将值绑定到 `value` 属性上，同时当组件触发 input 时用参数覆盖 value 属性，从而实现双向绑定。**

所以当我们自定义组件要实现双向绑定，只要在自定义组件中引入 value 的 props，同时当需要改变 value 时抛出 input 事件就 OK 了。

所以我们在 `SwInput.vue` 中的代码实现如下：

```html
<template>
  <div>
    <input :value="value" @input="onInput" />
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    methods: {
      onInput(e) {
        this.$emit('input', e.target.value);
      }
    }
  };
</script>
```

### 给 input 元素绑定 placeholder 属性 - inheritAttrs

如果我们观察 element-ui 提供的 `el-input` 组件会发现，设置的 `placeholder` 属性能作用在最终的真正的 input 元素上：

> 代码

```html
<el-input placeholder="请输入活动名称"></el-input>
```

> 页面展示

```html
<input
  type="text"
  autocomplete="off"
  placeholder="请输入活动名称"
  class="el-input__inner"
/>
```

然而我们的 `SwInput` 组件目前的 HTML 结构为：

```html
<div>
  <input :value="value" @input="onInput" />
</div>
```

如果我们在使用 `SwInput` 组件并设置 `placeholder` 时，最终的属性会作用在外层的 div 上，而不是 input 上：

> 代码

```html
<sw-input
  v-model="model.username"
  autocomplete="off"
  placeholder="输入用户名"
></sw-input>
```

> 页面效果

```html
<div
  data-v-a9396722=""
  autocomplete="off"
  placeholder="输入用户名"
  data-v-43522ae2=""
>
  <input data-v-a9396722="" />
</div>
```

那怎么才能把添加到组件上的 `placeholder` 属性交给里边的 input 元素呢？

通常情况下，我们会使用 props 传值的方式完成，但这种方案有种缺陷，那就是一旦我们有很多类似 `placeholder` 这样的自定义的属性需要设置，那 props 就会非常臃肿。

所以我们使用另一种方案：[Vue.js - inheritAttrs](https://cn.vuejs.org/v2/api/#inheritAttrs)

官方文档上说：

> 通过设置 inheritAttrs 到 false，这些默认行为将会被去掉。而通过 (同样是 2.4 新增的) 实例属性 $attrs 可以让这些特性生效，且可以通过 v-bind 显性的绑定到非根元素上。

一句话总结，我们可以利用 Vue 的 inheritAttrs api，让添加到组件上的属性最终作用于非根元素上。

接下来我们用这种方案改造 `SwInput` ：

> SwInput

```html
<template>
  <div>
    <!-- 使用 v-bind="$attrs" 将父组件设置给当前组件的属性，全部移交给子元素 -->
    <input :value="value" @input="onInput" v-bind="$attrs" />
  </div>
</template>

<script>
  export default {
     // 设置继承属性为false
     inheritAttrs: false,
     ...
  }
</script>
```

这样一来我们就把属性设置给了真正的 `SwInput` 组件中的 input 元素。

### Form 表单校验

#### 给 `SwFormItem` 添加 label 以及校验信息

> SwFormItem

```html
<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <slot></slot>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
  export default {
    props: {
      label: {
        type: String,
        default: ''
      },
      prop: {
        // 如果当前item有校验，则prop必传，与对应model字段名相同
        type: String
      }
    },
    data() {
      return {
        errorMessage: ''
      };
    }
  };
</script>
```

#### 使用 provide/inject 传递数据

由于我们的 `model` 和 `rules` 是传给了最外层的 `SwForm` ，而真正做校验的是 `SwFormItem` ，并且校验是离不开规则 `rules` 的，所以我们得把数据传给子组件，这里使用 [provide/inject](https://cn.vuejs.org/v2/api/#provide-inject) ，它的作用 Vue 官方有写：

> 这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。如果你熟悉 React，这与 React 的上下文特性很相似。

所以我们接下来需要在 `SwForm` 中通过 provide 将数据传给后代子孙，后代子孙（`SwFormItem`）通过 inject 接收数据。

> SwForm

```html
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    provide() {
      return {
        // 将自己传给子孙后代
        form: this
      };
    },
    props: {
      model: {
        // 模型
        type: Object,
        required: true
      },
      rules: {
        // 规则
        type: Object
      }
    }
  };
</script>
```

> SwFormItem

```html
...
<script>
  import Schema from 'async-validator';
  export default {
     inject: ["form"],
     ...
  }
</script>
```

#### 派发 input 事件并校验

我们的校验通常在 input 元素的 input 事件触发以后，所以得在 `SwInput` 组件中派发事件，然后在它的父组件 `SwFormItem` 中监听事件：

> SwInput

```html
...
<script>
  export default {
     ...
     methods: {
        onInput(e) {
           this.$emit("input", e.target.value);

           this.$parent.$emit('validate');
        }
     },
  }
</script>
```

> SwFormItem

```html
<script>
  // npm i async-validator -S
  import Schema from 'async-validator';
  export default {
    inject: ['form'],
    props: {
      label: {
        type: String,
        default: ''
      },
      prop: {
        type: String
      }
    },
    data() {
      return {
        errorMessage: ''
      };
    },
    mounted() {
      this.$on('validate', this.validate);
    },
    methods: {
      validate() {
        // 做校验
        const value = this.form.model[this.prop];
        const rules = this.form.rules[this.prop];

        // 设置校验规则
        const desc = {
          [this.prop]: rules
        };
        // 实例化 Schema
        const schema = new Schema(desc);
        // 开始校验
        return schema.validate(
          {
            [this.prop]: value
          },
          errors => {
            this.errorMessage = errors ? errors[0].message : '';
          }
        ); // return 的是个 Promise
      }
    }
  };
</script>
```

写完上述代码后，当你将表单中的文本框内容清空，就能看到校验提示了。

#### Form 表单提交校验

当用户填完所有表单点击提交时，我们还得将整个表单需要校验的地方都校验一遍，然后告知用户是否成功通知校验，所以我们还得在 `SwForm` 组件中添加一个 `validate` 方法，用于判断所有需要校验的地方是否都通过了校验：

> SwForm

```html
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    provide() {
      return {
        // 将自己传给子孙后代
        form: this
      };
    },
    props: {
      model: {
        // 模型
        type: Object,
        required: true
      },
      rules: {
        // 规则
        type: Object
      }
    },
    methods: {
      validate(cb) {
        // 找到所有需要校验的 SwFormItem（带有prop的都是），拿到它们中的 validate 校验方法
        const tasks = this.$children
          .filter(item => item.prop)
          .map(item => item.validate());
        console.log(tasks);
        // 所有任务都通过才算校验通过
        Promise.all(tasks)
          .then(() => cb(true))
          .catch(() => cb(false));
      }
    }
  };
</script>
```
