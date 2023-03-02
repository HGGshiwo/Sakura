import { AnimePageInfo } from "../../../type/AnimePageInfo";

class Agent {
    load: Function;
    afterErr: Function;
    afterLoad(callback: (data: AnimePageInfo)=>void): void
}

export { Agent }