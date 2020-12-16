---
title: transform3D转换（二）
tags:
  - CSS3
categories:
  - 前端
  - CSS
abbrlink: 14243
date: 2019-04-10 20:03:06
---

在我当初了解到 transform 后的一段时间，其实是不知道它能够让元素实现 3d 转换的。直到有一天在逛 codepen 时，我发现了下面这个 demo：

<iframe height="393" scrolling="no" title="CSS3 Transforms 3D Perspective Carousel" src="https://codepen.io/JingW/embed/qwrbxK/?height=393&amp;theme-id=0&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

<!-- more -->

p.s. 原作者地址在这儿：https://codepen.io/Hubson/pen/XmrEGX

OS：我靠，还能这样玩儿？赶紧查查如何实现的。（[点我重现查找过程](http://bfy.tw/N9fx)）

然后就发现了张鑫旭老师的 [这篇文章](https://www.zhangxinxu.com/wordpress/2012/09/css3-3d-transform-perspective-animate-transition/) 。算是给我打开了新世界的大门~ 原来现在的 CSS 都这么强大了，要知道几年前我在学 `.NET` 时就接触过 HTML 和 CSS，那个时候不还是满屏 div，没啥特效的时代嘛。

扯远了，言归正传。首先来看下面这个图（copy 上面文章来的~）：

{% asset_img 3dzuobiaoxi.png 3d %}

这个图就是咱们 3d 变形所依赖的坐标系。要想理解这张图，需要一点空间想象力。我们人在看这个坐标系时，是从左下角的眼睛处从 `+Z` 往 `-Z` 里面看的。可以把这个眼睛简单的想象成你自己，由网格组成的正方形平面相当于你在屏幕上创建的一个正方形 div 元素。那么当你设置 `transform: translate(200px, 0)` 时，你的元素将会向 `+X` 方向前进，也就是平常在 2d 变换中的向右移动。现在应该理解了吧~

## rotateX, rotateY, rotateZ

### rotateX

rotateX 就是沿着 x 轴进行 3d 旋转。

在下面示例中，我们实现让一个元素沿着它的 x 轴旋转 180°。为了让效果看起来更加明显，我把该元素分成了上下两个部分，并在中间留出了缝隙，以便当做 X 轴看待，当鼠标移入该元素后，它便“沿着” x 轴旋转 180°：

<iframe height="323" scrolling="no" title="transform3d-rotateX" src="https://codepen.io/JingW/embed/EJWKJq/?height=323&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

### rotateY

用和上面类似的方式，我们实现 rotateY 的 3d 旋转效果，让元素沿着 y 轴进行 3d 旋转：

<iframe height="265" scrolling="no" title="transform3d-rotateY" src="https://codepen.io/JingW/embed/JVWbgo/?height=265&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

### rotateZ

还记得那根 z 轴嘛，当我们垂直于屏幕看向元素时，z 轴在我们眼里就是一个“点”。所以当我们使用 rotateZ 来旋转元素时，元素会沿着 z 轴进行旋转，就是下方元素中间的“点”：

<iframe height="378" scrolling="no" title="transform3d-rotateZ" src="https://codepen.io/JingW/embed/GLWrRE/?height=378&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

## perspective 透视

这个属性英文直译过来就是 透视、视角的意思。

电脑显示屏是个 2d 平面，要想让元素在一个 2d 平面上有立体感（3d 效果），就得利用这个 `perspective` 透视属性。`perspective` 可以让一个 2d 平面在转换过程中呈现出 3d 效果。

不知道大家有没有注意到上面有关 rotateY 下的 demo，虽说是沿着元素 y 轴进行旋转，但一点 3d 立体效果都没有，要知道在现实生活中，如果一张卡片沿着它宽度一半儿的 y 轴进行旋转，肯定有近大远小的透视效果，即离我们近的一面越来越大，离我们远的一面越来越小。如果还没有明白，看了下面的示例就知道了（鼠标移入 body 就能触发旋转~）：

<iframe height="583" scrolling="no" title="transform3d-perspective" src="https://codepen.io/JingW/embed/pBewZM/?height=583&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

这下是不是明显多啦？其实这都全靠了 `perspective` 透视，它允许我们为场景添加深度感，原理就是**使 z 轴在靠近观察者的元素看起来更大，而更远的元素看起来更小**。也就是上面提到的“近大远小”。

我们来看看下面这张图：

{% asset_img perspective-distance.png perspective-distance %}

上图中蓝色圆圈表示三维空间中的元素，字母 d 表示透视的值，即观看者的眼睛和**屏幕**之间的距离。字母 Z 表示元素在 z 轴上的位置。元素在 z 轴上越远，相对于观察者的外观越小，它越接近，就看起来越大。这就是三维空间中透视的效果。

## perspective VS perspective()

perspective 有两种写法，一种是直接写在要使用 3d 转换的父元素身上（如上一个 demo）：

```css
/* 父容器 */
.contaienr {
  /* 将透视属性写在父容器 */
  perspective: 1000px;
}
/* 需要3d转换的子元素 */
.box {
  transition: transform 1s;
}
/* 触发转换 */
.container:hover box {
  transform: rotateY(180deg);
}
```

在这种写法下，一旦“舞台（浏览器显示区域）”上有多个元素都进行了 3d 转换，可能效果就与你的预想不太一样，靠近“舞台”两边的元素会“歪着”进行旋转：

<iframe height="367" scrolling="no" title="transform3d-perspective2" src="https://codepen.io/JingW/embed/KYWedq/?height=367&amp;theme-id=0&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

这是为什么呢？答案是因为默认我们观察者的“眼睛”是处于“舞台”正中央的前方的（这个前方是以“舞台”的视角），所以靠近我们观察者左前方的（观察者视角）卡片，在沿着 x 轴做旋转时，就是“歪着”的；同理观察者右前方卡片也是如此。

那么如果你想让它们都与正中央的卡片一样效果的旋转呢？这就引出了第二种写法：`perspective()` 。该属性写在 3d 转换元素本身上，而不是在其父元素上了：

```css
.box {
  transition: transform 1s;
}
.container:hover .box {
  /* 1. 沿着x轴旋转180° */
  /* 2. 给3d旋转元素本身添加 perspective 透视 */
  transform: perspective(500px) rotateX(180deg);
}
```

效果如下：

<iframe height="365" scrolling="no" title="transform3d-perspective3" src="https://codepen.io/JingW/embed/EJWpaq/?height=265&amp;theme-id=0&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

## perspective-origin

语法：

```css
perspective-origin: 50% 50%; /* 默认值，表示观察者在“舞台”正中央的上方 */
perspective-origin: left center; /* 表示观察者在“舞台”最左边且垂直居中的上方 */
```

该属性用于定义观察者观看三维空间时的位置所在。默认情况下为 x 轴 50%、y 轴 50%。也就是“舞台（屏幕）”正中央的上方。

读者可以尝试用鼠标拖动下方 demo 中的按钮“camera”到“舞台”的各个位置，然后看看三张卡片的 3d 转换效果。当你在拖动“camera”改变它的位置时，也就等同于改变了 `perspective-origin` 的位置。例如当你把按钮“camera”拖动到左上角，就相当于设置了 `perspective-origin: left top`。

<iframe height="360" scrolling="no" title="transform3d-perspective-origin" src="https://codepen.io/JingW/embed/vMmNpm/?height=360&amp;theme-id=0&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>
