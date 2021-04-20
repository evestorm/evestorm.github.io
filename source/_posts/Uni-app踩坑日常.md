---
title: Uni-app踩坑日常
tags:
  - uniapp
categories:
  - 前端
  - 框架
  - uniapp
abbrlink: 34936
date: 2019-10-11 20:41:30
---

## HbuilderX

### 在 HbuilderX 中第一次启动小程序

在 HbuilderX 里运行编译 uni-app 的微信小程序版，报：enable ide service (y/n) [27d [27c

解决方案：

在微信开发者工具里点击设置》安全设置，开启服务端口

{% asset_img serve.png serve %}

### 微信小程序报错：Cannot read property 'forceUpdate' of undefined

需给 uniapp 配置小程序的 ID。在 `manifest.json` 文件中填入 AppID。重启微信开发者工具。

## 图片路径问题

### 在 .vue 文件中

使用本地图片可以用绝对路径或者相对路径：

```html
<image src="/static/images/logo.png"></image>
<!-- or -->
<image src="../../static/images/logo.png"></image>
```

<!-- more -->

### 在 .css 样式文件中

`background` 属性中，得使用下面写法引入本地图片：

```css
background: url("~@/static/images.logo.png");
```

否则图片无法被正确加载。

<!-- more -->

### 自定义组件 image 的 src 路径

自定义组件里面使用 `<image>`时，若 `src` 使用相对路径可能出现路径查找失败的情况，故建议使用绝对路径。

—— [uni-app 文档 image 组件](https://uniapp.dcloud.io/component/image?id=image)

**错误示范 ❌**

```
copy<image
      src="../../static/icos/star-yellow.png"
></image>
```

{% asset_img 图片相对路径.png 图片相对路径 %}

**正确示范 ✅**

```html
<image src="/static/icos/star-yellow.png"></image>
```

{% asset_img 图片绝对路径.png 图片绝对路径 %}

## Vue 问题

### v-show 在小程序上不起作用

**场景再现**

希望通过点击按钮来切换三行文字的显示隐藏：

{% asset_img show异常.png show异常 %}

代码非常简单，但有两个条件：

- style 标签添加上 `scoped`
- 装填文字的容器有自己的 display 属性

{% asset_img show异常条件.png show异常条件 %}

{% asset_img show异常条件展示.png show异常条件展示 %}

在此种情况下，H5 的效果和预期一样，点击后三行文字都消失，再次点击三行文字都显示，如此往复。

但在微信小程序中第一行文字始终无法消失。

**问题所在**

在小程序中， .item.data-v-xxx 的样式覆盖掉了 view[hidden] 的样式：

{% asset_img show异常问题所在.png show异常问题所在 %}

所以本应该默认不显示的第一行文字显示了。

---

而在 H5 上，uni-app 的做法是给当前标签添加上行内样式的 display: none，优先级最高：

```html
<view v-show="show">
  <view class="item">谁特么买小米？！</view>
</view>
```

**解决办法**

在外层包裹一个 div，在上面设置 `v-show` 来控制元素的隐藏和显示。

这种方案有些繁琐，除此以外，还能在全局样式中加上如下代码即可解决不能使用 v-show 控制显示隐藏的问题：

```css
/* 解决 v-show 无法控制显示隐藏的bug */
view[hidden],
navigator[hidden] {
  display: none !important;
}
```

## 组件相关

### uni-icon h5 端不显示

在项目中使用 uni-app 官方提供的 uniIcon 组件时，要注意现有项目中使用的是 `uni-icon.vue` 还是 `uni-icons.vue` ，前者是旧版组件，后者是新版，多了个 `s` 后缀。

- 如果使用的前者，注意在页面中导入 `uni-icon` 时不要起名为 `uniIcon` ：

  ```js
  ❌import uniIcon from '@/components/uni-icon/uni-icon.vue'
  ```

  这样会导致 H5 端无法显示该图标。
  解决办法是起个别名，例如：

  ```js
  ✅import swIcon from '@/components/uni-icon/uni-icon.vue'
  ```

- 如果使用的后者，要注意使用 snippet 智能提示后，自动生成的代码 `<uni-icon type=""></uni-icon>` 是有错误的，标签名最后少了个 `s` ，正确写法是：

  ```html
  ✅ <uni-icons class="apply" type="plusempty" size="20"></uni-icons>
  ```

**三种情况比较：**

```html
<uni-icon type="plusempty" size="20"></uni-icon>
<sw-icon type="plusempty" size="20"></sw-icon>
<uni-icons type="plusempty" size="20"></uni-icons>
import uniIcon from '@/components/uni-icon/uni-icon.vue' import swIcon from
'@/components/uni-icon/uni-icon.vue' import uniIcons from
'@/components/uni-icons/uni-icons.vue'
```

{% asset_img image-三种表现.png image-三种表现 %}

**插件地址：**

<https://ext.dcloud.net.cn/plugin?id=28>

### 自定义 modal 弹窗

uni-app 自带的 [uni.showModal](https://uniapp.dcloud.io/api/ui/prompt?id=showmodal) API 的主体内容不支持添加标签，只能添加文字：

{% asset_img image-20191011230427295.png image-20191011230427295 %}

{% asset_img image-20191011230445941.png image-20191011230445941 %}

如果需要在弹窗中显示一个 input 控件或其他元素就无能为力了。

**解决办法**

在插件市场找到了一款自定义 modal 组件：

文档：<https://ext.dcloud.net.cn/plugin?id=134>

{% asset_img image-20191011230508998.png image-20191011230508998 %}

### colorUI 导致 uniapp 的 checkbox 没法儿选中的问题

给 checkbox 添加 class 就好：

```html
<checkbox :checked="item.selected" :class="{'checked':item.selected}" />
```

### 小程序 scroll-view position-fixed 失效

解决方案来源：<https://segmentfault.com/q/1010000009866120>

{% asset_img bVPyMk.jpeg bVPyMk %}

如图，nav 是 scroll-view 的方式横向滚动，当给 scroll-view 的外出 div 加 position: fixed; 定位时，scroll-view 滚动就失效了。

解决方案：把你的 nav-container 宽度设置为 100% 就可以了

```html
<view
  class="yyt-product-type-x font-24 position-fixed"
  style="width: 100vw; z-index:999;top:80rpx"
>
  <scroll-view
    scroll-x
    scroll-with-animation
    class="scroll-row row bg-white"
    :scroll-left="scrollLeft"
  >
    <view class="scroll-row-item row flex-nowrap">
      <view
        class="span-5 d-flex flex-column px-2 mt-1"
        v-for="(item, index) in typeItems"
        @tap="_onSelctItem(item)"
        :key="index"
      >
        <image
          :src="item.productTypeUrl"
          class="rounded-circle"
          style="width:104rpx;height:104rpx;"
          lazy-load
          mode="scaleToFill"
        ></image>
        <text
          :class="{ 'select-active': currentSelectItemId == item.id }"
          style="width:104rpx"
        >
          {{ item.productTypeName }}
        </text>
      </view>
    </view>
  </scroll-view>
</view>
```

## 框架相关

### class 数组对象形式绑定

非 H5 端不支持[Vue 官方文档：Class 与 Style 绑定](https://cn.vuejs.org/v2/guide/class-and-style.html)中的`classObject`和`styleObject`语法。

—— [uni-app 文档](https://uniapp.dcloud.io/use?id=class-与-style-绑定)

**H5**

{% asset_img image-20191011230609716.png image-20191011230609716 %}

**WX 小程序**

{% asset_img image-20191011230635046.png image-20191011230635046 %}

### showToast 不支持网络图片的 icon

{% asset_img showToastIcon.png showToastIcon %}

[官方文档](https://uniapp.dcloud.io/api/ui/prompt?id=showtoast)中有这样一段说明：

{% asset_img showToastIconInfo.png showToastIconInfo %}

**示例**

```js
uni.showToast({
  title: "标题",
  duration: 2000,
  image: "/static/images/success.png",
});
```

## tabBar 相关

### 自定义 picker 无法遮挡 tabBar

tabBar 的层级比自定义组件都高，这导致一切自定义组件都会被 tabBar 遮挡：

{% asset_img tabbar遮挡picker.png picker遮挡 %}

如果不希望 tabBar 遮挡自定义组件，可以在现实自定义组件时，手动调用下面方法隐藏 tabBar ，最后在使用完自定义组件后，将其重新显示：

```js
// 手动隐藏
uni.hideTabBar(OBJECT);
// 手动显示
uni.showTabBar(OBJECT);
```

### H5 底部固定 view 被 tabBar 遮挡

由于在 H5 端，不存在原生导航栏和 tabBar，也是前端 div 模拟。如果设置了一个固定位置的居底 view，在小程序和 App 端是在 tabBar 上方，但在 H5 端会与 tabBar 重叠。此时可使用`--window-bottom`，不管在哪个端，都是固定在 tabBar 上方。

```css
bottom: calc(var(--window-bottom) + 20px);
```

{% asset_img tabbar遮挡固定定位元素.png 固定元素遮挡 %}
