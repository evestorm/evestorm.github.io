---
title: git提交代码到错误的远端分支如何撤回并提交到正确分支
tags:
  - Git
  - 笔记
categories:
  - 工具
  - 版本控制
abbrlink: 61419
date: 2020-01-21 22:30:11
---

## 场景

假如你要提交代码到 bug 分支，然而却忘了切分支，仍然在 dev 开发分支上改了 bug，而且已经推送到远端了。此时你该如何撤回远端在 dev 分支的修改，并把代码推送到正确的远端 bug 分支上呢？

你可以执行下面操作：

```shell
# 切换到你提交了错误代码的分支
git checkout dev
# 撤销最近的一次提交
git revert HEAD --no-edit
# 将revert commit push到远端
git push origin dev
# 切换到正确的分支
git checkout bug
将目标 commit 嫁接到当前分支
git cherry-pick db6bb3f <=你之前提交到错误分支的那个commit的SHA
```

## 参考

[Git 误操作救命篇一： 如何将改动撤销？](https://zhuanlan.zhihu.com/p/42929114)
