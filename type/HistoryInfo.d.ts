import { RecommandInfo } from "./RecommandInfo";

interface HistoryInfo extends RecommandInfo{
    progress:number; //进度
    progressPre:number; //进度百分比
    
}

export {HistoryInfo}