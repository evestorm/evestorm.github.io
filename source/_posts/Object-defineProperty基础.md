---
title: Object.defineProperty基础
tags:
  - 笔记
  - ECMAScript
categories:
  - 前端
  - JS
  - ECMAScript
abbrlink: 64272
date: 2021-10-13 15:39:11
---

# 作用

定义对象属性的

# 参数

1. obj 要定义属性的对象
2. prop 要定义或修改的属性的名称或 Symbol
3. descriptor 要定义或修改的属性描述符

<!-- more -->

# 特性

## 默认通过 Object.defineProperty 定义的属性不可修改、不可删除也不可枚举

```js
function defineProperty() {
  var _obj = {};
  Object.defineProperty(_obj, 'a', {
    get() {
      return 1;
    }
  })
  Object.defineProperties(_obj, {
    b: {
      value: 2
    },
    c: {
      value: 3
    }
  })
  return _obj;
}

var obj = defineProperty();
console.log(obj.a); // 1
obj.a = 15;
console.log(obj.a); // 不可修改，仍然是 1
for (var key in obj) {
  console.log(key + ': ' + obj[key]); // 通过定义的a,b,c默认都不可枚举
}
delete obj.a; // 无法删除a
console.log(obj); // {a:1,b:2,c:3}
```

## writeable可修改、enumerable可枚举、configurable可配置（一般用作可删除）

```js
function defineProperty() {
  var _obj = {};

  Object.defineProperties(_obj, {
    a: {
      value: 1,
      writable: true, // 可修改
      enumerable: true, // 可枚举
      configurable: true, // 可操作的（一般指删除）
    },
    b: {
      value: 2
    }
  });
  return _obj;
}

const obj = defineProperty();

obj.a = 10;
obj.b = 5;

console.log(obj); // { a: 10, b: 2 }
// a被改了，b没有

for (const key in obj) {
  console.log(key + ': ' + obj[key]);
}
// 只打印 a: 10 ，不打印 b

delete obj.a; // 此时可删除a了
console.log(obj); // { b: 2 }
```

## getter/setter

### 数据劫持

```js
function defineProperty() {
  var _obj = {};
  var a = 1;
  Object.defineProperties(_obj, {
    a: {
      get() {
        return '"a"\'s value is ' + a + '.';
      },
      set(newVal) {
        console.log('The value "a" has been designed a new value "' + newVal + '".');
        a = newVal;
      }
    }
  });
  return _obj;
}

const obj = defineProperty();
console.log(obj.a); // "a"'s value is 1.
obj.a = 233; // The value "a" has been designed a new value "233".
```

### 当给属性设置了 setter、getter 后，不允许设置 value 和 writeable

```js
var obj = {};
Object.defineProperty(obj, 'a', {
  get() {
    return 1;
  },
  value: 2, // 不可设置
  writable: true, // 不可设置
})

// TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, #<Object>
```

### 通过 getter、setter 设置了的属性，在原对象中不可见，但默认可枚举、可删除

```js
var obj = {
	name: 'Lance',
  age: 24
}

var _obj = {};
Object.keys(obj).forEach(key => {
  _obj[key] = obj[key];
	Object.defineProperty(obj, key, {
  	get() {
    	return _obj[key];
    },
    set(newVal) {
    	_obj[key] = newVal;
    },
  });
});

console.log(obj);
for (var key in obj) {
	console.log(obj[key]);
}
delete obj.name;
console.log(obj);
```

{% asset_img 1637908960169-1befe0b3-2785-4073-9661-3d961326be52.png 1637908960169-1befe0b3-2785-4073-9661-3d961326be52 %}

```js
var obj = {
	name: 'Lance',
  age: 24
}

var _obj = {};
Object.keys(obj).forEach(key => {
  _obj[key] = obj[key];
	Object.defineProperty(obj, key, {
    // value: 1, // 不可配置
    // writeable: false, 不可配置
  	get() {
    	return _obj[key];
    },
    set(newVal) {
    	_obj[key] = newVal;
    },
    enumerable: false, // 可配置
    configurable : false // 可配置
  });
});

console.log(obj);
for (var key in obj) {
	console.log(obj[key]);
}
delete obj.name;
console.log(obj);
```

{% asset_img 1637909046397-df9ade35-53be-42c1-857b-ad530ad037d6.png 1637909046397-df9ade35-53be-42c1-857b-ad530ad037d6 %}

# 应用

## 计算器

<iframe height="300" style="width: 100%;" scrolling="no" title="Object.defineProperty计算器" src="https://codepen.io/JingW/embed/abVBrLw?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/JingW/pen/abVBrLw">
  Object.defineProperty计算器</a> by JingW (<a href="https://codepen.io/JingW">@JingW</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>