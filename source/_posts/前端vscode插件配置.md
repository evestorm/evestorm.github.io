---
title: 前端vscode插件配置
tags: VSCode
categories:
  - 工具
  - IDE
abbrlink: 11039
date: 2018-05-06 12:14:33
---

先把下面插件都安装下，最后使用 `settings.json` 去覆盖你本地自己的文件。

### 外观配置

- **主题**：
  - [Chester Atom](https://marketplace.visualstudio.com/items?itemName=chriseckenrode.vscode-chester-atom)
  - [One Monokai Theme](https://marketplace.visualstudio.com/items?itemName=azemoh.one-monokai) [目前在使用]
- **图标**：[VSCode Great Icons](https://marketplace.visualstudio.com/items?itemName=emmanuelbeziat.vscode-great-icons)
- **字体**：[Fira Code](https://github.com/tonsky/FiraCode/wiki)

<!-- more -->

#### 预览

{% asset_img vscode-theme.png UI-Show %}

### 风格检查、格式化

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) JS 代码审查工具
- [StyleLint](https://marketplace.visualstudio.com/items?itemName=shinnn.stylelint) CSS 代码审查工具
- [MarkdownLint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) Markdown 代码审查工具
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 代码格式化工具
- [Beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify) 代码格式化工具
- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) Vue 开发工具

### 编码效率

#### 代码片段

- [HTML Snippets](https://marketplace.visualstudio.com/items?itemName=abusaidm.html-snippets) HTML 代码智能提示
- [Javascript (ES6) Code Snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets) ES6 代码智能提示
- [Javascript Patterns Snippets](https://marketplace.visualstudio.com/items?itemName=nikhilkumar80.js-patterns-snippets) JavaScript 代码提示
- [Document This](https://marketplace.visualstudio.com/items?itemName=joelday.docthis)，一键给代码中的类、函数加上注释，支持函数声明、函数表达式、箭头函数等；

#### 代码补全

- [Auto Close Tag](https://link.juejin.im/?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dformulahendry.auto-close-tag)，在打开标签并且键入 `</` 的时候，能自动补全要闭合的标签；
- [Auto Rename Tag](https://link.juejin.im/?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dformulahendry.auto-rename-tag)，在修改标签名时，能在你修改开始（结束）标签的时候修改对应的结束（开始）标签。
- [Path Intellisense](https://link.juejin.im/?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dchristian-kohler.path-intellisense)，文件路径补全，在你用任何方式引入文件系统中的路径时提供智能提示和自动完成。
- [NPM Intellisense](https://link.juejin.im/?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dchristian-kohler.npm-intellisense)，NPM 依赖补全，在你引入任何 node_modules 里面的依赖包时提供智能提示和自动完成。
- [IntelliSense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion)，CSS 类名补全，会自动扫描整个项目里面的 CSS 类名并在你输入类名时做智能提示。
- [Emmet](https://link.juejin.im/?target=https%3A%2F%2Femmet.io)，VSCode 已经内置，官方介绍文档[参见](https://link.juejin.im/?target=https%3A%2F%2Fcode.visualstudio.com%2Fdocs%2Feditor%2Femmet)。
- [Auto Import](https://marketplace.visualstudio.com/items?itemName=steoates.autoimport)，自动查找、解析并提供所有可导入（import）的代码文件
- [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) 代码注释高亮
- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost) 显示导入的包的大小
- [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense) 智能识别引用文件路径
- [Template String Converter](https://marketplace.visualstudio.com/items?itemName=meganrogge.template-string-converter) 字符串中添加变量时，自动转为模板字符串形式
- [Vue VSCode Snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets) Vue 代码补全

#### 代码运行

- [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner) 代码一键运行
  <!-- [![Code Runner](前端vscode插件配置/162c15a64b468fd8.gif)](https://user-gold-cdn.xitu.io/2018/4/14/162c15a64b468fd8?imageslim) -->
  {% asset_img 162c15a64b468fd8.gif Code-Runner %}

### 功能增强

- [Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)，基于 Gist 实现 VSCode 用户配置、快捷键配置、已安装插件列表等的备份和恢复功能，配置过程有详细精确的操作步骤文档。生成的备份 Gist 默认是私密的，如果你想设置为共享的，也可以一键切换。
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) 代码拼写检查
- [Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory) 查看文件 Git 历史记录
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 开启本地服务器
- [Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync) 同步 vscode 配置
- [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) Git 源代码管理工具

### 外观增强

- [TODO Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight)
  维护时间稍长的代码仓库免不了会有各种 TODO、FIXME、HACK 之类的标记，TODO Highlight 能够帮我们把这些关键词高亮出来，在你翻阅代码时非常醒目，就像是在大声提醒你尽快把他解决掉。支持自定义配置需要高亮的关键词，实际使用比较坑的地方是，TODO、FIXME 之类的后面必须加上冒号，否则无法高亮。
  <!-- [![TODO Highlight](前端vscode插件配置/1)](https://user-gold-cdn.xitu.io/2018/4/14/162c1592cecf92d8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1) -->
  {% asset_img 1.png TODO-Highlight %}
- [Color Highlight](https://link.juejin.im/?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dnaumovs.color-highlight)，识别代码中的颜色，包括各种颜色格式。
- [Bracket Pair Colorizer Bracket Pair Colorizer 2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2)，识别代码中的各种括号，并且标记上不同的颜色，方便你扫视到匹配的括号。

#### 用户设置（User Settings）

```json
{
  "editor.fontSize": 14, // 编辑器字体大小
  "bracket-pair-colorizer-2.showBracketsInGutter": true,
  "workbench.iconTheme": "vscode-great-icons", // 文件icon图标
  "sync.gist": "e9262ee54aa0988ee98c24e6be1dada1",
  "workbench.colorTheme": "One Monokai", // 主题
  "editor.fontFamily": "'Fira Code', Menlo, Monaco, 'Courier New', monospace",
  "editor.fontLigatures": true, // 这个控制是否启用字体连字，true启用，false不启用，这里选择启用
  // 新增配置

  "editor.formatOnSave": true, // #每次保存的时候自动格式化
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }, // 每次保存的时候将代码按eslint格式进行修复
  "editor.tabSize": 2, // 重新设定tabSize
  "prettier.semi": true, // 添加代码结尾的分号
  "prettier.singleQuote": true, // 使用单引号替代双引号
  "prettier.arrowParens": "avoid", // 箭头函数参数只有一个时是否要有小括号。
  // avoid - 省略括号
  // always - 总是不省略
  "prettier.htmlWhitespaceSensitivity": "ignore", // 指定 HTML 文件的全局空白区域敏感度
  // "css"- 遵守 CSS display属性的默认值。
  // "strict" - 空格被认为是敏感的。
  // "ignore" - 空格被认为是不敏感的。
  // html 中空格也会占位，影响布局，prettier 格式化的时候可能会将文本换行，造成布局错乱

  // --------------- html -----------------
  //  <a href="https://prettier.io/">Prettier is an opinionated code formatter.</a>
  //  <!-- 变成 -->
  //  <!-- "Prettier is an opinionated code formatter. " 另起一行，在页面的布局上就会多一个节点文本出来 -->
  //  <a href="https://prettier.io/">
  //    Prettier is an opinionated code formatter.
  //  </a>
  // --------------- html -----------------
  "prettier.jsxBracketSameLine": true, // 将 > 多行 JSX 元素放在最后一行的末尾，而不是单独放在下一行（不适用于自闭元素）。
  // true - 放最后一行末尾
  // false - 单独放在末尾的下一行
  "prettier.bracketSpacing": true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
  "prettier.trailingComma": "none", // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
  "javascript.preferences.quoteStyle": "single", // JS格式化设置单引号
  "typescript.preferences.quoteStyle": "single", // TS格式化设置单引号
  "javascript.format.insertSpaceBeforeFunctionParenthesis": false, // 让函数(名)和后面的括号之间加个空格
  // 配置 ESLint 检查的文件类型
  "eslint.validate": ["javascript", "vue", "html"],
  "eslint.options": {
    // 指定vscode的eslint所处理的文件的后缀
    "extensions": [".js", ".vue", ".ts", ".tsx"]
  },
  //一定要在vutur.defaultFormatterOptions参数中设置，单独修改prettier扩展的设置是无法解决这个问题的，因为perttier默认忽略了vue文件（事实上从忽略列表移除vue也不能解决这个问题）
  "vetur.format.defaultFormatterOptions": {
    "prettier": {
      "semi": true, // 格式化末尾加分号
      "singleQuote": true, // 格式化以单引号为主
      "trailingComma": "none" // 是否末尾自动添加逗号（数组，json，对象）
      // "es5" - 在ES5中的对象、数组等最后一个元素后面加逗号
      // "none" - 不加逗号
      // "all" - 尽可能都加逗号 (包括函数function的参数).
    }, // 配置文档：https://prettier.io/docs/en/options.html
    "js-beautify-html": {
      // force-aligned | force-expand-multiline vue html代码格式化
      "wrap_attributes": "force-aligned", // 对除第一个属性外的其他每个属性进行换行，并保持对齐
      // - auto: 仅在超出行长度时才对属性进行换行。
      // - force: 对除第一个属性外的其他每个属性进行换行。
      // - force-aligned: 对除第一个属性外的其他每个属性进行换行，并保持对齐。
      // - force-expand-multiline: 对每个属性进行换行。
      // - aligned-multiple: 当超出折行长度时，将属性进行垂直对齐。
      "wrap_line_length": 200, // 换行长度
      "wrap_width_line": false, // 根据行宽换行
      "semi": false, // 格式化不加分号
      "singleQuote": true // 格式化使用单引号
    },
    "prettyhtml": {
      "printWidth": 200, // 每行最多多少字符换行
      "singleQuote": false, // 格式化使用单引号
      "wrapAttributes": false, // 强制属性换行
      "sortAttributes": true // 按字母顺序排序属性
    } // 配置文档：https://github.com/Prettyhtml/prettyhtml
  },
  "vetur.format.defaultFormatter.html": "js-beautify-html", // 使用 js-beautify-html 格式化 html
  "vetur.format.defaultFormatter.js": "prettier", // 使用 prettier 格式化 js
  "[vue]": {
    "editor.defaultFormatter": "octref.vetur" // 使用 vetur 格式化 vue
  },
  "path-intellisense.mappings": {
    "@": "${workspaceRoot}/src"
  },
  "liveServer.settings.donotShowInfoMsg": true,
  "editor.quickSuggestions": {
    "strings": true
  } // Vue路径提示配置
}
```
