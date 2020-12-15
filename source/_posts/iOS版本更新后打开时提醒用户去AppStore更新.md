---
title: iOS版本更新后打开时提醒用户去AppStore更新
tags:
  - iOS
categories:
  - 移动端
  - iOS
abbrlink: 12210
date: 2020-08-25 22:41:39
---

## 开发环境

- Xcode11
- Swift5
- Alamofire 5.2.1
- SwiftyJSON 5.0.0

<!-- more -->

## 代码

> AppDelegate.swift

```swift
import SwiftyJSON
import UIKit
import Alamofire

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, WXApiDelegate, WXApiLogDelegate {
    var window: UIWindow?

    func application(_: UIApplication, didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // 检测App是否需要更新
        checkVersion()

        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = ViewController()
        window?.makeKeyAndVisible()
        return true
    }

    // MARK: App更新

    // 获取版本号
    func checkVersion() {
        AF.request("https://itunes.apple.com/lookup?bundleId=App的bundleId", method: .get, parameters: [:])
            .responseJSON { response in
                print(response)
                if let value = response.value {
                    let json = JSON(value)
                    self.compareVersion(appStoreVersion: json["results"][0]["version"].stringValue)
                }
            }
    }

    // 比较版本
    func compareVersion(appStoreVersion: String) {
        print(appStoreVersion)
        let version: String = (Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String)!

        if appStoreVersion == version {
            print("当前已是最新版")
        } else {
            let alertC = UIAlertController(title: "有新版本", message: "前去更新版本？", preferredStyle: .alert)
            alertC.addAction(UIAlertAction(title: "去更新", style: .default, handler: { _ in
                self.updateApp(appId: AppID)
            }))
            alertC.addAction(UIAlertAction(title: "下次再说", style: .cancel, handler: { _ in
            }))
            UIApplication.shared.keyWindow?.rootViewController?.present(alertC, animated: true, completion: nil)
        }
    }

    // 更新App
    func updateApp(appId _: String) {
        // 根据iOS系统版本，分别处理
        let urlString = "itms-apps://itunes.apple.com/app/id\(AppID)"
        if let url = URL(string: urlString) {
            // 根据iOS系统版本，分别处理
            if #available(iOS 10, *) {
                UIApplication.shared.open(url, options: [:],
                                          completionHandler: {
                                              _ in
                })
            } else {
                UIApplication.shared.openURL(url)
            }
        }
    }
}
```
