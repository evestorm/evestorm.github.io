---
title: 上架AppStore
tags:
  - iOS
categories:
  - 移动端
  - iOS
abbrlink: 16027
date: 2020-07-18 22:31:55
---

## 一. 开发证书申请

进入 https://developer.apple.com/account

点击「Certificates, Identifiers & Profiles」

{% asset_img 1594882664645-69f13a17-f828-4f4f-8549-8456bf43955c.png 1594882664645-69f13a17-f828-4f4f-8549-8456bf43955c %}

点击添加 Certificates ：

{% asset_img 1594880841216-49e2644f-7fdd-4118-a903-6b65b1062d1c.png 1594880841216-49e2644f-7fdd-4118-a903-6b65b1062d1c %}

<!-- more -->

选择「iOS App Development」后直接点继续：

{% asset_img 1594882628147-8e4f75f8-55af-49e2-8fe1-822d6e9a421a.png 1594882628147-8e4f75f8-55af-49e2-8fe1-822d6e9a421a %}

选择证书：

{% asset_img 1594882942036-e8aa6a74-9aa9-4dcc-be0e-8dab42a193a0.png 1594882942036-e8aa6a74-9aa9-4dcc-be0e-8dab42a193a0 %}

证书获取：

打开 Mac 上的钥匙串访问「Keychain Access」，在菜单选择「钥匙串访问 => 证书助手 => 从证书颁发机构请求证书」：

{% asset_img 1594883082166-c51bf79c-75f5-4b8c-9549-456e0882f2b8.png 1594883082166-c51bf79c-75f5-4b8c-9549-456e0882f2b8 %}

输入邮件，选择「存储到磁盘」：

{% asset_img 1594883153988-e95dadae-c233-4b72-ab36-b88568ca6ad5.png 1594883153988-e95dadae-c233-4b72-ab36-b88568ca6ad5 %}

选择保存位置：

{% asset_img 1594883271573-2202faf1-fb20-42ad-ad5a-201df2f437ce.png 1594883271573-2202faf1-fb20-42ad-ad5a-201df2f437ce %}

点击保存：

{% asset_img 1594883294243-47fc2b34-abe2-4669-bc6f-dcdd2d07bdfb.png 1594883294243-47fc2b34-abe2-4669-bc6f-dcdd2d07bdfb %}

然后上传刚刚生成的证书，点击继续：

{% asset_img 1594883362266-e498f8f7-524d-4f13-baf3-10b43ea72a28.png 1594883362266-e498f8f7-524d-4f13-baf3-10b43ea72a28 %}

下载你的证书：

{% asset_img 1594883417680-6287c257-31ac-48a6-9ca1-69f6574cd95c.png 1594883417680-6287c257-31ac-48a6-9ca1-69f6574cd95c %}

双击下载的证书安装：

{% asset_img 1594883457231-06e24b7b-4d64-4802-b735-b142e66e50de.png 1594883457231-06e24b7b-4d64-4802-b735-b142e66e50de %}

输入密码后就能安装成功了：

{% asset_img 1594883656140-431b1c3e-ffb9-4155-a07a-a9cb1ee1a081.png 1594883656140-431b1c3e-ffb9-4155-a07a-a9cb1ee1a081 %}

## 二. App 证书申请

回到开发者控制台，选择「Identifiers」添加「Identifiers」：

{% asset_img 1594883949751-2e2fcee3-19bc-4f03-92d6-23a7347ca321.png 1594883949751-2e2fcee3-19bc-4f03-92d6-23a7347ca321 %}

选择「App IDs」点继续：

{% asset_img 1594884014199-d2ae7597-2ef0-4554-9dff-3dd342062b7b.png 1594884014199-d2ae7597-2ef0-4554-9dff-3dd342062b7b %}

选择类型点继续：

{% asset_img 1594884065440-665c827a-7357-471b-8605-23140dc81ce5.png 1594884065440-665c827a-7357-471b-8605-23140dc81ce5 %}

添加证书描述和 Bundle ID（需要使用 APNs 时，必须选择“Explicit”，不能使用“Wildcard”）：

{% asset_img 1594884403089-e434e459-4bb5-4238-803d-a09b0673d16a.png 1594884403089-e434e459-4bb5-4238-803d-a09b0673d16a %}

勾选下方你程序中所需的功能：

{% asset_img 1594884621351-b7a26ad4-10d8-444e-97f9-a08df8acf2b5.png 1594884621351-b7a26ad4-10d8-444e-97f9-a08df8acf2b5 %}

点击右上角继续后会让你确认一次信息，确认无误后点击注册：

{% asset_img 1594884722253-c8b1290e-3f47-4c88-bf58-e134776477bc.png 1594884722253-c8b1290e-3f47-4c88-bf58-e134776477bc %}

然后网页会自动跳转回「Identifiers」，可以看到你刚创建的证书：

{% asset_img 1594884768812-d518acf7-6c65-4265-8efc-2c47e7db265a.png 1594884768812-d518acf7-6c65-4265-8efc-2c47e7db265a %}

## 三. APNs.p12 推送证书

点击添加：

{% asset_img 1594884951069-97b6f494-8c9a-4f0f-b27b-fa7d5c71be94.png 1594884951069-97b6f494-8c9a-4f0f-b27b-fa7d5c71be94 %}

新建证书需要注意选择证书种类。分为开发环境和通用环境两种。推荐场景通用环境推送证书，可以推送开发环境、生产环境、voip 等：

{% asset_img 1594885019849-fbbbb133-00b6-4f65-9dbb-ac429b1e3c87.png 1594885019849-fbbbb133-00b6-4f65-9dbb-ac429b1e3c87 %}

选择完点击继续，会让你选择需要使用推送证书的「App ID」，再点继续：

{% asset_img 1594885120950-97feb067-cb6c-4a7f-b5d7-2f281dab756b.png 1594885120950-97feb067-cb6c-4a7f-b5d7-2f281dab756b %}

这里需要你上传 CSR 文件，就是在第一步生成的「CertificateSigningRequest.certSigningRequest」文件，的选择上传后点击继续：

{% asset_img 1594885430506-a70cf350-35f8-4758-8d11-b8cf5486d354.png 1594885430506-a70cf350-35f8-4758-8d11-b8cf5486d354 %}

创建成功后点击「Download」下载，后缀为 `.cer` 文件：

{% asset_img 1594885478624-b6b54634-1124-4aca-b800-77c7991986fc.png 1594885478624-b6b54634-1124-4aca-b800-77c7991986fc %}

{% asset_img 1594885502725-bebeb9e3-6a55-43ad-b947-6023ccde937f.png 1594885502725-bebeb9e3-6a55-43ad-b947-6023ccde937f %}

保存到本地后同样双击证书导入钥匙串：

{% asset_img 1594885646116-db9e333e-268b-4293-a3ac-3bfd3acef1aa.png 1594885646116-db9e333e-268b-4293-a3ac-3bfd3acef1aa %}

**注意**

- 有效证书左侧存在一个小三角标记，代表证书存在对应秘钥，导出时记得关闭小三角标记。有效推送证书的名称为`Apple Push Services`或`Apple Development IOS Push Services`。
- `Apple Push Services`命名是`通用环境推送证书`
- `Apple Development IOS Push Services` 命名是 `开发环境推送证书`

点击左侧 钥匙串-登录-种类证书，找到刚才导入的证书，右击导出`.p12`证书，并为其设置密码：

{% asset_img 1594886620406-e8586ad0-e6ca-4a79-9238-215b2bfd1cc1.png 1594886620406-e8586ad0-e6ca-4a79-9238-215b2bfd1cc1 %}

{% asset_img 1594886432653-5b48abce-1bc1-45f6-b807-e181b028f948.png 1594886432653-5b48abce-1bc1-45f6-b807-e181b028f948 %}

## 四. APNs Auth Key 证书（.p8 证书）

什么是 apns auth key:

Use the Apple Push Notification service for your notification requests. One key is used for all of your apps.（使用苹果推送通知服务通知服务，一个密钥可以用于你所有的应用程序）

而且正常的证书对应不同的 app，推送证书又有生产模式，开发者模式，使用起来非常的不方便。如果使用 apns auth key 就可以解决上述所有问题。

在控制台 - `Certificates, Identifiers & Profiles`中，选择左侧`Key`，点击`+`新建。

{% asset_img 1594886755529-8eaddc42-c245-488d-b701-504784a05f73.png 1594886755529-8eaddc42-c245-488d-b701-504784a05f73 %}

填写`Key Name`，勾选`Apple Push Notifications service (APNs)`，点击`Continue`按钮：

{% asset_img 1594886822835-6fc8a3b2-f5da-4467-a652-4b99d225cdb8.png 1594886822835-6fc8a3b2-f5da-4467-a652-4b99d225cdb8 %}

点击注册：

{% asset_img 1594886852251-d6ea99cf-7482-4c8a-8612-9a7124f535cf.png 1594886852251-d6ea99cf-7482-4c8a-8612-9a7124f535cf %}

创建成功后，点击`Download`按钮下载。

注意：只能下载一次，妥善保管。

{% asset_img 1594886917691-e4b89269-7b19-418f-bd57-584166dfea44.png 1594886917691-e4b89269-7b19-418f-bd57-584166dfea44 %}

点击下载或完成后会回退到控制台，上面显示有你刚刚创建的 Key：

{% asset_img 1594886963068-96e1642e-fbdd-451f-bfee-00e69389a9a1.png 1594886963068-96e1642e-fbdd-451f-bfee-00e69389a9a1 %}

## 五. Provisioning Profile（描述文件）创建

在控制台 - `Certificates, Identifiers & Profiles`中，选择左侧`Profiles`，点击`+`新建：

{% asset_img 1594887275568-c495e110-353a-4b78-ab99-4506e47caf82.png 1594887275568-c495e110-353a-4b78-ab99-4506e47caf82 %}

选择此`Provisioning Profile`的环境后，点击`Continue`按钮：

{% asset_img 1594887518943-7ffb64f2-64ac-4192-b361-c0ab28dee28e.png 1594887518943-7ffb64f2-64ac-4192-b361-c0ab28dee28e %}

选择要创建`Provisioning Profile`的`App ID`后，点击`Continue`按钮：

{% asset_img 1594887561994-9adf087e-349c-41fd-868c-48cfb6854b39.png 1594887561994-9adf087e-349c-41fd-868c-48cfb6854b39 %}

选择所属的开发者证书，（这里创建了多个开发者证书，建议只创建一个，方便管理）为了方便，选择了`Select All`，再点击`Continue`进入下一步：

{% asset_img 1594887668290-be1143b1-b63d-4d91-b5b1-d3a55dbd105e.png 1594887668290-be1143b1-b63d-4d91-b5b1-d3a55dbd105e %}

为该`Provisioning Profile`选择将要安装的设备（一般选择`Select All`），点击`Continue`。

注：App Store 或者 In House 默认所有设备。

{% asset_img 1594887748290-a8349248-3dc8-4c91-ba71-d55a255d2100.png 1594887748290-a8349248-3dc8-4c91-ba71-d55a255d2100 %}

给该`Provisioning Profile`填写`Profile Name`，建议命名`环境+AppID`，点击`generate`完成创建。

{% asset_img 1594887856732-4f82668f-4e6b-4028-a53e-713856db6856.png 1594887856732-4f82668f-4e6b-4028-a53e-713856db6856 %}

创建成功后就能下载到本地了：

{% asset_img 1594887943226-0a83dd2a-ceb0-4e43-bfed-f1e662ddf1f7.png 1594887943226-0a83dd2a-ceb0-4e43-bfed-f1e662ddf1f7 %}

双击下载的`Provisioning Profile`文件，添加到`Xcode`，即可使用该`AppID(Bundle ID)`创建应用和进行真机调试。

## 六. 创建 App

进入 https://appstoreconnect.apple.com/apps 点击左上角「加号」来添加 app：

{% asset_img 1594897913529-196b1812-e985-4e84-8a62-486746be4e3c.png 1594897913529-196b1812-e985-4e84-8a62-486746be4e3c %}

{% asset_img 1594897954861-3de37674-7029-470b-9dca-229b06723dd8.png 1594897954861-3de37674-7029-470b-9dca-229b06723dd8 %}

## 七. 发布 App 到 TestFlight

Xcode 选择「Generic iOS Device」：

{% asset_img 1594905858560-2e2e13f9-10d8-40d8-b286-a4730b60ede0.png 1594905858560-2e2e13f9-10d8-40d8-b286-a4730b60ede0 %}

菜单「Product -> Archive」开始打包：

{% asset_img 1594905886097-58d0e07d-15ff-4404-bd50-7fe5b877b9e3.png 1594905886097-58d0e07d-15ff-4404-bd50-7fe5b877b9e3 %}

接着选择「Validate App」进行验证：

{% asset_img 1594906458754-920bc282-b1e3-4a50-9be8-3c95694b539e.png 1594906458754-920bc282-b1e3-4a50-9be8-3c95694b539e %}

点「next」：

{% asset_img 1594906485066-1e5b4c66-d2ad-4662-a991-f0f20cc534ef.png 1594906485066-1e5b4c66-d2ad-4662-a991-f0f20cc534ef %}

选择手动签名：

{% asset_img 1594906513638-2ad211c3-3e78-4af3-bac4-ea0c04cd252b.png 1594906513638-2ad211c3-3e78-4af3-bac4-ea0c04cd252b %}

选择证书和 bundle id：

{% asset_img 1594906542543-d12a879f-c80f-46c2-9700-b993163beb14.png 1594906542543-d12a879f-c80f-46c2-9700-b993163beb14 %}

接着点「Next」进行验证：

{% asset_img 1594906656535-9c84ab3b-a98e-48c0-bfbb-347a46e8e476.png 1594906656535-9c84ab3b-a98e-48c0-bfbb-347a46e8e476 %}

验证通过后就可以选择「Distribute App」分发 app 了：

{% asset_img 1594906754071-a872d477-bcbb-4056-87f0-c4c646f003ef.png 1594906754071-a872d477-bcbb-4056-87f0-c4c646f003ef %}

一路点击最后选择 upload 上传就好了。

接着来到：https://appstoreconnect.apple.com/apps 进入 TestFlight 查看你上传的 app：

{% asset_img 1594909160793-31a36ffe-02a7-4714-a61a-0ea61aee527b.png 1594909160793-31a36ffe-02a7-4714-a61a-0ea61aee527b %}

过一会有可能会出现状态变为如图所示：

{% asset_img 1594909228013-0cf5ef31-00b5-4892-9e15-c9578fb28791.png 1594909228013-0cf5ef31-00b5-4892-9e15-c9578fb28791 %}

点击管理选择否然后就可以开始内部测试了：

{% asset_img 1594905696761-7de9c5a9-40b9-4a23-a2c1-79e49632e8d6.png 1594905696761-7de9c5a9-40b9-4a23-a2c1-79e49632e8d6 %}

接着你可以在后台添加测试人员（邮箱）：

{% asset_img 1594909424008-f6ff7f17-cf8d-44a5-bf06-26dc8991abe0.png 1594909424008-f6ff7f17-cf8d-44a5-bf06-26dc8991abe0 %}

添加后你所添加的测试人员的邮箱就会收到一封邀请，打开邮件，您会看到一个 TestFlight 前往的按钮，点一下，就会弹出来一个对话框，里面有一个邀请码，拷贝。

然后在手机上的 TestFlight “兑换”，帖上您的邀请码，确认。

然后就可以看到待安装的 App 了，安装，打开，输入账号密码，开启测试。

## 十. 附录

### [证书（Certificate）与描述文件（Provisioning Profiles）](https://www.cnblogs.com/rslai/p/9291159.html)

#### 证书：

证书是用来给应用程序签名的，只有经过签名的应用程序才能保证他的来源是可信任的，并且代码是完整的， 未经修改的。在 Xcode Build Setting 的 Code Signing Identity 中，你可以设置用于为代码签名的证书。

#### .p12：

因为直接从 Apple 下载的证书只有公钥，没有私钥。没办法证明这个证书是你的(没有办法证明你有这个权利)。而从本地钥匙串中导出的.p12 文件是包含公钥和私钥的，也就是说可以把证书上描述的权利赋予他人。

#### 描述文件：

描述文件里包含了 App ID , Certificates （证书）, Devices（设备）。 说明生成描述文件需要用到这些信息。我们要打包或者在真机上运行一个应用程序，首先需要证书来进行签名，用来标识这个应用程序是合法的、安全的、完整的等等。然后需要指明它的 App ID，并且验证 Bundle ID 是否与其一致。再次，如果是真机调试，需要确认这台设备能否用来运行程序。而 Provisioning Profile 就把这些信息全部打包在一起，方便我们在调试和发布程序打包时使用，这样我们只要在不同的情况下选择不同的 profile 文件就可以了。而且这个 Provisioning Profile 文件会在打包时嵌入.ipa 的包里。

## 七. 参考链接

[iOS 证书配置指南](http://docs.getui.com/getui/mobile/ios/apns/)

[手把手教你搞定 ios 的证书申请](https://www.jianshu.com/p/ae11b893284b)

[证书（Certificate）与描述文件（Provisioning Profiles）](https://www.cnblogs.com/rslai/p/9291159.html)
