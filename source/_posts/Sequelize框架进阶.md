---
title: Sequelize框架进阶
tags:
  - Sequelize
categories:
  - 后端
  - SQL
abbrlink: 3278
date: 2019-03-13 10:30:18
---

## 传送门

- [Sequelize框架入门](https://evestorm.github.io/posts/1183/)

## 前言

上一篇入门讲到了 `Sequelize框架` 的基本用法，比如实现简单的增删查改。原本打算一篇文章写到底的，但感觉内容太多，对读者不太友好，就另开了这篇文章。

虽然标题写着“进阶”，但其实有标题党的以为。这篇文章仍然着手于框架的使用，不涉及源码。大纲见侧边栏的目录，我们直接开始吧~

<!-- more -->

## 连表查询

### 准备工作

既然是连表查询，至少得有两个表吧。所以我们还需要另外新建一张表，这里起名为 `message` 表，表结构如下：

{% asset_img message-table.png message-table %}

其中 uid 对应用户的 id 。下面是两表的数据：

{% asset_img user-message-data.png user-message-data %}

接着我们新建一个 `app2.js` 文件，引入之前 `app.js` 中的部分代码（连接数据库+UserModel）以及创建一个 `MessageModel` 模型：

```js
const Sequelize = require('sequelize');

const sequelize = new Sequelize("miaov", "root", "root", {
    host: "127.0.0.1",
    port: 8889,
    dialect: "mysql"
});

try {
    sequelize.authenticate();
    console.log('数据库连接成功!');
} catch (err) {
    console.log('连接失败');
}

const UserModel = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '',
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
}, {
    timestamps: false,
    tableName: 'users',
});

const MessageModel = sequelize.define('Message', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    uid: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        defaultValue: 0,
    },
    content: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: '',
    }
}, {
    timestamps: false,
    freezeTableName: true, // 默认 false 将自动修改表名为复数，true 表示不修改表名，与数据库表名同步
    tableName: 'message'
});
```



### 需求+普通做法

我们这次的需求是获取某条留言的所有数据，其中包含 `留言本身的数据` + `该留言的用户数据` ，先来看最“耿直”的做法：

```js
(async () => {
    let data = {};
    // 根据 id 查找 message
    let message = await MessageModel.findByPk(1);
    // 根据 message 的 uid 反查出发布这条 message 的 user
    let user = await UserModel.findByPk(message.get('uid'));

    Object.assign(data, {
        id: message.id,
        uid: message.uid,
        content: message.content,
        username: user.username,
        age: user.age,
        gender: user.gender,
    });

    console.log(data);
})();
```

### BelongsTo

除了上面这种做法外，我们还可以使用 `sequelize` 提供的 `BelongsTo` 来关联两个模型进行查询。

思考一下我们的 `users` 和 `message` 表，从 `message` 的角度来讲，一条留言属于一个用户发布的，是一对一的关系。而 `BelongsTo` 关联的含义就是 A 属于 B。那我们应该怎么写代码呢？步骤如下：

1. 首先在模型中给关联的字段定义外键关系

   ```js
   references: {
      model: 关联的外键表模型, e.g. UserModel
      key: 关联的外键表的字段, e.g. id
   }
   ```

2. 在调用 `belongsTo` 或 `hasMany` 等方法的时候，通过第二个参数设置对象

   ```js
   { 
      foreignKey: 当前关联表的字段, e.g. uid
   }
   ```

没有完全理解上面的步骤也没关系，直接上代码更加清晰：

```js
const MessageModel = sequelize.define('Message', {
    ...,
    uid: { // 第一步：在模型中给关联的字段定义外键关系
        ...
        references: {
            model: UserModel, // 关联的外键表模型
            key: 'id',        // 关联的外键表的字段
        }
    },
    ...
}, ...);

(async () => {
    // 第二步：声明两表关系及外键
    // 下面方法翻译过来：留言属于用户
    MessageModel.belongsTo(UserModel, {
        foreignKey: 'uid' // 声明自己（message）的外键是 uid
    });

    let data = await MessageModel.findByPk(1, {
        include: [UserModel] // 表述查出的 message 记录中包含有对应的 user
    });

    console.log(`
        留言id：${data.id}
        留言人名称：${data.User.username}
        留言内容：${data.content}
    `);
})();
```



### HasMany

这次我们换个角度，来通过某个用户查找他/她所有的留言。稍微想一下，一个用户是可以发布多条留言的，所以从 `users` 角度来讲，跟 `message` 是一对多的关系。而 `sequelize` 也提供了处理这种关系的方法，那就是 `HasMany`。直接上代码：

```js
(async () => {
    // users 拥有
    UserModel.hasMany(MessageModel, {
        foreignKey: 'uid',
    });

    let data = await UserModel.findByPk(3, {
        include: [MessageModel]
    });

    console.log(`
        id为 ${data.id} 的留言人 ${data.username} 的留言内容：
    `);
    data.Messages.forEach(m => {
        console.log(`
            ${m.content}`);
    });
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
