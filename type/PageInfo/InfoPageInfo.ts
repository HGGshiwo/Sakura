import ListItemInfo from "../ListItemInfo";
import  RecmdInfo  from "../RecmdInfo";

interface InfoPageInfo {
    title: string,
    img: string,
    author: string,
    alias: string,
    state: string,
    time: string,
    type: ListItemInfo<string>[]
    produce: string,
    recommands: RecmdInfo[],
    sources: ListItemInfo<string>[],
    info: string,
    relatives: ListItemInfo<any>[]
}

export default InfoPageInfo;