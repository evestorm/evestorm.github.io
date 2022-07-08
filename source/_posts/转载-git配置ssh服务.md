---
title: 转载-git配置ssh服务
tags:
  - git
  - 转载
categories:
  - 工具
  - 版本控制
abbrlink: 1071
date: 2020-03-01 14:22:35
---

原文：https://juejin.cn/post/6844904066032599054

<!-- more -->

# 前言

在管理 Git 项目上，很多时候都是直接使用`https url`克隆到本地，当然也有有些人使用`SSH url`克隆到本地。

这两种方式的主要区别在于：

- 使用`https url`克隆对初学者来说会比较方便，复制`https url`然后到 git Bash 里面直接用 clone 命令克隆到本地就好了，但是每次 fetch 和 push 代码都需要输入账号和密码，这也是 https 方式的麻烦之处。
- 而使用`SSH url`克隆却需要在克隆之前先配置和添加好`SSH key`，因此，如果你想要使用`SSH url`克隆的话，你必须是这个项目的拥有者。否则你是无法添加`SSH key`的，另外 ssh 默认是每次 fetch 和 push 代码都不需要输入账号和密码，如果你想要每次都输入账号密码才能进行 fetch 和 push 也可以另外进行设置。

下面主要是讲述如何配置使用 ssh 方式来提交和克隆代码。

# 正文

## 配置本机 ssh

### 一、确定的是你的电脑上是安装过 Git

打开`cmd`，查看 git 版本：

```shell
输入：git --version
显示：git version 2.20.1.windows.1
复制代码
```

如果显示类似`git version 2.20.1.windows.1`的 Git 版本，说明你的电脑是安装过 Git 的；否则请左转[打开 Git 的正确姿势](https://juejin.im/post/6844903749631098893#heading-4)，把 Git 安装完了再来，不送。

### 二、查看是否配置了 git 用户名和邮箱

```shell
输入：git config user.name
显示：用户名
输入：git config user.email
显示用户邮箱
复制代码
```

如果没有配置，那么需要配置用户名和邮箱：

```shell
输入：git config --global user.name "xxx"

输入：git config --global user.email "xxx"
复制代码
```

### 三、查看是否配置过 SSH Key(密钥)

```shell
输入：cd ~/.ssh
输入：ls，
复制代码
```

查看该文件下的文件，看是否存在 `id_isa` 和 `id_isa.pub` 文件（也可以是别的文件名，只要 `yourName` 和 `yourName.pub` 成对存在就可以），如果存在的话，证明已经存在 ssh key 了，可以直接跳过`4、生成SSH Key`这一步骤，

### 四、生成 SSH Key(密钥)

```shell
输入: ssh-keygen -t rsa -C "你的邮箱"
复制代码
```

此处会提示`Enter file in which to save the key (/Users/shutong/.ssh/id_rsa):`这样一段内容,让我们输入文件名，如果第 3 步的文件存在的话最好在这里修改一下文件名以防覆盖之前的内容；如果第 3 步的文件不存在的话则直接按`enter`键就好了。

之后会有提示你是否需要设置密码，如果设置了每次使用 Git 都会用到密码，一般都是直接不写为空，直接`enter`就好了。

上述操作执行完毕后，在`~/.ssh/`目录会生成`XXX-rsa`(私钥)和`XXX-rsa.pub`(公钥)，它们默认的存储路径是：

> C:\Users\Administrator.ssh

**注意**

> 个人建议生成的 rsa 最好单独命名不要使用默认名称，因为有可能 sshkey 可能会用在多个地方，一不小心就可能被覆盖然后导致 git 功能异常

### 五、添加公钥到你的远程仓库（github）

#### 1 、查看你生成的公钥：

```shell
输入：cat ~/.ssh/id_rsa.pub
复制代码
```

这里会把公钥显示出来，我们把这段内容复制出来。

#### 2、添加公钥到远程仓库:

登陆你的 github 帐户 -> 点击你的头像，然后点击 `Settings` -> 左栏点击 `SSH and GPG keys` -> 点击 `New SSH key`

然后将复制的公钥内容，粘贴进`Key`文本域内。 `title`域，自己随便起个名字。

点击 `Add SSH key`。

#### 2、查看 ssh 文件是否配置成功

```shell
输入： ssh -T git@github.com
输出： Hi danygitgit! You've successfully authenticated, but GitHub does not provide shell access.
复制代码
```

恭喜你，你的设置已经成功了。

### 六、修改 git 的 remote url

如果之前添加的是`HTTPS`协议的 github 仓库地址，那么每次 push 或者 pull 仍然需要密码，所以，我们需要将其修改为`ssh`协议的，这样，就不需要这么麻烦了。

那么我们应该怎么办呢？

#### 1、查看当前的 remote url

首先进入本地仓库，右键 -> `Git Bash Here`

```shell
输入： git remote -v
输出： origin https://github.com/danygitgit/document-library.git (fetch)
输出： origin https://github.com/danygitgit/document-library.git (push)
复制代码
```

如果是以上的结果那么说明此项目是使用`https`协议进行访问的（如果地址是 git 开头则表示是`git`协议）

#### 2、复制远程仓库的 ssh 链接

登陆你的远程仓库，在上面可以看到你的 ssh 协议相应的 url，类似：

> git@github.com:danygitgit/document-library.git

复制此 ssh 链接。

#### 2、修改 git 的 remote url

方法有三种：

1. 修改命令

> git remote origin set-url [url]

1. 先删后加

> git remote rm origin git remote add origin [url]

1. 直接修改`config`文件

找到仓库下 `.git` 文件夹下的`config`文件，打开，可以看到以下内容

> [core] repositoryformatversion = 0 filemode = false bare = false logallrefupdates = true symlinks = false ignorecase = true[remote "origin"] url =https://github.com/danygitgit/document-library.git fetch = +refs/heads/_:refs/remotes/origin/_[branch "master"] remote = origin merge = refs/heads/master

将文件中的 `url =https://github.com/danygitgit/document-library.git`更改为 `url = git@github.com:danygitgit/document-library.git` 即可。

修改后的文件如下

> [core] repositoryformatversion = 0 filemode = false bare = false logallrefupdates = true symlinks = false ignorecase = true[remote "origin"] url = git@github.com:danygitgit/document-library.git fetch = +refs/heads/_:refs/remotes/origin/_[branch "master"] remote = origin merge = refs/heads/master

以后，不管是 push 还是 pull，你都不需要再提交密码了。

### 七、Sourcetree 配置 ssh 密钥

`SourceTree`是一款 git 管理可视化工具，就不需要繁琐的敲打命令行了。个人比较推荐，无论在 windows 环境还是 mac 的 os 环境。[官网链接](https://www.sourcetreeapp.com/)

关于`SourceTree`的安装及配置就不赘述了，具体请参考

- [Git SourceTree 免登陆安装及配置 生成 ssh](https://blog.csdn.net/wangjiangrong/article/details/80287041)
- [SOURCETREE 3.1.3 版本跳过 BITBUCKET 注册方法（亲测好用） | 淡忘&天涯](https://www.cnblogs.com/liuxin-673855200/p/11151835.html)
- [Sourcetree 配置 ssh 密钥](https://jingyan.baidu.com/article/9faa7231cdec65473d28cb11.html)

# 总结

磨刀不误砍柴工。勇于尝试，善于总结。开启你的 Git 踩坑之旅吧！

路漫漫其修远兮，希望 Git 可以帮我们记录每一个脚印，每一步成长。与诸君共勉。

祝大家 2020 更上一层楼！

# 相关资源

- [解决 sourceTree 的 git clone 报 SSH 密钥认证失败的问题](https://segmentfault.com/a/1190000016365283)
