---
title: VSCode+Vue项目Ctrl加V自动格式化代码
tags:
  - VSCode
categories:
  - 工具
  - IDE
abbrlink: 22469
date: 2020-11-23 13:48:36
---

## 背景

期望多人开发 Vue 项目时，大家的代码风格保持一致。并且在 VSCode 中，Ctrl+V 保存代码时自动按照 eslint 规范格式化代码。

## 插件安装

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)

<!-- more -->

## 配置 VSCode 用户 Settings.json

### 打开方式

1. 文件——>首选项——>设置
2. Ctrl+P 搜索 settings.json

### 添加配置

> 有注释的才需要添加，其他没注释的可以不用管

```json
{
  "editor.fontSize": 14,
  "bracket-pair-colorizer-2.showBracketsInGutter": true,
  "workbench.iconTheme": "material-icon-theme",
  "sync.gist": "e9262ee54aa0988ee98c24e6be1dada1",
  "workbench.colorTheme": "Atom One Dark",
  "editor.fontFamily": "'Fira Code', Menlo, Monaco, 'Courier New', monospace",

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
  "editor.fontFamily": "'Fira Code', Menlo, Monaco, 'Courier New', monospace",
  "path-intellisense.mappings": {
    "@": "${workspaceRoot}/src"
  } // Vue路径提示配置
}
```

## 配置 .eslintrc.js

Vue 项目的根目录下创建 .eslintrc.js ：

```js
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', 'airbnb-base/legacy'],
  rules: {
    // 文档：https://cn.eslint.org/docs/rules/
    'generator-star-spacing': 'off', // 强制 generator 函数中 * 号周围使用一致的空格
    // 开发模式允许使用console
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 开发环境允许使用调试 (生产模式禁用)
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 禁止使用 var
    'no-var': 'error',
    'padded-blocks': 'off', // 代码块中避免多余留白
    'comma-dangle': ['error', 'never'], // 是否允许对象中出现结尾逗号
    'no-undef': 0, // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
    quotes: 0, // 强制使用一致的反勾号、双引号或单引号 (0: double, 1: single, 2: backtick)
    eqeqeq: 'off', //  关闭 (要求使用 === 和 !==) 的校验
    'eol-last': 'off', // 要求或禁止文件末尾存在空行
    indent: 0, // 忽略强制使用一致的缩进
    'no-tabs': 0, // 忽略tab检查
    'no-mixed-spaces-and-tabs': 0 // 忽略检查当空格用于对齐时，允许混合制表符和空格。
  }
};
```

npm 安装 `eslint-config-airbnb-base` ：

```shell
npm info "eslint-config-airbnb-base@latest" peerDependencies
```

在 `.eslintrc.js` 中添加（上面配置已添加）：

```js
"extends": "airbnb-base/legacy"
```
