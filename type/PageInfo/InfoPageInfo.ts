import { ListItemInfo } from "../ListItemInfo";
import  RecmdInfo  from "../RecommandInfo";

interface InfoPageInfo {
    title: string,
    img: string,
    author: string,
    alias: string,
    state: string,
    time: string,
    type: ListItemInfo[]
    produce: string,
    recommands: RecmdInfo[],
    sources: ListItemInfo[],
    info: string,
    relatives: ListItemInfo[]
}

export default InfoPageInfo;