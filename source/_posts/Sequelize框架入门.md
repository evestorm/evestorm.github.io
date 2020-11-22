---
title: Sequelize框架入门
tags:
  - Sequelize
categories:
  - 后端
  - SQL
abbrlink: 1183
date: 2019-03-11 10:22:53
---

## 前言

平常写前端项目时，为了更方便的获取“真实”的动态数据，也会新建几个数据库表来作支撑。但每每需要用Node搭建后端服务时，数据库的查询真的让人头疼，难倒不难，就是特别繁琐，即使封装了个查询sql用工具模块，在遇到稍复杂的查询语句时还是得写完整SQL。

我又是个比较懒的人，在经历了几次痛苦折磨后，我开始google有没有谁帮我们解决了数据库表字段与对象之间的关系映射。也就是我们通常所说的 [ORM](https://baike.baidu.com/item/ORM/3583252?fr=aladdin) 。经过几番搜索，我找到了 [Sequelize](http://docs.sequelizejs.com/) 框架。在了解它之前，我们先简单介绍下什么是 `ORM` ：（我知道不少人是不会点击上面链接查看详情的 :)）

<!-- more -->

## 介绍

### ORM

ORM 全称 Object Relational Mapping，翻译成中文就是 `对象关系映射` 。是对 SQL 查询语句的封装，让我们可以用面向对象的方式操作数据库，来更加优雅的生成安全、可维护的 SQL 代码。说白了，就是通过对象来映射和操作数据库。

### Sequelize

而今天的主角 `Sequelize` 则是一个基于 promise 的 Node.js 异步ORM框架。它能够支持多种数据库，包含但不限于 PostgreSQL, MySQL 和 MSSQL 。

> 官网地址：http://docs.sequelizejs.com/
> github：https://github.com/sequelize/sequelize

## 使用

### 起步

在本地新建文件夹，例如 `sequelize-demo` ，然后在项目根目录下运行命令行命名 `npm init -y`。运行完该命令后项目tree如下：

{% asset_img npminit-y.png npminit-y %}

接着使用 npm 安装 `sequelize`：

```shell
npm i sequelize
```



### 连接数据库

完成上述步骤以后，我们在根目录下新建一个 `app.js` 文件来使用 `sequelize` ，代码如下：

```js
// 导入 sequelize
const Sequelize = require('sequelize');

// 新建 sequelize 实例
const sequelize = new Sequelize('数据库名称', '数据库用户名', '数据库密码', {
    // 其他的数据库连接配置
    host: '127.0.0.1', // 主机，默认 localhost
    port: 8889,        // 端口，默认 3306
    dialect: 'mysql',  // 数据库类型， 默认 mysql 【必填】
    timezone: '+08:00' // 时区，默认会根据系统当前所在时区进行设置，格式：'+08:00' 或字符串格式 'Asia/Shanghai' 参考：http://php.net/manual/zh/timezones.php 【使用场景：一般情况下默认配置就好，但如果服务器在美国，但想存储中国时区，就需要明确指定 '+08:00' 了】
});

// 测试数据库的连接（返回的是一个Promise，记得 catch 捕获错误）
try {
    sequelize.authenticate();
    console.log('数据库连接成功!');
} catch (err) {
    console.log('连接失败');  
}
```

此时你可以尝试运行 `app.js` 文件，即在根目录下运行 `node app.js` 命令。正常情况下你会收到报错信息，类似这样：

{% asset_img error-mysql2.png mysql2 %}

意思是你需要安装 `mysql2` ，这是因为 `sequelize` 虽然依赖了 `mysql2` ，但却没有内置安装。所以接下来你得在项目根目录下运行如下代码来安装 `mysql2`：

```shell
npm i mysql2
```



安装完毕后再次运行 `app.js` ，就能连接数据库成功了：

```shell
node app.js
Executing (default): SELECT 1+1 AS result
数据库连接成功!
```



### 定义模型（Model）

> 所谓模型，就是用来描述数据库表字段信息的对象，每一个模型对象表示数据库中的一个表，后续对数据库的操作都是用过对应的模型对象来完成的。

接下来我们就要定义数据的模型了。在此之前，你还需要做一些准备工作。以我为例，我在数据库中新建了一个 `users` 表，表字段和类型如下：

{% asset_img table-property.png 表字段 %}

然后定义出对应此表的数据模型：

```js
// 定义模型（用对象的方式来描述数据库中的表）
const UserModel = sequelize.define('User', {
    // 描述表中对应的字段信息
    id: { // 每一个字段的信息
        type: Sequelize.INTEGER(11), // 字段类型
        allowNull: false,            // 不允许为空
        autoIncrement: true,         // id自增长
        primaryKey: true,            // 设为主键
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '',            // 设置字段默认值
    },
    age: {
        type: Sequelize.TINYINT(3),
        allowNull: false,
    },
    gender: {
        type: Sequelize.ENUM(['men', 'women', 'other']), // 这是个枚举类型字段，表示性别只能为“男”，“女”，“保密”中的其中一个，传入 ENUM 中的可以是逗号隔开的字符串，也可以是个数组：ENUM(['men', 'women']) or ENUM('men', 'women', 'other')
        allowNull: false,
        defaultValue: 'men',
    },
}, { // 用来设置字段以外的其他信息
    timestamps: false, // 是否给每条记录添加 createAt 和 updateAt 字段，并在添加新数据和更新数据的时候自动设置这两个字段的值，默认为 true
    tableName: 'users', // 该模型映射的真实表名
});
```



**注意：**在定义模型时，字段名称可以和数据库表中的字段名称不相同，但如果你想另起一个别名，则需要在字段信息设置中加入 `field` 来关联真正的表字段名称。例如：

```js
userName: { // <-- 你起的别名
    type: Sequelize.STRING(50),
    allowNull: false,
    field: 'username', // 关联数据库表中真正的字段名
},
```



### 数据查询

#### 查询所有

完成表模型的定义以后，我们就可以通过 `findAll` 来查询表数据了：

```js
// 查询 users 表中所有数据
UserModel.findAll().then(users => {
    // 返回的 users 是个数组
    users.forEach(user => {
        // 循环的每个 user 都是个 Model 实例
        // 该 Model 实例包含 get 方法，我们能通过它获取 username
        console.log(user.get('username'));
    });
}).catch(err => {
    console.log(err);
});
```



写完上面代码后，再次运行 `app.js` ，你就应该能够查询到数据了~
p.s. 查询之前别忘了在数据库中插入一些数据。

#### 条件查询

除了查询全部数据，我们还可以使用 `where` 查询指定的数据：

```js
// 这次不用 .then 形式，而采用 async + await
(async function() {
    // 查找 username 为 '李元芳' 的唯一数据
    let res = await UserModel.findOne({
        where: {
            username: '李元芳'
        }
    })
    console.dir(res);
})();
```



而类似大于小于这样的查询会稍显麻烦一点。例如我们来编写查询 users 表中年龄大于某个值的代码：

```js
(async function () {
    // 查找满足 age > 24 的所有数据
    let res = await UserModel.findAll({
        where: {
            age: {
                [Sequelize.Op.gt]: 24,
            }
        }
    })
    // 打印出符合条件的用户的 username
    console.dir(res.map(r => r.get('username')));
})();
```



#### 多条件查询

除了单一条件查询，我们还可以通过嵌套 or 或 and 运算符的集合来生成复杂条件语句。例如我们来查询 `年龄小于25 或者 性别为男` 的所有数据：

```js
(async function () {
    let { Op } = Sequelize;
    // 查找满足 age < 25 或 gender = 'men' 的所有数据
    let res = await UserModel.findAll({
        where: {
            [Op.or]: [
                {
                    age: {
                        [Sequelize.Op.lt]: 25,
                    }
                },
                {
                    gender: 'men'
                }
            ]
        }
    })
    // 打印出符合条件的用户的 username
    console.dir(res.map(r => r.get('username')));
})();
```



从上面几组查询语句我们可以看出，`where` 通常用 `attribute: value` 键值对获取一个对象，其中 `value` 可以是匹配等式的**数据**或其他运算符的**键值对象**。更多查询语法可在下方链接查询：

- [Sequelize - Querying](http://docs.sequelizejs.com/manual/querying.html)
- [Sequelize - Querying（中文文档）](https://demopark.github.io/sequelize-docs-Zh-CN/querying.html)

#### 查询限制 limit, offset

我们还能限制查询的数量：

```js
(async () => {
    // 只从表中查询两条数据
    let res = await UserModel.findAll({
        limit: 2,
    });
    console.log(res.map(r => r.get('username')));
})();
```



跳过前2条数据：

```js
(async () => {
    let res = await UserModel.findAll({
        offset: 2,
    });
    console.log(res.map(r => r.get('username')));
})();
```



跳过前2条数据并获取3条：

```js
(async () => {
    let res = await UserModel.findAll({
        offset: 2,
        limit: 3
    });
    console.log(res.map(r => r.get('username')));
})();
```



#### 查询排序

我们还可以将查询数据进行排序：

```js
(async () => {
    // 查询的结果按年龄高到低排序
    let res = await UserModel.findAll({
        order: [
            ['age', 'desc']
        ]
    });
    console.log(res.map(r => r.get('username')));
})();
```



#### 查询记录

有些时候我们可能只是想单纯的查询数据表中有多少条数据，这时可以用 `count()` 方法：

```js
(async () => {
  // 查询 users 表中有多少条数据
  let count = await UserModel.count();
  console.log(count);
})();



// 或者使用 `findAndCountAll()` 方法在数据库中搜索多条记录，它能返回给我们**数据和总计数**：


(async () => {
    // 查询 users 表中的前两条数据，并返回 users 表中总记录数
    let res = await UserModel.findAndCountAll({
        limit: 2,
    });
    console.log(res);
})();
```



查询结果的格式如下：

```js
{ 
    count: 总记录数,
    rows: [ 
        {第一条记录}, {第二条记录}, ...
    ]
}
```



这个方法对我们为前端提供分页功能很方便，count是符合条件的总记录数，而rows中可以是当前页数下的记录数。

### 数据增加

既然能查，当然就能往数据库插入数据，在 `sequelize` 中，插入数据可以用 `build` 方法：

```js
// 新建一条数据（除了build外，还可以通过 new UserModel({}) 的形式创建一条记录）
let wangwu = UserModel.build({
    username: '王五',
    age: 22,
    gender: 'men'
});

// **注意：** 通过 new 或 build 出来的对象不会立即同步到数据库中，
// 需要使用后续的一些方法（例如 save ）来同步

// 你还可以修改这条数据
wangwu.set('age', 25);

// 最后别忘了保存才能成功插入数据
wangwu.save();
```


如果运行后没报错，去数据库刷新表吧，数据已经成功的插入到 `users` 表了~

### 数据修改

实际开发中修改数据是再平常不过的了，比如修改一篇博客，更新自己的个人信息… 在 `sequelize` 中，我们这样修改数据：

```js
// 查询id为2的用户数据
UserModel.findByPk(2).then(user => {
    // 查询到以后修改其 age 字段为 99
    user.set('age', 99);
    // 修改后别忘了保存
    user.save();
});
```



**注意：** 在 Sequelize v5 版本以前，通过id查询数据的方法名为 `findById` ，从 v5 版本开始，更改为 `findByPk` 。其实想一下这样非常合理，以前的 `findById` 太主观了，要知道不一定每个表的主键都为 id ，所以更改为 `findByPk` 后，表示通过**主键（Pk -> PrimaryKey）**查找，`sequelize` 会自动通过你在创建表模型时定义的主键字段查找。例如我们一开始在定义 `User` 模型时，就给 `id` 字段添加了 `primaryKey: true,` 属性。

除了 set + update 来更新数据以外，还可以使用 `update()` 方法做相同的事情：

```js
(async function () {
    // 先查询
    let xiaohong = await UserModel.findByPk(3);
    // update方法相当于 set + save
    await xiaohong.update({
        age: 22,
    });
})();
```



### 数据删除

如果想要删除一条数据，可以使用 `destroy` 方法：

```js
(async function () {
    // 先查询
    let wangwu = await UserModel.findByPk(4);
    // 对查询到的数据进行删除
    wangwu.destroy();
})();
```



## 完整代码

```js
const Sequelize = require('sequelize');

const sequelize = new Sequelize("miaov", "root", "root", {
  // 其他的数据库连接配置
  host: "127.0.0.1", // 主机
  port: 8889, // 端口
  dialect: "mysql" // 数据库类型
});

// 测试连接
try {
    sequelize.authenticate();
    console.log('数据库连接成功!');
} catch (err) {
    console.log('连接失败');    
}

// 定义模型（用对象的方式来描述数据库中的表）
const UserModel = sequelize.define('User', {
    // 定义字段
    id: { // 对字段属性的定义
        type: Sequelize.INTEGER(11), // 字段类型
        allowNull: false,            // 不允许为空
        autoIncrement: true,         // id自增长
        primaryKey: true,            // 设为主键
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '',            // 设置字段默认值
    },
    age: {
        type: Sequelize.TINYINT(3),
        allowNull: false,
    },
    gender: {
        type: Sequelize.ENUM(['men', 'women', 'other']),
        allowNull: false,
        defaultValue: 'men',
    },
}, { // 用来设置字段以外的其他信息
    timestamps: false,  // 是否给每条记录添加 createAt 和 updateAt 字段，并在添加新数据和更新数据的时候自动设置这两个字段的值，默认为 true
    tableName: 'users', // 该模型映射的真实表名
});

// 为了方便学习，使用一个函数包裹一组代码
// 这样代码就不会运行了，从而避免干扰其他代码的执行
// 如果想要此函数中代码执行，添加 `()` 就好
// (function(){...})();  <-- 加上括号
(function() {
    // 查询 users 表中所有数据
    UserModel.findAll().then(users => {
        // 返回的 users 是个数组
        users.forEach(user => {
            // 循环的每个 user 都是个 Model 实例
            // 该 Model 实例包含 get 方法，我们能通过它获取 username
            console.log(user.get('username'));
        });
    }).catch(err => {
        console.log(err);
    });
});

(async function() {
    // 新建一条数据（除了build外，还可以通过 new UserModel() 的形式创建一条记录）
    let liyuanfang = UserModel.build({
        username: '李元芳',
        age: 09,
        gender: 'men'
    });
    // 修改数据
    liyuanfang.set('age', 25);
    // 别忘了保存
    await liyuanfang.save();
});

(function() {
    // 查询id为2的用户数据
    UserModel.findByPk(2).then(user => {
        // 查询到以后修改其 age 字段为 99
        user.set('age', 99);
        // 修改后别忘了保存
        user.save();
    });
});

(async function() {
    // 先查询
    let xiaohong = await UserModel.findByPk(3);
    // update方法相当于 set + save
    await xiaohong.update({
        age: 18
    });
});

(async function () {
    // 先查询
    let wangwu = await UserModel.findByPk(4);
    // 对查询到的数据进行删除
    wangwu.destroy();
});

(async function() {
    // 查找 username 为 '李元芳' 的唯一数据
    let res = await UserModel.findOne({
        where: {
            username: '李元芳'
        }
    })
    console.dir(res);
});

(async function () {
    // 查找满足 age > 24 的所有数据
    let res = await UserModel.findAll({
        where: {
            age: {
                [Sequelize.Op.gt]: 24,
            }
        }
    })
    // 打印出符合条件的用户的 username
    console.dir(res.map(r => r.get('username')));
});

(async function () {
    let { Op } = Sequelize;
    // 查找满足 age < 25 或 gender = 'men' 的所有数据
    let res = await UserModel.findAll({
        where: {
            [Op.or]: [
                {
                    age: {
                        [Sequelize.Op.lt]: 25,
                    }
                },
                {
                    gender: 'men'
                }
            ]
        }
    })
    // 打印出符合条件的用户的 username
    console.dir(res.map(r => r.get('username')));
});

(async () => {
    // 只从表中查询两条数据
    let res = await UserModel.findAll({
        limit: 2,
    });
    console.log(res.map(r => r.get('username')));
});

(async () => {
    // 跳过前2条数据
    let res = await UserModel.findAll({
        offset: 2,
    });
    console.log(res.map(r => r.get('username')));
});

(async () => {
    // 跳过前2条数据并获取3条
    let res = await UserModel.findAll({
        offset: 2,
        limit: 3
    });
    console.log(res.map(r => r.get('username')));
});

(async () => {
    // 查询的结果按年龄高到低排序
    let res = await UserModel.findAll({
        order: [
            ['age', 'desc']
        ]
    });
    console.log(res.map(r => r.get('username')));
});

(async () => {
    // 查询的结果按年龄高到低排序
    let count = await UserModel.count();
    console.log(count);
});

(async () => {
    // 查询 users 表中的前两条数据，并返回 users 表中总记录数
    let res = await UserModel.findAndCountAll({
        limit: 2,
    });
    console.log(res);
})();
```

## 版本

安装的 sequelize 和 mysql2 的版本为：

```js
"dependencies": {
    "mysql2": "^1.6.5",
    "sequelize": "^5.3.1"
}
```



## 资源

- [Sequelize Docs](http://docs.sequelizejs.com/)
- [Sequelize Docs 中文版](https://demopark.github.io/sequelize-docs-Zh-CN/)
