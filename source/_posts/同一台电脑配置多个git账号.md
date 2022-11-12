---
title: 同一台电脑配置多个git账号
tags:
  - git
categories:
  - 工具
  - 版本控制
abbrlink: 50710
date: 2022-11-12 15:30:58
---

来源：https://github.com/jawil/notes/issues/2

<!-- more -->

### 场景

在日常使用 `git` 作为仓库使用的时候，有时可能会遇到这样的一些情况：

```shell
1. 有两个 `github` 账号，一台电脑怎么同时连接这两个账号进行维护呢？
2. 自己用一个 `github` 账号，平时用来更新自己的一些资料；公司使用的 `gitlab`（也是 `git` 的衍生产品）
```

### `SSH Key` 的配置

1.`Windows` 下打开 `Git Bash`，创建 `SSH Key`，按提示输入密码，可以不填密码一路回车

```shell
$ ssh-keygen -t rsa -C "注册邮箱"
```

然后用户主目录 `/.ssh/` 下有两个文件，`id_rsa` 是私钥，`id_rsa.pub` 是公钥

2.获取 `key`，打开 `.ssh` 下的 `id_rsa.pub` 文件，里面的内容就是 `key` 的内容

```shell
$ start ~/.ssh/id_rsa.pub
```

3.登录 `GitHub`，打开`SSH Keys` 页面，[快捷地址](https://github.com/settings/ssh)

{% asset_img ssh-keys.png 100% %}

4.测试 `ssh key` 是否成功，使用命令

```shell
$ ssh -T git@github.com
```

如果出现 `You’ve successfully authenticated, but GitHub does not provide shell access` 。这就表示已成功连上 `github`。

### gitlab 和 github 不同账号配置

一般开发用户应该都配置过一个git的账号，想在添加一个账号。

#### 清除 `git` 的全局设置

使用 **git config --list** 查看当前配置

如果你之前在设置本地仓库和 `github` 连接的时候设置过 `user.name` 和 `user.email`, 那么你必须首先清楚掉该设置，因为不清楚掉该设置，两个账号在提交资料的时候，验证肯定冲突（只能设置一个全局的`user.name` 和 `user.email`，而你现在有两个账号就对应两个不同的）。

```shell
1.取消global
git config --global --unset user.name
git config --global --unset user.email

2.设置每个项目repo的自己的user.email
git config  user.email "xxxx@xx.com"
git config  user.name "suzie"
```

或者直接直接编辑电脑`.gitconfig` 文件

```
$ cd ~// 进入根目录
$ vim .gitconfig // 把 `name` 和 `email` 都去掉
```

#### 生成另外一个账号新的SSH keys

1. 用 `ssh-keygen` 命令生成一组新的` id_rsa_new` 和 `id_rsa_new.pub`

```
$ ssh-keygen -t rsa -C "new email"
```

平时我们都是直接回车，默认生成 `id_rsa` 和 `id_rsa.pub`。这里特别需要注意，出现提示输入文件名的时候(`Enter file in which to save the key (~/.ssh/id_rsa): id_rsa_new`)要输入与默认配置不一样的文件名，比如：我这里填的是 `id_rsa_new`.

注：`windows` 用户和 `mac` 用户的区别就是，`mac` 中 `.ssh` 文件夹在根目录下，所以表示成 `~/.ssh/` ,而 `windwos` 用户是 `C:\Users\Administrator\.ssh`。

1. 执行 `ssh-agent` 让 `ssh` 识别新的私钥，因为默认只读取 `id_rsa`，为了让 `SSH` 识别新的私钥，需将其添加到 `SSH agent` 中：

```shell
$ ssh-add ~/.ssh/id_rsa_work  
```

如果出现 **Could not open a connection to your authentication agent** 的错误，就试着用以下命令：

```shell
$ ssh-agent bash
$ ssh-add ~/.ssh/id_rsa_work
```

1. 配置 `~/.ssh/config` 文件
   前面我们在 `~/.ssh` 目录下面，使用 `ssh-keygen -C “your_email” -t rsa` 生成公私秘钥，当有多个`github` 账号的时候，可以生成多组 `rsa` 的公司密钥。然后配置 `~/.ssh/config` 文件（如果没有的话请重新创建一个）。

```shell
$ touch config        # 创建config文件
```

然后修改如下：
我的 `config` 配置如下：

```shell
# 该文件用于配置私钥对应的服务器
# Default github user(609514766@qq.com)
Host git@github.com
HostName github.com
User jawil
IdentityFile ~/.ssh/id_rsa_github

# gitlab user(yenian.ll@alibaba-inc.com)
# 建一个gitlab别名，新建的帐号使用这个别名做克隆和更新
Host git@gitlab.alibaba-inc.com
HostName gitlab.alibaba-inc.com
User yenian.ll
IdentityFile ~/.ssh/id_rsa
```

如果存在 `config `文件的话，其实就是往这个 `config` 中添加一个 `Host`。

### 同一个电脑 两个 github 账号配置

然而事情并没有到此结束，装完逼还想跑那是不行的。小猪日后发现自己是一个念旧的人。他想要同时使用两个 `github`。

那好吧，`What a big deal～`

这个时候我们需要先找到 `~/.ssh/config` 文件，然后往里面添加如下配置

```shell
Host jawil.github.com
        HostName github.com
        IdentityFile ~/.ssh/github_rsa
```

我们指定 pig.github.com 这个"作用域"下的ssh连接统一指向 `github.com` ，并且使用之前生成好的 `github_rsa` 这个密钥加密。

那么默认的就是使用 `~/.ssh/id_rsa` 这个密钥加密咯。 并且 `HostName` 与“作用域”相同。这个就不需要我们管了。

这个时候我们测试一下呗。

```shell
$ ssh -T git@jawil.github.com
Hi jawil! You've successfully authenticated, but GitHub does not provide shell access.

$ ssh -T git@github.com
Hi yenian!  You've successfully authenticated, but GitHub does not provide shell access.
```

: ) , orz , 这时候还差最后一步，就是修改一下我们在 `jawil` 克隆下来的项目的 `remote` “作用域” 。

```shell
$ git remote rm origin
$ git remote add origin git@jawil.github.com:jawil/demo.git 
// 注意是 `jawil.github.com` 噢？把这个理解为一个“作用域”吧。
$ git push origin master
Everything up-to-date 
```
