---
title: Swift与JS交互
tags:
  - iOS
categories:
  - 移动端
  - iOS
abbrlink: 17227
date: 2020-07-11 19:58:33
---

## 一. 环境

Xcode 11，Swift 5.0, ES6

### 1.1 介绍

- WKWebView —允许通过 URL 加载 Web 内容
- WKScriptMessage — 接收 `postMessage()` 时创建的对象
- WKUserContentController —管理 `JavaScript` 调用和注入
- WKScriptMessageHandler —访问 `WKScriptMessage` 委托方法的协议
- WKWebViewConfiguration —传递给 WKWebView 的配置

<!-- more -->

## 二. iOS 端

### 2.1 添加 WKScriptMessageHandler 协议和相关变量、方法

```swift
class ViewController: UIViewController, WKScriptMessageHandler {
   // 屏幕宽高
   let screenW = UIScreen.main.bounds.width
   let screenH = UIScreen.main.bounds.height

   // 状态栏高度
   let statusBarHeight: CGFloat = {
      var heightToReturn: CGFloat = 0.0
      for window in UIApplication.shared.windows {
         if #available(iOS 13.0, *) {
               if let height = window.windowScene?.statusBarManager?.statusBarFrame.height, height > heightToReturn {
                  heightToReturn = height
               }
         } else {
               // Fallback on earlier versions
               heightToReturn = UIApplication.shared.statusBarFrame.size.height
         }
      }
      return heightToReturn
   }()

   // MARK: 获取当前设备安全区域frame

   public func safeAreaFrame(_ viewController: UIViewController) -> CGRect {
      let isIphoneX = UIScreen.main.bounds.height >= 812 ? true : false

      var navigationBarHeight: CGFloat = isIphoneX ? 44 : 20
      var tabBarHeight: CGFloat = isIphoneX ? 34 : 0

      // 标志导航视图控制器是否存在 默认不存在
      // 为什么需要这个？
      // 这里有个坑，当没有导航栏时，如果是iPhoneX等设备，tabBar.frame.height = 49 会不包含底部返回条的高度（34）, 存在导航栏时 tabBar.frame.height = 83
      var noNavigationExists = true

      if let navigation = viewController.navigationController {
         noNavigationExists = false
         navigationBarHeight += navigation.navigationBar.frame.height
      }
      if let tabBarController = viewController.tabBarController {
         tabBarHeight = noNavigationExists ? tabBarHeight : 0
         tabBarHeight += tabBarController.tabBar.frame.height
      }

      let frame = CGRect(x: 0, y: navigationBarHeight, width: screenW, height: screenH - tabBarHeight - navigationBarHeight)

      return frame
   }
}
```

> Extension/UIColor+Extension.swift

```swift
import UIKit

extension UIColor {
    //    rgba方法
    convenience init(red: CGFloat, green: CGFloat, blue: CGFloat, alpha: CGFloat = 1.0) {
        self.init(displayP3Red: red / 255.0, green: green / 255.0, blue: blue / 255.0, alpha: alpha)
    }

    //    主题色
    class func globalBgColor() -> UIColor {
        return UIColor(red: 7, green: 130, blue: 255)
    }
}
```

### 2.2 懒加载 webView

```swift
// MARK: 懒加载 webView

lazy var webView: WKWebView = {
   // 创建设置对象
   let preferences = WKPreferences()
   preferences.javaScriptEnabled = true
   preferences.javaScriptCanOpenWindowsAutomatically = true

   // 配置 WKWebView
   let configuration = WKWebViewConfiguration()
   configuration.preferences = preferences
   configuration.userContentController = WKUserContentController()

   // 注册iOS这个变量,让js能够通过 window.webkit.messageHandlers.iOS.postMessage() 调用 Swift 指定方法
   configuration.userContentController.add(self, name: "iOS")

   var webView = WKWebView(frame: safeAreaFrame(self), configuration: configuration)
   return webView
}()
```

### 2.3 生命周期内加载和销毁 webView 相关内容

```swift
// MARK: 生命周期

override func viewDidLoad() {
   super.viewDidLoad()

   view.backgroundColor = .white

   //        获取当前设备宽高
   let width: CGFloat = screenW

   //        加载h5
   let url = URL(string: "h5线上的https地址")
   let urlReq = URLRequest(url: url!)
   webView.load(urlReq)

   view.addSubview(webView)

   //        使用UIView覆盖状态栏
   statusView = UIView(frame: CGRect(x: 0, y: 0, width: width, height: statusBarHeight))
   //        使用 Extension/UIColor+Extension.swift 中的拓展方法
   statusView.backgroundColor = UIColor.globalBgColor()
   view.addSubview(statusView)

   //        注册iOS标识
   webView.evaluateJavaScript("window.iOS = 'iOS'") { _, error in
      print("Error : \(String(describing: error))")
   }

   //        获取各种权限
   getPermissions()
}

func webViewDidClose(_: WKWebView) {
   //        销毁，防止内存泄漏
   webView.configuration.userContentController.removeScriptMessageHandler(forName: "iOS")
}
```

### 2.4 监听 js 调用 iOS 方法

```swift
// MARK: 监听js调用iOS方法

func userContentController(_: WKUserContentController, didReceive message: WKScriptMessage) {
   // 前端通过 window.webkit.messageHandlers.iOS.postMessage 调用原生方法
   // 此处匹配下方的 「iOS」
   if message.name == iOS {
      guard let dict = message.body as? [String: AnyObject],
            let method = dict["method"] as? String else {
            return
      }
      iOSHandle(method: method, params: dict["params"] as AnyObject)
   }
}

// MARK: 执行前端调用的接口

private func iOSHandle(method: String, params: AnyObject) {
   switch method {
   // 获取手机通讯录返回给前端
   case "getContacts":
      returnContacts {
         // jsonString 为要返回给前端的 json 字符串
         self.webView.evaluateJavaScript("getContacts('\(jsonString)')") { _, error in
               print("Error : \(String(describing: error))")
         }
      }
   // 根据前端传递的电话号码调用打电话接口
   case "makePhoneCall":
      if let p = params as? [String: AnyObject], let phoneStr = p["phone"] as? String {
            makePhoneCall(phoneStr: phoneStr)
      }
   default:
      print("请求失败")
   }
}
```

## 三. JS 端

### 3.1 JS 传递参数调用原生方法，但无需返回值

```js
/**
 * @description 打电话
 * @param { String } phoneNumber 电话string
 */
const makePhoneCall = phoneNumber => {
  // 调用iOS下的callPhone方法
  window.webkit.messageHandlers.iOS.postMessage({
    method: 'makePhoneCall',
    params: {
      phone
    }
  });
};

makePhoneCall(18712345678);
```

### 3.2 JS 调用原生方法并接收原生方法返回值

```js
// 获取联系人
/**
 * @param {Object} cb 回调函数
 * @return 字符串
 * @e.g. {"555-610-6679":"TaylorDavid","555-522-8243":"HaroAnna","(415) 555-3695":"BellKate","(408) 555-3514":"HigginsDaniel","(707) 555-1854":"ZakroffHank","888-555-1212":"AppleseedJohn"}
 */
const getContacts = cb => {
  // 调用iOS下的getContacts方法
  window.webkit.messageHandlers.iOS.postMessage({
    method: 'getContacts'
  });
  // 将getContacts方法添加到window中
  // 这样Swift代码就可以调用getContacts方法了
  window['getContacts'] = msg => {
    cb && cb(JSON.parse(msg));
  };
};

getContacts(data => {
  // 接收联系人数组对象
  this.contactsList = data;
});
```

## 四. 参考资料

- [iOS WKWebView Communication Using Javascript and Swift](https://medium.com/john-lewis-software-engineering/ios-wkwebview-communication-using-javascript-and-swift-ee077e0127eb#75b1)
- [iOS 中 WKWebView 和 Native 交互](https://juejin.im/post/5baafa39e51d450e664b53b4)
- [WKWebView 与 vue.js 的交互](https://www.jianshu.com/p/36c6ffd4c99e)
