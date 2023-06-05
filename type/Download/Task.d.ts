//下载任务

interface Task {
    infoUrl: string; //属于哪个番剧
    taskUrl: string; //属于哪一集
    from: string; //从哪个网址下载
    to: string;   //下载到哪个文件中
    title: string; //需要显示的集标题
}

export default Task;