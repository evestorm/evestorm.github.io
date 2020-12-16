---
title: vscode自定义snippet片段
tags:
  - VSCode
categories:
  - 工具
  - IDE
abbrlink: 17235
date: 2019-06-11 21:32:05
---

最近我有个需求，想要在 github 上使用 markdown 语法时居中图片，然而搜了几种办法都无效，最后在 [DavidWells 的 gist](https://gist.github.com/DavidWells/7d2e0e1bc78f4ac59a123ddf8b74932d) 中找到了答案（p.s. 如果无法翻墙，你还可以参考 [这篇博客](https://blog.csdn.net/jingbin_/article/details/52960826)）

解决了一个问题又出现了另一个，其实我已经把博客写完了，但其中需要居中的图片比较多，而居中代码还比较繁琐，要是一个个手动替换也太麻烦了。然后就想到了使用 snippet ，官网教程在这里：[Creating your own snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets)

<!-- more -->

具体该如何实现呢：

1. Code → 首选项 → 用户代码片段

2. 在弹出的下拉列表中输入你想要在哪种文件中使用这种片段（例如我只希望在 markdown 文件中使用，就键入 markdown）

3. 此时 vs code 就会帮我们自动新建一个名为 markdown.json 的文件，我们在这个 json 文件中定义我们的代码片段就好了

4. 接着我们进入该文件，编写 snippet 配置：

   ```json
   {
     "Img centered": {
       "prefix": "mimg",
       "body": [
         "<div align=center>",
         "\t<img src='$1' alt='$2' width='$3'>",
         "</div>"
       ],
       "description": "Centered image in markdown"
     }
   }
   ```

5. 然而当我保存后在 md 文件中使用时，按下 tab 并没有效果，经过阅读官方文档，发现有这样一句话：`Enable it with "editor.tabCompletion": "on", type a snippet prefix, and press Tab to insert a snippet.`

6. 所以你还需要进入 首选项 → 设置 ，在顶部输入框键入 `editor.tabCompletion` 来搜索此配置，将 `off` 改为 `on` 就 OK 了

7. 现在大功告成，在 md 文件中，键入 mimg 后按下 tab 键，先前写好的 snippet 就能够使用了

结语：关于 vs code 的 snippet 片段，网上非常多教程，大家自行搜索就好，这篇笔记的重点是上方第 6 步把 `editor.tabCompletion` 改为 `on` 。这一步至关重要，不修改会导致你以为自己的 snippet 设置没生效。
