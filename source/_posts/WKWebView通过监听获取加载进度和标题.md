---
title: WKWebView通过监听获取加载进度和标题
tags:
  - iOS
categories:
  - 移动端
  - iOS
abbrlink: 63756
date: 2020-08-27 22:20:35
---

转载：https://www.jianshu.com/p/548a772f433e

WKWebView 提供了可以监听页面加载进度，以及页面的标题的方法。

```swift
let webView = WKWebView(frame: CGRect(x: 0, y: 0, width: screenWidth, height: screenHeight - navigationHeight ), configuration: WKWebViewConfiguration())

lazy private var progressView: UIProgressView = {
        let progress = UIProgressView.init(frame: CGRect(x: CGFloat(0), y: CGFloat(0), width: UIScreen.main.bounds.width, height: 2))
        progress.tintColor = UIColor.green
        progress.trackTintColor = UIColor.white
        return progress
    }()

override func viewDidLoad() {

    webView.addObserver(self, forKeyPath: "title", options: .new, context: nil)
    webView.addObserver(self, forKeyPath: "estimatedProgress", options: .new, context: nil)

}

//添加观察者方法
override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {

   //设置进度条
   if keyPath == "estimatedProgress"{
      progressView.alpha = 1.0
      progressView.setProgress(Float(webView.estimatedProgress), animated: true)
      if webView.estimatedProgress >= 1.0 {
            UIView.animate(withDuration: 0.3, delay: 0.1, options: .curveEaseOut, animations: {
               self.progressView.alpha = 0
            }, completion: { (finish) in
               self.progressView.setProgress(0.0, animated: false)
            })
      }
   }

   //重设标题
   else if keyPath == "title" {
      self.title = self.webView.title
   }
}
```
