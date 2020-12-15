---
title: Git学习笔记
tags:
  - Git
  - 笔记
categories:
  - 工具
  - 版本控制
abbrlink: 8520
date: 2020-01-21 22:46:40
---

## 安装

安装链接：[起步 - 安装 Git](https://git-scm.com/book/zh/v2/起步-安装-Git)

## 配置

### 配置 user.name 和 user.email

```shell
git config --global user.name 'your name'
git config --global user.email 'your_email@domain.com'
```

<!-- more -->

### 相关配置说明

```shell
git config --local 只针对某个仓库有效
git config --global 对当前用户的所有仓库有效
git config --system 对系统所有登录用户有效

# 显示 config 的配置
git config --list --local
git config --list --global
git config --list --system
```

## 创建 Git 仓库

### 1. 把已有的项目代码纳入 Git 管理

```shell
cd 项目代码所在文件夹
git init
```

### 2. 新建的项目直接用 Git 管理

```shell
cd 某个文件夹
git init your_project # 会在当前路径下创建和项目名称同名的文件夹
cd your_project
```

## 常见 Git 命令

- `git init` 创建 git 仓库

- ```shell
  git clone
  ```

  拷贝现有仓库（本地 or 远程）

  - `git clone LINK custom_name` 拷贝现有仓库并重命名

- ```shell
  git log
  ```

  查看 commit 日志

  - `git log --oneline` 一行显示 commit 的提交信息

  - ```shell
    git log --stat
    ```

    用来显示 commit 中更改的文件以及添加或删除的行数

    - 显示被修改的文件
    - 显示添加/删除的行数
    - 显示一个摘要，其中包含修改/删除的总文件数和总行数

- ```shell
  git add index.html
  ```

  暂存文件

  - `git add .` 暂存所有

- `git status` 了解仓库状况

- `git commit -m '初次提交'` 提交 commit

- `git diff` 命令用来查看已经执行但是尚未 commit 的更改

- ```shell
  git branch
  ```

  列出所有分支

  - `git branch sidebar` 创建分支
  - `git checkout sidebar` 切换分支
  - `git checkout -b sidebar` 新建分支并切换到新建的分支
  - `git branch -d sidebar` 删除分支

- `git merge <name-of-branch-to-merge-in>` 合并分支

- `git reset --hard HEAD^` 如果在错误的分支上进行了合并，可以使用此命令撤消

## 合并分支

要合并 `sidebar` 分支，确保你位于 `master` 分支上，并运行：

```shell
git merge sidebar
```

合并有以下两种类型：

- 快进合并 – 要合并的分支必须位于检出分支前面。检出分支的指针将向前移动，指向另一分支所指向的同一 commit。
- 普通类型的合并
  - 两个完全不同的分支被合并
  - 创建一个合并 commit

### 合并冲突

#### 合并冲突指示符解释

编辑器具有以下合并冲突指示符：

- `<<<<<<< HEAD` 此行下方的所有内容（直到下个指示符）显示了当前分支上的行
- `||||||| merged common ancestors` 此行下方的所有内容（直到下个指示符）显示了原始行的内容
- `=======` 表示原始行内容的结束位置，之后的所有行（直到下个指示符）是被合并的当前分支上的行的内容
- `>>>>>>> heading-update` 是要被合并的分支（此例中是 `heading-update` 分支）上的行结束指示符

当相同的行在要合并的不同分支上做出了更改时，就会出现合并冲突。git 将在合并途中暂停，并告诉你存在冲突，以及哪些文件存在冲突。要解决文件中的冲突：

- 找到并删掉存在合并冲突指示符的所有行
- 决定保留哪些行
- 保存文件
- 暂存文件
- 提交 commit

注意一个文件可能在多个部分存在合并冲突，因此检查整个文件中的合并冲突指示符，搜索 `<<<` 能够帮助你找到所有这些指示符。

## 撤销更改

### 更改最后一个 commit

```shell
git commit --amend
```

借助 `--amend` 选项，可以更改最近的 commit。

如果你的工作目录没有内容（也就是仓库中没有任何未 commit 的更改），那么运行 `git commit --amend` 将使你能够重新提供 commit 消息。代码编辑器将打开，并显示原始 commit 消息。只需纠正拼错的单词或重新表述即可！然后保存文件并关闭编辑器，以便采用新的 commit 消息。

### 向 commit 中添加忘记的文件

此外，`git commit --amend` 使你能够包含忘记包含的文件（或文件更改）。假设你更新了整个网站的导航链接颜色。commit 了该更改，并以为完事了。但是后来发现深藏在页面上的一个特殊导航链接没有新的颜色。你可以执行新的 commit 并更新该链接的颜色，但是这样就会出现两个 commit 执行完全相同的任务（更改链接颜色）。

相反，你可以修改最后一个 commit（更新所有其他链接颜色的 commit）以包含这个忘记的链接。要包含忘记的链接，只需：

- 编辑文件
- 保存文件
- 暂存文件
- 运行 `git commit --amend`

你对必要的 CSS 和/或 HTML 文件作出了更改，以便修正被遗忘的链接样式，然后保存所有被修改的文件，并使用 `git add` 暂存所有被修改的文件（就像要提交新的 commit 那样！），但是你可以运行 `git commit --amend` 来更新最近的 commit，而不是创建新的 commit。

### 还原 commit

创建了一个包含一些更改的 commit，然后使用 `git revert` 命令还原它

```shell
git revert <SHA-of-commit-to-revert>
```

因为最近的 commit 的 SHA 是 `db7e87a`，要还原该 commit： 需要运行 `git revert db7e87a`（随即弹出代码编辑器，以便编辑/确认提供的 commit 消息）

**注意此命令：**

- 将撤消目标 commit 所做出的更改
- 创建一个新的 commit 来记录这一更改

### 重置 commit

初看，**重置（reset）** 似乎和 **还原（revert）** 相似，但它们实际上差别很大。还原会创建一个新的 commit，并还原或撤消之前的 commit。但是重置会清除 commit！

> ⚠️ 重置很危险 ⚠️

> 一定要谨慎使用 git 的重置功能。这是少数几个可以从仓库中清除 commit 的命令。如果某个 commit 不再存在于仓库中，它所包含的内容也会消失。

> P.S. git 会在完全清除任何内容之前，持续跟踪大约 30 天。要调用这些被重置的内容，需要使用 `git reflog` 命令。你可以参阅以下链接以了解详情：

> - [git-reflog (英)](https://git-scm.com/docs/git-reflog)
> - [重写历史记录 (英)](https://www.atlassian.com/git/tutorials/rewriting-history)
> - [reflog，你的安全屏障 (英)](http://gitready.com/intermediate/2009/02/09/reflog-your-safety-net.html)

### 相关 commit 引用

我们知道可以使用 SHA、标签、分支和特殊的 `HEAD` 指针引用 commit。但有时候这些并不足够，我们可能需要引用相对于另一个 commit 的 commit。例如，有时候我们需要告诉 git 调用当前 commit 的前一个 commit，或者是前两个 commit。我们可以使用特殊的“祖先引用”字符来告诉 git 这些相对引用。这些字符为：

- `^` – 表示父 commit
- `~` – 表示第一个父 commit

我们可以通过以下方式引用之前的 commit：

- 父 commit – 以下内容表示当前 commit 的父 commit
- `HEAD^`
- `HEAD~`
- `HEAD~1`
- 祖父 commit – 以下内容表示当前 commit 的祖父 commit
- HEAD^^
- HEAD~2
- 曾祖父 commit – 以下内容表示当前 commit 的曾祖父 commit
- HEAD^^^
- HEAD~3

`^` 和 `~` 的区别主要体现在通过合并而创建的 commit 中。合并 commit 具有两个父级。对于合并 commit，`^` 引用用来表示第一个父 commit，而 `^2` 表示第二个父 commit。第一个父 commit 是当你运行 `git merge` 时所处的分支，而第二个父 commit 是被合并的分支。

我们来看一个示例，这样更好理解。这是我的 `git log` 当前的显示结果：

```shell
* 9ec05ca (HEAD -> master) Revert "Set page heading to "Quests & Crusades""
* db7e87a Set page heading to "Quests & Crusades"
*   796ddb0 Merge branch 'heading-update'
|\
| * 4c9749e (heading-update) Set page heading to "Crusade"
* | 0c5975a Set page heading to "Quest"
|/
*   1a56a81 Merge branch 'sidebar'
|\
| * f69811c (sidebar) Update sidebar with favorite movie
| * e6c65a6 Add new sidebar content
* | e014d91 (footer) Add links to social media
* | 209752a Improve site heading for SEO
* | 3772ab1 Set background color for page
|/
* 5bfe5e7 Add starting HTML structure
* 6fa5f34 Add .gitignore file
* a879849 Add header to blog
* 94de470 Initial commit
```

我们来看看如何引用一些之前的 commit。因为 `HEAD` 指向 `9ec05ca` commit：

- `HEAD^` 是 `db7e87a` commit
- `HEAD~1` 同样是 `db7e87a` commit
- `HEAD^^` 是 `796ddb0` commit
- `HEAD~2` 同样是 `796ddb0` commit
- `HEAD^^^` 是 `0c5975a` commit
- `HEAD~3` 同样是 `0c5975a` commit
- `HEAD^^^2` 是 `4c9749e` commit（这是曾祖父的 (`HEAD^^`) 第二个父 commit (`^2`))

### `git reset` 命令

`git reset` 命令用来重置（清除）commit：

```shell
$ git reset <reference-to-commit>
```

可以用来：

- 将 HEAD 和当前分支指针移到目标 commit
- 清除 commit
- 将 commit 的更改移到暂存区
- 取消暂存 commit 的更改

#### git reset 的选项

git 根据所使用选项来判断是清除、暂存之前 commit 的更改，还是取消暂存之前 commit 的更改。这些选项包括：

> 起始

{% asset_img image-20200120161811703.png image-20200120161811703 %}

##### `-mixed` git reset 默认执行的此操作

{% asset_img image-20200120162215190.png image-20200120162215190 %}

此刻执行 `git reset HEAD~1` 会把 `3` 中的提交存留于**工作区**的文件中，更改未暂存。

如果此刻我们暂存文件并再次提交，将会获得相同的提交内容。但我们会获得一个不同的提交 SHA，这是因为本次提交的时间戳和之前的 `3` 不同。但提交内容完全一样。

##### `--soft`

{% asset_img image-20200120162410814.png image-20200120162410814 %}

此刻执行 `git reset --soft HEAD~1` 会把 `3` 中的提交放进**暂存区**。这些更改仍然相同，而且已经暂存好了，如果你再 commit 会得到 reset 前一样的版本。同样 SHA 值不同。

##### `--hard`

{% asset_img image-20200120162626566.png image-20200120162626566 %}

此刻执行 `git reset --hard HEAD~1` 会把 `3` 中的提交全部删除。

#### 小节

总结下，`git reset` 命令被用来清除 commit：

```shell
$ git reset <reference-to-commit>
```

它可以用来：

- 将 HEAD 和当前分支指针移到引用的 commit
- 使用 `--hard` 选项清除 commit
- 使用 `--soft` 选项将 commit 的更改移至暂存区
- 使用 `--mixed` 选项取消暂存已被 commit 的更改

我们通常会用到祖先引用来指代之前的 commit。祖先引用包含：

- `^` – 表示父 commit
- `~` – 表示第一个父 commit

## 使用远程仓库

### 添加远程仓库

使用下面命令，在本地仓库与 GitHub 帐户上创建的远程仓库之间创建连接。

```shell
git remote add origin https://github.com/richardkalehoff/RichardsFantasticProject.git
```

对于刚在命令行中运行的命令，有几点需要注意：

1. 首先，这条命令包含一个子命令 `add`

2. 这里使用了 `origin` 一词，设置了我们之前所说的简写名

   - 记住， `origin` 一词并没什么特殊性。

   - 如果你想将它改为 `repo-on-GitHub`，那么只需（在运行命令之前）将 “origin” 改为 “repo-on-GitHub”：

     `$ git remote add repo-on-GitHub https://github.com/richardkalehoff/RichardsFantasticProject.git`

3. 第三，添加了仓库的完整路径（即 Web 上的远程仓库 URL）

然后使用 `git remote -v` 来验证我已经正确添加了远程仓库。

### 将更改推送到远程仓库

要将本地 commits 推送到远程仓库，你需要使用 `git push` 命令。你要提供远程仓库简写名以及用于容纳你的 commit 的分支名：

```shell
$ git push <remote-shortname> <branch>
```

我的远程仓库的简写名为 `origin`，并且我想推送的 commit 位于`master`分支上。那么，我要使用以下命令将我的 commit 推送到 GitHub 上的远程仓库：

```shell
$ git push origin master
```

### 从远程仓库拉取修改

`git push` 会同步**远程**仓库与**本地**仓库。要执行相反操作（将**本地仓库**与**远程仓库**同步），我们需要使用 `git pull`。`git pull` 的格式与 `git push` 的非常相似 - 提供远程仓库的简写名，以及你要拉取 commit 的分支名称。

```shell
$ git pull origin master
```

#### Fetch vs Pull

git fetch 用于从远程仓库分支检索 commit ，但**不会**在收到这些 commit 之后，自动将本地分支与远程跟踪分支合并。

上面的段落有点密集，你可以多读几遍。

你需要向 `git fetch` 提供和 `git pull` 完全相同的信息，也就是说要提供你想获取的远程仓库的简写名及其分支：

```shell
$ git fetch origin master
```

运行 `git fetch` 后，会发生以下活动：

- 远程分支上的 commit 会复制到本地仓库
- 本地跟踪分支（例如，`origin/master`）移到指向最新的 commit

需要注意的一点是，本地分支完全不会被改变。

你可以将 `git fetch` 想象成 `git pull` 它的一半操作，而 `git pull` 的另一半是合并。

使用 `git fetch` 而不是 `git pull` 的一个主要情形是当你的远程分支和本地分支都拥有对方所没有的更改时。在这种情况下，你要获取远程更改，将它们存储到本地分支中，然后手动执行合并。最后，你可以将新的合并 commit 推送会远程仓库。

## 常见终端命令

- ```
  ls
  ```

  \- 用来列出文件和目录

  - `ls -l` 列出文件和目录（长列表形式，更详细）
  - `ls *.png` 列出后缀为 png 的图像文件

- `mkdir` - 用来新建目录

- ```
  mv
  ```

  \- 移动文件

  - `mv logo.png Project` 把 logo.png 文件移入 Project 文件夹
  - `mv Document/*.png Project` 把 Document 文件夹下所有 .png 结尾文件扔进 Project 文件夹

- `cd` - 用来更换当前目录

- `pwd` - 查看当前工作目录

- `rm` - 用来删除文件和目录

- `rmdir` - 用来删除目录

- ```
  cat
  ```

  \- 查看文件内容（文件内容过多会直接定位到文件最底部）

  - `cat less` 只显示一屏高度的文件内容（按下 q 退出）

### less 分页器

- 要**向下**滚动，按下
- `j` 或 `↓` 一次向下移动一行
- `d` 按照一半的屏幕幅面移动
- `f` 按照整个屏幕幅面移动
- 要 **向上**滚动，按上
- `k` 或 `↑` 一次向上移动一行
- `u` 按照一半的屏幕幅面移动
- `b` 按照整个屏幕幅面移动
- 按下 `q` 可以**退出**日志（返回普通的命令提示符）
