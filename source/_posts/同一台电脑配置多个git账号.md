---
title: 同一台电脑配置多个git账号
tags:
  - git
categories:
  - 工具
  - 版本控制
abbrlink: 50710
date: 2022-11-12 15:30:58
---

# 本地生成 rsa

终端输入：

```bash
ssh-keygen -t rsa
# 输入文件路径+文件名
/Users/yangliang/.ssh/github_lance_rsa # 默认不输入 路径+文件名就是: ~/.ssh/id_rsa
```

<!-- more -->

输入完路径+文件名后一路回车：

{% asset_img keygen.png keygen %}

打印或复制公钥：

```bash
cat ~/.ssh/id_rsa.pub      # 控制台上输出内容
pbcopy < ~/.ssh/id_rsa.pub # 自动拷贝到粘贴板
```

{% asset_img cat_ssh.png cat_ssh %}

{% asset_img find_tree.png find_tree %}

# github 添加 ssh

前往 GitHub 网站的 `"account settings"`

依次点击 `"Setting -> SSH Keys"->"New SSH key"`

Title 处填写 “id_rsa.pub” 或其他任意信息（上图我的命名为 `github_lance_rsa`）。 key处原样拷贝上边复制的公钥信息

```bash
pbcopy < ~/.ssh/id_rsa.pub # 自动拷贝到粘贴板
```

最后，输入：

```bash
ssh -T git@github.com

# 对于我的账号，则是：
ssh -T evestorm@github.com
```

如果报错

```bash
Permission denied (publickey)
```

则输入如下命令：

```bash
ssh-add -k ~/.ssh/id_rsa
```

# 配置 git config

终端输入：

```bash
vi ~/.ssh/config
```

{% asset_img find_config.png find_config %}

```bash
# gitlab 公司gitlab
Host gitlab
    User git
    HostName gitlab.company.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/gitlab_rsa
    ServerAliveInterval 300
    ServerAliveCountMax 10
# github 个人github
Host github
    User git
    HostName github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/github_rsa
    ServerAliveInterval 300
    ServerAliveCountMax 10
```

# 来源

<https://www.zhihu.com/question/21402411/answer/95945718>
