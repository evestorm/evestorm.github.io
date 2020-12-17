---
title: 小程序formId获取
tags:
  - uniapp
  - 小程序
categories:
  - 前端
  - 移动端
  - 小程序
abbrlink: 35316
date: 2019-11-15 13:18:12
---

{% asset_img pushmessage.jpeg 效果截图 %}

## 1. 什么是 formId

`formId` 是小程序可以向用户发送模板消息的通行证，简单而言，你只有获取到 `formId`，把它交给后台，后台同学才能向用户发送通知消息，而这个通行证的有效期只有七天。这是微信为了防止小程序滥用通知消息骚扰用户而提出的一种策略。

## 2. formId 的获取

小程序的 [模板消息文档](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/template-message.html) 中说，获取 `formId` 有以下两种途径：

- 支付
- 提交表单

用户支付一次，能获取 3 个 `formId`，用户提交表单一次可得到一个 `formId` 。如果小程序中没有支付行为，但又有需要向用户发送消息的需求，这个时候就只能依靠提交表单了。

### 2. 1 下发条件说明

以下摘自 [模板消息文档 - 下发条件说明](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/template-message.html#下发条件说明)

#### 2.1.1 支付

当用户在小程序内完成过支付行为，可允许开发者向用户在 7 天内推送有限条数的模板消息（1 次支付可下发 3 条，多次支付下发条数独立，互相不影响）

#### 2.1.2 提交表单

当用户在小程序内发生过提交表单行为且该表单声明为要发模板消息的，开发者需要向用户提供服务时，可允许开发者向用户在 7 天内推送有限条数的模板消息（1 次提交表单可下发 1 条，多次提交下发条数独立，相互不影响）

### 2.2 代码示例

获取 `formId` 必须使用小程序/uni-app 的 `form` 组件，它本身有个属性叫 `report-submit` ，当在标签中加入这个属性时，一旦表单提交，`submit` 回调中就可以拿到 `formId` 了。

> html

```html
<!-- 微信小程序代码 -->
<form bindsubmit="formSubmit" report-submit="true">
  ...
  <button formType="submit">Submit</button>
</form>

<!-- uni-app 代码 -->
<form @submit="formSubmit" :report-submit="true">
  <button form-type="submit">提交表单</button>
  // formSubmit 为提交事件触发的自定义方法
</form>
```

> js

```js
formSubmit: function (e) {
  // 获取表单id
  const formId = e.detail.formId;
  // 非真机运行时 formId 应该为 'the formId is a mock one'
  console.log('表单id:', formId);
  // 获取后可通过异步请求将 formId 传递给后端
}
```

**重要：**

在微信开发者工具中运行获取的 `formId` 为 `the formId is a mock one` ，要获得真实有效的 `formId` 需要在真机上运行。

### 2.3 获取尽可能多的 formId

从运营的角度而言，`formId` 肯定是越多越好。所以每一个页面上用户的每一次点击我们都巴不得触发一次表单提交。哪怕从界面上讲，这次点击可能是跳转，弹窗的功能，跟表单完全无关，都要把 `button` 放在一个 `form` 中。但是这样无疑增加了前端的工作量，因为需要为每个页面的 `submit` 事件绑定一个上传 `formId` 的方法。一个可行的方法是借助 `vue` 的 `mixin`，为每一个页面实例混入一个上传 `formId` 的方法：

```js
// app.js
Vue.mixin({
  methods: {
    uploadFormId(e) {
      this.req({
        url: '/api/v1/formid?formId=' + e.target.formId
      });
    }
  }
});
```

另外一个方法：

```js
function _collectWeChatFormId(formId) {
  let token = wx.getStorageSync('token_/cookies'),
    openId = wx.getStorageSync('openid_cookies'),
    orign = 1;
  console.log('formId', formId);
  if (formId == 'the formId is a mock one') {
    console.log(`模拟器中运行！`);
    return false;
  }
  if (formId.length == 0) {
    console.log(`formId不能为空`);
    return false;
  }
  let site = '你的收集接口',
    dates = {
      token: token,
      openId: openId,
      formId: formId,
      orign: orign
    },
    md =
      'token=' +
      token +
      '&openId=' +
      openId +
      '&formId=' +
      formId +
      '&orign=' +
      orign;
  requestHttp(site, dates, md, function (res) {
    console.log(res);
    console.log(res.data);
  });
}
```

## 3. 小程序模板消息接口更新

请注意，小程序模板消息接口将于 2020 年 1 月 10 日下线，开发者可使用[订阅消息功能](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html)
