---
title: 移动端h5下载excel
tags:
  - excel
categories:
  - 前端
  - 解决方案
abbrlink: 4314
date: 2022-12-28 12:01:48
---

由于要兼容 iOS 和 Android 的关系，所以移动端的 excel 下载得后端生成文件并给到移动端静态文件地址，让移动端能够跳转下载再预览。

<!-- more -->

这里给出前端 js demo 代码：

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <button
      onclick="download('https://workwxconnect.test.upchina.com/files/2022-12-22/2022122209351768.xls')"
    >
      下载
    </button>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
      function download(url, params = {}) {
        let tempForm = document.createElement("form");
        tempForm.action = url;
        tempForm.method = "get";
        tempForm.style.display = "none";
        for (var x in params) {
          let opt = document.createElement("textarea");
          opt.name = x;
          opt.value = params[x];
          tempForm.appendChild(opt);
        }
        document.body.appendChild(tempForm);
        tempForm.submit();
        return tempForm;
      }
    </script>
  </body>
</html>

```
