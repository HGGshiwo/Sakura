//下载任务

interface Task {
    tabName: TabName;
    downloadId: string; //属于哪个下载任务
    from: string; //从哪个网址下载
    to: string;   //下载到哪个文件中
}

export default Task;