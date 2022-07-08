---
title: parseInt深入
tags:
  - 笔记
categories:
  - 前端
  - JS
  - ECMAScript
abbrlink: 3682
date: 2021-10-11 20:03:23
---

# 参数

## string

如果不是字符串－＞toString(开头的空白忽略）

<!-- more -->

## Radix (2-36)

> 解析一个字符串（string）并返回指定基数（Radix）的十进制整数。

- Radix 2-36 之间的整数，要解析成整数的字符串是多少进制 -> 进制数 -> 十进制整数
   - e.g. 参数为 16 ：要解析的整数的字符串是16进制数


```javascript
console.log(parseInt('10', 2)); // 2
// '10' 被当做 2 进制数，要通过 parseInt 转成 -> 10进制的整数 -> 返回
```

<!-- more -->

### 默认值不是10进制

#### 0x、0X开头，默认16进制

```javascript
console.log(parseInt('0x629eb', 16)); // 403947
console.log(parseInt('0x629eb')); // 403947
```

#### 0开头，可能是8进制、可能是10进制（ES5规范是10进制）需要写清楚radix，因为8进制需要补零

#### 其他开头，都是10进制

## 返回值

### 成功 - 能解析的返回的整数

```javascript
console.log(parseInt('1a03d', 16)); // 106557
```

#### 忽略字符串开头的空格

```javascript
console.log(parseInt('   10', 3)); // 3
```

#### 从不符合该进制要求的数字开始，忽略后续所有的字符

```javascript
console.log(parseInt('123', 2)); // 1
console.log(parseInt('113', 2)); // 3
```


#### 支持正负号 +/-

```javascript
console.log(parseInt('-1 13', 2)); // -1
```


### 💄失败 - 返回 NaN

#### radix 小于2或者大于36

```javascript
console.log(parseInt('13', 1)); // NaN
console.log(parseInt('13', 48)); // NaN
```

#### 未填写任何参数

```javascript
console.log(parseInt()); // NaN
```

#### 字符串第一个字符不能被正常转换数字的情况（第一个字符是数字也能转，转到第一个字符不是数字为止）

```javascript
console.log(parseInt('a1')); // NaN
console.log(parseInt('1a1')); // 1
console.log(parseInt('11a')); // 11
```

# 转十进制的算法

- [颠覆认知的 JavaScript - 1](https://www.yuque.com/baofengyuqianxi/kmuzed/wb4g78)
   - [[03]循环、引用值初识、显示及隐式类型转换](https://www.yuque.com/baofengyuqianxi/kmuzed/zpimza)
      - [进制转换](https://www.yuque.com/baofengyuqianxi/kmuzed/zpimza#dezBa)


```javascript
console.log(parseInt('123', 5)); // 38

//  3 * 5 ^ 0 = 3
//  2 * 5 ^ 1 = 10
//  1 * 5 ^ 2 = 25

//  3 + 10 + 25 = 38
```

```javascript
console.log(parseInt('0x629eb', 16)); // 403947

// 0123456789 abcdef -> 0-9, a-f(10-15)

// 0x 是前缀，不管，从6开始往后才是需要计算的

b(11) * 16 ^ 0 = 11
e(14) * 16 ^ 1 = 224
9		  * 16 ^ 2 = 2304
2	 	  * 16 ^ 3 = 8192
6		  * 16 ^ 4 = 393216

= 403947
```

# toString - 数字转化为相应进制的字符串数字

**出来的是字符串**

```javascript
console.log((3).toString(2)); // 把 3 作为 10进制 转为 2进制
// 输出 11
```

# 严格检测是否是整型
```javascript
var filterInt = function(string) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(string)) {
  	return Number(string);
  }
  return NaN;
}
```
