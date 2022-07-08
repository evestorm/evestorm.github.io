---
title: VSCode配置TypeScript自动编译报错
tags:
  - TypeScript
  - VSCode
categories:
  - 前端
  - JS
abbrlink: 15303
date: 2020-10-01 21:23:53
---

2020.10.02 更新：

em… 我在 github 上提问有了回复，链接在此：https://github.com/microsoft/vscode/issues/107895

具体解决方案就是，打开 `settings.json` ，设置 `"terminal.integrated.inheritEnv"` 为 true 。

<!-- more -->

---

之前在 VSCode 中能通过运行任务来监听 ts 文件的代码变更来实时编译 js。然而我今天发现这样会导致报错：

```shell
> Executing task: tsc -p '/Users/macbook/Documents/01ts-intro/tsconfig.json' --watch <

env: node: No such file or directory
The terminal process "/bin/bash '-c', 'tsc -p '/Users/macbook/Documents/01ts-intro/tsconfig.json' --watch'" failed to launch (exit code: 127).

Terminal will be reused by tasks, press any key to close it.
```

尝试了各种办法仍然没有解决，后来在终端直接执行命令反而好了，这里记录一下：

```shell
tsc -p 'tsconfig.json' --watch
```

### 附录

想要知道如何自动编译 TS？

可以看下掘金的这篇文章：[Visual Studio Code 中配置 TypeScript 自动编译](https://juejin.im/post/6844903829163474952)
