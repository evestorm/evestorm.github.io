---
title: Vue的v-if和v-show实现原理
tags:
  - Vue
categories:
  - 前端
  - 框架
  - Vue
  - 源码系列
abbrlink: 49974
date: 2021-08-02 14:35:00
---

# 页面表现

- v-if
  - true: 显示DOM
  - false: 用**注释节点占位**
  - **注释节点与DOM之间的切换**
- v-show
  - true: 不作处理（用户自己设置的 `display`）
  - false:  行内样式设置`**display: none**`
  - **行内样式：style or style="display: none"**

<!-- more -->

# 实现

## 思路

1. 对 data 进行**数据劫持**
2. **分析 ast 数**，找到元素绑定的 `v-if` 以及 `@methods` 事件函数
  1. 分别放进 **showPool 和 eventPool** 中（数据格式为 `Map`）
    1. showPool 数据格式
      1. key: DOM对象
      2. value: `{ type: 'if/show', prop: data.xxx }`
    2. eventPool 数据格式
      1. key: DOM对象
      2. value: `methods.xxx 方法`
3. **绑定事件**处理函数
4. **初次渲染**
  1. 如果遇到 v-if ，先给 showPool 中对应 value 加个 comment 注释节点用于后续占位
5. 用户触发 `methods` 事件函数
  1. data**数据更新**
  2. 触发了属性 setter
  3. 进行 `update` 更新页面


## 函数

- `initData` 数据响应式
  - 参数：
    - vm 实例（获取 vm.$data）
    - showPool（setter 触发，在 showPool 中找对应dom）
- `initPool` v-if、v-show、event 放进对应 pool
  - 参数：
    - template（ast树分析模板）
    - methods（找到事件函数）
    - showPool
    - eventPool
- `bindEvent` 事件绑定
  - 参数：
    - vm 实例（需要把方法放进实例）
    - eventPool（遍历 eventPool 挂载方法到 实例 上）
- `render` 页面渲染
  - 参数：
    - vm 实例（vm.$data 查模板绑定的属性；vm.$el 找到根容器最后把模板 append 进去）
    - showPool（遍历 pool 根据绑定属性的 true、false 初始化页面的显示状态）
    - container（append 进根容器）
- `update` 页面更新
  - vm 实例（获取属性值）
  - key（那个属性更新了）
  - showPool（找到相应key的DOM更新）

showPool：

{% asset_img 1645884012619-84958914-d101-4ec9-b6bf-ece41aed2770.png 100% %}

eventPool：

{% asset_img 1645884042516-4e587e7d-e55b-48c2-8088-93f6a06c9a70.png 100% %}

## 实现代码

```javascript
/**
 * showPool Map {dom: {}}
 * [
 *  [
 *    dom,
 *    {
 *      type: if/show
 *      prop: data下边的对应属性
 *     }
 *  ]
 * ]
 *
 * eventPool
 * 
 * [
 *   [
 *    dom,
 *    handler
 *   ]
 * ]
 */

var Vue = (function() {
	function Vue(options) {
    // el
    this.$el = document.querySelector(options.el);
    this.$data = options.data();
    
    this._init(this, options.template, options.methods);
  }
  
  Vue.prototype._init = function(vm, template, methods) {

    var container = document.createElement('div');
    container.innerHTML = template;

    var showPool = new Map();
    var eventPool = new Map();
    initData(vm, showPool); // 更新的时候要用到showPool
    initPool(container, methods, showPool, eventPool);
    bindEvent(vm, eventPool);
    render(vm, showPool, container);
  }

  function initData(vm, showPool) {
    var _data = vm.$data;

    for (var key in _data) {
      (function(key) {
        Object.defineProperty(vm, key, {
          get: function() {
            return _data[key];
          },
          set: function(newVal) {
            // this.isShowImg1 = true;
            _data[key] = newVal;
            update(vm, key, showPool)
          }
        });
      })(key);
    }
  }

  function initPool(container, methods, showPool, eventPool) {
    var _allNodes = container.getElementsByTagName('*');
    var dom = null;
    for (var i = 0; i < _allNodes.length; i++) {
      dom = _allNodes[i];
      
      var vIfData = dom.getAttribute('v-if');
      var vShowData = dom.getAttribute('v-show');
      var vEvent = dom.getAttribute('@click');

      if (vIfData) {
        showPool.set(
          dom,
          {
            type: 'if',
            prop: vIfData
          }
        )
        dom.removeAttribute('v-if');
      } else if (vShowData) {
        showPool.set(
          dom,
          {
            type: 'show',
            prop: vShowData
          }
        )
        dom.removeAttribute('v-show');
      }

      if (vEvent) {
        eventPool.set(
          dom,
          methods[vEvent]
        )
        dom.removeAttribute('@click');
      }
    }
    console.log(eventPool);
  }

  function bindEvent(vm, eventPool) {
    for (var [dom, handler] of eventPool) {
      vm[handler.name] = handler;
      dom.addEventListener('click', vm[handler.name].bind(vm), false);
    }
  }

  function render(vm, showPool, container) {
    var _data = vm.$data;
    var _el = vm.$el;

    for (var [dom, info] of showPool) {
      switch (info.type) {
        case 'if':
          info.comment = document.createComment('v-if');
          // 如果为假，就用 comment 节点替换 dom 节点
          // replaceChild(newNode, oldNode);
          !_data[info.prop] && dom.parentNode.replaceChild(info.comment, dom);
          break;
        case 'show':
          // 如果为假，就设置display为none
          !_data[info.prop] && (dom.style.display = 'none');
          break;
        default:
          break;
      }
    }

    _el.appendChild(container);
  }

  function update(vm, key, showPool) {
    var _data = vm.$data;

    for (var [dom, info] of showPool) {
      if (info.prop === key) {
        switch (info.type) {
          case 'if':
            !_data[key] ? dom.parentNode.replaceChild(info.comment, dom)
                        : info.comment.parentNode.replaceChild(dom, info.comment);
            break;
          case 'show':
            !_data[key] ? (dom.style.display = 'none')
                        : (dom.removeAttribute('style'));
            break;
          default:
            break;
        }
      }
    }
  }

  return Vue;
})();
  
export default Vue;
```