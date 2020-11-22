---
title: transition过渡（二）
tags:
  - CSS3
categories:
  - 前端
  - CSS
abbrlink: 13167
date: 2019-02-20 09:31:31
---

## 传送门

- [transition过渡（一）](https://evestorm.github.io/posts/24967/)
- [transition过渡（二）](https://evestorm.github.io/posts/13167/)

上篇文章是对 transition过渡 的一个简单介绍和使用。这篇文章就来聊聊具体属性的含义和用法。

<!-- more -->

## transition-property 过渡属性

从上一篇文章能够知道 transition-property 是拿来设置元素中参与过渡的属性的。它的可选值为：

- none 指所有属性都不参与过渡
- all 指所有属性都参与过渡
- [IDENT] 指定个别属性参与过渡

下面来看一个案例：

👇温馨提示：为了方便看效果，可点击 `CSS` 按钮折叠代码部分，仅显示页面 👇

<iframe height="265" scrolling="no" title="transition-property-demo1" src="https://codepen.io/JingW/embed/oONwww/?height=265&amp;theme-id=0&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

当你依次将鼠标移入上方演示demo中的三个按钮就会发现，都在各自下方显示出了一段文本。我们想要实现的，就是这段文本的显示需要有一个过渡效果，不要太生硬。最简单的一种实现方案就是鼠标移入按钮前，文本容器的 `height: 0` ，鼠标移入后固定容器高度 `height: 150px` （第一个按钮效果就用的此方案）。但在实际情况中，往往文本是自适应的，高度无法确定，所以很自然的，我们会想到将 `height: 150px` 设置为 `height: auto` ，这样不就能够实现自适应高度的容器过渡了嘛，这就是第二个按钮的一套实现方案。但结果大家都知道了，文本容器不再拥有过渡的动画，而是直接从 `0px` 瞬间变化到 `auto`，这是为什么呢？

**答案**：并不是所有的属性和属性值都能存在过渡动画。

这里特别需要注意的是，如果想要指定某个属性有过渡状态，就需要保证我们能够计算出过渡过程中每个时间点的属性值。
比如，从 `height: 0;` 过渡到 `height: 150px;` ，过渡时间是 `t` ，那我们可以算出在 `x` 时刻的属性状态是 `height: (150px-0)*x/t;` 。（注：这里公式成立的前提是假设 `transition-timing-function: linear;` ，如果`transition-timing-function` 为其他值，一样可以计算，只不过算法不同）
然而刚才第二种方案设置了 `height: auto;`，则在 `x` 时刻的属性状态为 `height: (auto-0px)*x/t;` ，显然，这种状态是不存在的、无法被计算的，因此在设置高度变成 `auto` 之后，也自然不会再有过渡动画了。

**解决方案**

第三个按钮的效果就是我们的一种解决方案，在默认状态下，我们不设置文本容器的 `height: 0` ，而是用 `transform: scale(1, 0);` 来代替它，意思是在初始状态下，我们的文本容器比例为宽1:1，高1:0，换句话说，宽为我们设置的宽，但高度为0。在鼠标移入按钮后，用 `transform: scale(1, 1);` 来代替方案二中的 `height: auto` ，设置文本容器的宽高为1，这样就又能出现过渡动画了。

**延伸**

由此进行延伸，再比如日常中最常使用的控制元素显示隐藏的代码是 `display: block;` 和 `display: none;` ，这也是不存在过渡动画的，因此，可以调整改为使用 `opacity: 1;` 和 `opacity: 0;` 来替换。

## transition-duration 过渡花费的时间

这个属性没什么可讲的，用它来设置元素过渡的持续时间

## transition-timing-function 效果曲线

这个属性是设置过渡的动画类型的，换句话说，就是设置在过渡过程中元素值的变化速度。它的可选值包含这样几组：

- ease | linear | ease-in | ease-out | ease-in-out
- step-start | step-end | steps([, [ start | end ] ]?)
- cubic-bezier(, , , )

### 预设的五个时间曲线

<iframe height="519" scrolling="no" title="transition-timing-function-五个预设时间曲线" src="https://codepen.io/JingW/embed/dLyjoN/?height=519&amp;theme-id=0&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

### 阶跃函数 step

直接上案例吧，看完效果再来讲阶跃函数几个参数的具体含义：

<iframe height="413" scrolling="no" title="transition-timing-function-阶跃函数" src="https://codepen.io/JingW/embed/PgwWXd/?height=413&amp;theme-id=0&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

实际体验了阶跃函数带来的效果后应该对其有个大概认知了吧。阶跃函数接收两个参数，第一个参数为**正整数**，指定阶跃函数的间隔数，你可以理解为把整个过渡过程拆成若干份儿；第二个参数可选，值为`[ start | end ]`，叫做跃点，指定是在每个间隔的起点还是终点发生阶跃变化，默认值为`end`。
查看上面案例的css代码，你会发现两种 `steps` 的简写形式：`step-start` 和 `step-end` ，它们分别等同于：`step-start = steps(1, start)` 和 `step-end = steps(1, end)` 。

### cubic-bezier 贝塞尔曲线函数

贝塞尔曲线函数接收四个参数，取值范围是 0 到 1 之间的数值（包括0和1）。

贝塞尔曲线函数，其实定义的是 **属性状态** 与 **时间** 的一个关系函数。如下坐标轴所示：

{% asset_img cubic05000510.png cubic-bezier %}

上图坐标轴中横坐标是时间，纵坐标是属性状态，右上角的坐标是(1,1)。在时间曲线中的每一个点，表示的就是对应时刻下属性的取值，每个点的斜率表示的就是在这个时刻属性的变化速度，因此在时间曲线中**斜率越小**，也就是**越平缓**的地方，表示**属性变化速度越慢**；**斜率越大**，也就是**越陡峭**的地方，表示**属性变化速度越快**。如上图中开始跟结束的时候，斜率都比较小，而中间的阶段，斜率比较大，因此这个曲线表示的就是在变化过程中由慢到快再到慢的一个过程。

回到贝塞尔曲线函数接收的四个参数上，前两个是上图中红色点的坐标(x1,y1)，后两个是图中蓝色点的坐标(x2,y2)，也就是 `cubic-bezier(x1, y1, x2, y2)` 这样的形式。我们可以在 http://cubic-bezier.com/ 这个工具上来调整我们独特的贝塞尔曲线，通过拖拽红色跟蓝色点，可以形成不一样的贝塞尔曲线。我们发现，其实规定取值范围在[0,1]之间，针对的是**x坐标**，也就是**时间**，因为时间如果超过了这个范围，就会出现在同一个时刻对应了两个不同的属性状态，这个是没有意义的；而y坐标是可以超过这个范围的，如下我们通过拖拽两个点形成了这样一个曲线：

{% asset_img cubic55465149.png cubic-bezier %}

它表示的是在过渡过程中属性值会超过终止状态的设定值然后再回到终点位置，表现为回弹的效果。大家可以在 http://cubic-bezier.com/ 上自己拖动两个点尝试一下，最后点击 go 按钮查看效果。

上面两个图的demo效果：

<iframe height="265" scrolling="no" title="transition-timing-function-贝塞尔曲线" src="https://codepen.io/JingW/embed/KYwqgb/?height=265&amp;theme-id=0&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

## transition-delay 延迟

这个属性同样没啥讲的，用它来设置元素延迟过渡的时间。

## transition 的不足

- 无法在页面加载的时候自动触发，因为只有当属性值发生改变的时候才会触发过渡动画。
- 无法重复播放过渡动画，除非再次触发过渡事件。
- 无法设置多种状态（keyframes 只有 from，to），只能从初始状态过渡到终止状态，无法再设置其他的状态。
- transition 规则作用的是单个属性的过渡状态，不能涉及多个属性，即使定义了 `transition: all 1s ease 0s;` 这样的规则，其对应的每个属性过渡动画也都是相互独立，相当于是定义了很多个 transition 规则，而每个 transition 只作用于一个属性。

## 资源

- [Easing Functions Cheat Sheet](https://easings.net/en#)
- [cubic-bezier](http://cubic-bezier.com/)
