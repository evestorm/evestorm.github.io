---
title: Xcode11手写代码入口启动黑屏解决方案
tags:
  - Xcode
  - iOS
categories:
  - 移动端
  - iOS
abbrlink: 33273
date: 2020-07-15 22:21:38
---

环境：Xcode11

## 问题

用 Swift 编写后发现编译通过但启动黑屏。

## 原因

- Xcode11 默认是会创建通过 UIScene 管理多个 UIWindow 的应用，工程中除了 AppDelegate 外会多一个 SceneDelegate
- AppDelegate 和 SceneDelegate 这是 iPadOS 带来的新的多窗口支持的结果，并且有效地将应用程序委托的工作分成两部分

<!-- more -->

## 解决方案

1. 删除掉 info.plist 中 `Application Scene Manifest` 和 `Main storyboard file base name` 选项

{% asset_img scene.png scene %}

{% asset_img mainstoryboard.png mainstoryboard %}

1. 删除 `SceneDelegate.swift` 文件
2. Appdelegate 新增 windows 属性

```swift
import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
   var window: UIWindow?

   func application(_: UIApplication, didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
      // Override point for customization after application launch.

      window = UIWindow(frame: UIScreen.main.bounds)
      window?.rootViewController = ViewController()
      window?.makeKeyAndVisible()
      return true
   }
}
```
