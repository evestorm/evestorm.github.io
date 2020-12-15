---
title: iOS调用微信分享
tags:
  - iOS
categories:
  - 移动端
  - iOS
abbrlink: 19541
date: 2020-08-03 22:50:12
---

# iOS 唤起 APP 之 Universal Link(通用链接)

## 什么是`Universal Link`(通用链接)

`Universal Link`(通用链接)是 Apple 在 iOS9 推出的一种能够方便的通过传统`HTTPS`链接来启动 APP 的功能，可以使用相同的网址打开网址和 APP。当你的应用支持`Universal Link`(通用链接)，当用户点击一个链接是可以跳转到你的网站并获得无缝重定向到对应的 APP，且不需要通过`Safari`浏览器。如果你的应用不支持的话，则会在`Safari`中打开该链接。在苹果开发者中可以看到对它的介绍是：

> Seamlessly link to content inside your app, or on your website in iOS 9 or later. With universal links, you can always give users the most integrated mobile experience, even when your app isn’t installed on their device.

<!-- more -->

### 如何理解`Universal Link`(通用链接)

`Universal Link`(通用链接)：看起来就是一条普通的`https`链接，当然是我们在该链接域名根目录配置过的一个链接，也可以在该链接中放置对应的 H5 页面。当用户的点击该链接，只要手机中安装了支持该链接的 APP 就会直接进入到 APP 中。如果没有安装 APP 则会跳转到`Safari`浏览器中，展示 H5 页面。对用户来说则是一个无缝跳转的过程。

### `Universal Link`(通用链接)的应用场景

使用`Universal Link`(通用链接)可以让用户在`Safari`浏览器或者其他 APP 的`webview`中拉起相应的 APP，也可以在 APP 中使用相应的功能，从而来把用户引流到 APP 中。比如淘宝当在`Safari`浏览器中进入淘宝网页点击打开 APP 则会使用`Universal Link`(通用链接)来拉起淘宝 APP。

### 使用`Universal Link`(通用链接)跳转的好处

- **唯一性**: 不像自定义的`URL Scheme`，因为它使用标准的`HTTPS`协议链接到你的 web 站点，所以一般不会被其它的 APP 所声明。另外，`URL scheme`因为是自定义的协议，所以在没有安装 app 的情况下是无法直接打开的(在`Safari`中还会出现一个不可打开的弹窗)，而`Universal Link`(通用链接)本身是一个`HTTPS`链接，所以有更好的兼容性；
- **安全**:当用户的手机上安装了你的 APP，那么系统会去你配置的网站上去下载你上传上去的说明文件(这个说明文件声明了当前该`HTTPS`链接可以打开那些 APP)。因为只有你自己才能上传文件到你网站的根目录，所以你的网站和你的 APP 之间的关联是安全的；
- **可变**:当用户手机上没有安装你的 APP 的时候，`Universal Link`(通用链接)也能够工作。如果你愿意，在没有安装你的 app 的时候，用户点击链接，会在 safari 中展示你网站的内容；
- **简单**:一个`HTTPS`的链接，可以同时作用于网站和 APP；
- **私有**: 其它 APP 可以在不需要知道你的 APP 是否安装了的情况下和你的 APP 相互通信。

## 支持`Universal Link`(通用链接)

1. 先决条件:必须有一个支持`HTTPS`的域名，并且拥有该域名下的上传到根目录的权限（为了上传 Apple 指定文件）。
2. 开发者中心配置：找到对应的 App ID，在 Application Services 列表里有 Associated Domains 一条，把它变为 Enabled 就可以了。

{% asset_img configappid.png 配置config %}

添加能力后，记得重新生成下描述文件，然后下载双击在 Xcode 中打开就好了。

1. Xcode 工程配置：

{% asset_img sigin2.png 配置1 %}

{% asset_img sigin3.png 配置3 %}

1. 配置指定文件：创建一个内容为 json 格式的文件，苹果将会在合适的时候，从我们在项目中填入的域名请求这个文件。这个文件名必须为 apple-app-site-association，**切记没有后缀名**，文件内容大概是这样子：

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "9JA89QQLNQ.com.apple.wwdc",
        "paths": ["/wwdc/news/", "/videos/wwdc/2015/*"]
      },
      {
        "appID": "ABCD1234.com.apple.wwdc",
        "paths": ["*"]
      }
    ]
  }
}
```

说明：

> appID：组成方式是 `teamId.yourapp’s bundle identifier`。如上面的 9JA89QQLNQ 就是 teamId。登陆开发者中心，在 Account -> Membership 里面可以找到 Team ID。
>
> paths：设定你的 app 支持的路径列表，只有这些指定的路径的链接，才能被 app 所处理。星号的写法代表了可识 别域名下所有链接。

1. 上传指定文件:上传该文件到你的域名所对应的根目录或者.well-known 目录下，这是为了苹果能获取到你上传的文件。上传完后,自己先访问一下,看看是否能够获取到，当你在浏览器中输入这个文件链接后，应该是直接下载 apple-app-site-association 文件。

## 微信开放平台设置

开放平台创建自己的移动应用：

{% asset_img create-app.png 创建应用 %}

填写 iOS 相关信息：

{% asset_img config-ios.png ios相关 %}

上面 universal links 填写外界能访问到你 `apple-app-site-association` 文件的网址。

## Xcode 设置

### 通过 CocoaPods 集成 SDK

```shell
pod 'WechatOpenSDK'
```

pod install 后重新打开 Xcode。

#### Xcode 设置 URL scheme

在 Xcode 中，选择你的工程设置项，选中“TARGETS”一栏，在“info”标签栏的“URL type“添加“URL scheme”为你所注册的应用程序 id（如下图所示）。

在 Xcode 中，选择你的工程设置项，选中“TARGETS”一栏，在 “info”标签栏的“LSApplicationQueriesSchemes“添加 weixin 和 weixinULAPI（如下图所示）。

{% asset_img weixinulapi.png weixinulapi %}

{% asset_img plist-wechat.png plist-wechat %}

新增 wechat

## 具体代码实现

### 桥接文件

新建桥接文件 `WX_Bridging-Header.h`：

{% asset_img bridging-file.png bridging-file %}

```swift
//
//  WX_Bridging-Header.h
//  Created by lance on 2020/8/3.
//

#ifndef WX_Bridging_Header_h
#define WX_Bridging_Header_h

// 微信
#define WX_AppID @"appid"
#define WX_AppSecret @"appsecret"

// 微信-通用链接 Universal Link
#define WX_UNIVERSAL_LINK @"Universal Link"

#ifdef __OBJC__

// 微信授权登录
#import "WXApi.h"

#endif

#endif /* WX_Bridging_Header_h */
```

Build Setting -> 搜索 “bridging” 找到 Objective-C Bridging Header 设置引用路径:`$(SRCROOT)/$(PROJECT_NAME)/WX_Bridging-Header.h`

{% asset_img settings-bridging.png 设置桥接 %}

### 配置 AppDelegate

在 `AppDelegate.swift` or `SceneDelegate.swift` 中继承代理：

- WXApiDelegate(必须)
- WXApiLogDelegate(可选)

新增 block，用于回到微信授权登录成功获取的 code，后续利用该 code 获取微信用户信息。

实现代理方法：onReq、onResp、onLog(可选)

初始化微信 SDK：

```swift
//
//  AppDelegate.swift
//  YYT_iOS
//
//  Created by evestorm on 2020/7/15.
//  Copyright © 2020 YYT. All rights reserved.
//

import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, WXApiDelegate, WXApiLogDelegate {
    var window: UIWindow?

    // block，用于回到微信授权登录成功获取的code，后续利用该code获取微信用户信息
    var wechatLoginCallback: ((_ code: String) -> Void)?

    func application(_: UIApplication, didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.

        // 初始化微信SDK
        registerWeChat()

        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = ViewController()
        window?.makeKeyAndVisible()
        return true
    }

    func applicationDidFinishLaunching(_: UIApplication) {}

    // 初始化微信SDK
    func registerWeChat() {
        WXApi.startLog(by: .detail, logDelegate: self)
        WXApi.registerApp(WX_AppID, universalLink: WX_UNIVERSAL_LINK)
    }

    // MARK: WXApiDelegate

    func onReq(_: BaseReq) {
        print("=========> onRep")
    }

    func onResp(_ resp: BaseResp) {
        print("========> onResp")
        if resp.isKind(of: SendAuthResp.self) {
            let _resp = resp as! SendAuthResp
            if let code = _resp.code {
                if wechatLoginCallback != nil {
                    wechatLoginCallback!(code)
                }
            } else {
                print(resp.errStr)
            }
        }
    }

    func onLog(_ log: String, logLevel _: WXLogLevel) {
        print(log)
    }
}
```

### 封装微信方法

```swift
//
//  WX_Tools.swift
//  YYT_iOS
//
//  Created by evestorm on 2020/8/3.
//  Copyright © 2020 YYT. All rights reserved.
//

import Alamofire
import AlamofireImage
import Foundation
import UIKit

class WeChatFunc: NSObject {
    // MARK: - 微信授权登录

    /// 发送Auth请求到微信，支持用户没安装微信，等待微信返回onResp
    /// - Parameters:
    ///   - wxApiDelegate: WXApiDelegate对象，用来接收微信触发的消息。
    ///   - currentVC: viewController 当前界面对象。
    static func sendWeChatLogin(wxApiDelegate: WXApiDelegate, currentVC: UIViewController) {
        // 构造SendAuthReq结构体
        let req = SendAuthReq()
        req.openID = WX_AppID
        req.scope = "snsapi_userinfo"
        req.state = "wx_oauth_authorization_state" // 用于保持请求和回调的状态，授权请求或原样带回。
        // 第三方向微信终端发送一个SendAuthReq消息结构
        WXApi.sendAuthReq(req, viewController: currentVC, delegate: wxApiDelegate, completion: nil)
    }

    /// 微信：获取用户个人信息（UnionID 机制）
    static func getWeChatUserInfo(code: String, success: @escaping (_ userInfo: [String: Any]) -> Void) {
        getWeChatAccessToken(code: code) { _, access_token, openid in
            self.getWeChatUserInfo(access_token: access_token, openID: openid) { userInfoJson in
                success(userInfoJson)
            }
        }
    }

    /// 微信：通过 code 获取 access_token、openid
    static func getWeChatAccessToken(code _: String, success: @escaping (_ result: [String: Any], _ access_token: String, _ openid: String) -> Void) {
        let urlString = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=(WX_AppID)&secret=(WX_AppSecret)&code=(code)&grant_type=authorization_code"
        var request = URLRequest(url: URL(string: urlString)!)
        request.httpMethod = "GET"
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        URLSession.shared.dataTask(with: request) { data, _, error in
            DispatchQueue.main.async {
                UIApplication.shared.isNetworkActivityIndicatorVisible = false
                if error == nil, data != nil {
                    do {
                        let dic = try JSONSerialization.jsonObject(with: data!, options: []) as! [String: Any]
                        let access_token = dic["access_token"] as! String
                        let openID = dic["openid"] as! String
                        //
                        success(dic, access_token, openID)
                    } catch {
                        print(#function)
                    }
                    return
                }
            }
        }.resume()
    }

    /// 微信：获取用户个人信息（UnionID 机制）
    static func getWeChatUserInfo(access_token _: String, openID _: String, success: @escaping (_ userInfo: [String: Any]) -> Void) {
        let urlString = "https://api.weixin.qq.com/sns/userinfo?access_token=(access_token)&openid=(openID)"
        var request = URLRequest(url: URL(string: urlString)!)
        request.httpMethod = "GET"
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        URLSession.shared.dataTask(with: request) { data, _, error in
            DispatchQueue.main.async {
                UIApplication.shared.isNetworkActivityIndicatorVisible = false
                if error == nil, data != nil {
                    do {
                        let dic = try JSONSerialization.jsonObject(with: data!, options: []) as! [String: Any]
                        // dic当中包含了微信登录的个人信息，用于用户创建、登录、绑定等使用
                        success(dic)
                    } catch {
                        print(#function)
                    }
                    return
                }
            }
        }.resume()
    }

    // MARK: 微信分享

    /*
     @description 微信媒体消息内容 这里以发送图片+文字+链接形式（微信卡片形式）
     @param {UIImage} shareImage 分享图片
     @param {String} shareTitle 分享标题
     @param {String} shareDesc 分享描述文案
     @param {String} shareUrl 跳转链接
     */
    static func sendWXMediaMessage(shareImage: UIImage, shareTitle: String, shareDesc: String, shareUrl: String) {
        guard WXApi.isWXAppInstalled(), WXApi.isWXAppSupport() else {
            // 如果未安装微信或者微信版本过低，提示去安装或升级
            let ac = UIAlertController(title: "提醒", message: "您尚未安装微信或微信版本过低，请安装或升级微信", preferredStyle: .alert)
            ac.addAction(UIAlertAction(title: "确定", style: .default))
            UIApplication.topViewController()?.present(ac, animated: true)

            return
        }
        let sendMessageToWXReq = SendMessageToWXReq()
        // 微信好友分享
        sendMessageToWXReq.scene = Int32(WXSceneSession.rawValue) // 朋友圈：WXSceneTimeline.rawValue
        sendMessageToWXReq.bText = false
        let wxMediaMessage = WXMediaMessage()
        wxMediaMessage.title = shareTitle
        wxMediaMessage.description = shareDesc
        // 压缩图片，防止图片数据过大导致分享无法成功，这里微信要求大小不能超过64K
        let thumImageData = UIImage.resetImgSize(sourceImage: shareImage, maxImageLenght: 300, maxSizeKB: 64)
        wxMediaMessage.thumbData = thumImageData as Data

        let wxWebPage = WXWebpageObject()
        wxWebPage.webpageUrl = shareUrl
        wxMediaMessage.mediaObject = wxWebPage
        sendMessageToWXReq.message = wxMediaMessage
        WXApi.send(sendMessageToWXReq)
    }

    /*
     @description 文字类型分享示例
     @param {String} 分享文字
     @param {Func} 闭包 版本过低时执行的操作
     */
    static func sendWXTextMessage(shareText: String) {
        guard WXApi.isWXAppInstalled(), WXApi.isWXAppSupport() else {
            // 如果未安装微信或者微信版本过低，提示去安装或升级
            let ac = UIAlertController(title: "提醒", message: "您尚未安装微信或微信版本过低，请安装或升级微信", preferredStyle: .alert)
            ac.addAction(UIAlertAction(title: "确定", style: .default))
            UIApplication.topViewController()?.present(ac, animated: true)

            return
        }
        let sendMessageToWXReq = SendMessageToWXReq()
        sendMessageToWXReq.bText = true
        sendMessageToWXReq.text = shareText
        sendMessageToWXReq.scene = Int32(WXSceneSession.rawValue)
        WXApi.send(sendMessageToWXReq)
    }

    /*
     @description 发送到小程序
     @param {String} webpageUrl 网页链接
     @param {String} userName 小程序的userName 小程序原始ID获取方法：登录小程序管理后台-设置-基本设置-帐号信息
     @param {String} path 小程序的页面路径
     @param {String} hdImageData 小程序新版本的预览图二进制数据 限制大小不超过128KB，自定义图片建议长宽比是 5:4。
     @param {String} withShareTicket 是否使用带shareTicket的分享
     @param {String} programType 小程序的类型，默认正式版 release(正式) test(测试) preview(体验)
     @param {String} miniTitle 小程序标题
     @param {String} miniDescription 小程序描述
     */
    static func sendWXMiniProgramMessage(webpageUrl: String, userName: String, path: String, imageUrl: String, withShareTicket: Bool = false, programType: Int, miniTitle: String, miniDescription: String) {
        // 这里以发送图片+文字+链接形式（微信卡片形式）
        guard WXApi.isWXAppInstalled(), WXApi.isWXAppSupport() else {
            // 如果未安装微信或者微信版本过低，提示去安装或升级
            let ac = UIAlertController(title: "提醒", message: "您尚未安装微信或微信版本过低，请安装或升级微信", preferredStyle: .alert)
            ac.addAction(UIAlertAction(title: "确定", style: .default))
            UIApplication.topViewController()?.present(ac, animated: true)
            return
        }

        let object = WXMiniProgramObject()
        object.webpageUrl = webpageUrl
        object.userName = userName
        object.path = path

        if let url = URL(string: imageUrl), let data = try? Data(contentsOf: url) {
//            object.hdImageData = try? Data(contentsOf: url)
            let img = UIImage(data: data)
            // 压缩图片，防止图片数据过大导致分享无法成功，这里微信要求大小不能超过64K
            let thumImageData = UIImage.resetImgSize(sourceImage: img ?? UIImage(named: "zzylogo")!, maxImageLenght: 300, maxSizeKB: 128)
            object.hdImageData = thumImageData as Data
        }

        object.withShareTicket = withShareTicket
        // ptype:正式版:0，测试版:1，体验版:2
        switch programType {
        case 0: // 正式版:0
            object.miniProgramType = WXMiniProgramType.release
        case 1: // 测试版:1
            object.miniProgramType = WXMiniProgramType.test
        case 2: // 体验版:2
            object.miniProgramType = WXMiniProgramType.preview
        default: // 默认正式版
            object.miniProgramType = WXMiniProgramType.release
        }
        let message = WXMediaMessage()
        message.title = miniTitle
        message.description = miniDescription
        message.thumbData = nil // 兼容旧版本节点的图片，小于32KB，新版本优先
        // 使用WXMiniProgramObject的hdImageData属性
        message.mediaObject = object
        let req = SendMessageToWXReq()
        req.bText = false
        req.message = message
        req.scene = Int32(WXSceneSession.rawValue) // 目前只支持会话
        WXApi.send(req)
    }
}
```

### 使用方式

```swift
WeChatFunc.sendWXTextMessage(shareText: message)
```

## 资源参考

[iOS 唤起 APP 之 Universal Link(通用链接)](https://www.cnblogs.com/guoshaobin/p/11164000.html)

[APP 接入微信支付或分享完整流程](https://www.codenong.com/js9ac702b07b94/)

[iOS 接入指南](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/Access_Guide/iOS.html)
