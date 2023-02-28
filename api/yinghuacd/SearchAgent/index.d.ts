import { ListItemInfo } from "../../../type/ListItemInfo";

class Agent {
    afterSearch: (callback: (result: ListItemInfo[])=>void)=>void;
    search: (arg: string)=>void;
}

export { Agent }