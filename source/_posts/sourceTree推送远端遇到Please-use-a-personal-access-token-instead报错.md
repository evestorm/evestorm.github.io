---
title: sourceTree推送远端遇到Please use a personal access token instead报错
tags:
  - 解决方案
  - SourceTree
categories:
  - 工具
  - 版本控制
abbrlink: 35510
date: 2021-07-28 17:38:28
---

如标题所示，今天推送远端发现了此错误，google 了下在 [Stack Overflow](https://stackoverflow.com/questions/68191392/password-authentication-is-temporarily-disabled-as-part-of-a-brownout-please-us) 上找到了类似问题的解决方案。但某些操作在我电脑上执行不了。所以特此记录下。

1. 首先进入到 github 上创建一个 token ，教程在此：<https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token>
2. 然后进入 keyChain 搜索 github ，找到分类为 application password 的那条 sourceTree 关联的文件
3. 双击秘钥文件点击 show password ，此时需要输入电脑开机密码查看密码
4. 输入后修改秘钥密码，按此格式填写 `access_token=<token>&scope=&serviceProvider=GitHub`
5. 上面的 `<token>` 是需要你用生成的 token 替换的内容
6. 最后 save changes 保存更改
7. 再次去 sourceTree 推送代码就 OK 了
