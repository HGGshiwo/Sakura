## 下载功能

新建任务：

1. 点击下载按钮
2. 数据库中新建一个下载任务，包含所有需要下载的ts文件以及完成的文件
3. 在队列中插入个ts任务
4. 查看是否激活任务



激活任务：

1. 如果达到当前最大下载数则返回
2. 如果当前队列为空则返回
3. 将若干个任务开始下载



下载完成：

1. 在数据库中修改任务的完成的部分

