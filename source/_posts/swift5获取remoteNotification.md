---
title: swift5获取remoteNotification
tags:
  - iOS
categories:
  - 移动端
  - iOS
abbrlink: 23085
date: 2020-08-26 19:56:43
---

```swift
let userInfo = launchOptions?[UIApplication.LaunchOptionsKey.remoteNotification] as? [AnyHashable: Any]
if userInfo != nil {
   JPUSHService.handleRemoteNotification(userInfo)
   let notification = NSNotification.Name(rawValue: "jpush")
   NotificationCenter.default.post(name: notification, object: nil, userInfo: userInfo)
}
```

来源：https://stackoverflow.com/questions/40209234/how-to-handle-launch-options-in-swift-3-when-a-notification-is-tapped-getting-s
