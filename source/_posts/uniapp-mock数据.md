---
title: uniapp-mock数据
tags:
  - 技巧
  - uniapp
categories:
  - 前端
  - 框架
  - uniapp
abbrlink: 59363
date: 2020-05-21 20:57:13
---

目前我们公司的页面结构规定的是一个页面一个单独文件夹，并且将页面文件拆成三个，例如：

```shell
.homePage/
├── homePage.js
├── homePage.less
└── homePage.vue
```

<!-- more -->

所以数据的模拟为了更方便维护，放在对应页面文件夹中再好不过了，下面是实现页面加载 mock 数据的步骤：

## 方案 1

### 1. 建立 json 数据

以 `homePage` 为例，在该文件夹下新建 `mock.json` 文件；

```json
{
  "cardData": {
    "count": 2,
    "carditem": [
      {
        "id": "GK100107900000193",
        "name": "测试表单填写限制",
        "describe": null,
        "time": "2020-03-13 16:13:02",
        "visitCount": 11,
        "conversionCount": 0,
        "conversionRatio": 0
      },
      {
        "id": "GK105645500000191",
        "name": "2.25营销",
        "describe": "2月24日0—24时，31个省（自治区、直辖市）和新疆生产建设兵团报告新增确诊病例508例，新增死亡病例71例（湖北68例，山东2例，广东1例），新增疑似病例530例",
        "time": "2020-02-25 13:41:26",
        "visitCount": 21,
        "conversionCount": 0,
        "conversionRatio": 0
      }
    ]
  },
  "generalData": null,
  "sendPeopleData": null,
  "detailData": null,
  "id": null
}
```

### 在 `homePage.js` 页面中使用

```js
// 引用
import mockData from './mock.json';

// 使用
let result = mockData.cardData;
```

## 方案 2

不使用 json 而使用 js 。

### 建立 js 文件

还是以 `homePage` 为例，在该文件夹下新建 `mock.json.js` 文件；

```js
let mockData = {
  cardData: {
    count: 2,
    carditem: [
      {
        id: 'GK100107900000193', // 优惠券会员卡营销页的ID
        name: '测试表单填写限制', // 优惠券会员卡营销页的Name
        describe: null, // 优惠券会员卡营销页的描述.
        time: '2020-03-13 16:13:02', // 优惠券会员卡营销页的时间.
        visitCount: 11, // 访问量下载量.
        conversionCount: 0, // 转化量.
        conversionRatio: 0 // 转化率.
      },
      {
        id: 'GK105645500000191',
        name: '2.25营销',
        describe:
          '2月24日0—24时，31个省（自治区、直辖市）和新疆生产建设兵团报告新增确诊病例508例，新增死亡病例71例（湖北68例，山东2例，广东1例），新增疑似病例530例',
        time: '2020-02-25 13:41:26',
        visitCount: 21,
        conversionCount: 0,
        conversionRatio: 0
      }
    ]
  },
  generalData: null,
  sendPeopleData: null,
  detailData: null,
  id: null
};

export default mockData;
```

### 在 `homePage.js` 页面中使用

```js
// 引用
import mockData from './mock.json.js';

// 使用
let result = mockData.cardData;
```

如果要不想集中编写，而是分散定义多个 mock 数据变量，可以写成下面形式：

```js
let cardData = {
  count: 2,
  carditem: [
    {
      id: 'GK100107900000193', // 优惠券会员卡营销页的ID
      name: '测试表单填写限制', // 优惠券会员卡营销页的Name
      describe: null, // 优惠券会员卡营销页的描述.
      time: '2020-03-13 16:13:02', // 优惠券会员卡营销页的时间.
      visitCount: 11, // 访问量下载量.
      conversionCount: 0, // 转化量.
      conversionRatio: 0 // 转化率.
    },
    {
      id: 'GK105645500000191',
      name: '2.25营销',
      describe:
        '2月24日0—24时，31个省（自治区、直辖市）和新疆生产建设兵团报告新增确诊病例508例，新增死亡病例71例（湖北68例，山东2例，广东1例），新增疑似病例530例',
      time: '2020-02-25 13:41:26',
      visitCount: 21,
      conversionCount: 0,
      conversionRatio: 0
    }
  ]
};

let generalData = {
  allMoney: 1000.0, // 总金额
  visitCount: 999, // 总访问
  orderCount: 233, // 总下单次数
  ratio: 10 // 转化率
};

let sendPeopleData = [
  {
    amount: 1000.0, // 总金额
    name: '全部', // 名称
    orderCount: 777, // 下单量
    ratio: 66.6, // 转化率
    visitCount: 980 // 访问量
  }
];

let detailData = [
  {
    amount: 0, // 总金额
    dataTime: '2020-05-18 00:00:00', // 日期时间
    date: '05.18', // 日期
    orderCount: 0, // 下单量
    visitCount: 0 // 访问量
  }
];

export { cardData, generalData, sendPeopleData, detailData };
```

使用：

```js
// 引入
import * as mockMulData from './mock-mul.js';

// 使用
let result = mockMulData.cardData;

// or

// 引入
import {
  cardData,
  generalData,
  sendPeopleData,
  detailData
} from './mock-mul.js';

// 使用
let result = generalData;
```

## 总结

两种方案都行，但推荐第二种，因为 json 格式的文件中不能有注释。而 js 的 mock 文件可以。方便阅读和维护。
