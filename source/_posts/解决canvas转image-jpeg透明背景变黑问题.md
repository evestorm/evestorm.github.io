---
title: 解决canvas转image/jpeg透明背景变黑问题
tags:
  - 技巧
  - canvas
  - 解决方案
categories:
  - 前端
  - HTML
abbrlink: 46911
date: 2020-08-05 19:56:22
---

## 问题

png 图片转 jpeg 时，透明区域被填充成黑色

## 问题复现

<!-- more -->

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <p>Canvas：</p>
    <canvas id="canvas" style="border: 1px solid #ccc;"></canvas>
    <br />
    <p>Base64转码后的图片：</p>
    <div id="base64Img"></div>

    <script type="text/javascript">
      let base64Img = document.getElementById('base64Img'),
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');

      // 创建新图片
      let img = new Image();
      img.src = 'off.png';

      img.addEventListener(
        'load',
        function () {
          // 绘制图片到canvas上
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          getBase64(canvas, function (dataUrl) {
            // 展示base64位的图片
            const newImg = document.createElement('img');
            newImg.src = dataUrl;

            base64Img.appendChild(newImg);
          });
        },
        false
      );

      // 获取canvas的base64图片的dataURL（图片格式为image/jpeg）
      function getBase64(canvas, callback) {
        const dataURL = canvas.toDataURL('image/jpeg');

        if (typeof callback !== undefined) {
          callback(dataURL);
        }
      }
    </script>
  </body>
</html>
```

{% asset_img canvas.png 透明背景变黑 %}

## 问题原因

canvas 转为 `jpeg` 之前会移除 `alpha` 通道，所以透明区域被填充成了黑色。

## 期待效果

`canvas` 可以将 `png` 的透明区域填充成白色。

## 解决方案

### 1. 将透明的 pixel 设成白色

因为 png 图片的背景都是透明的，所以我们可以寻找透明的 pixel，然后将其全部设置成白色。

代码片段：

```js
// 将canvas的透明背景设置成白色
var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
var data = imgData.data;
for (var i = 0; i < data.length; i += 4) {
  if (data[i + 3] < 255) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
    data[i + 3] = 255 - data[i + 3];
  }
}
ctx.putImageData(imgData, 0, 0);
```

完整代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <p>Canvas：</p>
    <canvas id="canvas" style="border: 1px solid #ccc;"></canvas>
    <br />
    <p>Base64转码后的图片：</p>
    <div id="base64Img"></div>

    <script type="text/javascript">
      let base64Img = document.getElementById('base64Img'),
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');

      // 创建新图片
      let img = new Image();
      img.src = 'off.png';

      img.addEventListener(
        'load',
        function () {
          // 绘制图片到canvas上
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          // 将canvas的透明背景设置成白色
          var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          var data = imgData.data;
          for (var i = 0; i < data.length; i += 4) {
            if (data[i + 3] < 255) {
              data[i] = 255 - data[i];
              data[i + 1] = 255 - data[i + 1];
              data[i + 2] = 255 - data[i + 2];
              data[i + 3] = 255 - data[i + 3];
            }
          }
          ctx.putImageData(imgData, 0, 0);

          getBase64(canvas, function (dataUrl) {
            // 展示base64位的图片
            const newImg = document.createElement('img');
            newImg.src = dataUrl;

            base64Img.appendChild(newImg);
          });
        },
        false
      );

      // 获取canvas的base64图片的dataURL（图片格式为image/jpeg）
      function getBase64(canvas, callback) {
        const dataURL = canvas.toDataURL('image/jpeg');

        if (typeof callback !== undefined) {
          callback(dataURL);
        }
      }
    </script>
  </body>
</html>
```

效果：

{% asset_img tran2white.png 透明转白 %}

从图中可以看出这个方案是有缺陷的，当 png 图片上存在半透明区域时，也会将其填充为黑色。

解决方案来源：[Change html canvas black background to white background when creating jpg image from png image](https://stackoverflow.com/questions/32160098/change-html-canvas-black-background-to-white-background-when-creating-jpg-image)

### 2. 在 canvas 绘制前填充白色背景

代码片段：

```js
// 在canvas绘制前填充白色背景
ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

完整代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <p>Canvas：</p>
    <canvas id="canvas" style="border: 1px solid #ccc;"></canvas>
    <br />
    <p>Base64转码后的图片：</p>
    <div id="base64Img"></div>

    <script type="text/javascript">
      let base64Img = document.getElementById('base64Img'),
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');

      // 创建新图片
      let img = new Image();
      img.src = 'off.png';

      img.addEventListener(
        'load',
        function () {
          // 绘制图片到canvas上
          canvas.width = img.width;
          canvas.height = img.height;

          // 在canvas绘制前填充白色背景
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.drawImage(img, 0, 0);

          getBase64(canvas, function (dataUrl) {
            // 展示base64位的图片
            const newImg = document.createElement('img');
            newImg.src = dataUrl;

            base64Img.appendChild(newImg);
          });
        },
        false
      );

      // 获取canvas的base64图片的dataURL（图片格式为image/jpeg）
      function getBase64(canvas, callback) {
        const dataURL = canvas.toDataURL('image/jpeg');

        if (typeof callback !== undefined) {
          callback(dataURL);
        }
      }
    </script>
  </body>
</html>
```

效果：

{% asset_img pre2white.png 设置前设置白色背景 %}

显然，在 canvas 绘制前填充白色背景这种方法，不仅简单，而且对 png 图片的半透明区域填充难看的黑色块。推荐这种解决方案。

解决方案来源：[How to fill the whole canvas with specific color](https://stackoverflow.com/questions/27736288/how-to-fill-the-whole-canvas-with-specific-color)
