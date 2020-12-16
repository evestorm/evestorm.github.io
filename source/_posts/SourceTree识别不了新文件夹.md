---
title: SourceTree识别不了新文件夹
tags:
  - SourceTree
categories:
  - 工具
  - 版本测试
abbrlink: 45184
date: 2020-07-03 19:55:09
---

环境：OS X 10.15.5 + Git + SourceTree

问题：我在某个 `SourceTree` 管理的项目目录下，添加了另一个项目文件夹进来，然后我想把这个文件夹也提交到 repo，但 `SourceTree` 的文件状态死活不更新。

后来发现新增文件夹中有个隐藏的 .git 文件夹，然后我把它删掉就能在文件状态看到刚新增的这个文件夹数据了，猜测是 SourceTree 认为那个文件夹是被别的 git 管理，所以加不进去。
