---
title: Proxy与ES-14种对象操作方法
tags:
  - 笔记
  - ECMAScript
categories:
  - 前端
  - JS
  - ECMAScript
abbrlink: 49273
date: 2021-10-17 16:50:46
---

# 认知

不要因为 Vue 使用到了 `Object.defineProperty()` 数据劫持，就把它和 Proxy 混为一谈。它俩不是一个东西

<!-- more -->

- `Object.defineProperty(obj, prop, descriptor)` 是直接处理 obj，然后当操作 obj 时，会在 set、get 方法中进行拦截
   - **对 obj 本身操作**
   - 给 obj 上新增没有的属性
- Proxy(target, handler) 是通过处理 obj 以后，是**返回了一个代理对象**，你是通过操作这个代理对象，来对数据做操作的
   - 创建一个 obj 的代理，中间隔了一层交流
   - 相比 defineProperty 少了个 prop 参数，因为是对已有的 obj 操作、处理

# 功能

自定义对象属性的获取、赋值、枚举、函数调用等功能

# 💄用法

## getter、setter 基本用法

```javascript
let target = {
  a: 1,
  b: 2
}

let proxy = new Proxy(target, {
  get(target, prop) {
    console.log('This is property value ' + target[prop]);
    return target[prop];
  },
  set(target, prop, value) {
    target[prop] = value;
  }
});

console.log("proxy.a", proxy.a); // 走了代理 This is ...
console.log("target.a", target.a); // 直接访问，没走代理。没显示 This is ...
proxy.b = 3;
console.log("target.b", target.b); // 3
console.log("proxy.b", proxy.b); // 3
console.log(proxy); // Proxy {a: 1, b: 2}
```

## 处理数组、函数

- Object.defineProperty 没法直接处理数组
- Proxy 可以。函数对象和数组都行


```javascript
let arr = [
  { name: 'Lance', age: 27 },
  { name: 'GC', age: 31 },
  { name: 'Jerry', age: 29 },
  { name: 'Sherry', age: 30 }
];

let persons = new Proxy(arr, {
  get(arr, prop) {
    return arr[prop];
  },
  set(arr, prop, value) {
    arr[prop] = value;
  }
});

persons[0] = { name: 'Xi', age: 30 }
console.log(arr, persons);
// [
//   { name: 'Xi', age: 30 },
//   { name: 'GC', age: 31 },
//   { name: 'Jerry', age: 29 },
//   { name: 'Sherry', age: 30 }
// ] [
//   { name: 'Xi', age: 30 },
//   { name: 'GC', age: 31 },
//   { name: 'Jerry', age: 29 },
//   { name: 'Sherry', age: 30 }
// ]
```

```javascript
let fn = function() {
  console.log('I am a function. ');
}

fn.a = 123;

let newFn = new Proxy(fn, {
  get(fn, prop) {
    return fn[prop] + ' This is a Proxy return';
  }
});

console.log(newFn.a); // 123 This is a Proxy return
```

### has

- a 不在 proxy 本身身上，是 proxy 从 target 代理来的

```javascript
let target = {
  a: 1,
  b: 2
}

let proxy = new Proxy(target, {
  get(target, prop) {
    return 'GET: ' + prop + ' = ' + target[prop];
  },
  set(target, prop, value) {
    target[prop] = value;
    console.log('SET: ' + prop + ' = ' + value);
  },
  has(target, prop) {
    return Reflect.has(target, prop);
  }
});

console.log('a' in proxy); // true
console.log(proxy); // a, b 在 Proxy 的 Target 下
```

{% asset_img 1644225900862-b41cc7ff-976a-4938-a12d-1080a8d2f734.png a不在proxy本身上而在target上 %}

### deleteProperty

- 经过了代理 deleteProperty 删除了 target 中的 b

```javascript
let target = {
  a: 1,
  b: 2
}

let proxy = new Proxy(target, {
  get(target, prop) {
    return 'GET: ' + prop + ' = ' + target[prop];
  },
  set(target, prop, value) {
    target[prop] = value;
    console.log('SET: ' + prop + ' = ' + value);
  },
  has(target, prop) {
    return Reflect.has(target, prop);
  },
  deleteProperty(target, prop) {
  	delete target[prop];
    console.log(1);
  }
});

delete proxy.b;
console.log("proxy", proxy);
console.log("target", target);
```

{% asset_img 1644226160893-457cf553-9c5e-429d-961c-6934ce69db4f.png delete代理上的属性删除target属性 %}

# ES - 14种对象操作方法

## 获取原型 [[GetPrototypeOf]]

- 通过原型方法: Object.getPrototypeOf(obj)
- 通过 __proto__ : obj.__proto__
- 通过构造函数的原型属性: 构造函数.prototype


```javascript
var obj = { a: 1, b: 2 };
var proto = Object.getPrototypeOf(obj);
console.log(proto); // Object.prototype
console.log(obj.__proto__);
console.log(Object.prototype);
```

{% asset_img 1637889668829-553c175c-33be-4e82-8b00-3860f00c9a6e.png getPrototypeOf %}

## 设置原型 [[SetPrototypeOf]]

- 通过 Object.setPrototypeOf(obj, xxx)
- 通过 obj.__proto__ = xxx
- 通过 Object.prototype = xxx
  
```javascript
var obj = { a: 1, b: 2 };
Object.setPrototypeOf(obj, { c: 3, d: 4 });
// obj.__proto__ = { c: 3, d: 4};
// Object.prototype = { c: 3, d: 4 };
console.log(obj);
```

{% asset_img 1637890397084-f61c7caa-c98d-46b9-ac80-5b818afbd6a3.png setPrototypeOf %}

## 获取对象的可扩展性 [[IsExtensible]]

**Object.isExtensible()** 方法判断一个对象是否是可扩展的（是否可以在它上面添加新的属性）。

```javascript
var extensible = Object.isExtensible(obj);
console.log(extensible); // true
Object.freeze(obj); // 冻结
var extensible2 = Object.isExtensible(obj);
console.log(extensible2); // false
```

### Object.seal

- 不可新增删除，可修改可枚举


```javascript
var obj = { a: 1, b: 2 };
Object.seal(obj); // 封闭对象
obj.c = 3; // 不可新增
console.log(obj);
delete obj.a; // 不可删除
console.log(obj);
obj.b = 3; // 可修改原有属性
console.log(obj);

for (const key in obj) {
  console.log(`key: ${key} - val: ${obj[key]}`);
}
```

{% asset_img 1637891738804-7a224d81-a9b5-4b48-a975-651273661d2d.png Object.seal %}

### Object.freeze

- 不可新增删除修改，但可枚举


```javascript
var obj = { a: 1, b: 2 };
Object.freeze(obj); // 冻结对象
obj.c = 3; // 不可新增
console.log(obj);
delete obj.a; // 不可删除
console.log(obj);
obj.b = 3; // 不可修改
console.log(obj);

for (const key in obj) {
  console.log(`key: ${key} - val: ${obj[key]}`);
}
```

{% asset_img 1637891772596-c931b06a-1e63-4a99-a90e-38098c403ee6.png Object.freeze %}

## 获取自有属性 [[GetOwnProperty]]

- 获取自有属性，不返回原型上的属性


```javascript
var obj = { a: 1, b: 2 };
Object.setPrototypeOf(obj, { c: 3, d: 4 });
console.log(Object.getOwnPropertyNames(obj)); // [ 'a', 'b' ]
```

## 禁止扩展对象 [[PreventExtensions]]

- 不可扩展
- 可删除


```javascript
var obj = { a: 1, b: 2 };
Object.preventExtensions(obj);
obj.c = 3;
console.log(obj);

delete obj.a;
console.log(obj);
```

{% asset_img 1637892635361-9745902f-a965-4e63-a319-6f4e7171ad8e.png Object.preventExtensions %}

## 拦截对象操作 [[DefineProperty]]

- Object.defineProperty()


## 判断是否是自身属性 [[HasOwnProperty]]

- obj.hasOwnProperty(key)


```javascript
var obj = { a: 1, b: 2 };
console.log(obj.hasOwnProperty('a')); // true
```

## 获取 [[GET]]

```javascript
var obj = { a: 1, b: 2 };
console.log('c' in obj); // false
console.log('a' in obj); // true
console.log(obj.a); // 1
```

## 设置 [[SET]]

```javascript
var obj = { a: 1, b: 2 };
obj.a = 3;
obj['b'] = 4;
console.log(obj); // { a: 3, b: 4 }
```

## 删除 [[Delete]]
```javascript
var obj = { a: 1, b: 2 };
delete obj.a;
console.log(obj); // { b: 2 }
```

## 枚举 [[Enumerate]]

```javascript
var obj = { a: 1, b: 2 };
for (var k in obj) {
	console.log(obj[k]); // 1,2
}
```


## 获取键集合 [[OwnPropertyKeys]]

```javascript
var obj = { a: 1, b: 2 };
console.log(Object.keys(obj)); // ['a', 'b']
```

## 调用函数

```javascript
function test() {}
test();

test.call/apply

var obj = { a: 1, b: 2 };
obj.test = function() {};
obj.test();
```

## 实例化对象

```javascript
function Test() {}
new Test();
```

# 自定义 Proxy

```javascript
function MyProxy(target, handler) {
  const _target = deepClone(target);
  Object.keys(_target).forEach(key => {
    Object.defineProperty(_target, key, {
      get() {
        return handler.get && handler.get(target, key);
      },
      set(newVal) {
        handler.set && handler.set(target, key, newVal);
      }
    })
  });
  return _target;

  function deepClone(org, tar) {
    let target = tar || {},
        toStr = Object.prototype.toString,
        arrType = '[object Array]';

    for (var key in org) {
      if (org.hasOwnProperty(key)) {
        let value = org[key];
        if (typeof value === 'object' && value !== null) {
          if (toStr.call(value) === arrType) {
            target[key] = [];
          } else {
            target[key] = {};
          }
          deepClone(value, target[key]);
        } else {
          target[key] = value;
        }
      }
    }
    return target;
  }
}

const obj = { a: 1, b: 2 }

const proxy = new MyProxy(obj, {
  get(obj, prop) {
    console.log('GET: ' + prop + ' = ' + obj[prop]);
    return obj[prop];
  },
  set(obj, prop, newVal) {
    console.log('SET: ' + prop + ' = ' + newVal);
    obj[prop] = newVal;
  }
});

proxy.a = 3;
console.log(proxy);
```

{% asset_img 1637909569266-843f41fb-bc6b-4078-ac73-7af1a23af175.png 自定义proxy %}

- 打印的 proxy 是个空对象，是因为 new 出来的 MyProxy 中 return 的 _target ，经过 Object.defineProperty 设置属性后，在对象中不可见了（不可枚举），展开对象后可见
- 在构造函数中 return 一个复杂值，会覆盖默认 return 的 this。但 return 一个基本值，不会覆盖 this
- 
# 总结

- 通过重写 Proxy 的 handler 中相应的方法，来达到修改原对象的目的。
- 外界每次通过 Proxy 去访问操作 target 对象的属性的时候，会经过 handler 中的相应方法，然后通过在代理的这些方法中做处理，来达到更改 target 对象的目的
- 间接操作 target，此方式跟 defineProperty 的拦截方式，完全不同


# 💄defineProperty 和 Proxy 的异同

## 相同

都能对数据进行“拦截”

## 不同

本质不同

- defineProperty 给对象增加属性用
- proxy 代理对象，通过重写 handler 方法，间接达到修改target的目的


## 💄defineProperty 存在的问题

### 数组通过 索引、修改数组length、push、pop 等一系列方式操作数组，都无法触发 setter，而 Proxy 可以触发

vue对 push、pop 等数组方法进行了重写

# Reflect 反射

{% asset_img 1637914208708-72ca2cda-3160-4f52-876c-9e5f910df51a.png Reflect %}

## 介绍

ES6 中定义的一个内置对象，是方法集合的容器。全局下的一个对象，不能 new
上面讲的14种方法，这里边有13种，少了一个枚举

## 存在的原因

放在这上面的原因是：

因为很多对象方法，以前都放在 Object 上在，但很多方法不是直接操作 Object，有可能是操作函数、或数组。
由于这样的不合理，所以专门用 Reflect 这样一个容器来装这些方法

## 使用
使用 Reflect 更合理，因为是用方法返回值

```javascript
let target = {
	a: 1,
  b: 2
}

let proxy = new Proxy(target, {
	get(target, prop) {
  	// return target[prop];
    return Reflect.get(target, prop);
  },
  set(target, prop, value) {
  	const isOk = Reflect.set(target, prop, value);
    if (isOk) {
      console.log('SET successfully');
    }
  }
});

proxy.a = 233; // SET successfully
console.log(proxy.b); // 2
console.log(target.a); // 233
```


