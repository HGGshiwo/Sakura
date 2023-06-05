//除了RecmdItemInfo之外需要记录的信息

interface HistoryInfo {
    progress:number; //进度
    progressPer:number; //进度百分比
    anthologyIndex:number; //当前的选集
    anthologyTitle: string; //选集的名字
    time; //点击的时间
}

export default HistoryInfo;