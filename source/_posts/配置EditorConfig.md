---
title: 配置EditorConfig
tags:
  - 工具
  - EditorConfig
categories:
  - 工具
  - IDE
abbrlink: 30080
date: 2021-03-11 19:54:01
---

## 简介

EditorConfig 有助于 `一个项目` 且 `多个开发者` 所用编辑器各不相同的团队维护编码风格。

<!-- more -->

## 官网

https://editorconfig.org/

### 不需要下载插件的编辑器

https://editorconfig.org/#pre-installed

### 需要下载插件的编辑器

https://editorconfig.org/#download

> 提示：
>
> 点击图标就能跳转到对应编辑器的插件安装地址

另外，VSCode 插件下载地址为[EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)。在 VSCode 中，创建好文件和安装好插件后，需要重启编辑器，但是此时只是修改编辑器的编辑设置，并不会将你已经存在的代码进行规范，可以通过快捷键格式化：`shift + alt + F`

## .editorconfig 文件示例

```shell
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file 表示是最顶层的配置文件，发现设为true时，才会停止查找.editorconfig文件
root = true

# Unix-style newlines with a newline ending every file 对于所有的文件  始终在文件末尾插入一个新行
[*]
end_of_line = lf
insert_final_newline = true

# Matches multiple files with brace expansion notation
# Set default charset  对于所有的js,py文件，设置文件字符集为utf-8
[*.{js,py}]
charset = utf-8

# 4 space indentation 控制py文件类型的缩进大小
[*.py]
indent_style = space
indent_size = 4

# Tab indentation (no size specified) 设置某中文件的缩进风格为tab Makefile未指明
[Makefile]
indent_style = tab

# Indentation override for all JS under lib directory  设置在lib目录下所有JS的缩进为
[lib/**.js]
indent_style = space
indent_size = 2

# Matches the exact files either package.json or .travis.yml 设置确切文件 package.json/.travis/.yml的缩进类型
[{package.json,.travis.yml}]
indent_style = space
indent_size = 2
```

## 通配符

```shell
*                匹配除/之外的任意字符串
**               匹配任意字符串
?                匹配任意单个字符
[name]           匹配name中的任意一个单一字符
[!name]          匹配不存在name中的任意一个单一字符
{s1,s2,s3}       匹配给定的字符串中的任意一个(用逗号分隔)
{num1..num2}    匹配num1到num2之间的任意一个整数, 这里的num1和num2可以为正整数也可以为负整数
```

## 属性

```shell
indent_style    设置缩进风格(tab是硬缩进，space为软缩进)
indent_size     用一个整数定义的列数来设置缩进的宽度，如果indent_style为tab，则此属性默认为tab_width
tab_width       用一个整数来设置tab缩进的列数。默认是indent_size
end_of_line     设置换行符，值为lf、cr和crlf
charset         设置编码，值为latin1、utf-8、utf-8-bom、utf-16be和utf-16le，不建议使用utf-8-bom
trim_trailing_whitespace  设为true表示会去除换行行首的任意空白字符。
insert_final_newline      设为true表示使文件以一个空白行结尾
root           表示是最顶层的配置文件，发现设为true时，才会停止查找.editorconfig文件
```

## 参考链接

- [一套非常标准的前端代码工作流](https://mp.weixin.qq.com/s/_Xu2GlgDJm-dgzjcXQlC4w)
