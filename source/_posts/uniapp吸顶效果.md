---
title: uniapp吸顶效果
tags:
  - 布局
  - uniapp
categories:
  - 前端
  - JS
abbrlink: 7733
date: 2019-12-19 21:03:41
---

## 场景

{% asset_img 吸顶效果.gif 吸顶效果 %}

## 案例

<iframe height="502" scrolling="no" title="列表标题吸顶效果" src="https://codepen.io/JingW/embed/GRgWvKb?height=502&amp;theme-id=default&amp;default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 997.594px;"></iframe>

<!-- more -->

## uni-app 写法

> template 结构

```html
<!-- 运营概况 -->
<view class="main">
  <view class="main-title" ref="operationRef" data-id="operationRef">
    <text class="left">运营概况</text>
    <view class="right">
      <view>我的</view>
      <view>全店</view>
    </view>
  </view>
  <!-- ================== 主体内容 =================== -->
  <view class="overview-com">...</view>
</view>
<!-- 运营概况 -->
<view class="main">
  <view class="main-title" ref="operationRef" data-id="operationRef">
    <text class="left">宴会概况</text>
    <view class="right">
      <view>我的</view>
      <view>全店</view>
    </view>
  </view>
  <!-- ================== 主体内容 =================== -->
  <view class="overview-com">...</view>
</view>
```

> js

```js
export default {
	data() {
		return {
			...,
			mainTitleEles: [], // 所有mainTitle标题对象集合
			mainEles: [], // 所有板块对象集合
			ot: [], //存储每个标题的offsetTop
			len: 0, // 标题的个数
			searchBottomY: 0, // 搜索view底部距离页面顶部的距离
			selectorQuery: {}, // Uniapp SelectorQuery 对象实例
		}
	},
	mounted() {
    // 获取 SelectorQuery 对象实例。可以在这个实例上使用 select 等方法选择节点
		this.selectorQuery = uni.createSelectorQuery().in(this);
		this.initFixedTop();
	},
	methods: {
		// --------------- 监听 mescroll 页面滚动 ------------------------
		// 初始化吸顶标题的工作
		initFixedTop() {
			// 获取所有需要吸顶效果的标题
			this.mainTitle = this.selectorQuery.selectAll('.main-title');
			uni.createSelectorQuery().selectAll('.main-title').fields({
				rect: true,
				dataset: true
			}, res => {
				this.mainTitleEles = res;
				// 标题的个数
				this.len = this.mainTitleEles.length;
				for (let i = 0; i < this.len; i++) {
					this.ot.push(this.mainTitleEles[i].top); //获取每个标题的offsetTop
				}
				// 获取所有需要吸顶的板块
				uni.createSelectorQuery().selectAll('.main').fields({
					rect: true,
					dataset: true,
					size: true
				}, res => {
					this.mainEles = res;
					// 存储每个标题的offsetTop（只读属性，返回当前元素相对于其 offsetParent 元素的顶部内边距的距离）
					// 加上 最后一个吸顶板块的高度. 解决滚动到最后一个标题（i）时，无法获取（i+1）的offsetTop
					this.ot.push(this.mainEles[this.len - 1].top + this.mainEles[this.len - 1].height);
				}).exec();
			}).exec();
		},
		onScroll(mescroll) {
			// 获取滚动的高度
			const st = mescroll.scrollTop;
			for (let i = 0; i < this.len; i++) {
				// 滚动时监听位置，为标题的吸顶设置一个显示范围
				if (st > this.ot[i] && st < this.ot[i + 1]) {
					this.$refs[this.mainTitleEles[i].dataset.id].$el.className = 'main-title fixed';
				} else {
					this.$refs[this.mainTitleEles[i].dataset.id].$el.className = 'main-title';
				}
			}
		},
  }
};
```

uni-app 思路和案例 demo 一样，所以就不贴代码的样式了，唯一要注意的一点就是 dom 属性的获取是通过 uni-app [相关 API](https://uniapp.dcloud.io/api/ui/nodes-info?id=nodesrefboundingclientrect) 实现的：

## 参考

- [uni-app 获取 dom 元素到顶部的距离以及操作 dom 元素的一些样式](https://www.cnblogs.com/angenstern/p/11752432.html)
- [uni.createSelectorQuery()](https://uniapp.dcloud.io/api/ui/nodes-info?id=nodesrefboundingclientrect)
- [实现多个标题的吸顶效果](https://blog.csdn.net/zhongshanxian/article/details/81415760)
