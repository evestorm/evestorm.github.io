---
title: pdf下载在iOS设备上下载失败
tags:
  - 解决方案
  - iOS
categories:
  - 前端
  - 解决方案
abbrlink: 46127
date: 2021-09-22 11:07:26
---

## 问题

我的 pdf 下载代码：

```js
/**
 * @description 下载pdf
 */
export const downloadPDF = (data) => {
  axios({
    method: data.method || "POST",
    url: isCompleteURL(data.url) ? data.url : appConfig.baseURL + data.url,
    data: data.params,
    params: data.params,
    responseType: "blob",
  }).then((res) => {
    const _res = res.data;
    let blob = new Blob([_res], { type: "application/pdf" });
    let downloadElement = document.createElement("a");
    let href = window.URL.createObjectURL(blob); //创建下载的链接
    downloadElement.href = href;
    downloadElement.style.display = "none";
    downloadElement.download = data.fileName; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载

    document.body.removeChild(downloadElement); //下载完成移除元素
    window.URL.revokeObjectURL(href); //释放掉blob对象
  });
};
```

在 PC 端没啥问题，但是发现在 iPhone 设备 Safari 上会报错：

> 未能完成操作。(WebKitBlobResource 错误")

## 解决方案

如果以编程方式将 a 标签注入 DOM，要确保不要过早移除它。可以 1s 后将其删除：

```js
/**
 * @description 下载pdf
 */
export const downloadPDF = (data) => {
  axios({
    method: data.method || "POST",
    url: isCompleteURL(data.url) ? data.url : appConfig.baseURL + data.url,
    data: data.params,
    params: data.params,
    responseType: "blob",
  }).then((res) => {
    // console.log(res)
    const _res = res.data;
    let blob = new Blob([_res], { type: "application/pdf" });
    let downloadElement = document.createElement("a");
    let href = window.URL.createObjectURL(blob); //创建下载的链接
    downloadElement.href = href;
    downloadElement.style.display = "none";
    // downloadElement.download = fileName; //下载后文件名
    downloadElement.download = data.fileName; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载

    setTimeout(() => {
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(href); //释放掉blob对象
    }, 1000);
  });
};
```
