---
title: Mac安装CocoaPods
tags:
  - CocoaPods
  - macOS
  - Xcode
  - iOS
categories:
  - 移动端
  - iOS
abbrlink: 27721
date: 2020-07-03 19:45:51
---

## 安装 CocoaPods 命令

```shell
sudo gem install cocoapods
```

<!-- more -->

等待了几分钟后，显示下面的信息，便表示已经安装成功了:

```shell
Installing ri documentation for cocoapods-1.8.4
Done installing documentation for thread_safe, tzinfo, concurrent-ruby, i18n, activesupport, nap, fuzzy_match, httpclient, algoliasearch, cocoapods-core, claide, cocoapods-deintegrate, cocoapods-downloader, cocoapods-plugins, cocoapods-search, cocoapods-stats, netrc, cocoapods-trunk, cocoapods-try, molinillo, atomos, colored2, nanaimo, xcodeproj, escape, fourflusher, gh_inspector, ruby-macho, cocoapods after 21 seconds
29 gems installed
```

最后一步 ，下载文件:

```shell
pod setup
```

## 项目中使用 CocoaPods

### 添加 Podfile 文件

终端中 cd 到项目根目录 输入 `touch Podfile`

输入 `touch Podfile` 后，我们的工程目录中会出现 一个 `Podfile` 文件

### 编辑 Podfile 文件

在文件中输入自己需要的第三方项目库，我们以 `AFNetworking` 为例

```shell
platform :ios, '10.0'

target 'CocoaPodsDemo' do

pod 'AFNetworking'

end

```

### 执行 pod

终端输入 `pod install`

```shell
pod install
Analyzing dependencies
Adding spec repo `trunk` with CDN `https://cdn.cocoapods.org/`
Downloading dependencies
Installing AFNetworking (3.2.1)
Generating Pods project
Integrating client project

[!] Please close any current Xcode sessions and use `CocoaPodsDemo.xcworkspace` for this project from now on.
Pod installation complete! There is 1 dependency from the Podfile and 1 total pod installed.
```

输出上面的内容就表示，已经成功了，提示我们关掉当前的看到上面的项目，打开 `CocoaPodsDemo.xcworkspace` 这个项目。

### 更新 Cocoapods

```shell
pod update --no-repo-update
```
