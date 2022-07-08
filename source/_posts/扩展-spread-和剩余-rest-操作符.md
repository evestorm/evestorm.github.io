---
title: 扩展(spread)和剩余(rest)操作符
tags:
  - 转载
  - 技巧
categories:
  - 前端
  - JS
abbrlink: 56177
date: 2021-02-01 22:18:23
---

转载自：https://github.com/coffe1891/frontend-hard-mode-interview/blob/master/1/1.2.12.md

## spread 和 rest 的区别

spread 和 rest 运算符都是`...`+`变量/参数`的形式。是 spread 还是 rest，要根据上下文情境来判断。

<!-- more -->

### 1.spread

当被用于迭代器中时，它是 spread 操作符：

```js
console.log(1, ...[2, 3, 4], 5);
// 1 2 3 4 5
console.log([1, ...[2, 3, 4], 5]);
//[1,2,3,4,5]
function add(x, y) {
  return x + y;
}

const numbers = [4, 38];
add(...numbers); // 42
```

spread 主要形式是`...[Array]`，表示对数组的展开。

### 2.rest

当被用于定义函数的参数时，是 rest 操作符：

```js
function push(...items) {
  console.log(items);
}
let a = 4;
push(a, 1, 2, 3);
//[4,1,2,3]
```

rest 主要是将函数的多个参数转化成数组，**而且只能放在函数参数的最后一个位置**，否则，比如`（array,...items,other）`会报错。

而 rest 的出现，让已经不被推荐使用的`arguments`彻底寿终正寝了。

```js
(function fn(...args) {
  console.log(args.join());
  console.log([...arguments].join()); //spread形式的用法
})([1, 2, 3]);
//>> 1,2,3
//>> 1,2,3
```

## 用法示例

### 1.添加属性

克隆一个对象，同时向(浅)拷贝对象添加附加属性。
在这个示例中，user 被(浅)拷贝，password 属性被添加到 userWithPass 中。

```js
const user = { id: 100, name: 'Howard Moon' };
const userWithPass = { ...user, password: 'Password!' };

user; //>> { id: 100, name: 'Howard Moon' }
userWithPass; //>> { id: 100, name: 'Howard Moon', password: 'Password!' }
```

### 2.对象合并

将两个对象合并到一个新对象中。

```js
const part1 = { id: 100, name: 'Howard Moon' };
const part2 = { id: 100, password: 'Password!' };

const user1 = { ...part1, ...part2 };
//>> { id: 100, name: 'Howard Moon', password: 'Password!' }
```

对象也可以使用以下语法合并：

```js
const partial = { id: 100, name: 'Howard Moon' };
const user = { ...partial, id: 100, password: 'Password!' };

user; //>> { id: 100, name: 'Howard Moon', password: 'Password!' }
```

### 3.排除对象属性

可以结合使用 rest 运算符删除属性。 在下面这个例子里，password 被删除 ，其余的属性作为 rest 返回。

```js
const noPassword = ({ password, ...rest }) => rest;
const user = {
  id: 100,
  name: 'coffe1891',
  password: 'Password!'
};

noPassword(user); //>> { id: 100, name: 'coffe1891' }
```

### 4.动态排除属性

函数接受一个 prop 作为参数。使用计算对象属性名称，可以从克隆中动态地删除属性。

```js
const user1 = {
  id: 100,
  name: 'coffe1891',
  password: 'Password!'
};
const removeProperty = prop => ({ [prop]: _, ...rest }) => rest;
//                     ----       ------
//                          \   /
//                dynamic destructuring

const removePassword = removeProperty('password');
const removeId = removeProperty('id');

removePassword(user1); //>> { id: 100, name: 'coffe1891' }
removeId(user1); //>> { name: 'coffe1891', password: 'Password!' }
```

### 5.对属性进行排序

有时性质并不按照我们需要的顺序排列。 使用一些技巧，我们可以将属性推到列表的顶部，或者将它们移到底部。若要将 id 移动到第一个位置，在扩展对象之前将 `id: undefined` 添加到新的 Object 最前面。

```js
const user3 = {
  password: 'Password!',
  name: 'Naboo',
  id: 300
};

const organize = object => ({ id: undefined, ...object });
//                            -------------
//                          /
//  move id to the first property

organize(user3);
//>> { id: 300, password: 'Password!', name: 'Naboo' }
```

若要将 password 移到最后一个属性，请从对象中解构 password。然后在使用 Rest 操作符后重新设置 password 属性。

```js
const user3 = {
  password: 'Password!',
  name: 'Naboo',
  id: 300
};

const organize = ({ password, ...object }) => ({ ...object, password });
//              --------
//             /
// move password to last property

organize(user3);
//>> { name: 'Naboo', id: 300, password: 'Password!' }
```

### 6.默认属性

默认属性是仅当它们不包含在原始对象中时才设置的值。
在本例中，user2 不包含 quotes 属性。 setdefaults 函数确保所有对象都设置了 quotes 属性，否则它将被设置为`[]`。
当调用 setDefaults (user2)时，返回值将包含 quotes 属性: `[]`。
在调用 setDefaults (user4)时，因为 user4 已经有了 quotes 属性，所以不会修改该属性。

```js
const user2 = {
  id: 200,
  name: 'Vince Noir'
};

const user4 = {
  id: 400,
  name: 'Bollo',
  quotes: ["I've got a bad feeling about this..."]
};

const setDefaults = ({ quotes = [], ...object }) => ({ ...object, quotes });

setDefaults(user2);
//>> { id: 200, name: 'Vince Noir', quotes: [] }

setDefaults(user4);
//>> {
//>>   id: 400,
//>>   name: 'Bollo',
//>>   quotes: ["I've got a bad feeling about this..."]
//>> }
```

如果你希望默认值先出现而不是后出现，也可以这样写：

```js
const setDefaults = ({ ...object }) => ({ quotes: [], ...object });
```

### 7.属性重命名

通过结合上面的技术，可以创建一个函数来重命名属性。假设有一些大写 ID 的对象属性名应该是小写的 id。 首先从对象解构 ID 然后在对象 Spread 时将其作为 id 添加回去。

```js
const renamed = ({ ID, ...object }) => ({ id: ID, ...object });

const user = {
  ID: 500,
  name: 'Bob Fossil'
};

renamed(user); //>> { id: 500, name: 'Bob Fossil' }
```

### 8.添加条件属性

在这个例子中，只有当 password 是真实的时候才会添加 password。

```js
const user = { id: 100, name: 'Howard Moon' };
const password = 'Password!';
const userWithPassword = {
  ...user,
  id: 100,
  ...(password && { password })
};

userWithPassword; //>> { id: 100, name: 'Howard Moon', password: 'Password!' }
```
