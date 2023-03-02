import CategoryPageInfo from "../../../type/PageInfo/CategoryPageInfo";
import { Section } from "../../../type/Section";

class Agent {
    constructor();
    afterLoad: (callback: (data: CategoryPageInfo) => void) => void;
    load: (arg: string) => void;
}

export { Agent }