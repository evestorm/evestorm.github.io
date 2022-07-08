---
title: 使用Jekyll搭建GitHubPages博客
tags: Jekyll
categories:
  - 教程
  - 博客
abbrlink: 63074
date: 2020-11-16 23:06:43
---

## 安装 Jekyll

来源：https://jekyllrb.com/docs/installation/

<!-- more -->

### macOS

终端运行：

```shell
xcode-select --install
```

安装 Ruby：

Jekyll 依赖 Ruby v2.5.0+，如果你的 macOS 版本为 Catalina 10.15 或以上，则不需要再手动安装，因为系统自带 Ruby 2.6.3 。

> 查看本地 Ruby 版本：`ruby -v`
>
> 如果你的版本低于 10.15 则需要下载或更新你的 Ruby
>
> 具体下载or更新方案可查看：https://jekyllrb.com/docs/installation/macos/#install-ruby

安装 Jekyll：

```shell
gem install --user-install bundler jekyll
```

选择你要安装博客的目录下运行：

```shell
jekyll new 你博客名(随意，反正最后要全部移动到你的githubpages repo下)
```

### Windows

windows安装不再赘述，可查看官网文档安装：https://jekyllrb.com/docs/installation/windows/

## 安装 minimal-mistakes-jekyll 主题

github 链接：https://github.com/mmistakes/minimal-mistakes

### 编辑 Gemfile

替换你的 `Gemfile` 文件：

```json
source "https://rubygems.org"

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!

# gem "github-pages", group: :jekyll_plugins

# To upgrade, run `bundle update`.

gem "github-pages", group: :jekyll_plugins
gem "minimal-mistakes-jekyll", :github => "mmistakes/minimal-mistakes"

# The following plugins are automatically loaded by the theme-gem:
#   gem "jekyll-paginate"
#   gem "jekyll-sitemap"
#   gem "jekyll-gist"
#   gem "jekyll-feed"
#   gem "jekyll-include-cache"
#
# If you have any other plugins, put them here!
group :jekyll_plugins do
end
```

运行 `bundle install` 安装依赖。

### 配置 _config.yml

找到 `_config.yml` 文件并替换：

```shell
# Welcome to Jekyll!
#
# This config file is meant for settings that affect your whole blog, values
# which you are expected to set up once and rarely edit after that. If you find
# yourself editing this file very often, consider using Jekyll's data files
# feature for the data you need to update frequently.
#
# For technical reasons, this file is *NOT* reloaded automatically when you use
# 'bundle exec jekyll serve'. If you change this file, please restart the server process.
#
# If you need help with YAML syntax, here are some quick references for you: 
# https://learn-the-web.algonquindesign.ca/topics/markdown-yaml-cheat-sheet/#yaml
# https://learnxinyminutes.com/docs/yaml/
#
# Site settings
# These are used to personalize your new site. If you look in the HTML files,
# you will see them accessed via {{ site.title }}, {{ site.email }}, and so on.
# You can create any custom variable you would like, and they will be accessible
# in the templates via {{ site.myvariable }}.

title: Your awesome title
email: your-email@example.com
description: >- # this means to ignore newlines until "baseurl:"
  Write an awesome description for your new site here. You can edit this
  line in _config.yml. It will appear in your document head meta (for
  Google search results) and in your feed.xml site description.
baseurl: "" # the subpath of your site, e.g. /blog
url: "https://evestorm.github.io" # the base hostname & protocol for your site, e.g. http://example.com
repository: "{github_username}/{github_username}.github.io" # 把 {github_username} 替换成你github的username
twitter_username: jekyllrb
github_username:  lance # 你的username，随便填

# Build settings
theme: minimal-mistakes-jekyll
plugins:
  - jekyll-feed

# Exclude from processing.
# The following items will not be processed, by default.
# Any item listed under the `exclude:` key here will be automatically added to
# the internal "default list".
#
# Excluded items can be processed by explicitly listing the directories or
# their entries' file path in the `include:` list.
#
# exclude:
#   - .sass-cache/
#   - .jekyll-cache/
#   - gemfiles/
#   - Gemfile
#   - Gemfile.lock
#   - node_modules/
#   - vendor/bundle/
#   - vendor/cache/
#   - vendor/gems/
#   - vendor/ruby/

```

然后执行 `bundle update`。

### 替换和更改

- 替换根目录下 `index.markdown` 为 `index.html`  ：

  ```html
  ---
  layout: home
  author_profile: true
  ---
  ```

- 找到 `_posts/0000-00-00-welcome-to-jekyll.md` 并替换 `layout: single`

- 删除 `about.md` 文件

最后执行： `bundle exec jekyll serve` 本地运行博客。


