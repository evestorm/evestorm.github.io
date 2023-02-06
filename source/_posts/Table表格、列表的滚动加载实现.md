---
title: Table表格、列表的滚动加载实现
tags:
  - React
  - 转载
categories:
  - 前端
  - 框架
  - React
abbrlink: 43963
date: 2022-12-18 13:16:41
---

转载自：<https://blog.csdn.net/weixin_42333548/article/details/124661215>

<!-- more -->

## 方案一：给table起一个className，监听当前table下的.ant-table-body元素的滚动(推荐)

主要实现逻辑：

1. 在table外包一个div，添加滚动事件onScrollCapture
2. 给table起一个类名，目的是为了获取table下ant-table-body的元素：let element = document.querySelectorAll[`.tableRect .ant-table-body`](0)
3. 判断依据 element.scrollTop + element.clientHeight === element.scrollHeight 说明到底了，页码加1，重新走请求数据逻辑，获取到的数据和所有已展示的数据做合并即可

```js
import React, { useState } from 'react';
import { Table } from 'antd';
import api from 'api/api';
 
const TableListPromise: React.FC<any> = (props) => {
  const [rows, setRows] = useState(10); // 每页10条
  const [total, setTotal] = useState(0); // 总条数
  const [dataSource, setDataSource] = useState([]); // 数据
  const [isMore, setIsMore] = useState<boolean>(true); // 是否还有数据 false-已经到底
  const [pageNo, setPageNo] = useState<number>(1); // 页码
 
  const getList = (page = 1) => {
    api.list({ page, rows }).then((res) => {
      const { data } = res.data;
      if (data) {
        const { total, rows } = data;
        setTotal(total);
        setDataSource(page == 1 ? rows : [...dataSource, ...rows]);
      }
    });
  };
 
  const onScrollCapture = () => {
    // 滚动的容器
    let tableEleNodes = document.querySelectorAll(`.tableRect .ant-table-body`)[0];
    if (
      Math.round(tableEleNodes?.scrollTop) + tableEleNodes?.clientHeight ==
      tableEleNodes?.scrollHeight
    ) {
      if (total === dataSource.length) {
        // 做自己到底啦的业务逻辑处理  已经到底啦~
        setIsMore(false);
        return false;
      }
      console.log('-----pageNo+1-----', pageNo + 1);
      getList(pageNo + 1);
      setPageNo(pageNo + 1);
    }
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'rownum',
      key: 'rownum',
      width: '15%',
      render: (text, record, index) => index + 1,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '就诊医院',
      dataIndex: 'orgName',
      key: 'orgName',
      width: '35%',
    },
    {
      title: '居住地址',
      dataIndex: 'addr',
      key: 'addr',
      width: '30%',
    },
  ];
  return (
    <div className="tablecontainer" onScrollCapture={onScrollCapture}>
      <Table
        className={`tableRect`}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ y: 240 }}
        rowKey={() => Math.random()}
      />
      {!isMore ? <div className="no-more">已经到底啦</div> : null}
    </div>
  );
};
 
export default TableListPromise;
```

## 方案二：控制样式，隐藏antd table表格的头部，自己写一个

直接在Table组件外面包一个div，通过这个div的滚动事件onScrollCapture来实现

```js
 
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import api from 'api/api';
 
const TableListPromise = (props) => {
 
  const [isMore, setIsMore] = useState(true); // 是否还有数据
  const [page, setPage] = useState(1); // 页码
  const [rows, setRows] = useState(10); // 每页10条
  const [total, setTotal] = useState(0); // 总条数
  const [dataSource, setDataSource] = useState([]); // 数据
 
  let scrollRef;
 
  const getList = (page = 1) => {
    api
      .list({ page, rows })
      .then((res) => {
        const { data } = res.data;
        if (data) {
          const { total, rows } = data;
          setTotal(total);
          setDataSource(page == 1 ? rows : [...dataSource, ...rows]);
        }
      });
  };
 
  const onScrollCapture = (e) => {
    // scrollTop会有小数点导致等式不成立，解决方案：四舍五入
    if (
      Math.round(scrollRef.scrollTop) + scrollRef.clientHeight == scrollRef.scrollHeight
    ) {
      if (Math.ceil(total / rows) == page) {
        setIsMore(false);
        return false;
      }
      getList(page + 1);
      setPage(page + 1);
    }
  };
 
  const columns = [
    {
      title: '序号',
      dataIndex: 'rownum',
      key: 'rownum',
      width: '15%',
      render: (text, record, index) => index + 1
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '20%'
    },
    {
      title: '就诊医院',
      dataIndex: 'orgName',
      key: 'orgName',
      width: '35%'
    },
    {
      title: '居住地址',
      dataIndex: 'addr',
      key: 'addr',
      width: '30%'
    }
  ];
 
  return (
    <div className="list-page">
      <ul className="table-header">
        {columns.map((item) => (
          <li style={{ width: item.width }} key={item.key}>
            {item.title}
          </li>
        ))}
      </ul>
      <div
        onScrollCapture={onScrollCapture}
        style={{ height: 320, overflowY: 'scroll' }}
        ref={(c) => {
          scrollRef = c;
        }}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          size="small"
          pagination={false}
          rowKey="idNo"
        />
        {!isMore ? <div className="no-more">已经到底啦</div> : null}
      </div>
    </div>
  );
};
 
export default TableListPromise;
```

需要注意两点：1、为了固定表头，直接控制样式隐藏掉了antd的表头自己手写；2、scrollTop会有小数点导致等式不成立，解决方案：四舍五入。
