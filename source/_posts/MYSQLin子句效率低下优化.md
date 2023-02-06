---
title: MYSQLin子句效率低下优化
tags:
  - MYSQL
categories:
  - 后端
  - 数据库
  - MYSQL
abbrlink: 44625
date: 2023-01-03 17:02:15
---

连表查询遇到个问题：

```sql
SELECT
  t2.id AS videoId,
  t2.title AS videoName,
  uId AS upName
FROM
  t_xinwu_comment_video t1
LEFT JOIN
  t._xinwu_video t2
ON
  t2.id = t1.bId
WHERE t1.uId IN ('up0196956', 'up0196956', 'up0197018', 'upo197299',  'upo197268')
```

表数据才1000多条，但是查询耗时接近5s，肯定哪儿出了问题，开始以为是没索引的问题，后边发现两张表都有索引。最后查资料有人说可以在 in 外边包一层，当临时表处理，能够提高查询效率：

<!-- more -->

```sql
SELECT
 video.id AS videoId,
 video.title AS videoName,
 commentList.uId AS upName
FROM
(
 SELECT
    comment.uId,
    comment.bId
  FROM
    t_xinwu_comment_video AS comment
  WHERE
    comment.uId in ('up0196956', 'up0196956', 'up0197018', 'upo197299',  'upo197268')
) AS commentList
 LEFT JOIN
t_xinwu_video AS video
 ON
commentList.bId = video.id
```

改成这样后就只需要0.4s左右了，在此记录下。
