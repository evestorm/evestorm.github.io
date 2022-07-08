---
title: 【转载】如何在Mac上配置一个本地Web服务器
categories:
  - 后端
  - 服务器
abbrlink: 28116
date: 2019-04-07 13:30:54
tags:
---

来源：https://shannonchenchn.github.io/2018/10/22/How-do-you-set-up-a-local-web-server-on-Mac/

<!-- more -->

## 目录

- 我们为什么需要服务器？
  - 1. 本地文件 VS. 远程文件
  - 1. 直接访问本地文件时存在的问题
- 方法一、启动 Mac 自带的 Apache 服务器
- 方法二：使用 Python 的 SimpleHTTPServer 模块启动服务器

### 我们为什么需要服务器？

#### 1. 本地文件 VS. 远程文件

通常情况下，你可以通过在浏览器中直接打开或者通过一个 URL 来访问一个文件。

使用浏览器访问本地文件时，一般地址是 `file://` 开头的本地文件地址。
而访问远程文件时，一般地址是 `http://` 或者 `https://` 开头的地址，表示这个文件通过 http 协议访问的。

#### 2. 直接访问本地文件时存在的问题

在有些情况下，你打开一个本地的 html 文件时，会出现运行错误。

导致这些错误的原因主要有以下两个：
（1） 其中包含了异步请求。 如果你直接打开本地文件运行，一些浏览器（包括 Chrome）将不会运行其中的异步请求（请参阅 从服务器获取数据）。 这是因为安全限制而导致的（更多关于 Web 安全的信息，请参阅[Website security](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security)）。

比如，你直接在浏览器中打开含有如下内容的文件：

```html
<html>
  <head>
    <script>
      var request = new XMLHttpRequest();

      request.onreadystatechange = function () {
        console.log(request);
      };

      // 发送请求:
      request.open('GET', './data.json');
      request.send();
    </script>
    <title>HTML 测试页面</title>
  </head>

  <body>
    <p>测试页面</p>
  </body>
</html>
```

然后，你会在 console 中看到这样的错误：

```shell
index.html:12 Failed to load file:///Users/ShannonChen/Desktop/Playground/nodejs_example/data.json: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https.
```

（2） 执行文件中的代码时需要通过执行一些附加逻辑（如 PHP 或 Python）才能获得结果，而不仅仅是直接访问一个文件。

比如，我登录了京东网站后，查看购物车页面时，需要服务器返回的是包含我的购物车数据的页面，这个时候，就需要服务端在接收到请求后，跟我的用户信息（一般是 cookie）来返回匹配的数据。

### 方法一、启动 Mac 自带的 Apache 服务器

1. 运行 Apache `$ sudo apachectl start`
2. 退出 Apache `$ sudo apachectl stop`
3. 把工程文件夹放到以下位置中 `/Library/WebServer/Documents`
4. 在浏览器中访问：在地址栏中输入地址 `http://localhost/工程文件夹名称/`，回车。

**注意：** 不再需要使用后一定要记得退出，否则会消耗电脑性能。

Q：如何修改 Apache 的默认端口？
A：首先，找到 Apache 的配置文件，位于 `/etc/apache2` 下的 `httpd.conf`。
然后，找到 `Listen 80` 那一行，修改成你想要的端口即可。

### 方法二：借助 Mac 系统自带的 Python，使用其中的 SimpleHTTPServer 模块启动服务器

1. 安装 Python，其实 Mac 系统就自带了 Python2.7。

2. 通过 `cd <your-working-dir>` 进入到你的工作目录下，也就是你要让别人访问的文件所在的目录。

3. 在工作目录下执行下面的命令后，就可以启动服务了：

   ```shell
   # 如果你的 Python 版本是 3.X
   python3 -m http.server

   # 如果你的 Python 版本是 2.X
   python -m SimpleHTTPServer
   ```

4. 默认情况下，上面的操作将会在本地 Web 服务器上的端口 8000 上运行工作目录中的内容。您可以通过在浏览器中输入 URL `http://localhost:8000` 并回车，来访问此服务器。你会看到列出的目录的内容，点击就可以查看你想运行的 HTML 文件。

Q：如何修改服务器的默认端口？
A：可以通过运行下面的命令来指定一个端口号：

```shell
# 如果你的 Python 版本是 3.X
python -m http.server <your-port>

# 如果你的 Python 版本是 2.X
python -m SimpleHTTPServer <your-port>
```

### 结论

方法二相比方法一来说，更简单、方便，也更灵活，而且还可以随时在终端上看到服务器的状态。

### 参考

- [How do you set up a local testing server? - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server)（推荐阅读）
- [Mac OS X 启用 Web 服务器](https://www.jianshu.com/p/d006a34a343f)
- [Mac 自带的本地服务器的使用](http://www.jianshu.com/p/90d5fa728861)
- [Mac OS 原来自带了 apache，基本用法总结](https://blog.csdn.net/seafishyls/article/details/44546809)
