import { RecommandInfo } from "./RecommandInfo";

interface HistoryInfo extends RecommandInfo{
    href: string; //番剧地址
    apiName: string; //由于history可能被独立点击
    progress:number; //进度
    progressPer:number; //进度百分比
    anthologyIndex:number; //当前的选集
    anthologyTitle: string; //选集的名字
    time; //点击的时间
}

export default HistoryInfo;