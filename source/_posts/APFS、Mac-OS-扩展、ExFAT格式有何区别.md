---
title: APFS、Mac OS 扩展、ExFAT格式有何区别
tags:
  - macOS
categories:
  - 操作系统
  - macOS
abbrlink: 33677
date: 2020-11-30 16:09:17
---

## **APFS**

是**Apple 苹果系统特有的一种文件格式**，是 Mac OS High Sierra 操作系统版本时发布的；这种文件格式只能苹果 Mac OS 操作系统使用。（必须至少是 Mac OS High Sierra 版本以及更新的 Mac OS 才行，老版本的苹果系统不支持）这种系统非常牛逼，主要是**针对 PCIe 闪存和 SSD 固态硬盘进行了优化**；如果你是使用固态硬盘，且**不考虑硬盘上的东西在 Windows 操作系统中使用，那推荐使用 APFS 硬盘格式**。

<!-- more -->

## **Mac OS 扩展格式**

Mac OS Extended 是以前苹果 Mac OS 使用的文件系统，现在基本上已经淘汰了。能用 APFS 就尽量使用 APFS，与其考虑**兼容旧版的 Mac OS**，不如让更新旧版的 Mac OS 系统。

## **Mac OS 日志格式**

Mac OS 操作系统有一个自带的硬盘备份工具，叫 Time Machine（时间机器）；这种硬盘格式就是**专门用于 Time Machine**。如果是要**把这个硬盘作为备份盘**，那就格式化成这种硬盘格式。

## **ExFAT**

上面说的三种硬盘格式都是专门用于苹果的 Mac OS 操作系统的，而 ExFAT 则是不仅可用于 Mac OS 苹果操作系统，还可以用于 Windows 操作系统。**如果你想该硬盘的东西在 Windows 系统可以被读取，那就选择 ExFAT 操作系统**。
