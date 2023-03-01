import { InfoSub } from "./InfoSub";
import { RecommandInfo } from "./RecommandInfo";
import { Source } from "./Source";

interface VideoPageInfo {
    title: string,
    img: string,
    infoSub: InfoSub,
    recommands: RecommandInfo[],
    sources: Source[],
    info: string
}

export default VideoPageInfo;