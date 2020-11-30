---
title: 【转载】使用Object键值替换Switch
tags:
  - 技巧
  - 转载
categories:
  - 前端
  - JS
abbrlink: 10849
date: 2020-09-21 15:07:47
---

转载地址：https://www.cnblogs.com/ZerlinM/p/13595810.html
原文地址：https://ultimatecourses.com/blog/deprecating-the-switch-statement-for-object-literals

在许多编程语言中，switch 语句存在 - 但是它应该更长吗？如果你是一个 JavaScript 程序员，你经常跳进和跳出对象，创建，实例化和操作它们。对象非常灵活，它们是 JavaScript 中几乎所有内容的核心，使用它们代替 switch 语句是我最近一直在做的事情。

## 什么是 switch 语句?

如果您以前没有使用 switch 过或者有点不确定它是做什么的，那么让我们来看看吧。什么 switch 是输入并提供输出，例如正在运行的代码。
让我们来看一个通常的 switch 陈述：

```js
var type = 'coke';
var drink;
switch (type) {
  case 'coke':
    drink = 'Coke';
    break;
  case 'pepsi':
    drink = 'Pepsi';
    break;
  default:
    drink = 'Unknown drink!';
}
console.log(drink); // 'Coke'
```

它类似于 if 和 else 语句，但它应该评估单个值 - 在 switch 我们使用 a case 来评估每个值。
当你开始看到很多 else if 陈述时，某些东西可能是错误的，通常你会使用类似于 switch 它更适合目的和意图的东西。这是一些 else if 滥用：

```js
function getDrink(type) {
  if (type === 'coke') {
    type = 'Coke';
  } else if (type === 'pepsi') {
    type = 'Pepsi';
  } else if (type === 'mountain dew') {
    type = 'Mountain Dew';
  } else if (type === 'lemonade') {
    type = 'Lemonade';
  } else if (type === 'fanta') {
    type = 'Fanta';
  } else {
    // acts as our "default"
    type = 'Unknown drink!';
  }
  return "You've picked a " + type;
}
```

这个实现太松散了，有错误的余地，加上它是一个非常冗长的语法，可以不断重复自己。还有一个黑客攻击的空间，因为你可以评估每个内部的多个表达式 else if，例如 else if (type === ‘coke’ && somethingElse ！== ‘apples’)。这 switch 是该工作的最佳工具，尽管您需要不断添加 break;语句以防止案件失败，这是其众多问题之一。

## 开关问题

switch 从程序控制流程到其处理代码块的非标准方式存在多个问题，其余的 JavaScript 使用花括号而交换机则不然。从语法上讲，它不是 JavaScript 的最佳选择，也不是它的设计。我们被迫 break;在每个语句中手动添加语句 case，这可能导致难以调试和嵌套错误，如果我们忘记了！道格拉斯·克罗克福德（Douglas Crockford）曾多次撰写和谈论过这个问题，他的建议是谨慎对待。

我们经常在 JavaScript 中使用 Object 查找，通常用于我们永远不会考虑使用的东西 switch- 那么为什么不使用 Object 键值替换 switch？对象更灵活，具有更好的可读性和可维护性，我们不需要手动 break;每个“案例”。他们对新的 JavaScript 开发人员也很友好，因为他们是标准对象。

随着“案例”数量的增加，对象（哈希表）的性能优于交换机的平均成本（案例的顺序很重要）。对象方法是哈希表查找，并且交换机必须评估每个案例，直到它遇到匹配和中断。

## 对象文本查找

我们一直使用对象，无论是构造函数还是文字。通常，我们将它们用于对象查找目的，以从 Object 属性中获取值。
让我们设置一个 String 仅返回值的简单 Object 键值。

```js
function getDrink(type) {
  var drinks = {
    coke: 'Coke',
    pepsi: 'Pepsi',
    lemonade: 'Lemonade',
    default: 'Default item'
  };
  return 'The drink I chose was ' + (drinks[type] || drinks['default']);
}

var drink = getDrink('coke');
// The drink I chose was Coke
console.log(drink);
```

我们从交换机中保存了几行代码，对我而言，数据在演示中更加清晰。我们甚至可以进一步简化它，没有默认情况：

```js
function getDrink(type) {
  return (
    'The drink I chose was ' +
    {
      coke: 'Coke',
      pepsi: 'Pepsi',
      lemonade: 'Lemonade'
    }[type]
  );
}
```

但是，我们可能需要比 a 更复杂的代码 String，这可能会挂在函数内部。为了简洁和易于理解的示例，我将从新创建的函数返回上述字符串：

```js
var type = 'coke';

var drinks = {
  coke: function () {
    return 'Coke';
  },
  pepsi: function () {
    return 'Pepsi';
  },
  lemonade: function () {
    return 'Lemonade';
  }
};
```

区别在于我们需要调用 Object 文字的函数：

```js
drinks[type]();
```

更具可维护性和可读性。我们也不必担心 break;陈述和案例会失败-这只是一个普通的对象。
通常，我们会 switch 在函数内部放入一个 return 值，因此在这里做同样的事情，然后将对象文字查找转换为可用的函数：

```js
function getDrink(type) {
  var drinks = {
    coke: function () {
      return 'Coke';
    },
    pepsi: function () {
      return 'Pepsi';
    },
    lemonade: function () {
      return 'Lemonade';
    }
  };
  return drinks[type]();
}

// let's call it
var drink = getDrink('coke');
console.log(drink); // 'Coke'
```

不错，很容易，但这并不能满足“ default”的要求 case，因此我们可以轻松创建它：

```js
function getDrink(type) {
  var fn;
  var drinks = {
    coke: function () {
      return 'Coke';
    },
    pepsi: function () {
      return 'Pepsi';
    },
    lemonade: function () {
      return 'Lemonade';
    },
    default: function () {
      return 'Default item';
    }
  };
  // if the drinks Object contains the type
  // passed in, let's use it
  if (drinks[type]) {
    fn = drinks[type];
  } else {
    // otherwise we'll assign the default
    // also the same as drinks.default
    // it's just a little more consistent using square
    // bracket notation everywhere
    fn = drinks['default'];
  }
  return fn();
}

// called with "dr pepper"
var drink = getDrink('dr pepper');
console.log(drink); // 'Default item'
```

我们可以简化上面的内容，if 并在表达式中 else 使用 or ||运算符：

```js
function getDrink(type) {
  var drinks = {
    coke: function () {
      return 'Coke';
    },
    pepsi: function () {
      return 'Pepsi';
    },
    lemonade: function () {
      return 'Lemonade';
    },
    default: function () {
      return 'Default item';
    }
  };
  return (drinks[type] || drinks['default'])();
}
```

这会将两个对象查找包装在括号内( )，将它们视为表达式。然后调用表达式的结果。如果 drinks[type]在查找中未找到，则默认为 drinks[‘default’]，简单！
我们不具备总是 return 里面的函数或者，我们可以改变引用任何变量然后返回它：

```js
function getDrink(type) {
  var drink;
  var drinks = {
    coke: function () {
      drink = 'Coke';
    },
    pepsi: function () {
      drink = 'Pepsi';
    },
    lemonade: function () {
      drink = 'Lemonade';
    },
    default: function () {
      drink = 'Default item';
    }
  };

  // invoke it
  (drinks[type] || drinks['default'])();

  // return a String with chosen drink
  return 'The drink I chose was ' + drink;
}

var drink = getDrink('coke');
// The drink I chose was Coke
console.log(drink);
```

这些是非常基本的解决方案，而 Object 字面量包含一个 function 返回 a 的值 String，在您只需要 a 的情况下 String，可以将 a String 用作键的值-在某些情况下，该函数将包含逻辑，该逻辑将从该函数返回。如果您要混合使用函数和字符串，则始终可以使用函数来保存查找 type 和调用（如果是函数）会更容易-我们不想尝试调用 String。

## 对象字面量“告吹”

对于 switch 案例，我们可以让它们失败（这意味着一个以上的案例可以应用于特定的代码段）：

```js
var type = 'coke';
var snack;
switch (type) {
  case 'coke':
  case 'pepsi':
    snack = 'Drink';
    break;
  case 'cookies':
  case 'crisps':
    snack = 'Food';
    break;
  default:
    drink = 'Unknown type!';
}
console.log(snack); // 'Drink'
```

让我们 coke 和 pepsi“贯穿”以不添加 break 语句。为 Object Literals 执行此操作非常简单且更具说明性 - 并且不易出错。我们的代码突然变得更加结构化，可读性和可重用性：

```js
function getSnack(type) {
  var snack;
  function isDrink() {
    return (snack = 'Drink');
  }
  function isFood() {
    return (snack = 'Food');
  }
  var snacks = {
    coke: isDrink,
    pepsi: isDrink,
    cookies: isFood,
    crisps: isFood
  };
  return snacks[type]();
}

var snack = getSnack('coke');
console.log(snack); // 'Drink'
```

## 总结

Object 键值是 JavaScript 中流动的一种更自然的控制，switch 有点陈旧和笨重，并且容易出现调试错误。对象更具可扩展性，可维护性，我们可以更好地测试它们。它们也是设计模式的一部分，在日常的其他编程任务中非常常用。对象键值可以包含函数以及任何其他对象类型，这使它们非常灵活！键值中的每个函数也都有函数作用域，因此我们可以从我们调用的父函数 getDrink 返回闭包（在这种情况下返回闭包）。
