---
title: 使用hexo搭建个人博客
tags: hexo
categories:
  - 教程
  - 博客
abbrlink: 43303
date: 2018-03-13 14:10:09
---

## 介绍

利用 [Hexo](https://hexo.io/zh-cn/) 在 [GitHub](https://baike.baidu.com/item/github/10145341?fr=aladdin) 上搭建个人博客。

<!-- more -->

## 准备工作

你的电脑需要安装下面两个应用程序：

- NodeJS [如何安装](http://www.runoob.com/nodejs/nodejs-install-setup.html)
- Git [如何安装](http://www.runoob.com/git/git-install-setup.html)

或者直接查看 hexo 的[官方文档](https://hexo.io/zh-cn/docs/#%E5%AE%89%E8%A3%85%E5%89%8D%E6%8F%90)查看安装教程。

## 安装 Hexo

> [安装文档](https://hexo.io/zh-cn/docs/)

终端全局安装：

```
npm install -g hexo-cli
```

### 建站

安装 Hexo 完成后，请执行下列命令，Hexo 将会在指定文件夹中新建所需要的文件：

```shell
hexo init 你的站点文件夹
cd 你的站点文件夹
npm install
```

### 命令执行

下方是三个常见命令，可以先执行前俩看看效果，最后一个部署命令待会再执行。

- `hexo server -p 5000` 本地启动服务器，5000 端口
- `hexo new '你想要创建的文章名称'` 创建文章
- `hexo clean && hexo deploy` 部署网站

### 使用第三方主题

- [Next](https://github.com/iissnan/hexo-theme-next) 【推荐】
- [Yilia](https://github.com/litten/hexo-theme-yilia)

#### 安装 Next 主题

```shell
cd 你的站点目录
git clone https://github.com/next-theme/hexo-theme-next themes/next
```

## 配置

### 创建分类和标签

#### 分类

运行：

```shell
hexo new page "categories"
```

p.s. 命名为 `categories` 原因是 `categories` 在 next 主题中是一个关键词对应着分类。

在主站根目录下,也就是你 hexo 的目录下找到 `/source/categories/index.md`，打开后的效果类似下方代码：

```markdown
---
title: categories #本页标题
date: 2018-03-13 23:02:50 #创建日期
type: 'categories' #分类属于
comments: false #如果有启用多说 或者 Disqus评论，默认页面也会带有评论。需要关闭的话，请添加字段 comments 并将值设置为 false
---
```

接着在 themes 主题文件夹下找到 next 文件夹，修改 \_config.yml 文件：

```yaml
menu:
  home: / || fa fa-home
  about: /about/ || fa fa-user
  tags: /tags/ || fa fa-tags
  categories: /categories/ || fa fa-th
  archives: /archives/ || fa fa-archive
```

然后在命令行输入添加文章命令：

```
hexo new '你想要创建的文章名称'
```

根目录(主站目录下)/source/\_posts/<刚创建的文章名称>.md，双击打开：

```markdown
---
title: 文章标题
date: 2018-03-13 23:13:23
tags: html #属于哪个标签
categories: interview #属于哪个分类
---
```

#### 标签

打开命令行，进入博客所在文件夹。执行命令：

```shell
hexo new page tags
```

成功后会有一个路径提示

```shell
INFO Created: ~/Documents/blog/source/tags/index.md
```

找到对应的文件打开

```markdown
---
title: tags
date: 2018-03-14 00:02:05
---
```

添加 type: “tags”到内容中，添加后是这样的：

```markdown
---
title: 标签
date: 2018-03-14 00:03:52
type: 'tags'
comments: false
---
```

打开你的文章页面：

```markdown
---
title: jQuery对表单的操作及更多应用
date: 2019-03-14 00:03:55
categories: 前端
tags: jQuery  #如果想要多个标签可以 tags: [jQuery, 表格, 表单验证] or
- jQuery
- 表格
- 表单验证
---
```

p.s. 如果想要实现父子分类，也和标签一样的格式：

```markd
categories:
- IDE
- VSCode
```

参考：[分类和标签](https://hexo.io/zh-cn/docs/front-matter.html#分类和标签)

##### 修改文章底部 # 号标签，改为图标

寻找 `themes/next/_config.yml` 中的 tag_icon ，改为 true

### 头像设置

把头像放在站点根目录的 `source/uploads/` 下，然后在 `theme/next/_config.yml` 下修改配置：

```yaml
avatar:
  url: /uploads/avatar.png
```

### 侧边栏

#### 菜单

在 `theme/next/_config.yml` 下配置：

```yaml
menu:
  home: / || fa fa-home
  #about: /about/ || fa fa-user
  #tags: /tags/ || fa fa-tags
  #categories: /categories/ || fa fa-th
  archives: /archives/ || fa fa-archive
  #schedule: /schedule/ || fa fa-calendar
  #sitemap: /sitemap.xml || fa fa-sitemap
  #commonweal: /404/ || fa fa-heartbeat
```

#### 社交

```yaml
social:
  GitHub: https://github.com/yourname || fab fa-github
  E-Mail: mailto:yourname@gmail.com || fa fa-envelope
  Weibo: https://weibo.com/yourname || fab fa-weibo
  Google: https://plus.google.com/yourname || fab fa-google
  Twitter: https://twitter.com/yourname || fab fa-twitter
  FB Page: https://www.facebook.com/yourname || fab fa-facebook
  StackOverflow: https://stackoverflow.com/yourname || fab fa-stack-overflow
  YouTube: https://youtube.com/yourname || fab fa-youtube
  Instagram: https://instagram.com/yourname || fab fa-instagram
  Skype: skype:yourname?call|chat || fab fa-skype
```

### 阅读更多

在文章想要截断的地方添加 `<!-- more -->` ，这样在文章列表中就会只展示到截断位置为止。

## 第三方插件

### 永久 URL 生成：hexo-abbrlink

- 用来生成每篇博客永久 URL 链接的
- Repo: https://github.com/rozbo/hexo-abbrlink
- 执行： `npm install hexo-abbrlink --save`

### 部署到 GitHub：hexo-deployer-git

- 将本地博客部署到 GitHub
- Repo: https://hexo.io/zh-cn/docs/one-command-deployment)
- 执行： `npm install hexo-deployer-git --save`

**如何部署**

在 `_config.yml` 下配置：

```yaml
deploy:
  type: git
  repo: 'https://github.com/evestorm/evestorm.github.io'
  branch: 'gh-pages'
```

然后在你的 githubpages 的 repo 下新建 `gh-pages` 分支，最后执行：`hexo clean && hexo deploy` 即可部署。

### 本地热更新：hexo-server

- 服务器模块。在启动期间，Hexo 会监视文件变动并自动更新
- Repo: https://github.com/hexojs/hexo-server
- 执行： `npm install hexo-server –save`

### 关键词搜索：LocalSearch

- 本地搜索
- Repo: https://github.com/theme-next/hexo-generator-searchdb
- 执行：`npm install hexo-generator-searchdb --save`

**配置博客**

安装完成，编辑博客配置文件：`hexo/_config.yml`

```yaml
search:
  path: search.xml
  field: post
  content: true
  format: html
```

**配置主题**

Next 主题自带搜索设置，编辑主题配置文件：`_config.yml`

找到文件中 Local search 的相关配置，设为 `true`

```yaml
# Local search
# Dependencies: https://github.com/next-theme/hexo-generator-searchdb
local_search:
  enable: true
  # If auto, trigger search by changing input.
  # If manual, trigger search by pressing enter key or search button.
  trigger: auto
  # Show top n results per article, show all results by setting to -1
  top_n_per_article: 1
  # Unescape html strings to the readable one.
  unescape: false
  # Preload the search data when the page loads.
  preload: false
```

最后记得 hexo 重新部署。

### 统计分析：busuanzi_count

NexT 主题集成了不蒜子（busuanzi_count）统计功能，在 NexT 配置文件中找到关键词 `busuanzi_count:` ，把 enable 设置为 true

p.s. 除此之外，如果设置为 true 后仍然无效，且打开控制台显示 js 报错。有可能是不蒜子链接失效的原因，需要在 Next 主题配置文件位置：

```
themes\next\layout\_third-party\analytics\busuanzi-counter.swig
```

修改 script 链接为：

```html
<script
  async
  src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
></script>
```

### 评论功能：ChangYan

文档地址：https://theme-next.js.org/docs/third-party-services/comments.html#Changyan-China

- 注册登录：https://changyan.kuaizhan.com/

- 获取 APP ID 和 APP KEY

- 设置 changyan enable: true:

  ```yaml
  # changyan
  changyan:
    enable: true
    appid:
    appkey:
  ```

### 代码块复制

下载[clipboard.min.js](https://raw.githubusercontent.com/zenorocha/clipboard.js/master/dist/clipboard.min.js)并保存至`themes\next\source\js\clipboard.min.js`

在 `.\themes\next\source\js\` 下创建 `clipboard-use.js` , 添加如下内容：

```js
/*页面载入完成后，创建复制按钮*/
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  var initCopyCode = function () {
    let parents = document.querySelectorAll('.highlight .code');
    parents.forEach(parent => {
      let btn = document.createElement('button');
      let i = document.createElement('i');
      let span = document.createElement('span');
      btn.classList.add('btn-copy');
      btn.setAttribute('data-clipboard-snippet', '');
      i.classList.add('fa', 'fa-clipboard');
      span.innerText = '复制';
      i.appendChild(span);
      btn.appendChild(i);
      parent.insertBefore(btn, parent.firstChild);
    });

    new ClipboardJS('.btn-copy', {
      target: function (trigger) {
        return trigger.nextElementSibling;
      }
    });
  };
  initCopyCode();
});
```

在 `根目录\source\_data\` 下创建 `styles.styl` ，添加如下内容：

```css
// 代码块复制按钮
// --------------------------------------------------
.highlight {
  //方便copy代码按钮（btn-copy）的定位
  position: relative;
}
.btn-copy {
  display: inline-block;
  cursor: pointer;
  background-color: #eee;
  background-image: linear-gradient(#fcfcfc, #eee);
  border: 1px solid #d5d5d5;
  border-radius: 3px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-appearance: none;
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  color: #333;
  -webkit-transition: opacity 0.3s ease-in-out;
  -o-transition: opacity 0.3s ease-in-out;
  transition: opacity 0.3s ease-in-out;
  padding: 2px 6px;
  position: absolute;
  right: 5px;
  top: 5px;
  opacity: 0;
}
.btn-copy span {
  margin-left: 5px;
}
.highlight:hover .btn-copy {
  opacity: 1;
}
```

在 `source\_data\` 下创建 `body-end.swig` ，添加如下内容：

```html
<!-- 代码块复制功能 -->
<script type="text/javascript" src="/js/clipboard.min.js"></script>
<script type="text/javascript" src="/js/clipboard-use.js"></script>
```

在 next 配置文件中启用 `styles.styl` 和 `body-end.swig`：

```json
custom_file_path:
  bodyEnd: source/_data/body-end.swig
  style: source/_data/styles.styl
```

### 常用配置

[Hexo 瞎折腾系列(4) - 站点首页不显示文章全文](https://blog.csdn.net/lewky_liu/article/details/81277337)

### 常用命令

```shell
// npm全局安装Hexo
npm install -g hexo-cli

// 新建Hexo项目
hexo init <folder>
cd <folder>
npm install

// 新建文章
hexo new '文章名'

// 启动服务器
hexo server -p 5000

// 生成静态文件
hexo generate --watch

// 部署
hexo clean && hexo deploy
```

## 相关配置及资源

- [Hexo+NexT 打造一个炫酷博客](https://juejin.im/post/5bcd2d395188255c3b7dc1db#heading-42)
- [这应该是最全的 hexo 博客搭建以及 next 美化教程](https://me.idealli.com/post/e8d13fc.html)
- [LeanCloud](https://leancloud.cn/)
- [Hexo 搭建 GitHub 博客—打造炫酷的 NexT 主题–高级(四)](https://eirunye.github.io/2018/09/15/Hexo搭建GitHub博客—打造炫酷的NexT主题—高级—四/)
- [Hexo NexT 主题代码块添加复制功能](http://www.missfli.com/2018/06/19/github-hexo-next-08.html)
- [修改 hexo 博客 next 主题文章页面宽度](https://ihaoming.top/archives/9a935f57.html)
- [在 Hexo 中使用资源文件夹添加图片](https://hexo.io/zh-cn/docs/asset-folders.html)
