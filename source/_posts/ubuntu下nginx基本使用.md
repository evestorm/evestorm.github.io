---
title: ubuntu下nginx基本使用
tags:
  - 笔记
  - Nginx
  - Ubuntu
categories:
  - 后端
  - 服务器
abbrlink: 36876
date: 2019-06-21 20:29:08
---

## 安装 Nginx

终端键入以下命令：

```shell
sudo apt update
sudo apt install nginx
```

安装完成后查看版本：

```shell
sudo nginx -v
```

输出：

```shell
nginx version: nginx/1.14.0 (Ubuntu)
```

<!-- more -->

## 配置防火墙

如果你服务器打开了防火墙，则还需要打开端口 80 和 443。然后键入：

```shell
sudo ufw allow 'Nginx Full'
```

你可以通过下面方式验证更改：

```shell
sudo ufw status
```

如果出现：

```shell
Nginx Full                ALLOW      Anywhere
Nginx Full (v6)            ALLOW      Anywhere (v6)
```

就说明更改成功。

## 测试安装

浏览器中打开 [http://your_ip](http://your_ip/) ，就能够看到默认的 Nginx 欢迎页面

## 使用 systemctl 管理 Nginx 服务

你可以像任何其他 systemd 命令一样管理 Nginx 服务。 要停止 Nginx 服务，运行：

```shell
sudo systemctl stop nginx
```

要再次启动，请键入：

```shell
sudo systemctl start nginx
```

重新启动 Nginx 服务：

```shell
sudo systemctl restart nginx
```

在进行一些配置更改后重新加载 Nginx 服务：

```shell
sudo systemctl reload nginx
```

如果你想禁用 Nginx 服务在启动时启动：

```shell
sudo systemctl disable nginx
```

并重新启用它：

```shell
sudo systemctl enable nginx
```

以上参考来源：[如何在 Ubuntu 18.04 上安装 Nginx](https://www.linuxidc.com/Linux/2018-05/152257.htm)

## 配置 404

`/etc/nginx/sites-enabled/default` 中添加：

```json
server {
  listen 80 default_server;
  listen [::]:80 default_server ipv6only=on;

  . . .

  error_page 404 /custom_404.html; # 也可以跳转一个其他页面：http://www.baidu.com
  location = /custom_404.html {
          root /usr/share/nginx/html;
          internal;
          allow 118.232.21.221; # 允许谁访问
          deny 118.245.21.123; # 禁止这个 ip 访问
          # 如果有 deny all 这样一个命令，且在 allow 代码的上方，那么即使写了 allow 也不会生效。
  }

  location = /img {
    allow all; # 允许所有人访问(p.s. 当服务器根目录没有img文件夹时，会跳转404页面)
  }
  location = /admin {
    deny all; # 假如有个admin目录，不希望被人访问时设置。当有人访问时，报403禁止访问错误
  }
  location ~ \.php$ {
    deny all; # 正则表达式匹配的方式禁止他人访问 .php 结尾的文件
  }
}
```

参考：[使用 Nginx 的 error_page 指令自定义 404 50x 错误页面](https://www.centos.bz/2017/03/nginx-error_page-custom-404-50x/)

## 关闭自启服务，比如打印机

先安装一个类 GUI 软件，可以管理自启：

```shell
sudo apt-get. install sysv-rc-conf
```

输入命令 sysv-rc-conf，可以管理开机启动程序。
带 x 的都是开机启动的

参考：[如何关闭 ubuntu 不必要的开机启动程序](https://zhidao.baidu.com/question/509705858.html)

## 配置虚拟主机：

p.s. 默认 nginx 网站根目录为 `var/www/html`

### 基于端口号的配置

进入 `etc/nginx/sites-available` 目录下，新建一个配置，命名为 test ：

```shell
vim test
```

> test

```shell
# server配置
server {
  listen 8001; # 每行命令结束别忘了加 ; 分号
  listen [::]:8001;

  server_name localhost;    #你配置的对应的域名
  root /var/www/html/html8001;    #记得在该目录下新建这个文件夹以及默认index.html文件

  # 你的默认index文件
  index index.html
  #你的root文件所在的地址
  location / {
  	try_files $uri $uri/ =404;
  }
}
```

保存退出。

然后在终端停掉 nginx 再重开：

```shell
nginx -s quit
nginx
```

**❗️ 注意：**如果你开启了防火墙，记得把配置的 8001 端口开放出来：

```shell
sudo ufw allow 8001/tcp
```

另外还需在阿里云的安全组规则中把 8001 端口开发出来。

### 基于 IP 的配置

把上面 test 文件中的 `server_name` 改为你的其他 IP 就好。

### 基于域名的配置

还是以上面的 `test` 文件为例，只需要把 `server_name` 改为你的域名就好。

除此之外，你还需要配置域名解析，例如你使用了阿里云 ECS，那么你需要访问阿里云的域名解析添加记录：

在阿里云的控制台中找到域名管理，然后选择顶级域名 evelance.cn 后面的“解析”字样。在新打开的页面中我们可以看到一个提供域名解析的界面，选择解析类型为 A 类解析，然后输入 mall（我们想要的二级域名的头），然后在地址里面输入我们刚才查看到的 ECS 的公网 ip，然后点击确认，之后我们的解析就会生效了。

## 使用 Nginx 反向代理

仍然以 `test` 文件为例，示例配置如下：

```shell
server {
  listen 8001;
  listen [::]:8001;

  server_name nginx.evelance.cn;

  location / {
    proxy_pass http://www.bilibili.com;
  }
}
```

## Nginx 适配 PC 和移动设备

1. 在 `/var/www/` 目录下新建两个文件夹，分别为：`pc` 和 `mobile` 目录：

   ```shell
   cd /var/www
   mkdir pc
   mkdir mobile
   ```

2. 分别在两个目录下新建 `index.html` 文件并对应键入下面文字以示区分：

   ```html
   <h1>我是PC</h1>
   <h1>我是Mobile</h1>
   ```

3. 进入 `/etc/nginx/sites-enabled/` 目录，还是以 `test` 文件作为示例：

   ```json
   server {
     listen 8001;
     listen [::]:8001;

     server_name nginx.evelance.cn;

     location / {
       root /var/www/pc;
       if ($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') {
         root /var/www/mobile;
       }
       index index.html;
     }
   }
   ```

4. 重启 nginx ：

   ```shell
   nginx -s quit
   nginx
   ```

## 启用 gzip

进入 `/etc/nginx` 目录，通过 vim 编辑 `nginx.conf` 文件：

```shell
cd /etc/nginx
vim nginx.conf
```

找到 Gzip Settings 项，发现 nginx 默认是开启 gzip 的：

```shell
gzip on;
```

但我们发现 gzip_types 配置项是被注释了的，所以我们只需要解开注释就好：

```shell
gzip_types text/plain text/css application/json application/javascript text/html application/xml text/javascript;
```

最后重启 nginx

```shell
nginx -s quit
nginx
```
