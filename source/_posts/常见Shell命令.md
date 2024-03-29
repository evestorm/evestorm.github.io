---
title: 常见Shell命令
tags:
  - Shell
categories:
  - 后端
  - 脚本
  - Shell
abbrlink: 54337
date: 2020-01-20 13:37:19
---

## 常见终端命令

<!-- more -->

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
