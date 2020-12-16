---
title: Xcode格式化代码
tags:
  - Xcode
categories:
  - 移动端
  - iOS
abbrlink: 7987
date: 2020-07-08 22:29:01
---

最近因为业务需要重操旧业，玩起了 iOS。发现 Xcode 没有 VS Code 这种 IDE 自带的格式化代码工具。问了问万能 Will ，推荐了个插件叫 [SwiftFormat](https://github.com/nicklockwood/SwiftFormat) 。感觉还不错。这里记录下如何用 CocoPods 安装。

<!-- more -->

### Pods 引入

在 `Podfile` 中添加插件：

```shell
...
  # Pods for YYT
  ...
  pod 'SwiftFormat/CLI'

end
```

### Pods 更新

项目的根目录执行 Pods 更新：

```shell
pod update --no-repo-update
```

### 配置脚本

然后添加运行脚本：

{% asset_img image-20201119114158207.png image-20201119114158207 %}

添加好之后 `CMD + B` or `CMD + R` 编译运行时就能自动格式化代码了，赞！
