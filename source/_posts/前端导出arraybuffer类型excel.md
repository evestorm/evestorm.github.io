---
title: 前端导出arraybuffer类型excel
tags:
  - excel
  - arraybuffer
categories:
  - 前端
  - 解决方案
abbrlink: 37594
date: 2022-12-14 14:07:57
---

后端返回数据如下:

{% asset_img arraybuffer.png 100% %}

需要前端处理转为 excel 下载，记录下方案

<!-- more -->

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <button onclick="download()">下载</button>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script>
    const exportExcel = data => {
      axios({
        method: data.method,
        url: data.url,
      })
        .then(res => {
          console.log(res);
          var uInt8Array = new Uint8Array(res.data.data.data.data); // 把返回的二进制数组转化为js的二进制数组
          let blob = new Blob([uInt8Array],{type:"application/vnd.ms-excel"}); // 创建blob对象，文件类型设置为excel的类型
          let blobURL = window.URL.createObjectURL(blob); // 创建一个可访问的URL
          let tempLink = document.createElement('a'); // 创建a标签去下载
          tempLink.style.display = 'none';
          tempLink.href = blobURL;
          tempLink.setAttribute('download', 'demo'+".xlsx");
          if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
          }
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          window.URL.revokeObjectURL(blobURL);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    
    function download() {
      console.log('down');
      exportExcel({
        method: 'get',
        url: 'https://qbworkwxconnect.test.upchina.com/api/groupchat/download-groupchat?corpId=ww7b2c628cf4c199eb&chatId=wrwyDhDAAAxnTh5VMMcszAktoFGj9MOA',
      })
    }
  </script>
</body>
</html>
```
