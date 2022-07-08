---
title: Grid布局入门
tags:
  - CSS3
  - Grid
categories:
  - 前端
  - CSS
abbrlink: 42136
date: 2020-01-04 22:52:47
---

## 介绍

### 什么是 Grid Layout

Grid Layout 翻译过来是[网格布局]的意思，它是一个二维系统，包含了行（row）与列（column）以及间距（gap）。下图能够很好的说明这一点（图片来自[mdn](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Grids)）：

<!-- more -->

{% asset_img grid.png grid_layout %}


### Grid vs Flex

工作中写移动端页面的朋友对 Flex 布局肯定不陌生，有些人可能更极端一点，直接 Flex 一把梭。那 Grid 和 Flex 有什么区别呢？我们仍然可以用一张图片进行举例说明：

{% asset_img gridvflex.png grid-vs-flex %}

在上图中，我们可以使用 Grid 来搭建页面的整体结构；而使用 Flex 控制 Grid 中的单个区域，例如顶部导航栏中的具体内容。

**Grid vs Flex 总结**

- Grid 是一种二维布局方式，而 Flex 是一维的。
- Grid 重点关注布局, 而 Flex 重点关注内容的流向。
- Flex 适用于应用的组件，而 Grid 适用于应用本身的布局。

总的来说，Grid 擅长搭建布局结构，而 Flex 则擅长处理元素的流向。

## 使用

### 行与列

首先我们需要将容器的 display 属性设置为 grid，然后使用下列 CSS 属性来控制其中的行与列：

- grid-template-columns 用来划分列数
- grid-template-rows 用来划分行数

#### 固定宽度 & 百分比宽度

<iframe height="826" scrolling="no" title="01-grid-行与列基本使用" src="https://codepen.io/JingW/embed/RwNjowB?height=826&amp;theme-id=default&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

#### 重复设置

通过上面 demo 你会发现一个问题，如果一行有 3 列，我们就需要定义 3 列各自的宽，那如果有 10 列，20 列呢？难道都需要一个个设置，岂不是太麻烦了？所以重复设置的需求应运而生。我们可以使用 `repeat` 统一设置值，第一个参数为重复数量，第二个参数是重复值。下面是两个示例：

<iframe height="1030" scrolling="no" title="02-grid-repeat重复" src="https://codepen.io/JingW/embed/abzVQmR?height=1020&amp;theme-id=default&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

#### 比例划分

我们还可以像 Flex 布局的 `flex: 1` 那样，给布局中的元素设置比例。在 Grid 中，我们使用 `fr` 这个单位来设置元素在空间中所占的比例。

<iframe height="700" scrolling="no" title="03-grid-比例划分" src="https://codepen.io/JingW/embed/oNgoQEK?height=700&amp;theme-id=default&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

#### 组合定义

`grid-tempalte` 是 `grid-template-rows`、`grid-template-columns`、`grid-template-areas` 的三个属性的简写。

下面是使用 `grid-template` 同时声明 `grid-template-rows、grid-template-columns`。

```css
grid-template: 100px 1fr / 50px 1fr;
```

下面是使用 `grid-template` 定义 `grid-template-areas` ，有关 `grid-template-areas` 的使用方法会在下面介绍：

```css
grid-template:
  'header . .'
  '. main .'
  'footer footer .';
```

<iframe height="1133" scrolling="no" title="yLyPQjj" src="https://codepen.io/JingW/embed/yLyPQjj?height=1133&amp;theme-id=default&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

#### minmax

使用 minmax 方法可以设置取值范围。下面行高在 `最小100px ~ 最大1fr` 间取值：

<iframe height="531" scrolling="no" title="05-grid-minmax设置最大最小值" src="https://codepen.io/JingW/embed/dyPZQro?height=531&amp;theme-id=default&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

### 间距

#### 行间距

<iframe height="439" scrolling="no" title="06-grid-行间距row-gap" src="https://codepen.io/JingW/embed/ExabOqB?height=439&amp;theme-id=default&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

#### 列间距

<iframe height="443" scrolling="no" title="07-grid-列间距column-gap" src="https://codepen.io/JingW/embed/QWwOzLr?height=443&amp;theme-id=default&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

#### 间距简写

使用 gap 规则可以一次定义行、列间距，如果间距一样可以只设置一个值：

<iframe height="437" scrolling="no" title="07-grid-间距简写gap" src="https://codepen.io/JingW/embed/zYxPyOQ?height=437&amp;theme-id=default&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

### 网格线命名

通过 grid-template-rows 和 grid-template-columns 定义网格时，网格线可以被命名。网格线名称也可以设置网格项目位置

分配网格线名称必须用方括号[网格线名称]，然后后面紧跟网格轨道的尺寸值。定义网格线名称时需要避免使用规范中出现的关键词，以免导致混乱。

```css
grid-template-rows: [row-1-start] 1fr [row-2-start] 1fr [row-2-end];

grid-template-columns: [col-1-start] 1fr [col-2-start] 1fr [col-3-start] 1fr [col-3-end];
```

{% asset_img shangexian.png 栅格线 %}

可以在方括号中添加多个名称来命名网格线名称，使用多外名称命名网格线名称时，名称间要用空格隔开。每一个网格线的名称可以用来定位网格项目的位置

{% asset_img shangexianduomingming.png 栅格线多命名 %}

使用网格线名称设置网格项目位置和使用网格线号码设置网格项目位置类似，引用网格线名称的时候不应该带方括号

使用 repeat()函数可以给网格线分配相同的名称。这可以节省一定的时间。

```css
grid-template-rows: repeat(3, [row-start] 1fr [row-end]);

grid-template-columns: repeat(3, [col-start] 1fr [col-end]);
```

使用 repeat()函数可以给网格线命名，这也导致多个网格线具有相同的网格线名称。相同网格线名称指定网格线的位置和名称，也且会自动在网格线名称后面添加对应的数字，使其网格线名称也是唯一的标识符

{% asset_img shangexianrepeat.png repeat命名栅格线 %}

使用相同的网格线名称可以设置网格项目的位置。网格线的名称和数字之间需要用空格分开

```css
grid-row: row-start 2 / row-end 3;

grid-column: col-start / col-start 3;
```

### 网格区域命名

像网格线名称一样，网格区域的名称可以使用 grid-template-areas 属性来命名。引用网格区域名称也可以设置网格项目位置。

```css
grid-template-areas: 'header header' 'content sidebar' 'footer footer';

grid-template-rows: 150px 1fr 100px;

grid-template-columns: 1fr 200px;
```

设置网格区域的名称应该放置在单引号或双引号内，每个名称由一个空格符分开。网格区域的名称，每组（单引号或双引号内的网格区域名称）定义了网格的一行，每个网格区域名称定义网格的一列

**[注意]grid-template-areas: “header header” “content sidebar” “footer footer”;不可以简写为 grid-template-areas: “header” “content sidebar” “footer”;**

{% asset_img grid-template-areas.png grid-template-areas %}

grid-row-start、grid-row-end、grid-column-start 和 grid-column-end 以及简写的 grid-row、grid-column、grid-area 都可以引用网格区域名称，用来设置网格项目位置

### 元素定位

| 选项              | 说明         |
| :---------------- | :----------- |
| grid-row-start    | 行开始栅格线 |
| grid-row-end      | 行结束栅格线 |
| grid-column-start | 列开始栅格线 |
| grid-column-end   | 列结束栅格线 |

#### 根据栅格线

通过设置具体的第几条栅格线来设置区域位置，设置的数值可以是正数和负数：

<iframe height="435" scrolling="no" title="09-grid-栅格线" src="https://codepen.io/JingW/embed/oNgomod?height=435&amp;theme-id=default&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

#### 根据栅格命名

<iframe height="436" scrolling="no" title="10-grid-栅格线命名" src="https://codepen.io/JingW/embed/mdyqvgZ?height=436&amp;theme-id=default&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

#### 根据偏移量

使用 `span` 可以设置移动单元格数量，数值只能为正数。

- 设置在 `grid-*-end` 表示 `grid-*-end` 栅格线是从 `grid-*-start` 移动几个单元格
- 设置在 `grid-*-start` 表示 `grid-*-start` 栅格线是从 `grid-*-end` 移动几个单元格

<iframe height="445" scrolling="no" title="11-grid-偏移量" src="https://codepen.io/JingW/embed/dyPZrOE?height=445&amp;theme-id=default&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

#### [推荐]简写模式 grid-row/grid-column

可以使用 `grid-row` 设置行开始栅格线，使用 `grid-column` 设置结束栅格线。

上例中的居中对齐元素，可以使用以下简写的方式声明（推荐）。

```css
grid-row: 2/3;
grid-column: 2/3;
```

<iframe height="438" scrolling="no" title="12-grid-grid-row/grid-column简写形式" src="https://codepen.io/JingW/embed/bGNabrX?height=438&amp;theme-id=default&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

#### 简写形式 grid-area

`grid-area` 更加简洁是同时对 `grid-row` 与 `grid-column` 属性的组合声明。

语法结构如下：

```css
grid-row-start/grid-column-start/grid-row-end/grid-column-end
```

下面是将元素定位在中间的示例：

<iframe height="412" scrolling="no" title="13-grid-grid-area简写形式" src="https://codepen.io/JingW/embed/mdypbBQ?height=412&amp;theme-id=default&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

### 栅格流动

在容器中设置`grid-auto-flow` 属性可以改变单元流动方式。

| 选项   | 说明     |
| :----- | :------- |
| column | 按列排序 |
| row    | 按行排列 |

#### 栅格流动的基本使用

<iframe height="557" scrolling="no" title="14-grid-grid-auto-flow栅格流动" src="https://codepen.io/JingW/embed/gObobYm?height=557&amp;theme-id=default&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

#### 强制填充

当元素在栅格中放不下时，将会发生换行产生留白，使用 grid-auto-flow: row dense; 可以执行填充空白区域操作。

<iframe height="495" scrolling="no" title="15-grid-强制填充" src="https://codepen.io/JingW/embed/eYmymZX?height=495&amp;theme-id=default&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

### 栅格对齐

可以通过属性方便的定义栅格的对齐方式，可用值包括 `start | end | center | stretch | space-between | space-evenly | space-around`。

| 选项            | 说明                                             | 对象     |
| :-------------- | :----------------------------------------------- | :------- |
| align-items     | 栅格内所有元素的垂直排列方式                     | 栅格容器 |
| justify-items   | 栅格内所有元素的横向排列方式                     | 栅格容器 |
| justify-content | 所有栅格在容器中的水平对齐方式，容器有额外空间时 | 栅格容器 |
| align-content   | 所有栅格在容器中的垂直对齐方式，容器有额外空间时 | 栅格容器 |
| align-self      | 元素在栅格中垂直对齐方式                         | 栅格元素 |
| justify-self    | 元素在栅格中水平对齐方式                         | 栅格元素 |

<iframe height="559" scrolling="no" title="16-grid-元素对齐" src="https://codepen.io/JingW/embed/LYEeERG?height=559&amp;theme-id=default&amp;default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

#### 组合简写 place-content

用于控制栅格的对齐方式，语法如下：

```css
place-content: <align-content> <justify-content>;
```

#### 组合简写 place-items

控制所有元素的对齐方式，语法结构如下：

```css
place-items: <align-items> <justify-items>;
```

#### 组合简写 place-self

控制单个元素的对齐方式

```css
place-self: <align-self> <justify-self>;
```

### 参考资料

- [Grid 布局方式的实例详解](https://www.cnblogs.com/wangxiang9528/p/9867822.html)
