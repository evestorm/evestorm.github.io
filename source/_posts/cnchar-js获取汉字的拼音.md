---
title: cnchar.js获取汉字的拼音
tags:
  - 技巧
categories:
  - 前端
  - 解决方案
abbrlink: 38408
date: 2020-08-21 13:16:05
---

分享一个获取汉字拼音的库：

https://github.com/theajack/cnchar

几种常用方法：

```js
array:返回数组；"汉字".spell("array") =>['Han','Zi']

first:返回首字母 ；"汉字".spell("first") =>'HZ'

up:将结果全部大写；"汉字".spell("up") =>'HANZI'

low:将结果全部小写；"汉字".spell("low") =>'hanzi'

组合使用："汉字".spell("first","array",'low') =>['h','z']
```
