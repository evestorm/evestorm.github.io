---
title: MacM1芯片安装MySQL
tags:
  - Java
  - MySQL
categories:
  - 后端
  - Java
abbrlink: 31981
date: 2022-12-28 15:32:23
---

使用 `brew install mysql` 安装 MySQL

如果一切顺利，安装完毕后可直接使用 `mysql -u root` 进行免登录

<!-- more -->

但我一共遇到两次卡壳儿的地方：

## Mac下安装软件 报错No such file or directory @ rb_sysopen xxx 系列问题

解决方法是把环境变量 `$HOMEBREW_BOTTLE_DOMAIN` 设置为空字符串，命令行下执行：

```shell
$HOMEBREW_BOTTLE_DOMAIN=''
```

如果想永久修改，则需要去更新profile文件，zsh是~/.zprofile文件，bash要修改~/.bash_profile文件。

此问题具体原因详情查看：<https://zhuanlan.zhihu.com/p/491515480>

解决完此问题后我接着又遇到了第二个问题

## ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)​

安装完后根据提示，我执行了 `mysql -u root` 但报错，报错内容就是标题：

```shell
ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)​
```

此问题发生原因是首先得启动 mysql 才能登录使用：

```shell
​mysql.server start
```

这样就能使用 mysql 了

详情：<https://blog.51cto.com/u_14201949/5966749>
