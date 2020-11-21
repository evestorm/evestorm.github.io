---
title: JS数组有哪些常用方法
categories:
  - 前端
  - JS
abbrlink: 21501
date: 2018-12-13 23:34:46
tags:
---

## 改变原数组的方法

### splice() 添加/删除数组元素

> splice() 方法**向/从数组中添加/删除**项目，然后返回被删除的项目
>
> array.splice(index,howmany,item1,…..,itemX)
>
> 1. index：必需。整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。
> 2. howmany：可选。要删除的项目数量。如果设置为 0，则不会删除项目。
> 3. item1, …, itemX： 可选。向数组添加的新项目。
>
> 返回值: 如果有元素被删除,返回包含被删除项目的新数组。

<!-- more -->

#### 删除元素

```js
// 从数组下标0开始，删除3个元素
let a = [1, 2, 3, 4, 5, 6, 7];
let item = a.splice(0, 3); // [1,2,3]
console.log(a); // [4,5,6,7]

// 从最后一个元素开始删除3个元素，因为最后一个元素，所以只删除了7
let item = a.splice(-1, 3); // [7]
```

#### 删除并添加

```js
// 从数组下标0开始，删除3个元素，并添加元素'添加'
let a = [1, 2, 3, 4, 5, 6, 7];
let item = a.splice(0,3,'添加'); // [1,2,3]
console.log(a); // ['添加',4,5,6,7]

// 从数组最后第二个元素开始，删除3个元素，并添加两个元素'添加1'、'添加2'
let b = [1, 2, 3, 4, 5, 6, 7];
let item = b.splice(-2,3,'添加1','添加2'); // [6,7]
console.log(b); // [1,2,3,4,5,'添加1','添加2']
```

#### 不删除只添加

```js
let a = [1, 2, 3, 4, 5, 6, 7];
let item = a.splice(0,0,'添加1','添加2'); // [] 没有删除元素，返回空数组
console.log(a); // ['添加1','添加2',1,2,3,4,5,6,7]

let b = [1, 2, 3, 4, 5, 6, 7];
let item = b.splice(-1,0,'添加1','添加2'); // [] 没有删除元素，返回空数组
console.log(b); // [1,2,3,4,5,6,'添加1','添加2',7] 在最后一个元素的前面添加两个元素
```

### sort() 数组排序

> 定义: sort()方法对数组元素进行排序，并返回这个数组。
>
> 参数可选: 规定排序顺序的比较函数。
>
> 默认情况下sort()方法没有传比较函数的话，默认按字母升序，如果不是元素不是字符串的话，会调用`toString()`方法将元素转化为字符串的Unicode(万国码)位点，然后再比较字符。

#### 不传参

```js
// 字符串排列 看起来很正常
var a = ["Banana", "Orange", "Apple", "Mango"];
a.sort(); // ["Apple","Banana","Mango","Orange"]

// 数字排序的时候 因为转换成Unicode字符串之后，有些数字会比较大会排在后面 这显然不是我们想要的
var a = [10, 1, 3, 20,25,8];
console.log(a.sort()) // [1,10,20,25,3,8];
```

**比较函数的两个参数：**

sort的比较函数有两个默认参数，要在函数中接收这两个参数，这两个参数是数组中两个要比较的元素，通常我们用 a 和 b 接收两个将要比较的元素：

- 若比较函数返回值<0，那么a将排到b的前面;
- 若比较函数返回值=0，那么a 和 b 相对位置不变；
- 若比较函数返回值>0，那么b 排在a 将的前面；

#### 数字升降序

```js
var array =  [10, 1, 3, 4, 20, 4, 25, 8];  
array.sort(function(a,b){
  return a-b;
});
console.log(array); // [1,3,4,4,8,10,20,25];

array.sort(function(a,b){
  return b-a;
});
console.log(array); // [25,20,10,8,4,4,3,1];
```

### pop() 删除一个数组中的最后的一个元素

> 定义: pop() 方法删除一个数组中的最后的一个元素，并且返回这个元素。

```js
let  a =  [1,2,3];
let item = a.pop();  // 3
console.log(a); // [1,2]
```

### shift() 删除数组的第一个元素

> 定义: shift()方法删除数组的第一个元素，并返回这个元素。

```js
let  a =  [1,2,3];
let item = a.shift();  // 1
console.log(a); // [2,3]
```

### push() 向数组的末尾添加元素

> 定义：push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
>
> 参数: item1, item2, …, itemX ,要添加到数组末尾的元素

```js
let  a =  [1,2,3];
let item = a.push('末尾', '233');  // 5
console.log(a); // [1,2,3,'末尾', '233']
```

### unshift()

> 定义：unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
>
> 参数: item1, item2, …, itemX ,要添加到数组开头的元素

```js
let a = [1, 2, 3];
let item = a.unshift('开头', '开头2');  // 5
console.log(a); // [ '开头', '开头2', 1, 2, 3 ]
```

### reverse() 颠倒数组中元素的顺序

> 定义: reverse() 方法用于颠倒数组中元素的顺序。

```js
let  a =  [1,2,3];
a.reverse();  
console.log(a); // [3,2,1]
```

## 不改变原数组的方法

### slice() 浅拷贝数组的元素

> 定义： 方法返回一个从开始到结束（**不包括结束**）选择的数组的一部分浅拷贝到一个新数组对象，且原数组不会被修改。
>
> 语法：array.slice(begin, end);

```js
let a= ['hello','world'];
let b=a.slice(0,1); // ['hello']

// 新数组是浅拷贝的，元素是简单数据类型，改变之后不会互相干扰。
// 如果是复杂数据类型(对象,数组)的话，改变其中一个，另外一个也会改变。
a[0]='改变原数组';
console.log(a,b); // ['改变原数组','world'] ['hello']

let a= [{name:'OBKoro1'}];
let b=a.slice();
console.log(b,a); // [{"name":"OBKoro1"}]  [{"name":"OBKoro1"}]
// a[0].name='改变原数组';
// console.log(b,a); // [{"name":"改变原数组"}] [{"name":"改变原数组"}]
```

### join() 数组转字符串

> 定义: join() 方法用于把数组中的所有元素通过指定的分隔符进行分隔放入一个字符串，返回生成的字符串。
>
> 语法: array.join(str)

```js
let a= ['hello','world'];
let str=a.join(); // 'hello,world'
let str2=a.join('+'); // 'hello+world'

let a= [['OBKoro1','23'],'test'];
let str1=a.join(); // OBKoro1,23,test
let b= [{name:'OBKoro1',age:'23'},'test'];
let str2 = b.join(); // [object Object],test
// 对象转字符串推荐JSON.stringify(obj);

// 结论：
// join()/toString()方法在数组元素是数组的时候，会将里面的数组也调用join()/toString(),
// 如果是对象的话，对象会被转为[object Object]字符串。
```

### join() 数组转字符串

> 定义: join() 方法用于把数组中的所有元素通过指定的分隔符进行分隔放入一个字符串，返回生成的字符串。
>
> 语法: array.join(str)

```js
let a= ['hello','world'];
let str=a.join(); // 'hello,world'
let str2=a.join('+'); // 'hello+world'

let a= [['OBKoro1','23'],'test'];
let str1=a.join(); // OBKoro1,23,test
let b= [{name:'OBKoro1',age:'23'},'test'];
let str2 = b.join(); // [object Object],test
// 对象转字符串推荐JSON.stringify(obj);

// 结论：
// join()/toString()方法在数组元素是数组的时候，会将里面的数组也调用join()/toString(),
// 如果是对象的话，对象会被转为[object Object]字符串。
```

### concat

> 定义： 方法用于合并两个或多个数组，返回一个新数组。
>
> 语法：var newArr =oldArray.concat(arrayX,arrayX,……,arrayX)
>
> 参数：arrayX（必须）：该参数可以是具体的值，也可以是数组对象。可以是任意多个。

```js
let a = [1, 2, 3];
let b = [4, 5, 6];
//连接两个数组
let newVal=a.concat(b); // [1,2,3,4,5,6]
// 连接三个数组
let c = [7, 8, 9]
let newVal2 = a.concat(b, c); // [1,2,3,4,5,6,7,8,9]
// 添加元素
let newVal3 = a.concat('添加元素',b, c,'再加一个'); 
// [1,2,3,"添加元素",4,5,6,7,8,9,"再加一个"]
// 合并嵌套数组  会浅拷贝嵌套数组
let d = [1,2 ];
let f = [3,[4]];
let newVal4 = d.concat(f); // [1,2,3,[4]]
```

### ES6扩展运算符`...`合并数组

```js
let a = [2, 3, 4, 5]
let b = [ 4,...a, 4, 4]
console.log(a,b); //  [2, 3, 4, 5] [4,2,3,4,5,4,4]
```

### indexOf() 查找数组是否存在某个元素，返回下标

> 定义: 返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。
>
> p.s. 字符串也有此方法，要注意当 ‘lance’.indexOf(‘’) 一个空字符串时，返回0而不是-1
>
> 语法：array.indexOf(searchElement,fromIndex)
>
> 参数：
>
> searchElement(必须):被查找的元素
>
> fromIndex(可选):开始查找的位置(不能大于等于数组的长度，返回-1)，接受负值，默认值为0。
>
> 严格相等的搜索:
>
> 数组的indexOf搜索跟字符串的indexOf不一样,数组的indexOf使用严格相等`===`搜索元素，即**数组元素要完全匹配**才能搜索成功。
>
> **注意**：indexOf()不能识别`NaN`

```js
let a=['啦啦',2,4,24,NaN]
console.log(a.indexOf('啦'));  // -1 
console.log(a.indexOf('NaN'));  // -1 
console.log(a.indexOf('啦啦')); // 0
```

### lastIndexOf() 查找指定元素在数组中的最后一个位置

> 定义: 方法返回指定元素,在数组中的最后一个的索引，如果不存在则返回 -1。（从数组后面往前查找）
>
> 语法：arr.lastIndexOf(searchElement,fromIndex)
>
> 参数:
>
> searchElement(必须): 被查找的元素
>
> fromIndex(可选): 逆向查找开始位置，默认值数组的 `长度-1`，即查找整个数组。
>
> 关于fromIndex有三个规则:
>
> 1. 正值。如果该值大于或等于数组的长度，则整个数组会被查找。
> 2. 负值。将其视为从数组末尾向前的偏移。(比如-2，从数组最后第二个元素开始往前查找)
> 3. 负值。其绝对值大于数组长度，则方法返回 -1，即数组不会被查找。

```js
let a=['OB',4,'Koro1',1,2,'Koro1',3,4,5,'Koro1']; // 数组长度为10
// let b=a.lastIndexOf('Koro1',4); // 从下标4开始往前找 返回下标2
// let b=a.lastIndexOf('Koro1',100); //  大于或数组的长度 查找整个数组 返回9
// let b=a.lastIndexOf('Koro1',-11); // -1 数组不会被查找
let b=a.lastIndexOf('Koro1',-9); // 从第二个元素4往前查找，没有找到 返回-1
```

### ES7 includes() 查找数组是否包含某个元素 返回布尔

> 定义： 返回一个布尔值，表示某个数组是否包含给定的值
>
> 语法：array.includes(searchElement,fromIndex=0)
>
> 参数：
>
> searchElement(必须):被查找的元素
>
> fromIndex(可选):默认值为0，参数表示搜索的起始位置，接受负值。正值超过数组长度，数组不会被搜索，返回false。负值绝对值超过长数组度，重置从0开始搜索。
>
> **includes方法是为了弥补indexOf方法的缺陷而出现的:**
>
> 1. indexOf方法不能识别`NaN`
> 2. indexOf方法检查是否包含某个值不够语义化，需要判断是否不等于`-1`，表达不够直观

```js
let a=['OB','Koro1',1,NaN];
// let b=a.includes(NaN); // true 识别NaN
// let b=a.includes('Koro1',100); // false 超过数组长度 不搜索
// let b=a.includes('Koro1',-3);  // true 从倒数第三个元素开始搜索 
// let b=a.includes('Koro1',-100);  // true 负值绝对值超过数组长度，搜索整个数组
```
