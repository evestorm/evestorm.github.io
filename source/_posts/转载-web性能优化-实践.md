---
title: 转载-web性能优化-实践
tags:
  - 转载
  - 性能优化
categories:
  - 前端
  - 性能优化
abbrlink: 47143
date: 2019-08-02 22:13:49
---

## 概括

#### 涉及到的分类

- 网络层面
- 构建层面
- 浏览器渲染层面
- 服务端层面

#### 涉及到的功能点

- 资源的合并与压缩
- 图片编解码原理和类型选择
- 浏览器渲染机制
- 懒加载预加载
- 浏览器存储
- 缓存机制
- `PWA`
- `Vue-SSR`

<!-- more -->

## 资源合并与压缩

### `http`请求的过程及潜在的性能优化点

- 理解`减少http请求数量`和`减少请求资源大小`两个优化要点
- 掌握`压缩`与`合并`的原理
- 掌握通过`在线网站`和`fis3`两种实现压缩与合并的方法

#### 浏览器的一个请求从发送到返回都经历了什么

动态的加载静态的资源

{% asset_img jingtaitupian.png 浏览器请求过程 %}

- `dns`是否可以通过缓存减少`dns`查询时间
- 网络请求的过程走最近的网络环境
- 相同的静态资源是否可以缓存
- 能否减少`http`请求大小
- 能否减少`http`请求数量
- 服务端渲染

#### 资源的合并与压缩设计到的性能点

- 减少`http`请求的数量
- 减少请求的大小

### `html`压缩

> `HTML`代码压缩就是压缩这些在文本文件中有意义，但是在`HTML`中不显示的字符，包括`空格`,`制表符`,`换行符`等，还有一些其他意义的字符，如`HTML`注释也可以被压缩

{% asset_img html-yasuo.png html-压缩 %}

> 意义

{% asset_img html-yasuoduibi.png html-压缩对比 %}

- 大型网站意义比较大

#### 如何进行`html`的压缩

- 使用在线网站进行压缩(走构建工具多，公司级在线网站手动压缩小)
- `node.js`提供了`html-minifier`工具
- 后端`模板引擎渲染压缩`

### `css`及`js`压缩

#### `css`的压缩

- 无效代码删除
  - 注释、无效字符
- `css`语义合并

#### `css`压缩的方式

- 使用在线网站进行压缩
- 使用`html-minifier`对`html`中的`css`进行压缩
- 使用`clean-css`对`css`进行压缩

#### `js`的压缩与混乱

- 无效字符的删除
  - 空格、注释、回车等
- 剔除注释
- 代码语意的缩减和优化
  - 变量名缩短(`a`,`b`)等
- 代码保护
  - 前端代码是透明的，客户端代码用户是可以直接看到的，可以轻易被窥探到逻辑和漏洞

#### `js`压缩的方式

- 使用在线网站进行压缩
- 使用`html-minifier`对`html`中的`js`进行压缩
- 使用`uglifyjs2`对`js`进行压缩

### 不合并文件可能存在的问题

- 文件与文件有插入之间的上行请求，又增加了`N-1`个网络延迟
- 受丢包问题影响更严重
- 经过代理服务器时可能会被断开

{% asset_img wenjianhebing.png 文件合并 %}

#### 文件合并缺点

- 首屏渲染问题
  - 文件合并之后的`js`变大，如果首页的渲染依赖这个`js`的话，整个页面的渲染要等`js`请求完才能执行
  - 如果首屏只依赖`a.js`，只要等`a.js`完成后就可执行
  - 没有通过服务器端渲染，现在框架都需要等合并完的文件请求完才能执行，基本都需要等文件合并后的`js`
- 缓存失效问题
  - 标记 `js` `md5`戳
  - 合并之后的`js`,任何一个改动都会导致大面积的缓存失效

#### 文件合并对应缺点的处理

- 公共库合并
- 不同页面`js`单独打包
- 见机行事，随机应变

#### 文件合并对应方法

- 使用在线网站进行合并
- 构建阶段，使用`nodejs`进行文件合并

## 图片相关优化

### 一张`JPG`的解析过程

{% asset_img img-jiexiguocheng.jpg img-解析过程 %}

`jpg`有损压缩：虽然损失一些信息，但是肉眼可见影响并不大

### `png8`/`png24`/`png32`之间的区别

- `png8` —-`256色` + 支持透明
- `png24` —-`2^24` + 不支持透明
- `png32` —`2^24` +支持透明

```
文件大小` + `色彩丰富程度
```

`png32`是在`png24`上支持了透明，针对不同的业务场景选择不同的图片格式很重要

### 不同的格式图片常用的业务场景

#### 不同格式图片的特点

- `jpg`有损压缩，压缩率高，不支持透明
- `png`支持透明，浏览器兼容性好
- `webp`压缩程度更好，在`ios webview`中有兼容性问题
- `svg`矢量图，代码内嵌，相对较小，图片样式相对简单的场景(尽量使用，绘制能力有限，图片简单用的比较多)

#### 不同格式图片的使用场景

- `jpg`：大部分不需要透明图片的业务场景
- `png`：大部分需要透明图片的业务场景
- `webp`：`android`全部(解码速度和压缩率高于`jpg`和`png`，但是`ios` `safari`还没支持)
- `svg`：图片样式相对简单的业务场景

### 图片压缩的几种情况

- 针对真实图片情况，舍弃一些相对无关紧要的色彩信息

- ```
  CSS雪碧图
  ```

  ：把你的网站用到的一些图片整合到一张单独的图片中

  - 优点：减少`HTTP`请求的数量(通过`backgroundPosition`定位所需图片)
  - 缺点：整合图片比较大时，加载比较慢(如果这张图片没有加载成功，整个页面会失去图片信息)`facebook`官网任然在用，主要`pc`用的比较多，相对性能比较强

- ```
  Image-inline
  ```

  ：将图片的内容嵌到

  ```
  html
  ```

  中(减少网站的

  ```
  HTTP
  ```

  请求)

  - `base64信息`，减少网站的 HTTP 请求,如果图片比较小比较多，时间损耗主要在请求的骨干网络

- ```
  使用矢量图
  ```

  - 使用`SVG`进行矢量图的绘制
  - 使用`icon-font`解决`icon`问题

- ```
  在android下使用webp
  ```

  - `webp`的优势主要体现在它具有更优的图像数据压缩算法，能带来更小的图片体积，而且拥有肉眼识别无差异的图像质量；
  - 同时具备了无损和有损的压缩模式、`Alpha`透明以及动画的特性，在`JPEG`和`PNG`上的转化效果都非常优秀、稳定和统一

## `css`和`js`的装载与执行

### HTML 页面加载渲染的过程

#### 一个网站在浏览器端是如何进行渲染的

{% asset_img rendering.jpg 页面渲染过程 %}

### HTML 渲染过程中的一些特点

- 顺序执行，并发加载

  - 词法分析：从上到下依次解析
    - 通过`HTML`生成`Token对象`（当前节点的所有子节点生成后，才会通过`next token`获取到当前节点的兄弟节点），最终生成`Dom Tree`
  - 并发加载：资源请求是并发请求的
  - 并发上限
    - 浏览器中可以支持并发请求，不同浏览器所支持的并发数量不同（以域名划分），以`Chrome`为例，并发上限为 6 个
    - 优化点： 把 CDN 资源分布在多个域名下

- 是否阻塞

  - ```
    css
    ```

    阻塞

    - ```
      css
      ```

      在

      ```
      head
      ```

      中通过

      ```
      link
      ```

      引入会阻塞页面的渲染

      - 如果我们把`css`代码放在`head`中去引入的话，那么我们整个页面的渲染实际上就会等待`head`中`css`加载并生成`css树`，最终和`DOM`整合生成`RanderTree`之后才会进行渲染
      - 为了浏览器的渲染，能让页面显示的时候视觉上更好。 避免某些情况，如：假设你放在页面最底部，用户打开页面时，有可能出现，页面先是显示一大堆文字或图片，自上而下，丝毫没有排版和样式可言。最后，页面又恢复所要的效果

    - `css`不阻塞`js`的加载，但阻塞`js`的执行

    - `css`不阻塞外部脚步的加载(`webkit preloader 预资源加载器`)

  - ```
    js
    ```

    阻塞

    - 直接通过

      ```
      <script src>
      ```

      引入会阻塞后面节点的渲染

      - `html parse`认为`js`会动态修改文档结构(`document.write`等方式)，没有进行后面文档的变化

      - ```
        async
        ```

        、

        ```
        defer
        ```

        (

        ```
        async
        ```

        放弃了依赖关系)

        - `defer`属性（`<script defer></script>`） (这是延迟执行引入的`js`脚本（即脚本加载是不会导致解析停止，等到`document`全部解析完毕后，`defer-script`也加载完毕后，在执行所有的`defer-script`加载的`js`代码，再触发`Domcontentloaded`）

        - ```
          async
          ```

          属性（

          ```
          <script async></script>
          ```

          ）

          - 这是异步执行引入的`js`脚本文件
          - 与`defer`的区别是`async`会在加载完成后就执行，但是不会影响阻塞到解析和渲染。但是还是会阻塞`load`事件，所以`async-script`会可能在`DOMcontentloaded`触发前或后执行，但是一定会在`load`事件前触发。

## 懒加载与预加载

### 懒加载

- 图片进入可视区域之后请求图片资源
- 对于电商等图片很多，页面很长的业务场景适用
- 减少无效资源的加载
- 并发加载的资源过多会会阻塞 js 的加载，影响网站的正常使用

`img src`被设置之后，`webkit`解析到之后才去请求这个资源。所以我们希望图片到达可视区域之后，`img src`才会被设置进来，没有到达可视区域前并不现实真正的`src`，而是类似一个`1px`的占位符。

```
场景：电商图片
```

### 预加载

- 图片等静态资源在使用之前的提前请求
- 资源使用到时能从缓存中加载，提升用户体验
- 页面展示的依赖关系维护

```
场景：抽奖
```

### 懒加载原生`js`和`zepto.lazyload`

> 原理

先将`img`标签中的`src`链接设为同一张图片（空白图片），将其真正的图片地址存储再`img`标签的自定义属性中（比如`data-src`）。当`js`监听到该图片元素进入可视窗口时，即将自定义属性中的地址存储到`src`属性中，达到懒加载的效果。

> 注意问题：

- 关注首屏处理,因为还没滑动，需要手动调用一次方法
- 占位，图片大小首先需要预设高度，如果没有设置的话，会全部显示出来

{% asset_img lanjiazai.jpg 懒加载页面结构 %}

```js
var viewheight = document.documentElement.clientHeight; //可视区域高度

function lazyload() {
  var eles = document.querySelectorAll('img[data-original][lazyload]');

  Array.prototype.forEach.call(eles, function (item, index) {
    var rect;
    if (item.dataset.original === '') return;
    rect = item.getBoundingClientRect(); //返回元素的大小及其相对于视口的

    if (rect.bottom >= 0 && rect.top < viewheight) {
      !(function () {
        var img = new Image();
        img.src = item.dataset.url;
        img.onload = function () {
          item.src = img.src;
        };
        item.removeAttribute('data-original');
        item.removeAttribute('lazyload');
      })();
    }
  });
}

lazyload();
document.addEventListener('scroll', lazyload);
```

### 预加载原生`js`和`preloadJS`实现

#### 预加载实现的几种方式

- 第一种方式：直接请求下来

```html
<img
  src="https://user-gold-cdn.xitu.io/2019/2/21/1690d1b216cbfa18"
  style="display: none"
/>
<img
  src="https://user-gold-cdn.xitu.io/2019/2/21/1690d1b21b70c8d2"
  style="display: none"
/>
<img
  src="https://user-gold-cdn.xitu.io/2019/2/21/1690d1b216e17e26"
  style="display: none"
/>
<img
  src="https://user-gold-cdn.xitu.io/2019/2/21/1690d1b217b3ae59"
  style="display: none"
/>
```

- 第二种方式：`image`对象

```js
var image = new Image();
image.src = "www.pic26.com/dafdafd/safdas.jpg"；
```

- 第三种方式：

  ```
  XMLHttpRequest
  ```

  - 缺点：存在跨域问题
  - 优点：好控制

```js
var xmlhttprequest = new XMLHttpRequest();

xmlhttprequest.onreadystatechange = callback;

xmlhttprequest.onprogress = progressCallback;

xmlhttprequest.open('GET', 'http:www.xxx.com', true);

xmlhttprequest.send();

function callback() {
  if (xmlhttprequest.readyState == 4 && xmlhttprequest.status == 200) {
    var responseText = xmlhttprequest.responseText;
  } else {
    console.log('Request was unsuccessful:' + xmlhttprequest.status);
  }
}

function progressCallback() {
  e = e || event;
  if (e.lengthComputable) {
    console.log('Received' + e.loaded + 'of' + e.total + 'bytes');
  }
}
PreloadJS模块;
```

- **本质**：**权衡浏览器加载能力，让它尽可能饱和利用起来**

## 重绘与回流

### `css`性能让`javascript`变慢

要把`css`相关的外部文件引入放进`head`中，加载`css`时，整个页面的渲染是阻塞的，同样的执行`javascript`代码的时候也是阻塞的，例如`javascript`死循环。

```
一个线程   =>  javascript解析
一个线程   =>  UI渲染
```

这两个线程是互斥的，当`UI`渲染的时候，`javascript`的代码被终止。当`javascript`代码执行，`UI`线程被冻结。所以`css`的性能让`javascript`变慢。

```
频繁触发重绘与回流，会导致UI频繁渲染，最终导致js变慢
```

### 什么是重绘和回流

#### 回流

- 当`render tree`中的一部分(或全部)因为元素的`规模尺寸`，`布局`，`隐藏`等改变而需要`重新构建`。这就成为回流(`reflow`)
- 当`页面布局`和`几何属性`改变时，就需要`回流`

#### 重绘

- 当`render tree`中的一些元素需要更新属性，而这些属性只是影响元素的`外观`，`风格`，而不影响布局，比如`background-color`。就称重绘

#### 关系

用到`chrome` 分析 `performance`

```
回流必将引起重绘，但是重绘不一定会引起回流
```

### 避免重绘、回流的两种方法

#### 触发页面重布局的一些 css 属性

- 盒子模型相关属性会触发重布局
  - `width` / `height` / `min-height`
  - `padding` / `margin`
  - `display`
  - `border-width` / `border`
- 定位属性及浮动也会触发重布局
  - `top` / `bottom` / `left` / `right`
  - `position`
  - `float`
  - `clear`
- 改变节点内部文字结构也会触发重布局
  - `text-align` / `vertical-align`
  - `overflow` / `overflow-y`
  - `font-size` / `font-family` / `font-weight`
  - `line-height`
  - `white-space`

优化点：使用不触发回流的方案替代触发回流的方案

#### 只触发重绘不触发回流

- `color`
- `border-style`、`border-radius`
- `visibility`
- `text-decoration`
- `background`、`background-image`、`background-position`、`background-repeat`、`background-size`
- `outline`、`outline-color`、`outline-style`、`outline-width`
- `box-shadow`

#### 新建 DOM 的过程

- 获取`DOM`后分割为多个图层
- 对每个图层的节点计算样式结果(`Recalculate style` 样式重计算)
- 为每个节点生成图形和位置(`Layout` 回流和重布局)
- 将每个节点绘制填充到图层位图中(`Paint Setup`和`Paint` `重绘`)
- 图层作为纹理上传至`gpu`
- 符合多个图层到页面上生成最终屏幕图像(`Composite Layers` 图层重组)

### 浏览器绘制`DOM`的过程是这样子的：

- 获取 DOM 并将其分割为多个层（`layer`），将每个层独立地绘制进位图（`bitmap`）中
- 将层作为纹理（`texture`）上传至 `GPU`，复合（`composite`）多个层来生成最终的屏幕图像
- `left/top/margin`之类的属性会影响到元素在文档中的布局，当对布局（`layout`）进行动画时，该元素的布局改变可能会影响到其他元素在文档中的位置，就导致了所有被影响到的元素都要进行重新布局，浏览器需要为整个层进行重绘并重新上传到 `GPU`，造成了极大的性能开销。
- `transform` 属于合成属性（`composite property`），对合成属性进行 `transition/animation` 动画将会创建一个合成层（`composite layer`），这使得被动画元素在一个独立的层中进行动画。
- 通常情况下，浏览器会将一个层的内容先绘制进一个位图中，然后再作为纹理（`texture`）上传到 `GPU`，只要该层的内容不发生改变，就没必要进行重绘（`repaint`），浏览器会通过重新复合（`recomposite`）来形成一个新的帧。

#### `chrome`创建图层的条件

> 将频繁重绘回流的 DOM 元素单独作为一个独立图层，那么这个 DOM 元素的重绘和回流的影响只会在这个图层中

- `3D`或透视变换
- `CSS`属性使用加速视频解码的 `<video>` 元素
- 拥有 `3D` (`WebGL`) 上下文或加速的 `2D` 上下文的 `<canvas>` 元素
- 复合插件(如 `Flash`)
- 进行 `opacity/transform` 动画的元素拥有加速
- `CSS filters` 的元素有一个包含复合层的后代节点(换句话说，就是一个元素拥有一个子元素，该子元素在自己的层里)
- 元素有一个 `z-index` 较低且包含一个复合层的兄弟元素(换句话说就是该元素在复合层上面渲染)

> 总结：对布局属性进行动画，浏览器需要为每一帧进行重绘并上传到 `GPU` 中对合成属性进行动画，浏览器会为元素创建一个独立的复合层，当元素内容没有发生改变，该层就不会被重绘，浏览器会通过重新复合来创建动画帧

gif 图

#### 总结

- 尽量避免使用触发`回流`、`重绘`的`CSS`属性
- 将`重绘`、`回流`的影响范围限制在单独的图层(`layers`)之内
- 图层合成过程中消耗很大页面性能，这时候需要平衡考虑重绘回流的性能消耗

### 实战优化点总结

- 用

  ```
  translate
  ```

  替代

  ```
  top
  ```

  属性

  - `top`会触发`layout`，但`translate`不会

- 用

  ```
  opacity
  ```

  代替

  ```
  visibility
  ```

  - `opacity`不会触发重绘也不会触发回流，只是改变图层`alpha`值，但是必须要将这个图片独立出一个图层
  - `visibility`会触发重绘

- 不要一条一条的修改`DOM`的样式，预先定义好`class`，然后修改`DOM`的`className`

- `把DOM`离线后修改，比如：先把`DOM`给`display:none`（有一次`reflow`），然后你修改 100 次，然后再把它显示出来

- 不要把

  ```
  DOM
  ```

  节点的属性值放在一个循环里当成循环的变量

  - `offsetHeight`、`offsetWidth`每次都要刷新缓冲区，缓冲机制被破坏
  - 先用变量存储下来

- 不要使用

  ```
  table
  ```

  布局，可能很小的一个小改动会造成整个

  ```
  table
  ```

  的重新布局

  - `div`只会影响后续样式的布局

- 动画实现的速度的选择

  - 选择合适的动画速度
  - 根据`performance`量化性能优化

- 对于动画新建图层

  - 启用

    ```
    gpu
    ```

    硬件加速(并行运算)，

    ```
    gpu加速
    ```

    意味着数据需要从

    ```
    cpu
    ```

    走总线到

    ```
    gpu
    ```

    传输，需要考虑传输损耗.

    - `transform:translateZ(0)`
    - `transform:translate3D(0)`

{% asset_img gpu-speed.png gpu加速 %}

## 浏览器存储

### `cookies`

#### 多种浏览器存储方式并存，如何选择？

{% asset_img cookie.jpg cookie %}

- 因为`http`请求无状态，所以需要`cookie`去维持客户端状态

- ```
  cookie
  ```

  的生成方式：

  - `http`–>`response header`–>`set-cookie`

  - `js`中可以通过`document.cookie`可以读写`cookie`

  - ```
    cookie
    ```

    的使用用处：

    - 用于浏览器端和服务器端的交互(用户状态)
    - 客户端自身数据的存储

- `expire`：过期时间

- ```
  cookie
  ```

  的限制：

  - 作为浏览器存储，大小`4kb`左右
  - 需要设置过期时间 `expire`

- 重要属性：`httponly` 不支持`js`读写(防止收到模拟请求攻击)

- 不太作为存储方案而是用于维护客户关系

- 优化点：

  ```
  cookie
  ```

  中在相关域名下面

  - `cdn`的流量损耗
  - 解决方案：`cdn`的域名和主站域名要分开

### WebStorage

#### localstorage

- `HTML5`设计出来专门用于浏览器存储的
- 大小为`5M`左右
- 仅在客户端使用，不和服务端进行通信
- 接口封装较好
- 浏览器本地缓存方案

#### sessionstorage

- 会话级别的浏览器存储
- 大小为`5M`左右
- 仅在客户端使用，不和服务器端进行通信
- 接口封装较好
- 对于表单信息的维护

### indexedDB

- `IndexedDB`是一种低级`API`，用于客户端存储大量结构化数据。该`API`使用索引来实现对该数据的高性能搜索。虽然`Web`
- `Storage`对于存储叫少量的数据很管用，但对于存储更大量的结构化数据来说，这种方法不太有用。`IndexedDB`提供了一个解决方案。

```
为应用创建离线版本
```

- `cdn`域名不要带`cookie`
- `localstorage`存库、图片

`cookie`种在主站下，二级域名也会携带这个域名，造成流量的浪费

### Service Worker 产生的意义

### PWA 与 Service Worker

- `PWA`(`Progressive Web Apps`)是一种`Web App`新模型，并不是具体指某一种前言的技术或者某一个单一的知识点，我们从英文缩写来看就能看出来，这是一个渐进式的`Web App`，是通过一系列新的`Web特性`，配合优秀的`UI`交互设计，逐步增强`Web App`的用户体验

#### chrome 插件 lighthouse

> 检测是不是一个渐进式`web app`

- 当前手机在弱网环境下能不能加载出来
- 离线环境下能不能加载出来

> 特点

- 可靠：没有网络的环境中也能提供基本的页面访问，而不会出现“未连接到互联网”的页面
- 快速：针对网页渲染及网络数据访问有较好的优化
- 融入(`Engaging`)：应用可以被增加到手机桌面，并且和普通应用一样有全屏、推送等特性

#### service worker

> `service worker`是一个脚本，浏览器独立于当前页面，将其在后台运行，为实现一些不依赖页面的或者用户交互的特性打开了一扇大门。在未来这些特性将包括消息推送，背景后台同步，`geofencing`(地理围栏定位)，但他将推出的第一个首要的特性，就是拦截和处理网络请求的能力，包括以编程方式来管理被缓存的响应。

{% asset_img service-worker.png service-worker %}

#### 案例分析

[Service Worker 学习与实践](https://juejin.im/post/5ba0fe356fb9a05d2c43a25c)

[了解 servie worker](https://link.juejin.im/?target=http%3A%2F%2Fkailian.github.io%2F2017%2F03%2F01%2Fservice-worker%23🐉)

```
copychrome://serviceworker-internals/
chrome://inspect/#service-worker/
```

`service worker`网络拦截能力，存储`Cache Storage`，实现离线应用

#### indexedDB

{% asset_img indexdb.png indexdb %}

```js
callback && callback()写法
相当于
if(callback){
   callback();
}
```

### `cookie`、`session`、`localStorage`、`sessionStorage`基本操作

### `indexedDB`基本操作

```js
object store:对象存储本身就是结构化存储
function openDB(name, callback) {
           //建立打开indexdb  indexedDB.open
           var request = window.indexedDB.open(name)
           request.onerror = function(e) {
               console.log('on indexedDB error')
           }
           request.onsuccess = function(e) {
                   myDB.db = e.target.result
                   callback && callback()
               }
               //from no database to first version,first version to second version...
           request.onupgradeneeded = function() {
               console.log('created')
               var store = request.result.createObjectStore('books', {
                   keyPath: 'isbn'
               })
               console.log(store)
               var titleIndex = store.createIndex('by_title', 'title', {
                   unique: true
               })
               var authorIndex = store.createIndex('by_author', 'author')

               store.put({
                   title: 'quarry memories',
                   author: 'fred',
                   isbn: 123456
               })
               store.put({
                   title: 'dafd memories',
                   author: 'frdfaded',
                   isbn: 12345
               })
               store.put({
                   title: 'dafd medafdadmories',
                   author: 'frdfdsafdafded',
                   isbn: 12345434
               })
           }
       }
       var myDB = {
           name: 'tesDB',
           version: '2.0.1',
           db: null
       }

       function addData(db, storeName) {

       }

       openDB(myDB.name, function() {
           // myDB.db = e.target.result
           // window.indexedDB.deleteDatabase(myDB.name)
       });

       //删除indexedDB
```

### `indexDB`事务

`transcation` 与 `object store`建立关联关系来操作`object store` 建立之初可以配置

```js
var transcation = db.transcation('books', 'readwrite');
var store = transcation.objectStore('books');

var data = store.get(34314);
store.delete(2334);
store.add({
  title: 'dafd medafdadmories',
  author: 'frdfdsafdafded',
  isbn: 12345434
});
```

### `Service Worker`离线应用

`serviceworker`需要`https`协议

### 如何实现`ServiceWorker`与主页面之间的通信

[lavas](https://link.juejin.im/?target=https%3A%2F%2Flavas.baidu.com%2Fguide%2Fv1%2Ffoundation%2Flavas-start)

## 缓存

> 期望大规模数据能自动化缓存，而不是手动进行缓存，需要浏览器端和服务器端协商一种缓存机制

> - Cache-Control 所控制的缓存策略
> - last-modified 和 etag 以及整个服务端浏览器端的缓存流程
> - 基于 node 实践以上缓存方式

### `httpheader`

#### 可缓存性

- `public`:表明响应可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存。
- `private`:表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）。
- `no-cache`:强制所有缓存了该响应的缓存用户，在使用已存储的缓存数据前，发送带验证器的请求到原始服务器
- `only-if-cached`:表明如果缓存存在，只使用缓存，无论原始服务器数据是否有更新

#### 到期

- `max-age=<seconds>`:设置缓存存储的最大周期，超过这个时间缓存被认为过期(单位秒)。与`Expires`相反，时间是相对于请求的时间。
- `s-maxage=<seconds>`:覆盖`max-age` 或者 `Expires` 头，但是仅适用于共享缓存(比如各个代理)，并且私有缓存中它被忽略。`cdn`缓存
- `max-stale[=<seconds>]` 表明客户端愿意接收一个已经过期的资源。 可选的设置一个时间(单位秒)，表示响应不能超过的过时时间。
- `min-fresh=<seconds>` 表示客户端希望在指定的时间内获取最新的响应。

#### 重新验证 和 重新加载

> 重新验证

- `must-revalidate`：缓存必须在使用之前验证旧资源的状态，并且不可使用过期资源。
- `proxy-revalidate`：与`must-revalidate`作用相同，但它仅适用于共享缓存（例如代理），并被私有缓存忽略。
- `immutable` ：表示响应正文不会随时间而改变。资源（如果未过期）在服务器上不发生改变，因此客户端不应发送重新验证请求头（例如`If-None-Match`或`If-Modified-Since`）来检查更新，即使用户显式地刷新页面。在`Firefox`中，`immutable`只能被用在 `https:// transactions`.

> 重新加载

- `no-store`:缓存不应存储有关客户端请求或服务器响应的任何内容。
- `no-transform`:不得对资源进行转换或转变。`Content-Encoding`,`Content-Range`, `Content-Type`等`HTTP`头不能由代理修改。例如，非透明代理可以对图像格式进行转换，以便节省缓存空间或者减少缓慢链路上的流量。 `no-transform`指令不允许这样做。

### Expires

- 缓存过期时间，用来指定资源到期的时间，是服务器端的时间点
- 告诉浏览器在过期时间前浏览器可以直接从浏览器缓存中存取数据，而无需再次请求
- `expires`是`http1.0`的时候的
- `http1.1`时候，我们希`望cache`的管理统一进行，`max-age`优先级高于`expires`，当有`max-age`在的时候`expires`可能就会被忽略。
- 如果没有设置`cache-control`时候会使用`expires`

### Last-modified 和 If-Modified-since

- 基于客户端和服务器端协商的缓存机制
- `last-modified` –> `response header`
  `if-modified-since` –> `request header`
- 需要与`cache-control`共同使用

> `last-modified`有什么缺点？

- 某些服务端不能获取精确的修改时间
- 文件修改时间改了，但文件的内容却没有变

### Etag 和 If-none-match

- 文件内容的 hash 值
- `etag` –>`reponse header`
  `if-none-match` –>`request header`
- 需要与`cache-control`共同使用

好处：

- 比`if-modified-since`更加准确
- 优先级比`etage`更高

{% asset_img fenjihuancun.jpg 分级缓存策略 %}

### 流程图

{% asset_img fenjihuancun-liuchengtu.png 流程图 %}

{% asset_img liuchengtu2.png 流程图2 %}

## 服务端性能优化

服务端用的 node.js 因为和前端用的同一种语言，可以利用服务端运算能力来进行相关的运算而减少前端的运算

- `vue`渲染遇到的问题
- `vue-ssr`和原理和引用

### vue 渲染面临的问题

```
先加载vue.js
=>  执行vue.js代码
=>  生成html
```

> 以前没有前端框架时，

- 用`jsp/php`在服务端进行数据的填充，发送给客户端就是已经`填充好数据`的 html

- 使用`jQuery`异步加载数据

- 使用

  ```
  React
  ```

  和

  ```
  Vue
  ```

  前端框架

  - 代价：需要框架全部加载完，才能把页面渲染出来，页面的首屏性能不好

### 多层次的优化方案

- 构建层的模板编译。`runtime`,`compile`拆开,构建层做模板编译工作。`webpack`构建时候，统一，直接编译成`runtime`可以执行的代码
- 数据无关的`prerender`的方式
- 服务端渲染

{% asset_img service-side-rendering.png 服务端渲染 %}

## 文章来源

- [前端面试之路四(web 性能优化篇)](https://juejin.im/post/5c011e0c5188252ea66afdfa)
