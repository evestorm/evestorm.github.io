---
title: 基于sequelize的数据库迁移
tags:
  - Sequelize
categories:
  - 后端
  - SQL
abbrlink: 16051
date: 2019-03-15 10:48:13
---

## 数据库迁移

有时候我们也希望能够跟踪数据库的更改，像 git 一样在各个不同时期的数据库状态之间进行切换。或者能通过一套工具将数据库迁移到本机，让我们在家也能进行测试开发，而不用依赖公司的测试环境。这些特性，作为今天的主角 `sequelize-cli` 都能提供给我们。

> npm链接请 [点击这里](https://www.npmjs.com/package/sequelize-cli)。

## 安装

首先创建项目，项目名随意，创建完毕后cd到项目根目录，老规矩命令行 `npm init -y` 创建 `package.json` ，然后输入安装一步到位：`npm i sequelize mysql2 sequelize-cli` 。

<!-- more -->

**注意：** `sequelize-cli` 依赖 `sequelize`，`sequelize` 依赖 `mysql2`

安装完毕后我们可以测试下是否可用，根目录命令行输入：

```shell
./node_modules/.bin/sequelize
```

看见命令行输出类似下方提示代表安装成功：

```shell
sequelize [命令]

命令：
  sequelize db:migrate                        Run pending migrations
  sequelize db:migrate:schema:timestamps:add  Update migration table to have timestamps
  sequelize db:migrate:status                 List the status of all migrations
  sequelize db:migrate:undo                   Reverts a migration
  sequelize db:migrate:undo:all               Revert all migrations ran
  sequelize db:seed                           Run specified seeder
  sequelize db:seed:undo                      Deletes data from the database
  sequelize db:seed:all                       Run every seeder
  sequelize db:seed:undo:all                  Deletes data from the database
  sequelize db:create                         Create database specified by configuration
  sequelize db:drop                           Drop database specified by configuration
  sequelize init                              Initializes project
  sequelize init:config                       Initializes configuration
  sequelize init:migrations                   Initializes migrations
  sequelize init:models                       Initializes models
  sequelize init:seeders                      Initializes seeders
  sequelize migration:generate                Generates a new migration file     [aliases: migration:create]
  sequelize model:generate                    Generates a model and its migration    [aliases: model:create]
  sequelize seed:generate                     Generates a new seed file               [aliases: seed:create]

选项：
  --help     显示帮助信息                                                                             [布尔]
  --version  显示版本号                                                                               [布尔]
```

## 使用

### 初始化

目前我们项目的树形结构为：

```shell
.
├── node_modules
├── package-lock.json
└── package.json
```

接着根目录命令行输入 `./node_modules/.bin/sequelize init` 来初始化 sequelize 项目，该命令会帮我们创建如下目录：

```shell
.
├── config              # 包含数据库的配置文件
├── migrations          # 包含所有迁移文件（e.g. 数据库、表的创建，字段的增加）跟数据库结构有关的操作都存放在这里
├── models              # 包含项目中的所有模型（e.g. Users, Message）
├── node_modules
├── seeders             # 包含所有种子文件（e.g. 表中的数据）
├── package-lock.json
└── package.json
```



## config

首先我们来看下 `config` 目录下的 `config.json` 文件。它里面包含了数据库的的基本配置，默认分为 `development（开发）` 、`test（测试）` 和 `production（生产）` 环境。当然你也可以删除或新增环境，比如新增一个在家编写代码所使用的 `home` 环境。

### db:create

`sequelize-cli` 默认读取 `development` 模式下的数据库配置来创建数据库，所以接下来就用它来配置：

```js
"development": {
    "username": "root", // 数据库用户名
    "password": "root", // 数据库密码
    "database": "database_development", // 需要创建的数据库名
    "host": "127.0.0.1", // 主机
    "port": 8889,       // 端口号
    "dialect": "mysql"  // 使用的数据库类型
},
```



配置完毕后在根目录下的命令行输入 `./node_modules/.bin/sequelize db:create`
。当你看到如下输出就代表创建数据库成功：

```shell
Loaded configuration file "config/config.json".
Using environment "development".
Database sw_sequelize_development created.
```



### db:drop

能添加就能删除，我们可以键入 `./node_modules/.bin/sequelize db:drop` 命令来删除数据库。当你看到命令行输出下面内容就代表删除成功：

```shell
Loaded configuration file "config/config.json".
Using environment "development".
Database sw_sequelize_development dropped.
```



### 模式切换

前面已经说了，`sequelize-cli` 默认读取 `development` 模式下的数据库配置。那如果我现在想切到 `test` 模式下该怎么办呢？

#### 变更环境变量

首先得切换服务器环境变量，MacOS下（其他系统切换命令见下方链接）使用 `export NODE_ENV=test` 来切换到 `test` 模式，然后使用 `echo $NODE_ENV` 查看是否已经切换成功，接着就可以再次执行 `./node_modules/.bin/sequelize db:create` 命令，创建 `test` 模式下的数据库了：

```shell
$ export NODE_ENV=test

$ echo $NODE_ENV
test

./node_modules/.bin/sequelize db:create

Sequelize CLI [Node: 9.0.0, CLI: 5.4.0, ORM: 5.3.3]

Loaded configuration file "config/config.json".
Using environment "test".
Database sw_sequelize_test created.
```

> [各系统下NodeJS环境变量修改](http://sorex.cnblogs.com/p/6200940.html)

#### 还原环境变量

如果想回到默认的 `development` 模式，MacOS下直接键入命令 `export NODE_ENV=` 就OK啦。

## models

### 创建模型

我们通过 `model:generate` 或者 `model:create` 来创建模型文件，它一共需要两个参数，分别是：

- –name: 模型名称（必须）
- –attributes: 字段列表（必须）

回到我们的项目，在根目录执行下面命令来创建一个 User 模型文件：

```shell
./node_modules/.bin/sequelize model:create --name User --attributes username:STRING
```

执行完毕后命令行会有类似下方输出：

```shell
Sequelize CLI [Node: 9.0.0, CLI: 5.4.0, ORM: 5.3.3]

New model was created at .../你的项目名/models/user.js .
New migration was created at .../你的项目名/migrations/20190316035632-User.js
```



所以 `model:create` 命令执行后帮我们创建了两个文件，一个是用来定义 User 模型的文件 user.js :

```js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
```



一个是 `migrations` 迁移文件夹下的 `用来创建 User 表` 的文件：

```js
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    //   创建名为 Users 的数据表
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
```



其中 `models` 文件夹下文件，例如生成的 `user.js` 模型文件是给程序用的；`migrations` 和 `seeders` 文件夹下的文件是个 `cli` 用的。

总结下来，`model:create` 命令帮我们做了两件事情：

- 创建 User 模型
- 创建跟模型对应的 Users 数据表文件，方便用此文件在数据库中创建 Users 表

## migrations

刚刚我们已经创建了一个 User 模型和用来创建 Users 表的脚本执行文件。下面就可以开始执行迁移了。首先我们重温何为执行迁移：

> 所谓迁移，就是对数据库进行结构的创建、升级（修改）等操作

### 执行迁移

#### db:migrate

执行迁移的命令为 `db:migrate`，我们直接在项目根目录下运行：

```shell
./node_modules/.bin/sequelize db:migrate
```

（如果在此之前你运行过 db:drop 命令来删除数据库，记得再重新执行一次 db:create，否则会导致创建表失败）。执行成功的输出类似下面文字：

```shell
Sequelize CLI [Node: 9.0.0, CLI: 5.4.0, ORM: 5.3.3]

Loaded configuration file "config/config.json".
Using environment "development".
== 20190316035632-create-user: migrating =======
== 20190316035632-create-user: migrated (0.047s)
```

此时刷新下你的本地数据库，就会发现之前空空如也的数据库中多了个 `users` 表和 `sequelizemeta` 表：

{% asset_img create-users.png create-users %}

`users` 表被创建出来我们能理解，重点说一下这个 `sequelizemeta` 表，其实它是用来记录已经被执行过的迁移脚本的，避免我们重复执行已经执行过的脚本。

#### db:migrate:status

我们可以通过 `db:migrate:status` 命令来查看当前迁移脚本的执行状态：

```shell
./node_modules/.bin/sequelize db:migrate:status
```

执行完毕后的打印结果为：

```shell
Loaded configuration file "config/config.json".
Using environment "development".
up 20190316035632-create-user.js
```

这个 up ，表示我们已经执行该脚本。此时我们可以删掉 `sequelizemeta` 表中的记录，然后再次执行 `db:migrate:status` ，会发现输出的 `up` 已变为 `down` ，表示我们从未执行过该脚本。由此可知 `db:migrate:status` 会通过 `sequelizemeta` 表中的记录来判断脚本是否被执行过。而当我们已经执行过某些脚本后再次执行 `db:migrate` ，那些已经执行过的脚本就不会再次重复执行了：

```shell
Loaded configuration file "config/config.json".
Using environment "development".
No migrations were executed, database schema was already up to date.
```

#### db:migrate:undo

除了上面的新增数据表操作，我们还可以进行撤销操作。执行 `./node_modules/.bin/sequelize db:migrate:status` 命令后 `sequelize-cli` 会帮我们撤销掉上一次（最近一次）的迁移操作，比如我们的 `sequelizemeta`
表中记录了两条迁移操作（假设创建了 user 和 message 表）：

```js
20190316035632-create-user.js
20190316035921-create-message.js
```

那么执行 `undo` 后就会把最近的一次迁移，也就是 `*-message.js` 从表中移除，并且在数据库中删除 `message` 表。而这个删除操作，其实是执行了迁移文件下对应表的删除代码：

```js
down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Messages');
}
```

#### db:migrate:undo:all

当执行 `./node_modules/.bin/sequelize db:migrate:undo:all` 命令后，能帮我们撤销所有的迁移操作。

#### db:migrate:undo: –name

此命令能帮我们撤销具体指定的迁移脚本，例如执行下面命令会撤销名称为 `20190316035632-create-user` 的脚本操作：

```shell
./node_modules/.bin/sequelize db:migrate:undo --name 20190316035632-create-user
```



执行完毕后再来刷新我们的数据库，就会发现 `user` 表已被删除，只留下了 `message` 表。

### 字段添加与删除

随着业务的增长，我们很有可能需要扩充数据表的字段。例如我们需要给 `user` 表添加一个 `username` 字段，那么我们就可以键入以下命令来创建一个 `migration` :

```shell
./node_modules/.bin/sequelize migration:create --name UserAddAge
```

执行完上述操作后我们能在 `migrations` 文件夹中看到新创建的 `UserAddAge` 文件，打开后代码如下：

```js
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
```



我们要做的，就是在 `up` 和 `down` 方法中填入数据库操作逻辑的代码，`up` 方法中有注释作提示，让我们返回一个类型为 `Promise` 的对象，还给出了示例。因为我们要给数据表添加字段，所以使用 `addColumn` 方法：

```js
return queryInterface.addColumn(
    'users',                        // 被添加字段的表名称
    'age',                          // 需要添加的字段名称
    {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
    },                              // 字段属性
)
```

这样我们就可以给 `user` 表添加上 `age` 字段了。

p.s. 之所以代码中填写 `users` ，是因为 `sequelize-cli` 帮我们创建表是会自动给表名称加 `s` 。

------

能添加就能删除，删除操作我们在 `down` 方法中编写：

```js
return queryInterface.removeColumn(
    'users',
    'age'
);
```

`UserAddAge.js` 文件完整代码：

```js
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addColumn(
      'users', 
      'age',
      {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeColumn(
      'users',
      'age'
    );
  }
};
```



编写完毕后我们运行 `./node_modules/.bin/sequelize db:migrate` 来重新执行一遍所有迁移，刷新 `user` 表后就能看见新增字段 `age` 了。

最后你还可以执行 `./node_modules/.bin/sequelize db:migrate:undo` 来确认 `down` 方法正常工作，从而让 `user` 表删除刚刚添加的 `age` 字段。

文档参考：[更多 QueryInterface 操作](http://docs.sequelizejs.com/class/lib/query-interface.js~QueryInterface.html)

## seeders

除了数据库结构的添加修改删除操作以外，我们通常还会给各种表批量添加一些假数据。这个时候就要用到 seeders 里的种子文件了。比方说现在要给 `user` 表批量添加一些数据，则可以执行下面代码：

```shell
./node_modules/.bin/sequelize seed:create --name userTest
```



执行完毕后你会发现在 `seeders` 文件夹下多了一个类似 `20190316090425-userTest.js` 的文件。

### 批量添加

我们可以在里面编写代码让 `cli` 帮助我们批量添加数据：

```js
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
      return queryInterface.bulkInsert('users', [
        {
          username: '狄仁杰',
          age: 56
        },
        {
          username: '李元芳',
          age: 27
        }
      ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('users', null, {});
  }
};
```



种子文件的执行方式有两种：

- `db:seed 种子文件名` 来运行指定种子文件
- `db:seed:all` 来运行所有种子文件

知道执行方法后我们来运行下面命令：

```shell
./node_modules/.bin/sequelize db:seed:all
```

执行成功后刷新我们的 `user` 表，就会发现数据已经被批量添加进去了。

### 批量删除

命令行输入并执行： `./node_modules/.bin/sequelize db:seed:undo:all` 便可以批量删除刚刚添加进 `user` 表中的数据。

### 记录种子数据的存储

我们知道 `migrations` 迁移是会被记录的（数据库的 `sequelizemeta` 表中），但默认情况下，种子数据的存储不会被记录下来。但官方同样提供了 [方法](http://docs.sequelizejs.com/manual/migrations.html#seed-storage) 来记录种子数据的存储。我们可以通过在配置文件中使用 `seederStorage` 来记录存储：

#### JSON记录

> config/config.json

```json
"development": {
    ...
    "seederStorage": "json", // 存储类型
    "seederStoragePath": "userTestData.json" // 存储路径（当前项目根目录下）
},
```

p.s. 上方注释在 copy 到自己项目时需要删除，否则报错。

接着我们执行 `./node_modules/.bin/sequelize db:seed:undo:all` 先删除数据表中数据，然后再执行 `./node_modules/.bin/sequelize db:seed:all` 重新添加一次种子数据。你就会发现项目根目录下多出来了一个叫做 `userTestData.json` 的文件，里面记录了已经执行过的种子文件名：

```js
[
  "20190316090425-userTest.js"
]
```



#### sequelize记录

p.s. 如果你已经用上面json记录的方式记录过种子文件的存储，再想要尝试用sequelize玩一遍的话，首先得执行一遍 `./node_modules/.bin/sequelize db:seed:undo:all` 哦。

```json
"development": {
    ...
    "seederStorage": "sequelize", // 存储类型
    "seederStoragePath": "userTestData.json", // 存储路径（当前项目根目录下）
    "seederStorageTableName": "userTestData" // 存储的表名
},
```

编写完上述代码后你可以执行下面命令：

```shell
./node_modules/.bin/sequelize db:seed:all
```

执行完毕后刷新数据库，就能在数据库中发现 `userTestData` 表，里面记录了已经执行完毕的种子文件 `20190316090425-userTest.js`

## 版本

安装的 sequelize 和 mysql2 的版本为：

```json
"dependencies": {
    "sequelize": "^5.3.3",
    "sequelize-cli": "^5.4.0"
}
```



## 资源

- [QueryInterface 操作](http://docs.sequelizejs.com/class/lib/query-interface.js~QueryInterface.html)
