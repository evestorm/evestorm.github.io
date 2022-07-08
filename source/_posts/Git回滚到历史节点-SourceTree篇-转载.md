---
title: 转载-Git回滚到历史节点=>SourceTree篇
tags:
  - 转载
  - Git
categories:
  - 工具
  - 版本控制
abbrlink: 19083
date: 2020-05-18 22:43:52
---

转载自：https://blog.csdn.net/u010416101/article/details/78142697

<!-- more -->

## 原理

原理，我们都知道 Git 是基于 Git 树进行管理的，要想要回滚必须做到如下 2 点:

1. 本地头节点与远端头节点一样(Git 提交代码的前提条件)；
2. 于本地头节点获取某次历史节点的更改。

说的有点抽象，以图来进行形容：

{% asset_img head-node.jpeg head-node %}

## 详细步骤

步骤简记如下:
两个节点 当前节点(最新节点) 与 历史节点

1. 点击历史节点，重置到历史节点，选择硬合并；
2. 点击当前节点，重置到当前节点，选择软合并；
3. 提交；

PS: 注意检出 Head 不是重置步骤！Head 节点是不属于任何一个节点的。

## 详细步骤(图示)

1 点击历史节点，重置到历史节点

{% asset_img reset-1.jpeg reset-1 %}

2 选择硬合并

{% asset_img merge-1.jpeg merge-1 %}

3 点击当前节点，重置到当前节点

{% asset_img reset-2.jpeg reset-2 %}

4 选择软合并

{% asset_img merge-2.jpeg merge-2 %}

5 提交

{% asset_img submit-1.jpeg submit-1 %}

## 参考文献

1. [(知乎)Source tree 如何回滚到以前版本？](https://www.zhihu.com/question/48178380)
2. [(新拉分支做法)使用 SourceTree 将 bitbucket 的远程仓库回滚到某一次提交](https://blog.csdn.net/zhangbinsijifeng/article/details/47005613)
3. [(知乎)Git 自动回滚 和 应用发布的二三事](https://zhuanlan.zhihu.com/p/23970048)
4. [(博客园 操作图示)sourceTree 回滚操作](https://www.cnblogs.com/hopeway-shaon/p/5740280.html)
