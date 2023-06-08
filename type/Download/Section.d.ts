import { TabName } from "../../route";
import ListItemInfo from "../ListItemInfo";
import RecmdInfo from "../RecmdInfo";
import Episode from "./Episode";

interface Section {
    infoUrl: string; //信息页的url
    episodes: Episode[]; //选集对应的每一集
    title: string;
    img: string;
    author: string;
    alias: string;
    state: string;
    time: string;
    type: ListItemInfo<string>[];
    produce: string;
    info: string;
    relatives: ListItemInfo<any>[];
    recommands?: RecmdInfo[];
    tabName: TabName,
    apiName: string,
}

export default Section;
