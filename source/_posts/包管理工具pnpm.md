---
title: 包管理工具pnpm
tags:
  - npm
  - pnpm
categories:
  - 前端
  - 构建工具
  - pnpm
abbrlink: 54634
date: 2023-03-23 09:16:34
---

# 包管理器的介绍

## npm 简史

在npm@3之前,如下图：

{% asset_img npm2.png npm2 %}

从上面可以看到，包是一层一层的安装的。那么这样会有些问题。

<!-- more -->

1. 假如我们依赖的包又依赖了其他的包，这样的话，路径就会很长，在window上会找不到包的地址。
2. 一个包可能会有多个副本存在，比如：foo引用了bar，假如aaa包引用了bar，那么bar就会存在两份。

{% asset_img npm2vsnpm3.png npm2vsnpm3 %}

在npm@3 之后

{% asset_img npm3.png npm3 %}

因为有这些问题，所以 npm3 版本之后，就换了一种包的安装管理方式。从上图可以看到，它将包的给拉平了，全部都放到了 node_modules 下面。但是这样还是会有一些问题。

1. 有些包可以访问到并不依赖的包，比如，A 包会访问到 C 包的东西
2. 拉平算法比较复杂，在安装时候的可以感觉到很慢[拉平规则](https://cloud.tencent.com/developer/article/1964485)
3. 假如说 C 包，就必须存在到 B 包下面，但是 npm 还是会安装到根 node_modules下面

## pnpm 简史

pnpm 也是一个包管理工具。

{% asset_img npm3.png npm3 %}

pnpm 并没有拉平包，但是通过软链接的方法，将包给关联起来，所以也就相应的解决了上面的这些问题。

# pnpm 可以避免愚蠢的错误

## npm

假如我们使用 下面的命令来创建一个应用

1. 创建一个新项目 `mkdir project && npm init -y`
2. 安装依赖 `npm install express --save`
3. 运行 `ls -l`

{% asset_img npm-install.png npm-install %}

可以看到在 node_modules 中存在很多的包。

假如你在项目中要使用 debug 这个包，但是忘记将它添加到依赖中，在开始的时候，没什么问题，一切都运行良好，但是在几周或者几个月后可能会发生以下情况：

1. express 更新了依赖，将 `debug@1.x.x` 更新到了 `debug@2.x.x`。但是对于 `express` 来说，只是发了一个 `patch` 的版本，没有重大更新，但是你的代码中，用的还是 `debug@1.x.x` 的 `api`，那么这样再次运行就会错误
2. `express` 不在使用了 `debug` 包，那么我们用的时候就会出现 `bug`，会提示找不到该包。

总结以下出现的问题：因为 npm@3 版本之后，将所有的包都拉平了，所以我们可以直接使用 `node_modules` 中的包，最终会在某一天出现错误。

## pnpm

我们在安装后可以看到，`node_modules` 里面只有一个 `express`，没有其他的包。假设我们需要使用 `debug` 包，忘记了在 `package` 中声明，为了让代码可以运行，必须在 `package` 中将其引用。

用了 pnpm 工具之后，可以明确的知道我们用的这个包是从那里得到的。

# pnpm 使用

## 简单使用

首先全局安装：

```shell
npm install -g pnpm
```

安装全部依赖：

```shell
pnpm i
```

安装指定依赖:

```shell
pnpm add vue / pnpm add @types/node -D
```

删除指定依赖：

```shell
pnpm remove vue / pnpm remove @types/node -D
```

运行脚本：

```json
"scripts": {
  "dev": "webpack"
}
```

```shell
pnpm dev / pnpm run dev
```

## 工具推荐: [ni](https://github.com/antfu/ni)

### 全局安装 ni

```shell
npm i -g @antfu/ni
```

### ni - 安装

```shell
ni
# npm install
# yarn install
# pnpm install
# bun install
```

```shell
ni vite
# npm i vite
# yarn add vite
# pnpm add vite
# bun add vite
```

```shell
ni @types/node -D
# npm i @types/node -D
# yarn add @types/node -D
# pnpm add -D @types/node
# bun add -d @types/node
```

### nr - 运行

```shell
nr dev --port=3000
# npm run dev -- --port=3000
# yarn run dev --port=3000
# pnpm run dev --port=3000
# bun run dev --port=3000
```

### nun - 卸载

```shell
nun webpack
# npm uninstall webpack
# yarn remove webpack
# pnpm remove webpack
# bun remove webpack
```

```shell
nun -g silent
# npm uninstall -g silent
# yarn global remove silent
# pnpm remove -g silent
# bun remove -g silent
```

## window10/11 需要注意

`ni` 指令和 `PowerShell` 中的 NI(new-item)冲突，如果要使用 ni 命令，请执行下面的指令：

``'Remove-Item Alias:ni -Force -ErrorAction Ignore'``

如果想保留指令，可以将下面的代码添加到 `$profile` 中。

```js
if (-not (Test-Path $profile)) {
  New-Item -ItemType File -Path (Split-Path $profile) -Force -Name (Split-Path $profile -Leaf)
}
$profileEntry = 'Remove-Item Alias:ni -Force -ErrorAction Ignore'
$profileContent = Get-Content $profile
if ($profileContent -notcontains $profileEntry) {
  $profileEntry | Out-File $profile -Append -Force
}
```

可以在 `PowerShell` 中运行 `$profile` 指令查看文件位置

```shell
# PowerShell 5: 
C:\Users\USERNAME\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1
# PowerShell 7: 
C:\Users\USERNAME\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
```

## 再次优化

我们已经可以通过 `nr dev` 来运行脚本里面定义的指令了，但是每次还是需要输入6个字符，那么我们可以通过添加别名的方式再次优化我们的操作。`win10/11-powershell` 如下：

将下面的命令添加到 `profile` 文件中，以后我们运行 dev 的时候只需要输入 `d` 即可

```js
# NPM Aliases
function test { nr test }
function serve{ nr serve }
function dev{ nr dev}
function build{ nr build}
function release{ nr release}
Set-Alias -Name t -Value test
Set-Alias -Name s -Value serve
Set-Alias -Name d -Value dev
Set-Alias -Name b -Value build
Set-Alias -Name r -Value release
```
