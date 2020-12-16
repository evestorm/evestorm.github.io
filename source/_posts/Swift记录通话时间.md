---
title: Swift记录通话时间
tags:
  - iOS
categories:
  - 移动端
  - iOS
abbrlink: 32380
date: 2020-08-20 20:01:57
---

公司 App 项目需要记录用户拨打电话的通话时间，查了下文档，发现 CallKit 提供的接口可以完成此功能。

<!-- more -->

代码如下：

```swift
import CallKit

class ViewController: UIViewController, WKScriptMessageHandler, WKUIDelegate, WKNavigationDelegate, MFMessageComposeViewControllerDelegate, CXCallObserverDelegate {

  let callObserver = CXCallObserver()
  private var beforeDate: Date! // 注意：这里必须是全局属性，不能定义局部变量

  // ----------- 打电话 --------------
  // 参考: https://stackoverflow.com/questions/13743344/how-can-i-find-out-whether-the-user-pressed-the-call-or-the-cancel-button-when-m
    public func callPhone(phoneStr: String) {
        let phone = "telprompt://" + phoneStr
        if let url = NSURL(string: phone.replacingOccurrences(of: " ", with: "", options: .literal, range: nil)), UIApplication.shared.canOpenURL(url as URL) {
            callObserver.setDelegate(self, queue: DispatchQueue.main)
            didDetectOutgoingCall = false
            // we only want to add the observer after the alert is displayed,
            // that's why we're using asyncAfter(deadline:)
            UIApplication.shared.open(url as URL, options: [:]) { [weak self] success in
                if success {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                        self?.addNotifObserver()
                    }
                }
            }
        }
    }

    func addNotifObserver() {
        let selector = #selector(appDidBecomeActive)
        let notifName = UIApplication.didBecomeActiveNotification
        NotificationCenter.default.addObserver(self, selector: selector, name: notifName, object: nil)
    }

    //    用户取消了打电话
    @objc func appDidBecomeActive() {
        // if callObserver(_:callChanged:) doesn't get called after a certain time,
        // the call dialog was not shown - so the Cancel button was pressed
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { [weak self] in
            if !(self?.didDetectOutgoingCall ?? true) {
                print("Cancel button pressed")
            }
        }
    }

    //    用户点击了呼叫
    func callObserver(_: CXCallObserver, callChanged call: CXCall) {
        /**
         拨通:  outgoing :1  onHold :0   hasConnected :0   hasEnded :0
         拒绝:  outgoing :1  onHold :0   hasConnected :0   hasEnded :1
         链接:  outgoing :1  onHold :0   hasConnected :1   hasEnded :0
         挂断:  outgoing :1  onHold :0   hasConnected :1   hasEnded :1

         新来电话:    outgoing :0  onHold :0   hasConnected :0   hasEnded :0
         保留并接听:  outgoing :1  onHold :1   hasConnected :1   hasEnded :0
         另一个挂掉:  outgoing :0  onHold :0   hasConnected :1   hasEnded :0
         保持链接:    outgoing :1  onHold :0   hasConnected :1   hasEnded :1
         对方挂掉:    outgoing :0  onHold :0   hasConnected :1   hasEnded :1
         */

        // 接通
        if call.isOutgoing, call.hasConnected, !call.hasEnded {
            // 记录当前时间
            setBeginDate()
        }
        // 挂断
        if call.isOutgoing, call.hasConnected, call.hasEnded {
            // 计算通话时长
            let seconds = getCallPhoneTime()

            webView.evaluateJavaScript("callPhone(\(seconds))") { _, error in
                print("Error : \(String(describing: error))")
            }
        }
    }

    // 记录当前时间
    func setBeginDate() {
        beforeDate = Date()
    }

    // 计算通话时长
    func getCallPhoneTime() -> String {
        let dat = Date(timeInterval: 0, since: beforeDate)
        let a = dat.timeIntervalSinceNow

        let timeString = String(format: "%0.f", fabs(a)) // 转为字符型
        print("\(timeString)秒")
        return timeString
    }
}
```
