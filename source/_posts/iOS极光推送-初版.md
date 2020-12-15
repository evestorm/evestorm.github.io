---
title: iOS极光推送-初版
tags:
  - iOS
categories:
  - 移动端
  - iOS
abbrlink: 15162
date: 2020-08-26 22:27:22
---

## 苹果证书设置

### 开启 Push Notification 功能

找到你 App 的 id:

{% asset_img image-20200825132620154.png image-20200825132620154 %}

开启消息推送：

{% asset_img image-20200825132503908.png image-20200825132503908 %}

<!-- more -->

### 配置消息推送

{% asset_img image-20200825132714159.png image-20200825132714159 %}

{% asset_img image-20200825132725279.png image-20200825132725279 %}

点击 `Development SSL Certificate` 创建证书：

{% asset_img image-20200825132820152.png image-20200825132820152 %}

上传 csr 文件点击继续：

{% asset_img image-20200825132921777.png image-20200825132921777 %}

开发推送证书配置完毕：

{% asset_img image-20200825133009708.png image-20200825133009708 %}

起个名字下载到本地:

{% asset_img image-20200825133126663.png image-20200825133126663 %}

相同的步骤配置正式环境的推送证书：

{% asset_img image-20200825133233873.png image-20200825133233873 %}

{% asset_img image-20200825133314393.png image-20200825133314393 %}

两个证书配置完毕后的效果：

{% asset_img image-20200825133436324.png image-20200825133436324 %}

分别双击两个证书，在“KeychainAccess”中打开，选择左侧“钥匙串”列表中“登录”，以及“种类”列表中“我的证书”，找到刚才下载的证书，并导出为 .p12 文件。

找到它并设置为总是信任：

{% asset_img image-20200825134055576.png image-20200825134055576 %}

将其导出为 p12 文件：

{% asset_img image-20200825134141788.png image-20200825134141788 %}

同样的方式为生产证书设置总是信任以及导出为 p12 证书。

### 重新生成一遍 Profile 文件

{% asset_img image-20200825133633752.png image-20200825133633752 %}

## 极光配置

登录极光官网：

https://www.jiguang.cn/

认证开发者账号，此处省略。

进入开发者平台：

https://www.jiguang.cn/dev2/#/newOverview?appKey=

### 创建应用

{% asset_img image-20200825135528626.png image-20200825135528626 %}

填写应用名称以及上传图标：

{% asset_img image-20200825135536095.png image-20200825135536095 %}

创建完毕后会自动跳转：

{% asset_img image-20200825135631804.png image-20200825135631804 %}

进入推送设置：

{% asset_img image-20200825135710436.png image-20200825135710436 %}

### iOS 证书配置

{% asset_img image-20200825135731263.png image-20200825135731263 %}

配置完毕后点击保存：

{% asset_img image-20200825141021644.png image-20200825141021644 %}

{% asset_img image-20200825141047595.png image-20200825141047595 %}

## 导入极光 SDK

在 Xcode 中通过 Cocoapods 的方式导入：

```shell
pod 'JPush', '3.3.4'
```

通过 `pod update --no-repo-update` 进行 pods 更新。

### 上架前提醒

提交新版本或者初次上架之前，最后会遇到一个关于 IDFA 的选项。

> 您的 App 正在使用广告标识符 (IDFA)。您必须先提供关于 IDFA 的使用信息或将其从 App 中移除，然后再上传您的二进制文件。

**记得要勾上是**。否则会遇到麻烦。

P.S. 如果你的项目不需要投送广告，可以选择无 IDFA 版本的极光 SDK，集成方式如下：

```shell
pod 'JCore', '2.3.4-noidfa'
pod 'JPush', '3.3.4'
```

配置推送：

我的 Xcode 版本为 11，所以要开启 Application Target 的 Capabilities-> `Access WIFI Infomation` 选项。

{% asset_img image-20200825144319615.png image-20200825144319615 %}

还有 `PushNotifications` ，以及打开 `Remote notifications` ：

{% asset_img image-20200825215627247.png image-20200825215627247 %}

### 创建桥接文件

> XXX_Bridging-Header.h （XXX 随便设置，一般用项目名大写字母）

```swift
/*极光推送*/
#import "JPUSHService.h"
// iOS10注册APNs所需头文件
//#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
```

### AppDelegate.swift 中编写极光相关代码

```swift
//
//  AppDelegate.swift

import UserNotifications // 本地通知相关

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, JPUSHRegisterDelegate {
    var window: UIWindow?

    func application(_: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        // 注册极光推送
        registerJPush(launchOptions: launchOptions)

        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = ViewController()
        window?.makeKeyAndVisible()
        return true
    }

    func applicationDidFinishLaunching(_: UIApplication) {}

    // MARK: 极光推送相关

    func registerJPush(launchOptions: [UIApplication.LaunchOptionsKey: Any]?) {
        // 注册极光推送
        let entiity = JPUSHRegisterEntity()

        entiity.types = Int(UNAuthorizationOptions.alert.rawValue |
            UNAuthorizationOptions.badge.rawValue |
            UNAuthorizationOptions.sound.rawValue)

        JPUSHService.register(forRemoteNotificationConfig: entiity, delegate: self)

        JPUSHService.setup(withOption: launchOptions,
                           appKey: JPushAppKey,
                           channel: "app store",
                           apsForProduction: false)
    }

    func jpushNotificationCenter(_: UNUserNotificationCenter!, willPresent notification: UNNotification!, withCompletionHandler completionHandler: ((Int) -> Void)!) {
        let userInfo = notification.request.content.userInfo
        if notification.request.trigger is UNPushNotificationTrigger {
            JPUSHService.handleRemoteNotification(userInfo)
        }
        // 需要执行这个方法，选择是否提醒用户，有Badge、Sound、Alert三种类型可以选择设置
        completionHandler(Int(UNNotificationPresentationOptions.alert.rawValue))
    }

    func jpushNotificationCenter(_: UNUserNotificationCenter!, didReceive response: UNNotificationResponse!, withCompletionHandler completionHandler: (() -> Void)!) {
        let userInfo = response.notification.request.content.userInfo
        if response.notification.request.trigger is UNPushNotificationTrigger {
            JPUSHService.handleRemoteNotification(userInfo)
        }
        // 系统要求执行这个方法
        completionHandler()
    }

    // 点推送进来执行这个方法
    func application(_: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        JPUSHService.handleRemoteNotification(userInfo)
        completionHandler(UIBackgroundFetchResult.newData)
    }

    // 系统获取Token
    func application(_: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        JPUSHService.registerDeviceToken(deviceToken)
    }

    // 获取token 失败
    func application(_: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) { // 可选
        print("did Fail To Register For Remote Notifications With Error: \(error)")
    }

    // 后台进前台
    func applicationDidEnterBackground(_: UIApplication) {
        // 销毁通知红点
				UIApplication.shared.applicationIconBadgeNumber = 0
				JPUSHService.setBadge(0)
        let center = UNUserNotificationCenter.current()
        center.removeAllDeliveredNotifications() // To remove all delivered notifications
        center.removeAllPendingNotificationRequests() // To remove all pending notifications which are not delivered yet but scheduled.

        // source: https://stackoverflow.com/questions/40397552/cancelalllocalnotifications-not-working-in-ios10
    }

    func jpushNotificationCenter(_: UNUserNotificationCenter!, openSettingsFor _: UNNotification!) {}

    func jpushNotificationAuthorization(_: JPAuthorizationStatus, withInfo _: [AnyHashable: Any]!) {}
}
```

### 测试通知

现在我们来测试下发个通知给所有用户：

{% asset_img image-20200825155413289.png image-20200825155413289 %}

{% asset_img image-20200825155513706.png image-20200825155513706 %}

{% asset_img image-20200825155522931.png image-20200825155522931 %}

点击确认就能够发送通知给用户啦。

## 参考

[iOS SDK 集成指南](https://docs.jiguang.cn/jpush/client/iOS/ios_guide_new/)
