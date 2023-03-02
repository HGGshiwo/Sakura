import { AnimePageInfo } from "../../../type/PageInfo/AnimePageInfo";

class Agent {
    load: Function;
    afterErr: Function;
    afterLoad(callback: (data: AnimePageInfo)=>void): void
}

export { Agent }