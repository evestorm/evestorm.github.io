---
title: Swift注入变量给前端导致的报错问题
tags:
  - iOS
categories:
  - 移动端
  - iOS
abbrlink: 13655
date: 2020-07-17 20:00:06
---

在 iOS 中加载 H5 时需要注入一些 JS 变量供前端使用，例如把 App 相关的信息存进 JS ，好让 JS 调用：

```swift
// MARK: 获取App信息

public func getAppInfo() -> [String: String] {
    let infoDictionary = Bundle.main.infoDictionary!
    let appVersion = infoDictionary["CFBundleShortVersionString"] as! String
    let appName = infoDictionary["CFBundleName"] as! String
    return ["version": appVersion, "name": appName]
}
//        获取app信息
let appInfo = getAppInfo()
let scriptStr = """
   window.iOS = {
         'getAppInfo': {
            'version': \(appInfo["version"]!),
            'name': \(appInfo["name"]!),
         }
   }
"""
```

<!-- more -->

上面的代码注入到 JS 中会导致前端无法通过 `iOS.getAppInfo.name` 获取到 App 的名称，明明我的 `appInfo["name"]` 是个 String 字符串类型，为什么会拿不到了？

通过在 Swift 打印 `scriptStr` 变量我发现，`window.iOS` 对象中的 name 属性被解析成了：

```js
'name': App名称
```

所以 JS 无法拿到，问题就出现在 `App名称` 上，这原本是个字符串，但注入到 JS 后它并没有被 `双引号""` 或 `单引号''` 包裹，导致 JS 会把 `App名称` 当做是个变量名而不是字符串。所以把上面代码改为下方形式就好了：

```js
let scriptStr = """
   window.iOS = {
         'getAppInfo': {
            'version': "\(appInfo["version"]!)",
            'name': "\(appInfo["name"]!)",
         }
   }
"""
```
