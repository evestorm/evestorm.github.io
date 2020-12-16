---
title: Uniapp实时监听input输入为数字
tags:
  - Vue
  - uniapp
categories:
  - 前端
  - 解决方案
abbrlink: 47344
date: 2020-05-12 21:06:54
---

测试要求提现的输入只能为数字+小数点，不许为其他：

{% asset_img tixian.png 其他 %}

<!-- more -->

## 解决方案

> Wxml

```html
<input
  type="number"
  :placeholder="placeTips"
  placeholder-style="font-size:24rpx"
  v-model="amount"
  @input="checkNum($event)"
/>
```

> JS

```js
checkNum(e) {
	let val = e.target.value.replace(/(^\s*)|(\s*$)/g, "")
	console.log(val)
	if (!val) {
		this.amount = '';
		return
	}
	var reg = /[^\d.]/g

	// 只能是数字和小数点，不能是其他输入
	val = val.replace(reg, "")
	// // 保证第一位只能是数字，不能是点
	val = val.replace(/^\./g, "");
	// // 小数只能出现1位
	val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	// // 小数点后面保留2位
	val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
	console.log(val);
	this.$nextTick(() => {
		this.amount = val;
	})
},
```
