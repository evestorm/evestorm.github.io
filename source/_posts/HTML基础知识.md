---
title: HTML基础知识
tags:
  - 笔记
categories:
  - 前端
  - HTML
abbrlink: 29404
date: 2021-10-04 14:31:41
---

# 元素

## 🌈 常见元素种类

- 行内元素 `inline`
   - 不会独占一行；相邻的排同一行；一行排不下会换行
   - 不可设置宽高
   - `pending`、`margin` **水平方向上设置有效**，垂直方向上无效
- 行内块元素 `inline-block`
   - 和其他元素同一行（行内元素特点）
   - 可以设置宽高（块级元素特点）
   - `pending`、`margin` 设置有效
- 块级元素 `block`
   - 独占一行
   - 可以设置宽高
   - `pending`、`margin` 设置有效

<!-- more -->

## a标签作用

- 超链接 `<a href="link">link</a>`
- 打电话 `<a href="tel:18722232223">联系我们</a>`
- 发邮件 `<a href="mailto:evelance@gmail.com">发送邮件</a>`
- 锚点定位 `<a href="#div1">去id为div1的位置去</a>`
- 协议限定符 `<a href="javascript:alert('hello world')">打开弹窗</a>`
   - 禁止刷新页面：`<a href="javascript:;">无法跳转</a>` （`javascript:;`）


## 🌈 元素嵌套

- 内联元素可以嵌套内联元素
- 块元素能嵌套任何元素
- **p标签不能嵌套div**
- **a标签不能嵌套a标签**
  
# 表格table

- table `display: table`
   - attr
      - `border` 边框
      - `cellpadding` 单元格内边距
      - `cellspacing` 单元格边距
   - `caption` 标题标签 `display: table-caption`
   - `tr` - table row 表格行标签 `display: table-row`
      - `th` - table header cell 表头标签 `display: table-cell`
      - `td` - table data cell 单元格标签 `display: table-cell`
         - `rowspan` - 合并n行
         - `colspan` - 合并n列
         - align - left|right|center 对齐方式
   - `thead` - table head 表格页眉标签 `display: table-header-group`
   - `tfoot` - table foot 表格页尾标签 `display: table-footer-group`
   - `tbody` - table body 表格主体标签 `display: table-row-group`

## 🌈 注意点

   - `thead、tfoot、tbody` 要写的意义：
      - 不写，如果数据多，整个表格会等数据完全加载完后才显示；如果都写了，页眉和页尾则不用等数据完全加载完就会先展示出来
   - 加载顺序：`thead -> tfoot -> tbody` 
      - 就算把 `tfoot` 写在 `thead` 前面，也不会影响它们的显示顺序，`thead` 还是会在 `tfoot` 上面显示


## 示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <table border="1" cellpadding="10" cellspacing="10">
    <caption>用户</caption>
    <thead>
      <tr>
        <th>ID</th>
        <th>姓名</th>
        <th>电话</th>
        <th>年龄</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Lance</td>
        <td>18722212223</td>
        <td>26</td>
      </tr>
      <tr>
        <td>2</td>
        <td>GC</td>
        <td>18677721122</td>
        <td>30</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Jerry</td>
        <!-- 合并n列 -->
        <td colspan="2">colspan合并2列</td>
      </tr>
      <tr>
        <td>4</td>
        <td>QB</td>
        <td>17699921242</td>
        <td rowspan="2">rowspan合并2行</td>
      </tr>
      <tr>
        <td>5</td>
        <td>Sherry</td>
        <td>18677721122</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="4" align="right">合并整行</td>
      </tr>
    </tfoot>
  </table>
</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/260235/1640847575350-112fda5e-261f-4897-94ea-f74f9d120d84.png#clientId=ud00dc4d5-9b71-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=406&id=uf13fa7f1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=406&originWidth=413&originalType=binary&ratio=1&rotation=0&showTitle=false&size=26447&status=done&style=none&taskId=u73045727-c14a-458d-9168-1522c2c3bae&title=&width=413)

# 表单 form

```html
<form method="GET" action="">
  <p>
    用户名：<input type="text" name="username" />
  </p>
  <p>
    密码：<input type="password" name="password" />
  </p>
  <p>
    <input type="button" value="登录" />
  </p>
</form>

提交后url: ?username=lance&password=123
```
## label

```html
<form method="GET" action="">
  <label for="username">用户名：</label>
  <input type="text" id="username" name="username" />
  

  <label for="password">密码：</label>
 	<input type="password" name="password" />
  <p>
    <input type="button" value="登录" />
  </p>
</form>
```
## radio

- name 用来把多个 input 分成一组单选
- 值是 value

```html
<form method="GET" action="">
	<input
         type="radio" 
         id="male" 
         name="sex" 
         checked="checked"
         value="male" />
  <label for="male">男士</label>
  <input 
         type="radio" 
         id="female" 
         name="sex"
         value="female" />
  <label for="female">女士</label>
</form>
```

## checkbox

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <form action="" method="get">
    <input
      type="checkbox"
      id="java"
      name="language"
      value="java">
    <label for="java">Java</label>
    <input
      type="checkbox"
      id="php"
      name="language"
      value="php">
    <label for="php">PHP</label>
    <input type="submit" value="提交">
  </form>
</body>
</html>
```

## select

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <form action="" method="get">
    <select name="lang">
      <option value="">请选择</option>
      <option value="js">JavaScript</option>
      <option value="html">HTML</option>
      <option value="css">CSS</option>
    </select>
    <input type="submit" value="提交">
  </form>
</body>
</html>
```
## textarea

- cols 可见宽度 公式：8px(英文字符) * cols + 17px(滚动条宽度)【只是个近似值】
- rows 可见行数

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <form action="" method="get">
    <textarea id="context" name="context" cols="30" rows="10"></textarea>
    <input type="submit" value="提交">
  </form>
</body>
</html>
```

### 🌈 不要换行写，否则会导致有空格
因为 textarea 是在标签之间写内容，所以换行也会被当做内容，只不过内容是空白的。
```html
<textarea cols="30" rows="10"></textarea>
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/260235/1634261809468-80698a11-eea9-4a9a-8178-6604f916ceba.png#clientId=u2c9f9e9b-3264-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=202&id=u13fc315e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=404&originWidth=662&originalType=binary&ratio=1&rotation=0&showTitle=false&size=10047&status=done&style=none&taskId=u2b260a38-7fd2-494e-ad45-e850ee549cc&title=&width=331)

```html
<textarea cols="30" rows="10">
</textarea>
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/260235/1634261840738-2e16403b-cbd5-4bf4-a4f0-d48b9f650ce2.png#clientId=u2c9f9e9b-3264-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=193&id=u3186c475&margin=%5Bobject%20Object%5D&name=image.png&originHeight=386&originWidth=626&originalType=binary&ratio=1&rotation=0&showTitle=false&size=11097&status=done&style=none&taskId=ue75249e6-770f-43a9-a313-9119ea31c5d&title=&width=313)

### 🌈 获取值用 value 不用 innerHTML

- value 获取的是纯文本
- innerHTML 获取的是元素中的HTML，不止是文本

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <textarea cols="30" rows="10">123123<div></textarea>
  <script>
    var text = document.getElementsByTagName("textarea")[0];
    console.log("text.value: ", text.value);
    console.log("text.innerHTML: ", text.innerHTML);
    console.log("text.innerText: ", text.innerText);
  </script>
</body>
</html>
```

![image.png](https://cdn.nlark.com/yuque/0/2021/png/260235/1634262145396-ed8f88dc-c31e-4019-92dc-1fb815f31ac3.png#clientId=u2c9f9e9b-3264-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=291&id=uf4cdfcb4&margin=%5Bobject%20Object%5D&name=image.png&originHeight=582&originWidth=680&originalType=binary&ratio=1&rotation=0&showTitle=false&size=35280&status=done&style=none&taskId=u44943cbc-0e8f-487a-8ee6-d5cc7fa3c46&title=&width=340)

## MD5加密

- 是一种消息摘要的算法
   - 是不可逆加密算法（一旦加密，倒过来无法解密 ）
   - 这种加密是不需要额外的秘钥

# HTML字符实体

> [html字符实体](https://www.w3school.com.cn/html/html_entities.asp)

- `&lt;` => `<` 小于
- `&gt;` => `>` 大于 
- `&nbsp;` => ` ` 空格


# HTML语义化

对语义化的理解：

- 语义清晰，便于团队开发
- 利于SEO（搜索引擎优化）
  
## SEO

一种搜索引擎的搜索规则，可利用它来提高网站在搜索结果中的排名
前端SEO实践与注意点：

- 实践：
   - `<head>` 标签中：
      - `title`：言简意赅，需要体现出页面的主要内容
      - `description`：对页面内容的高度概括
      - `keywords`：列举出网站重要关键词
- 注意点：
   - 重要内容不要js输出，爬虫不会执行JS获取内容
   - 非装饰性图片必须加alt
   - 提高网站访问速度
