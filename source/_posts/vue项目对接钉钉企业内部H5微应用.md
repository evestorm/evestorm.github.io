---
title: vue项目对接钉钉企业内部H5微应用
tags:
  - Vue
  - 钉钉
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 40566
date: 2022-07-07 16:36:46
---

## 文章来源

https://bbs.huaweicloud.com/blogs/263183

<!-- more -->

## 目的

将已有 H5 应用接入钉钉，用户免登陆

## 准备工作

1. 注册钉钉
2. 负责开发的相关人员申请成为钉钉子管理员(找公司内的超管申请)
  1. 注意需要管理员赋予必要的权限，例如：
      1. 开发应用的数据权限
      2. 开发者权限
      3. 工作台管理
      4. 应用中心管理
3. 登录钉钉开发者后台
  1. 只有管理员和子管理员可登录开发者后台
4. 在应用开发页面，选择「企业内部开发 > H5微应用」，然后单击创建应用
  {% asset_img create-app.png 80% %}
5. 填写应用的基本信息，然后单击确定创建
6. 在应用信息页面，单击开发管理，然后单击修改
  这里注意『开发模式』的选择。如果已有可接入的H5应用时，文档提示说选择『快捷链接』的方式，但是如果后端需要请求钉钉的话就要配置服务器出口IP(白名单)了，所以还是得选择『开发应用』，不然无法配置后端请求的白名单(坑)
  {% asset_img dev-manage.png 80% %}
7. 单击凭证与基础信息获取应用的AppKey和AppSecret
8. 如果需要获取通讯录权限，就要添加合适的接口权限
  {% asset_img add-api-permission.png 80% %}

## 开发流程

1. 获取免登授权码。
  - H5微应用免登流程
2. 获取access_token。
  - 调用gettoken接口获取access_token。
3. 获取用户userid。
  - 调用user/getuserinfo接口获取用户的userid，通过免登码获取用户userid。
4. 获取用户详情。
  - 调用user/get接口获取用户详情信息。
5. 根据手机号做登录。
  - 视自己应用情况而定

## 项目修改

### 项目情况

#### 技术栈

- vue 2.6.11
- vue-cli 2.9.6

#### 接入步骤

依赖安装

更目录执行以下命令

```shell
npm install dingtalk-jsapi --save
```

获取微应用免登授权码方法封装

项目的 utils 目录下(当然也可以选择 common 组件目录)新建文件 `dd.js` 

```js
import * as dd from 'dingtalk-jsapi'

export function getCode(callback) {
  let corpId = 'your corpId'
  if (dd.env.platform !== 'notInDingTalk') {
    dd.ready(() => {
      //使用SDK 获取免登授权码
      dd.runtime.permission.requestAuthCode({
        corpId: corpId,
        onSuccess: info => {
          // 根据钉钉提供的api 获得code后,再次调用这个callback方法
          // 由于是钉钉获取code是异步操作,不知道什么时候执行完毕
          // callback 函数会等他执行完毕后在自己调用自己
          callback(info.code)
        },
        onFail: err => {
          alert('fail')
          alert(JSON.stringify(err))
        }
      })
    })
  }
}
```

corpId 可到后台 基本信息->开发信息(旧版)->企业自用账号信息 下查看。

应用入口页面修改

```js
import { getCode } from '@/utils/dd'

export default {
  data() {
    return { }
  },
  methods: {},
  created() {
    getCode(code => {
      // 登录处理
    })
  }
}
```

## 对接感受

从 H5 微应用的对接来看没有特别复杂的配置，对接起来很流畅，基本没有卡壳的地方

- 官方文档有一处写的不够准确，已有H5应用时引导用户选择快捷链接开发模式，但是这种模式下如果后端需要请求钉钉接口的话就找不到配置IP白名单的地方了，比较尴尬。
- 权限管理的地方，涉及到通讯录权限时，基本信息与成员手机号、邮箱都是分开的权限需要手动添加，不然是获取不到相应信息的
- 参与测试人员需要在应用的版本管理与发布tab页单独设置可使用范围才能使相关开发人员在钉钉客户端上看见入口

## 相关资源

- [DingTalk「开发者说」第8期 钉钉微应用开发实战](https://developer.aliyun.com/article/879346)
- [钉钉开发文档](https://open.dingtalk.com/document/orgapp-client/read-before-development)