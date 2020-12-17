---
title: 减小Xcode体积
tags:
  - Xcode
categories:
  - 移动端
  - iOS
abbrlink: 4133
date: 2020-08-24 12:46:04
---

## 问题

今天用 `iStat Menus` 看了下硬盘大小，发现已用了 90%的空间。怎么突然这么大了？再用 `CleanMyMac` 查看了大文件空间占用，发现 Xcode 占了 53 个 G… 然后就想着应该有什么办法能减小 Xcode 体积。

<!-- more -->

## 清理方案

下面路径进入可以在 Finder 中按下快捷键 `Shift + Cmd + G` 进入。

1. 此文件夹下放的是连接真机生成的文件，可以全部删掉或者把不常用的版本删掉，再次连接设备会自动生成

```shell
> ~/Library/Developer/Xcode/iOS DeviceSupport
```

1. app 打包生成的文件，可以删掉不需要的项目打包文件

```shell
> ~/Library/Developer/Xcode/Archives
```

1. 项目的索引文件等，可以全部删除，或者删除不常用的项目，再次打开项目会自动生成

```shell
> ~/Library/Developer/Xcode/DerivedData
```

删除了上述文件夹下不需要的文件后，我的 SSD 从 90%减少到了 85%。
