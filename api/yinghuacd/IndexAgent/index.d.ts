import { SearchInfo } from "../../../type/SearchInfo";

class Agent {
    constructor();
    afterSearch: (callback: (result: SearchInfo[])=>void)=>void;
    search: (arg: string[])=>void;
}

export { Agent }