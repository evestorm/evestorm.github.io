---
title: Element-ui轮播图el-carousel组件虚拟列表实现方案
tags:
  - 技巧
categories:
  - 前端
  - UI
  - element-ui
abbrlink: 2528
date: 2023-07-13 14:27:11
---

## 背景

公司大屏项目有一块地方用到了 el-carousel 组件，但是数据量比较大（3000多条），导致页面卡顿，所以需要对 el-carousel 组件进行优化。

## 思路方案

利用虚拟列表技术，每次只渲染可视区域的数据，不可视区域的数据不渲染，这样就可以减少渲染的数据量，提高渲染性能。

具体思路是，不论自动轮播还是手动点击指示器，都会触发 el-carousel 的 change 事件，我们可以在 change 事件中获取当前可视区域的数据，然后将数据传给 el-carousel 组件，这样就可以实现虚拟列表的效果。

---

## 具体实现

首先，要达到上面的效果，需要配置循环滚动，`el-carousel-item` 只需要三个就可以。我们把列表变量定义为 `visibleList`:

```html
<el-carousel
trigger="click"
:interval='5000'
v-show="appList.length !== 0"
:initial-index="0"
@change="pageChange"
indicator-position="none"
ref="carouselRef"
>
    <el-carousel-item
      v-for="(item, index) in visibleList"
      :key="index"
    >
      <div class="apps">
        <App
          v-for="(app, ind) in item"
          :key="ind"
          :item='app'
        >
        </App>
      </div>
    </el-carousel-item>
</el-carousel>
```

然后就是监听切换的动作，显示对应下标的内容。`el-carousel` 组件中提供 `change` 事件，事件回传一个 `index` 参数表示当前页的索引，当前返回的只有0、1、2三个，往后切换的顺序是0 - 1 - 2 - 0，往前切换的顺序是0 - 2 - 1 - 0，了解了切换规律就可以确定是current值是增加还是减少了。代码如下：

```html
<template>
  <Container title="应用复制状态监控" center='true'>
    <template v-slot:box-content>
      <el-carousel
        trigger="click"
        :interval='5000'
        v-show="appList.length !== 0"
        :initial-index="0"
        @change="pageChange"
        indicator-position="none"
        ref="carouselRef"
      >
        <el-carousel-item
          v-for="(item, index) in visibleList"
          :key="index"
        >
          <div class="apps">
            <App
              v-for="(app, ind) in item"
              :key="ind"
              :item='app'
            >
            </App>
          </div>
        </el-carousel-item>
        <ul class="el-carousel__indicators el-carousel__indicators--horizontal">
          <li class="el-carousel__indicator el-carousel__indicator--horizontal"
            v-for="(item, idx) of appList"
            :key="idx"
            :class="{ 'is-active': idx === currentIdx }"
            @click="goToPage(idx)"
          >
            <button class="el-carousel__button"></button>
          </li>
        </ul>
      </el-carousel>
    </template>
  </Container>
</template>

<script>
import Container from '../container.vue';
import App from '../application.vue';

export default {
  name: 'Footer',
  props: {
    data: { // 父组件传递的数据
      required: true,
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      appList: [], // 应用系统列表
      currentIdx: 0, // 当前索引
      prevIndex: 0, // 前一次索引
      toIndex: 0, // 要跳转的下标
      customSwiper: false // 用于判断是否自定义的切换
    }
  },
  computed: {
    // 用来展示的计算过的轮播列表
    visibleList() {
      const ls = [];
      ls[this.prevIndex] = this.appList[this.currentIdx];
      const prev = this.appList[this.currentIdx - 1] || '';
      const next = this.appList[this.currentIdx + 1] || '';
      if (this.prevIndex === 0) {
        ls[1] = next;
        ls[2] = prev;
      } else if (this.prevIndex === 2) {
        ls[1] = prev;
        ls[0] = next;
      } else {
        ls[0] = prev;
        ls[2] = next;
      }
      return ls;
    }
  },
  watch: {
    data() {
      // 如果后端轮播数据少于24个，就不需要分页；否则24个一组分页
      this.appList = this.data.applicationMonitorList.length <= 24
        ? [this.data.applicationMonitorList]
        : this.sliceArray(this.data.applicationMonitorList, 24);
    }
  },
  methods: {
    sliceArray(array, chunkSize) {
      const result = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
      }
      return result;
    },
    pageChange(index, oldIdx) {
      // 如果是手动点击轮播图指示器
      if (this.customSwipe) {
        this.currentIdx = this.toIndex;
        this.customSwipe = false;
      } else {
        // 如果是自动轮播
        if (index - this.prevIndex === 1 || index - this.prevIndex === -2) {
          // 往后切换
          if (this.currentIdx === this.appList.length - 1) {
            this.currentIdx = 0;
          } else {
            ++this.currentIdx;
          }
        }
        if (index - this.prevIndex === -1 || index - this.prevIndex === 2) {
          // 往前切换
          if (this.currentIdx === 0) {
            this.currentIdx = this.appList.length - 1;
          } else {
            --this.currentIdx;
          }
        }
      }
      this.prevIndex = index;
    },
    goToPage(idx) {
      // 需要切换的下标大于当前，用next方法模拟
      if (this.currentIdx < idx) {
        this.$refs.carouselRef.next();
      }
      // 反之，使用prev方法
      if (this.currentIdx > idx) {
        this.$refs.carouselRef.prev();
      }
      this.customSwipe = true; // 用于判断是否自定义的切换
      this.toIndex = idx; // 跳转的下标
    }
  },
  components: {
    Container,
    App
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../../assets/css/hatech';

/deep/ .el-carousel--horizontal {
  position: absolute;
  height: 100%;
}
/deep/ .el-carousel__container {
  height: 94%;
}
/deep/ .el-carousel__button {
  width: ha-px-vw(25px);
}
.apps {
  width: 98%;
  height: 100%;
  display: flex;
  padding: ha-px-vh(20px) ha-px-vw(15px);
  justify-content: space-between;
  align-content: space-around;
  flex-wrap: wrap;
}

.el-carousel {
  position: relative;
}
</style>
```