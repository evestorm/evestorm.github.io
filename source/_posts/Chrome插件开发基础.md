---
title: Chrome插件开发基础
tags:
  - Chrome插件
abbrlink: 55964
date: 2023-01-24 12:48:01
categories:
- 前端
- Chrome插件
---

# 介绍

简单来说，Chrome 插件是用来增强浏览器或页面功能的程序。我们可以用它来实现「文章预计阅读时间」、「页面一键暗黑模式」、「Chrome Tab 分组管理」等功能。开发 Chrome 插件主要用到的技术是 HTML、CSS 和 JavaScript ，对 Web 开发人员来说非常友好。

文档链接：

[Welcome to Chrome Extensions - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3)

<!-- more -->

# 核心项目结构

```shell
.
├── background.js        # 后台脚本, e.g. 插件快捷键、popup、关闭选项卡等事件监听
├── images               # 图片资源
│   ├── icon-128.png
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
├── manifest.json        # 插件的配置清单JSON
├── popup                # 插件弹窗
│   ├── index.css
│   ├── index.html
│   └── index.js
└── scripts              
    └── content.js       # 插入到网页中的脚本
```

# manifest.json

这个文件必须存在于 Chrome 插件中，而且得放在项目根目录，用途是配置所有和插件相关的配置。其中，`manifest_version`、`name`、`version` 是必不可少的配置字段，`description` 和 `icons` 是推荐配置的字段。

```json
{
  "manifest_version": 3,                                    // manifest 版本，必须得是v3
  "name": "Notion Tools",                                   // 插件名称
  "version": "1.0",                                         // 插件版本
  "description": "Enhance the features of notion",          // 插件描述
  "icons": {                                                // 插件 icon 图标
    "16": "images/icon-16.png",
    "32": "images/icon-32.png",
    "48": "images/icon-48.png",
    "128": "images/icon-128.png"
  },
  "content_scripts": [{                                     // 注入页面的内容脚本
    "js": [                                                 // js 路径配置，按数组顺序加载
      "scripts/utils.js",
      "scripts/Outline.js",
      "scripts/content.js"
    ],
    "matches": [                                            // 允许浏览器识别哪些站点将内容脚本注入
      "https:\/\/*\/*"
    ],
    "css": ["outline.css"],                                 // 样式路径
    "run_at": "document_end"                                // 内容脚本执行阶段, 默认为文档空闲时（document_idle）
  }],
  "permissions": ["scripting", "storage"],                  // 插件权限申请
  "web_accessible_resources": [                             // 插件访问资源
    {
      "matches": ["https:\/\/*\/*"],
      "resources": [
        "images/eye.svg",
        "images/eye-hidden.svg"
      ]
    }
  ],
  "action": {                                               // 控制插件的操作 e.g. 默认弹窗配置等
    "default_popup": "popup/index.html"
  },
  "background": {                                           // 后台脚本, e.g. 插件快捷键、popup、关闭选项卡等事件监听
    "service_worker": "background.js"
  },
  "commands": {                                             // 快捷键配置
    "show-outline": {
      "suggested_key": {
        "default": "Ctrl+Shift+O",
        "windows": "Ctrl+Shift+O",
        "mac": "Command+Shift+O",
        "chromeos": "Ctrl+Shift+O",
        "linux": "Ctrl+Shift+O"
      },
      "description": "Show or hide the outline."
    },
  "_execute_action": {                                    // "_execute_action" 键运行的代码与 action.onClicked() 事件相同，因此不需要额外的代码
      "suggested_key": {
        "default": "Ctrl+U",
        "mac": "Command+U"
      }
    }
  }
}
```

文档链接：

[Welcome to Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)

# Content Scripts

虽然叫做 Content Scripts ，但它并不限于 JS ，也可以包含 CSS 。我们可以通过在 manifest.json 中配置的方式，把 JS、CSS 注入到页面中去。

```json
{
 "content_scripts": [{
    "js": [                     // js 路径配置，按数组顺序加载
      "scripts/utils.js",
      "scripts/Outline.js",
      "scripts/content.js"
    ],
    "matches": [
      "https:\/\/*\/*"          // "<all_urls>" 表示匹配所有地址
    ],
    "css": ["outline.css"],     // css 路径配置
    "run_at": "document_end"    // 脚本注入的时间，可选值: "document_start" | "document_end" | "document_idle"，默认 document_idle 表示页面空闲
  }],
}
```

## ⚠️ 注意

**如果没有配置 `run_at` 为 `document_start`，下面这种代码是不会生效的：**

```js
document.addEventListener('DOMContentLoaded', function() {
  // todo
});
```

文档链接：

[Chrome extensions content scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

# Background

插件在后台运行的 js 代码，一般把「需要一直运行的」、「启动就运行的」、「全局的」代码放在 background 里面。

```json
{
 "background": {  // 配置插件在后台运行的js代码
    "service_worker": "background.js",
  "type": "module" // 使其支持 ES Module
  },
}
```

# Popup

`popup` 是点击插件图标时打开的一个弹窗页面，一般用来做一些临时性的交互或插件本身的配置。

```json
{
 "action": {
    "default_popup": "popup/index.html"
  },
}
```

# Background Script 和 Content Scripts 区别

- `background script` 是一旦插件被安装就常驻后台运行的，background 的权限非常高，几乎可以调用所有的 Chrome 扩展 API（除了 devtools）
- `content scripts` 是指定匹配的模式后，当用户访问被匹配的URL时，对应的 js 脚本会注入到页面然后自动运行，从而有能力对页面 DOM 进行操作，或者通过 API 和 `background page` 进行通信。它可以调用部分API：`chrome.i18n(国际化)`、`chrome.storage(存储)`、`chrome.runtime(运行时，部分可调用)`。

# 通信

摘自：<https://juejin.cn/post/6844903985711677453#heading-4>

## popup 和 background 之间的通信

首先，给一个大致通信图。关于 `content script`、`popup script`、`background script`，它们之间的通信总体概览图如下：

![overview](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ce44193d-0aaf-4db2-bd8d-7d2694d6db32/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230124%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230124T045648Z&X-Amz-Expires=86400&X-Amz-Signature=d285d5d206fee8a91e37b48f9d26363599fccb20e024cab9edb153b575375f19&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Untitled.png%22&x-id=GetObject)

开始吧。还是和以前一样，新建插件文件夹，增加必须的 `manifest.json` 和基本文件。

### `background` 给 `popup` 发送消息

插件的 `background` ，对于浏览器只存在一个，而对于 `popup` ，不同的 tab 就会存在一个前端，如果 `background` 需要给不同前端发送信息，就需要特殊的tab id。这里是针对 `background` 给 `popup` 传递信息。

`background.js` 添加代码:

```js
function toPopup() {
    alert('to popup!')
}
```

`popup.js` 添加代码：

```js
const bg = chrome.extension.getBackgroundPage()
document.getElementById('rBgInfo').onclick = function() {
    bg.toPopup()
}
```

在 `popup.html` 引入 `popup.js` ，并添加id为 `rBgInfo` 的按钮，安装插件，点击按钮，如果弹窗如下样式，则表明成功。

![alert popup](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2206e862-1913-496d-b1c8-3ecb9b58204b/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230124%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230124T045956Z&X-Amz-Expires=86400&X-Amz-Signature=a43c50956f0dca67095af7918b57a069854539d1b64d3aae71ceb53891b473a5&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Untitled.png%22&x-id=GetObject)

### `popup` 给 `background` 发送消息

`background => popup` 是通过 `getBackgroundPage` ，而 `popup => background` 是通过 `getViews` 。

下面就来瞧一下

**使用长连接**

在 `popup.js` 增加如下代码：

```js
// 使用长连接
let port = chrome.extension.connect({
    name: 'popup-name'
})

// 使用postMs 发送信息
port.postMessage('给 background 传递信息~')

// 接收信息
port.onMessage.addListener(msg => {
    console.log('接收的信息：', msg)
})
```

在 `background.js` 增加如下代码：

```js
// 获取所有 tab
const pups = chrome.extension.getViews({
    type: 'popup'
}) || []

// 输出第一个使用插件页面的url
if (pups.length) {
    console.log(pups[0].location.href)
}
```

点击插件刷新按钮，点击【背景页】按钮，可以看到每次点击一下插件图标，就会发送一次信息。

![send to bg](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0fc85460-ad0f-4d83-8cf2-641dd64a555c/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230124%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230124T050147Z&X-Amz-Expires=86400&X-Amz-Signature=f077af9cb79829a01591137ed323da108e29384eb15ed1fa3ec36d46aea40f3f&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Untitled.png%22&x-id=GetObject)

这也告诉了 chrome 插件的另一个机制：点击图标出现和隐藏 `popup` 弹窗页面，实际上是对整个页面的销毁，类似于关闭网页，而不是切换网页。（很重要的哦）

#### 操作 DOM

除了信息传递， `background` 可能也需要对 `popup.html` 的页面进行操作，比如检测到当前是万圣节🎃，给插件页面添加个 `happy halloween` 。

首先给 `popup.html` 增加一个text

```html
<p id="pbText">不是万圣节</p>
```

然后只需要在 `background.js` 中如下处理：

```js
// 使用长连接 - 监听 popup 传递来的消息
chrome.extension.onConnect.addListener(port => {
    console.log('连接中------------')
    port.onMessage.addListener(msg => {
        console.log('接收消息：', msg)
        getAll()
        port.postMessage('popup，我收到了你的信息~')
    })
})

// 获取所有 tab
function getAll() {
    const views = chrome.extension.getViews({
        type: 'popup'
    })

    for (let o of views) {
        console.log(111)
        o.document.getElementById('pbText').innerHTML = "万圣节🎃快乐"
    }
}
```

添加 `getAll()` 函数，将函数防止长连接即可。这里主要想展示 `chrome.extension.getViews` 函数的使用。

刷新插件，点击插件图标，就会弹窗如下页面了：

![popup page](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2f1e970a-6684-448b-bc28-2237f67e8c10/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230124%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230124T050348Z&X-Amz-Expires=86400&X-Amz-Signature=d0bbb3fad32c1cffa63ef8fb2c430f6d9dae0f4ba28bf698df81f71ae108d0be&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Untitled.png%22&x-id=GetObject)

## `popup` 和 `content` 之间的通信

有了 `background` 和 `popup` ，下面需要做的就是创建一个 `content` 页面。

`manifest` 添加下列配置

```json
{
    ...
    "content_scripts": [
        {
            "matches": [
                "<all_urls>"
            ],
            "js": [
                "content.js"
            ]
        }
    ]
}
```

### `content` 给 `popup` 发送消息

首先在 `content.js` 添加如下代码：

```js
// Chrome提供的大部分API是不支持在content_scripts中运行
// sendMessage onMessage 是可以使用
chrome.runtime.sendMessage({
    info: "我是 content.js"
}, res => {
    // 答复
    alert(res)
})
```

代码负责发送信息和接收反馈，然后给 `popup.js` 添加：

```js
chrome.runtime.onMessage.addListener((req,sender, sendResponse) => {
    sendResponse('我收到了你的来信')
    console.log('接收了来自 content.js的消息', req.info)
})
```

代码负责接收消息和发送反馈。

刷新插件，点击插件按钮，打开一个页面，保持插件 `popup` 处于活跃状态（上面讲了哈~，插件关闭等于页面销毁），然后刷新页面，会发现浏览器弹出弹窗：

![alert-popup](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b97e7eef-6086-4761-bfd6-e111311a8d74/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230124%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230124T050607Z&X-Amz-Expires=86400&X-Amz-Signature=0386014a41e7eec0b293d1bbb7029c2bf6d86ce3bdbc4dc360b5cb308f6d4df7&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Untitled.png%22&x-id=GetObject)

最后，右键插件图标，点击“审查弹窗内容”，可以看到 `content.js` 和 `popup.js` 的 `console.log` 日志（👻这等于告诉您如何调试插件~）

![console log](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/eb2d15f1-eb91-41ab-9e93-02da76acd9a3/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230124%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230124T050646Z&X-Amz-Expires=86400&X-Amz-Signature=dede02fea6330d3b777de099b0f4cc13518fefea7760111d74725fbefad6415d&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Untitled.png%22&x-id=GetObject)

弹窗说明我们的程序是成功运行的，日志打印表明我们的通信是成功的，现在我们已经知道了 `content` 给 `popup` 发送消息。

### `popup` 给 `content` 发送消息

其实上面已经告诉了  `popup` 给 `content` 发送信息了，但毕竟不是 `popup` 主动地，谈恋爱了，肯定需要主动一些了。

给 `popup` 添加如下代码，放入 `rBgInfo` 按钮点击事件：

```js

// popup ---> content
chrome.tabs.query({
    active: true,
    currentWindow: true
}, (tabs) => {
    let message = {
        info: '来自popup的情书💌'
    }
    chrome.tabs.sendMessage(tabs[0].id, message, res => {
        console.log('popup=>content')
        console.log(res)
    })
})
```

寄送一封信，`content` 得接收信：

```js
// get popup2content info
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.info)
    sendResponse('我收到了你的情书，popup~')
})
```

点击插件刷新按钮，打开页面，点击弹窗的 `rBgInfo` 按钮，日志打印如下：

![log content](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/594d0979-9b93-42fd-a049-31dd920f0966/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230124%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230124T050818Z&X-Amz-Expires=86400&X-Amz-Signature=726e193f4c530db4fd4c1cb3468224ed733c530cb2cf863376ecc992f636d972&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Untitled.png%22&x-id=GetObject)

关于 `popup` 给 `content` 的通信又又又成功了~

## `background` 和 `content` 之间的通信

`background` 和 `content` 之间的通信与 `popup` 和 `content` 类似的，写者就不写demo了，与上面一样。

## 长连接与短连接

在上面的一些demo中，可以看到通信使用了两个函数，一个就是 `sendMessage` ，另一个就是 `connect` ，其实这两个分别对应着不同的连接方式：

- 长连接： `chrome.tabs.connect` 和 `chrome.runtime.connect`
- 短连接： `chrome.tabs.sendMessage`

# 本地开发查看插件开发效果

在开发人员模式下加载未打包的插件：

1. 地址栏输入 `chrome://extensions` 打开新 tab 进入插件管理页面
   - 或者单击“扩展”菜单拼图按钮，然后在菜单底部选择“管理扩展程序”。
2. 通过单击页面右侧「开发者模式」旁边的切换开关来启用开发人员模式。
3. 单击“加载已解压的扩展程序”按钮，然后选择插件目录。

![unpacked extension](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b07234d3-a7d0-4b6d-896f-9ba067506d57/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230124%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230124T051057Z&X-Amz-Expires=86400&X-Amz-Signature=9d436c532fbcf8b494874b52874e63f9d4fe991fb93ab56589d1403a60675707&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Untitled.png%22&x-id=GetObject)

# 参考资源

- [Chrome 插件开发全攻略](https://w3ctim.com/post/33eaeb5f.html)
- [入门系列3 - background、content、popup的通信](https://juejin.cn/post/6844903985711677453)
