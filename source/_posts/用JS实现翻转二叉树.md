---
title: 用JS实现翻转二叉树
categories:
  - 后端
  - 算法
abbrlink: 50491
date: 2019-02-27 09:45:39
tags:
---

## 简介

翻转二叉树就是把二叉树每一层的左右顺序颠倒过来。

## 示例

> 输入

```js
     4
   /   \
  2     7
 / \   / \
1   3 6   9
```

> 输出

```js
     4
   /   \
  7     2
 / \   / \
9   6 3   1
```

<!-- more -->

## 算法步骤

如果根节点不为空，那么将左右子结点交换，然后将左右子结点进行递归调用。

## 代码实现

```js
var invertTree = function(root) {
  if (root !== null) {
    var temp = root.left;
    root.left = root.right;
    root.right = temp;
    invertTree(root.left);
    invertTree(root.right);
  }
  return root;
 
};
```
