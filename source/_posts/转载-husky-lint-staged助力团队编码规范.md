---
title: 转载-husky+lint-staged助力团队编码规范
tags:
  - 工具
  - 转载
categories:
  - 工具
  - IDE
abbrlink: 63036
date: 2021-03-11 20:22:21
---

转载自：https://neveryu.github.io/2020/06/10/husky-lint-staged/

## 快速集成

在提交 git 之前，我们需要校验我们的代码是否符合规范，如果不符合，则不允许提交代码。

首先，安装依赖：

```shell
npm install -D husky

// lint-staged 可以让husky只检验git工作区的文件，不会导致你一下出现成百上千个错误
npm install -D lint-staged
```

<!-- more -->

然后修改 `package.json`，增加配置：

```json
"scripts": {
 "precommit": "eslint src/**/*.js"
}
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "src/**/*.{js,vue}": ["prettier --write", "eslint --cache --fix", "git add"]
}
```

在 `git commit` 之前会进入 工作区文件的扫描，执行 `prettier` 脚本，修改 `eslint` 问题，然后重要提交到工作区。

## 深入了解

# 了解 githooks

Git Hooks 就是在 Git 执行特定事件（如 commit、push、receive 等）时触发运行的脚本，类似于“钩子函数”，没有设置可执行的钩子将被忽略。

在项目的 `.git/hooks` 目录中，有一些 `.sample` 结尾的钩子示例脚本，如果想启用对应的钩子，只需手动删除后缀，即可。（删除某一个 hook 的后缀 `.sample` 即可启用该 hook 脚本，默认是不启用的。）

【但是，我们一般不去改动 `.git/hooks` 里面的文件，因为我们使用 husky 】

# husky

- husky 的安装

```shell
npm i husky -D --registry=https://registry.npm.taobao.org
```

husky 在安装过程中会在 `.git/hooks` 文件夹中生成一系列的 `git hook` 脚本。

> 需要注意的是：你要留意 husky 的安装信息，是否为你安装了 `git` 钩子。

如果安装正确的话，可以看到 husky 会打印出如下消息：

```shell
> node husky install
husky > setting up git hooks
husky > done
```

h{% asset_img husky-2.png husky-2 %}

但也有可能：

{% asset_img husky-1.png husky-1 %}

这个就是由于电脑 `node` 版本的原因，跳过了 Git 钩子安装，相当于是没有安装成功哦~

OK，假设你的 husky 安装是正常的，那么 husky 为你安装的 hooks 将会生效。这样我们在 `git commit` 的时候会触发 `pre-commit` 钩子从而触发到 huksy。

我们在 `package.json` 文件中配置 husky 的钩子需要执行的 命令 或 操作。

```js
"husky": {
  "hooks": {
    "pre-commit": "echo \"git commit trigger husky pre-commit hook\" "
  }
}
```

这样，在 `git commit` 的时候就会看到 `pre-commit` 执行了。

{% asset_img husky-3.png husky-3.png %}

从 1.0.0 开始，husky 的配置可以使用 `.huskyrc`、`.huskyrc.json`、`.huskyrc.js` 或 `husky.config.js` 文件

## 钩子中执行多个命令

- 根据 npm script 的规则，使用 &&

  ```js
  "husky": {
    "hooks": {
      "pre-commit": "echo \"git commit trigger husky pre-commit hook\" && npm run test"
    }
  }
  ```

- 如果您更喜欢使用数组，建议的方法是在 `.huskyrc.js` 中定义它们

  ```js
  const tasks = arr => arr.join(' && ');

  module.exports = {
    hooks: {
      'pre-commit': tasks(['npm run lint', 'npm run test'])
    }
  };
  ```

## hook 拦截

为了阻止提交，`pre-commit` 脚本必须以非零的退出代码退出。

如果您的提交未被阻止，请检查脚本退出代码。

当然 husky 不止能验证 `commit` ，也可以进行 `push` 等其他操作验证，这里就不一一举例了，具体可以参照 [npm husky](https://www.npmjs.com/package/husky) 。

---

# lint-staged

`lint-staged` 是一个在 git 暂存文件上（也就是被 `git add` 的文件）运行已配置的 linter（或其他）任务。`lint-staged` 总是将所有暂存文件的列表传递给任务。

```js
// package.json

"lint-staged": {
  "src/**/*.{js,vue}": [
    "prettier --write",
    "eslint --cache --fix",
    "git add"
  ]
}
```

这里 lint-staged 的配置是：在 git 的待提交的文件中，在 src 目录下的所有 `.js` `.vue` 都要执行三条命令。前两条一会儿说，后一条是将处理过的代码重新 add 到 git 中。

结合我们前面介绍的 husky，配合 husky 的 pre-commit 钩子，将会形成一个自动化工具链。

```js
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "src/**/*.{js,vue}": ["prettier --write", "eslint --cache --fix", "git add"]
}
```

在 commit 之前，将暂存区的内容做一次 代码检查 和 代码美化，然后再添加到暂存区；然后再 commit，完美！！

从 v3.1 开始，您现在可以使用不同的方式进行 lint-staged 配置：

- lint-staged 在你的对象 package.json
- .lintstagedrc JSON 或 YML 格式的文件
- lint-staged.config.js JS 格式的文件
- 使用 –config 或 -c 标志传递配置文件

# mrm

[mrm](https://github.com/sapegin/mrm) 是一个自动化工具。**推荐**

它将根据 package.json 依赖项中的代码质量工具来安装和配置 husky 和 lint-staged，因此请确保在此之前安装并配置所有代码质量工具，如 Prettier 和 ESlint

安装 mrm 并执行 lint-staged 任务：

```shell
npm i mrm -D --registry=https://registry.npm.taobao.org
npx mrm lint-staged
```

[mrm 文档、mrm api doc](https://mrm.js.org/)

# 关于 prettier 的问题

prettier 是一个很好的格式化代码的插件，但对已经有一定迭代完成度的代码不推荐使用。使用该插件后，它会将原有的代码也进行格式化，造成很多不可知的问题，我就是前车之鉴，使用 prettier 后，原本已经没有 eslint 问题的代码，又多出了更多的不知道什么原因的报错，只能将代码回退处理。

所以，这也就是我们为什么在 `lint-staged` 中，执行 `prettier` 的原因。
