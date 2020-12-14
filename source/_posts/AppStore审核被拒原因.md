---
title: AppStore审核被拒原因
tags:
  - iOS
categories:
  - iOS
  - 上架
abbrlink: 36545
date: 2020-07-20 16:02:40
---

## Guideline 5.1.1 - Legal - Privacy - Data Collection and Storage

今天 App 审核被拒了，理由如下：

> We noticed that your app requests the user’s consent to access their contacts, camera, and photos but does not clarify the use of the contacts, camera, and photos in the applicable purpose string.

意思就是没有对请求的相关权限进行描述，或者描述的不够准确，比如使用到了定位，相册相机，通讯录等权限，要把为什么使用这些权限做下详细描述!

例如一个外卖应用，获取定位后需要展示附近的美食信息。那么，相应的定位权限描述，应当是类似“获取定位信息用于为用户提供附近的美食信息”这样的描述。

## Guideline 5.1.2 Legal: Privacy - Data Use and Sharing

7 月 23 日审核又被拒了，理由如下：

> Your app accesses user data from the device but does not have the required precautions in place.
>
> Next Steps
>
> To collect personal data with your app, you must make it clear to the user that their personal data will be uploaded to your server and you must obtain the user’s consent before the data is uploaded. You must also have a Privacy Policy URL and ensure that the URL you provide directs users to your privacy policy.

搜了下被拒原因：

App 申请了通讯录访问权限，所以必须向用户明确其个人数据将上传至应用的服务器，并且必须获得用户的同意才能上传数据。还必须拥有隐私政策 URL，并确保提供的 URL 将用户引导至提供的隐私政策上。

修改方案：

{% asset_img agree.jpeg agree %}

P.S. 上方点击「隐私授权协议」后，用户会跳转到我准备好的一个协议说明链接。

### 参考来源

- [获取用户隐私信息，苹果审核 app 被拒（2.5.13 5.1.1 5.1.2）](http://www.jeepxie.net/article/147613.html)
