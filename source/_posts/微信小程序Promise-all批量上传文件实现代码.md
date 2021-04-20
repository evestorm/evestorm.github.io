---
title: 微信小程序Promise.all批量上传文件实现代码
tags:
  - 小程序
  - 技巧
categories:
  - 前端
  - 移动端
  - 小程序
abbrlink: 5201
date: 2021-03-25 20:00:58
---

## 问题

小程序上传图片要多张上传，而微信小程序提供的接口 `wx.uploadFile` 一次只能上传一个。

## 解决

利用 Promise.all 解决。

<!-- more -->

## 代码

环境：使用到了 小程序官方的 weui UI 框架

> wxml

```html
<mp-cells>
  <mp-cell>
    <mp-uploader
      bindfail="uploadError"
      bindsuccess="uploadSuccess"
      select="{{selectFile}}"
      binddelete="deleteFile"
      upload="{{uplaodFile}}"
      files="{{files}}"
      max-size="{{ 5 * 1024 * 1024 }}"
      max-count="2"
      title="上传驾驶证"
      tips="最多选择两张"
    ></mp-uploader>
  </mp-cell>
</mp-cells>
```

> js

```js
Page({
  data: {
    localFiles: [] // 驾驶证上传files文件
  },
  onLoad() {
    // 图片上传相关初始化
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    });
  },
  // 选择图片触发
  selectFile(files) {
    console.log('files', files);
    // 返回false可以阻止某次文件上传
    // 组件已设置 max-size 为 5M，此处不用处理
  },
  // 上传图片
  uplaodFile(files) {
    const that = this;
    console.log('upload files', files);
    const filePaths = files.tempFilePaths;
    // 文件上传的函数，返回一个promise

    // 多文件上传，Promise.all
    return Promise.all(
      filePaths.map((tempFilePath, index) => {
        return new Promise((resolve, reject) => {
          wx.uploadFile({
            url: mdaUrl + '/commonImg/uploadPic',
            filePath: tempFilePath,
            header: {
              'content-type': 'multipart/form-data',
              PROJECTCODE: 'TMS'
            },
            name: 'file',
            success(res) {
              const result = JSON.parse(res.data);
              if (result.code === 0) {
                console.log(result);
                that.setData({
                  driverImages: [...that.data.driverImages, result.data]
                });
                resolve(result.data);
              } else {
                reject(res);
              }
            },
            fail() {
              reject(new Error('上传出错'));
            }
          });
        });
      })
    )
      .then(results => {
        console.log(results);
        // Promise的callback里面必须resolve({urls})表示成功，否则表示失败
        return { urls: results.map(data => data.url) };
      })
      .catch(err => {
        wx.showToast({
          title: '上传失败，请重新上传！'
        });
        return Promise.reject(err);
      });
  },
  // 删除图片
  deleteFile(e) {
    const { index, item } = e.detail;
    console.log(index, item);
    const target = this.data.driverImages.find(
      imgObj => imgObj.url === item.url
    );
    console.log(this.data.driverImages);
    wx.request({
      url: mdaUrl + '/commonImg/deleteListFilePath',
      method: 'POST',
      data: [
        {
          filePath: target.filePath
        }
      ],
      success(res) {
        const result = res.data;
        if (result.code === 0) {
          wx.showToast({
            title: '删除成功'
          });
        } else {
          wx.showToast({
            title: '删除失败'
          });
        }
      }
    });
  },
  uploadError(e) {
    console.log('upload error', e.detail);
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail);
  }
});
```

## 资源

- [微信小程序官方文档-Uploader 图片上传 Uploader 组件](https://developers.weixin.qq.com/miniprogram/dev/extended/weui/uploader.html)
- [小程序 Promise.all 批量上传文件](https://blog.csdn.net/smartsmile2012/article/details/95638657)
