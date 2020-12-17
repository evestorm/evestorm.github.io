---
title: 理解Vue中的computed用法以及和methods、watch的区别(摘录)
tags:
  - 笔记
  - Vue
categories:
  - 前端
  - 框架
  - Vue
abbrlink: 42683
date: 2019-10-23 13:49:12
---

摘录来源：https://www.cnblogs.com/tugenhua0707/p/11760466.html

## 一. 理解 Vue 中的 computed 用法

computed 是计算属性的; 它会根据所依赖的数据动态显示新的计算结果, 该计算结果会被缓存起来。computed 的值在 getter 执行后是会被缓存的。如果所依赖的数据发生改变时候, 就会重新调用 getter 来计算最新的结果。

下面我们根据官网中的 demo 来理解下 computed 的使用及何时使用 computed。

computed 设计的初衷是为了使模板中的逻辑运算更简单, 比如在 Vue 模板中有很多复杂的数据计算的话, 我们可以把该计算逻辑放入到 computed 中去计算。

<!-- more -->

下面我们看下官网中的一个 demo 如下:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>vue</title>
    <meta charset="utf-8" />
    <script
      type="text/javascript"
      src="https://cn.vuejs.org/js/vue.js"
    ></script>
  </head>
  <body>
    <div id="app">{{ msg.split('').reverse().join('') }}</div>
    <script type="text/javascript">
      new Vue({
        el: '#app',
        data: {
          msg: 'hello'
        }
      });
    </script>
  </body>
</html>
```

如上代码, 我们的 data 属性中的 msg 默认值为 ‘hello’; 然后我们在 vue 模板中会对该数据值进行反转操作后输出数据, 因此在页面上就会显示 ‘olleh’; 这样的数据。这是一个简单的运算, 但是如果页面中的运算比这个还更复杂的话, 这个时候我们可以使用 computed 来进行计算属性值, computed 的目的就是能使模板中的运算逻辑更简单。因此我们现在需要把上面的代码改写成下面如下代码：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>vue</title>
    <meta charset="utf-8" />
    <script
      type="text/javascript"
      src="https://cn.vuejs.org/js/vue.js"
    ></script>
  </head>
  <body>
    <div id="app">
      <p>原来的数据: {{ msg }}</p>
      <p>反转后的数据为: {{ reversedMsg }}</p>
    </div>
    <script type="text/javascript">
      var vm = new Vue({
        el: '#app',
        data: {
          msg: 'hello'
        },
        computed: {
          reversedMsg() {
            // this 指向 vm 实例
            return this.msg.split('').reverse().join('');
          }
        }
      });
    </script>
  </body>
</html>
```

如上代码, 我们在 computed 中声明了一个计算属性 reversedMsg。我们提供的 reversedMsg 函数, 将用作属性 vm.reversedMsg 的 getter 函数; 我们可以在上面实例化后代码中, 打印如下信息:

```js
console.log(vm);
```

打印信息如下所示, 我们可以看到 vm.reversedMsg = ‘olleh’;

{% asset_img computed-reversedMsg.png computed-reversedMsg %}

我们也可以打开控制台, 当我们修改 vm.msg 的值后, vm.reversedMsg 的值也会发生改变，如下控制台打印的信息可知:

[![img](<理解Vue中的computed用法以及和methods、watch的区别(摘录)/vm.msg.png>)](https://gitee.com/evestorm/various_resources/raw/master/vue/vm.msg.png)
{% asset_img vm-msg.png vm.msg %}

如上打印的信息我们可以看得到, 我们的 vm.reversedMsg 的值依赖于 vm.msg 的值，当 vm.msg 的值发生改变时, vm.reversedMsg 的值也会得到更新。

### computed 应用场景

1. 适用于一些重复使用数据或复杂及费时的运算。我们可以把它放入 computed 中进行计算, 然后会在 computed 中缓存起来, 下次就可以直接获取了。
2. 如果我们需要的数据依赖于其他的数据的话, 我们可以把该数据设计为 computed 中。

## 二：computed 和 methods 的区别?

如上 demo 代码, 如果我们通过在表达式中调用方法也可以达到同样的效果, 现在我们把代码改成方法, 如下代码:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>vue</title>
    <meta charset="utf-8" />
    <script
      type="text/javascript"
      src="https://cn.vuejs.org/js/vue.js"
    ></script>
  </head>
  <body>
    <div id="app">
      <p>原来的数据: {{ msg }}</p>
      <p>反转后的数据为: {{ reversedMsg() }}</p>
    </div>
    <script type="text/javascript">
      var vm = new Vue({
        el: '#app',
        data: {
          msg: 'hello'
        },
        /*
      computed: {
        reversedMsg() {
          // this 指向 vm 实例
          return this.msg.split('').reverse().join('')
        }
      }
      */
        methods: {
          reversedMsg() {
            // this 指向 vm 实例
            return this.msg.split('').reverse().join('');
          }
        }
      });
      console.log(vm);
    </script>
  </body>
</html>
```

如上代码, 我们反转后的数据在模板中调用的是方法 reversedMsg(); 该方法在 methods 中也定义了。那么也可以实现同样的效果, 那么他们之间到底有什么区别呢?

### computed 和 methods 区别是

1. computed 是基于响应性依赖来进行缓存的。只有在响应式依赖发生改变时它们才会重新求值, 也就是说, 当 msg 属性值没有发生改变时, 多次访问 reversedMsg 计算属性会立即返回之前缓存的计算结果, 而不会再次执行 computed 中的函数。但是 methods 方法中是每次调用, 都会执行函数的, methods 它不是响应式的。
2. computed 中的成员可以只定义一个函数作为只读属性, 也可以定义成 get/set 变成可读写属性, 但是 methods 中的成员没有这样的。

我们可以再看下如下 demo：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>vue</title>
    <meta charset="utf-8" />
    <script
      type="text/javascript"
      src="https://cn.vuejs.org/js/vue.js"
    ></script>
  </head>
  <body>
    <div id="app">
      <div>第一次调用computed属性: {{ reversedMsg }}</div>
      <div>第二次调用computed属性: {{ reversedMsg }}</div>
      <div>第三次调用computed属性: {{ reversedMsg }}</div>
      <!-- 下面是methods调用 -->
      <div>第一次调用methods方法: {{ reversedMsg1() }}</div>
      <div>第二次调用methods方法: {{ reversedMsg1() }}</div>
      <div>第三次调用methods方法: {{ reversedMsg1() }}</div>
    </div>
    <script type="text/javascript">
      var vm = new Vue({
        el: '#app',
        data: {
          msg: 'hello'
        },
        computed: {
          reversedMsg() {
            console.log(1111);
            // this 指向 vm 实例
            return this.msg.split('').reverse().join('');
          }
        },
        methods: {
          reversedMsg1() {
            console.log(2222);
            // this 指向 vm 实例
            return this.msg.split('').reverse().join('');
          }
        }
      });
      console.log(vm);
    </script>
  </body>
</html>
```

执行后的结果如下所示:

[![img](<理解Vue中的computed用法以及和methods、watch的区别(摘录)/mul-computed.png>)](https://gitee.com/evestorm/various_resources/raw/master/vue/mul-computed.png)

如上代码我们可以看到, 在 computed 中有属性 reversedMsg, 然后在该方法中会打印 1111; 信息出来, 在 methods 中的方法 reversedMsg1 也会打印 2222 信息出来, 但是在 computed 中, 我们除了第一次之后，再次获取 reversedMsg 值后拿得是缓存里面的数据, 因此就不会再执行该 reversedMsg 函数了。但是在 methods 中, 并没有缓存, 每次执行 reversedMsg1()方法后，都会打印信息。
从上面截图信息我们就可以验证的。

那么我们现在再来理解下缓存的作用是什么呢? computed 为什么需要缓存呢? 我们都知道我们的 http 也有缓存, 对于一些静态资源, 我们 nginx 服务器会缓存我们的静态资源，如果静态资源没有发生任何改变的话, 会直接从缓存里面去读取,这样就不会重新去请求服务器数据, 也就是避免了一些无畏的请求, 提高了访问速度, 优化了用户体验。

对于我们 computed 的也是一样的。如上面代码, 我们调用了 computed 中的 reversedMsg 方法一共有三次，如果我们也有上百次调用或上千次调用的话, 如果依赖的数据没有改变, 那么每次调用都要去计算一遍, 那么肯定会造成很大的浪费。因此 computed 就是来优化这件事的。

## 三：Vue 中的 watch 的用法

watch 它是一个对 data 的数据监听回调, 当依赖的 data 的数据变化时, 会执行回调。在回调中会传入 newVal 和 oldVal 两个参数。
Vue 实列将会在实例化时调用$watch(), 他会遍历 watch 对象的每一个属性。

### watch 的使用场景是

当在 data 中的某个数据发生变化时, 我们需要做一些操作, 或者当需要在数据变化时执行异步或开销较大的操作时. 我们就可以使用 watch 来进行监听。

#### watch 普通监听和深度监听

如下普通监听数据的基本测试代码如下:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>vue</title>
    <meta charset="utf-8" />
    <script
      type="text/javascript"
      src="https://cn.vuejs.org/js/vue.js"
    ></script>
  </head>
  <body>
    <div id="app">
      <p>空智个人信息情况: {{ basicMsg }}</p>
      <p>
        空智今年的年龄:
        <input type="text" v-model="age" />
      </p>
    </div>
    <script type="text/javascript">
      var vm = new Vue({
        el: '#app',
        data: {
          basicMsg: '',
          age: 31,
          single: '单身'
        },
        watch: {
          age(newVal, oldVal) {
            this.basicMsg = '今年' + newVal + '岁' + ' ' + this.single;
          }
        }
      });
    </script>
  </body>
</html>
```

显示效果如下：

{% asset_img single.png single %}

如上代码, 当我们在 input 输入框中输入年龄后, 比如 32, 那么 watch 就能对 ‘age’ 这个属性进行监听，当值发生改变的时候, 就会把最新的计算结果赋值给 ‘basicMsg’ 属性值, 因此最后在页面上就会显示 ‘basicMsg’ 属性值了。

#### 理解 handler 方法及 immediate 属性

如上 watch 有一个特点是: 第一次初始化页面的时候, 是不会去执行 age 这个属性监听的, 只有当 age 值发生改变的时候才会执行监听计算. 因此我们上面第一次初始化页面的时候, ‘basicMsg’ 属性值默认为空字符串。那么我们现在想要第一次初始化页面的时候也希望它能够执行 ‘age’ 进行监听, 最后能把结果返回给 ‘basicMsg’ 值来。因此我们需要修改下我们的 watch 的方法，需要引入 handler 方法和 immediate 属性, 代码如下所示:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>vue</title>
    <meta charset="utf-8" />
    <script
      type="text/javascript"
      src="https://cn.vuejs.org/js/vue.js"
    ></script>
  </head>
  <body>
    <div id="app">
      <p>空智个人信息情况: {{ basicMsg }}</p>
      <p>
        空智今年的年龄:
        <input type="text" v-model="age" />
      </p>
    </div>
    <script type="text/javascript">
      var vm = new Vue({
        el: '#app',
        data: {
          basicMsg: '',
          age: 31,
          single: '单身'
        },
        watch: {
          age: {
            handler(newVal, oldVal) {
              this.basicMsg = '今年' + newVal + '岁' + ' ' + this.single;
            },
            immediate: true
          }
        }
      });
    </script>
  </body>
</html>
```

如上代码, 我们给我们的 age 属性绑定了一个 handler 方法。其实我们之前的 watch 当中的方法默认就是这个 handler 方法。但是在这里我们使用了 immediate: true; 属性，含义是: 如果在 watch 里面声明了 age 的话, 就会立即执行里面的 handler 方法。如果 immediate 值为 false 的话,那么效果就和之前的一样, 就不会立即执行 handler 这个方法的。因此设置了 immediate:true 的话,第一次页面加载的时候也会执行该 handler 函数的。即第一次 basicMsg 有值。

因此第一次页面初始化效果如下：

{% asset_img single-2.png single-2 %}

#### 理解 deep 属性

watch 里面有一个属性为 deep，含义是：是否深度监听某个对象的值, 该值默认为 false。

如下测试代码:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>vue</title>
    <meta charset="utf-8" />
    <script
      type="text/javascript"
      src="https://cn.vuejs.org/js/vue.js"
    ></script>
  </head>
  <body>
    <div id="app">
      <p>空智个人信息情况: {{ basicMsg }}</p>
      <p>
        空智今年的年龄:
        <input type="text" v-model="obj.age" />
      </p>
    </div>
    <script type="text/javascript">
      var vm = new Vue({
        el: '#app',
        data: {
          obj: {
            basicMsg: '',
            age: 31,
            single: '单身'
          }
        },
        watch: {
          obj: {
            handler(newVal, oldVal) {
              this.basicMsg =
                '今年' + newVal.age + '岁' + ' ' + this.obj.single;
            },
            immediate: true,
            deep: true // 需要添加deep为true即可对obj进行深度监听
          }
        }
      });
    </script>
  </body>
</html>
```

如上测试代码, 如果我们不把 deep: true 添加的话,当我们在输入框中输入值的时候，改变 obj.age 值后，obj 对象中的 handler 函数是不会被执行到的。受 JS 的限制, Vue 不能检测到对象属性的添加或删除的。它只能监听到 obj 这个对象的变化,比如说对 obj 赋值操作会被监听到。比如在 mounted 事件钩子函数中对我们的 obj 进行重新赋值操作, 如下代码:

```js
mounted() {
  this.obj = {
    age: 22,
    basicMsg: '',
    single: '单身'
  };
}
```

最后我们的页面会被渲染到 age 为 22; 因此这样我们的 handler 函数才会被执行到。如果我们需要监听对象中的某个属性值的话, 我们可以使用 deep 设置为 true 即可生效。deep 实现机制是: 监听器会一层层的往下遍历, 给对象的所有属性都加上这个监听器。当然性能开销会非常大的。

当然我们可以直接对对象中的某个属性进行监听的，比如就对 ‘obj.age’ 来进行监听， 如下代码也是可以生效的。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>vue</title>
    <meta charset="utf-8" />
    <script
      type="text/javascript"
      src="https://cn.vuejs.org/js/vue.js"
    ></script>
  </head>
  <body>
    <div id="app">
      <p>空智个人信息情况: {{ basicMsg }}</p>
      <p>
        空智今年的年龄:
        <input type="text" v-model="obj.age" />
      </p>
    </div>
    <script type="text/javascript">
      var vm = new Vue({
        el: '#app',
        data: {
          obj: {
            basicMsg: '',
            age: 31,
            single: '单身'
          }
        },
        watch: {
          'obj.age': {
            handler(newVal, oldVal) {
              this.basicMsg = '今年' + newVal + '岁' + ' ' + this.obj.single;
            },
            immediate: true
            // deep: true // 需要添加deep为true即可对obj进行深度监听
          }
        }
      });
    </script>
  </body>
</html>
```

#### watch 和 computed 的区别

相同点：他们两者都是观察页面数据变化的。

不同点：computed 只有当依赖的数据变化时才会计算, 当数据没有变化时, 它会读取缓存数据。
watch 每次都需要执行函数。watch 更适用于数据变化时的异步操作。
