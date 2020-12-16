---
title: >-
  Xcode升级12编译报错The linked library is missing one or more architectures required
  by this target
tags:
  - Xcode
categories:
  - 移动端
  - iOS
abbrlink: 45158
date: 2020-10-15 22:24:05
---

## 问题

升级 Xcode12 后编译报错，报错提示类似：

```shell
The linked library 'xxxx.a/Framework' is missing one or more architectures required by this target: armv7.
```

<!-- more -->

又或者：

```shell
xxx/Pods/Target Support Files/Pods-xxx/Pods-xxx-frameworks.sh: line 128: ARCHS[@]: unbound variable
Command PhaseScriptExecution failed with a nonzero exit code
```

## 解决方案

在 TARGETS ——> Build Settings-Excluded Architectures 中添加以下代码：

```shell
EXCLUDED_ARCHS__EFFECTIVE_PLATFORM_SUFFIX_simulator__NATIVE_ARCH_64_BIT_x86_64=arm64 arm64e armv7 armv7s armv6 armv8 EXCLUDED_ARCHS=$(inherited) $(EXCLUDED_ARCHS__EFFECTIVE_PLATFORM_SUFFIX_$(EFFECTIVE_PLATFORM_SUFFIX)__NATIVE_ARCH_64_BIT_$(NATIVE_ARCH_64_BIT))
```

{% asset_img comp.png target-build-settings %}

保存后重新编译即可。
