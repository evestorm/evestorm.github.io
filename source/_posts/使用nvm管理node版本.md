---
title: 使用nvm管理node版本
tags:
  - Node
  - nvm
categories:
  - 后端
  - Node
abbrlink: 48432
date: 2020-10-21 23:58:09
---

# macOS

## 卸载之前安装的 node

如果安装 nvm 之前本地已全局安装过 node，请在终端执行下面脚本删除 node：

<!-- more -->

```shell
# 查看已经安装在全局的模块
npm ls -g --depth=0
# 删除全局 node_modules 目录
sudo rm -rf /usr/local/lib/node_modules
# 删除 node
sudo rm /usr/local/bin/node
# 删除全局 node 模块注册的软链
cd /usr/local/bin && ls -l | grep "../lib/node_modules/" | awk '{print $9}'| xargs rm
```

## 安装 nvm

打开终端，进入当前用户的 home 目录：

```shell
cd ~
```

使用 ls -a 显示当前目录下的所有文件（夹）（包含隐藏文件及文件夹），查看有没有 .bash_profile 文件：

```shell
ls -a
```

如果没有就创建：

```shell
touch ~/.bash_profile
```

然后执行 nvm 安装：

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
```

or

```shell
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
```

安装完成后，终端输入 nvm 验证是否安装成功，终端可能出现 Command not found，这并非没有安装成功，试试重启终端再输入 nvm 。一般情况下此时已可用。

## 执行 nvm 命令提示 Command not found

如果你的系统是最新更新的 macOS Catalina ，则重启终端也可能没用，因为默认的 shell 是 zsh，所以找不到配置文件。

解决方案：

### 一. 通过 source 读取并执行命令

```shell
# 1.新建一个 .zshrc 文件（如果没有的话）
touch ~/.zshrc
# 2.在 ~/.zshrc文件最后，增加一行
source ~/.bash_profile
```

重启终端后就能使用 nvm 命令了。

### 二. 拷贝 .bash_profile 中的 nvm 相关环境配置到 .zshrc 中去

我在执行完方法以后，发现 nvm 命令是有了，但是我的终端 zsh 文字出现了乱码。所以我采取了方法二。

打开 .bash_profile 文件，将其中的 nvm 环境配置复制一份到 .zshrc 文件代码中的末尾去：

```shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

重启终端再次执行 nvm ，发现能够使用。

# Window 10 64bit

摘自：[Windows nvm 的安装使用(及排坑)](https://zhuanlan.zhihu.com/p/81801605)

## 卸载系统上现有 node（如果有）

> 此处基于[windows 下 nvm 安装 node 之后 npm 命令找不到问题解决办法](https://link.zhihu.com/?target=https%3A//www.bbsmax.com/A/1O5EPPR3J7/)，在此基础上简化和完善。

- 在卸载程序中卸载 node
- 在环境变量中删除所有与 node 相关的路径(无论是 user 级，还是 system 级)
- 删除以下路径的文件(可能只有部分文件才有) C:\Program Files (x86)\nodejs

> C:\Program Files\nodejs
> C:\Users{User}\AppData\Roaming\npm
> C:\Users{User}\AppData\Roaming\npm-cache
> C:\Users{User}\node_modules (在我电脑上的路径)

## 下载 nvm

下载最新版 nvm 并安装[nvm-setup.zip](https://link.zhihu.com/?target=https%3A//github.com/coreybutler/nvm-windows/releases)

## 更换镜像源

在 `路径 C:\Users\{User}\AppData\Roaming\nvm\settings.txt` 下添加以下两条

```js
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

此时如果你还仔细观察，会发现`C:\Program Files`下的 nodejs 问家家其实是一个快捷方式，指向的是 nvm 的安装路径`C:\Users\i353667\AppData\Roaming\nvm`下对应的 node 版本。

# nvm 常见命令

- nvm ls 列出安装 node 的所有版本
- nvm current 显示当前使用的版本
- nvm install 安装指定的版本，如 nvm install v8.13.0
- nvm uninstall 卸载指定的版本
- nvm use node-version 切换使用指定的版本
- nvm alias default v12.18.4 设置默认 node 版本
- nvm deactivate 解除当前版本绑定
- nvm ls-remote 获取远程可用版本
- nvm list available 获取可用的 node 版本列表
