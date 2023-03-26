import { InfoSub } from "../InfoSub";
import { ListItemInfo } from "../ListItemInfo";
import { RecommandInfo } from "../RecommandInfo";
import { Source } from "../Source";

type ComicPageInfo = {
    title: string,
    img: string,
    infoSub: InfoSub,
    recommands: RecommandInfo[],
    sources: Source[],
    info: string,
    relatives: ListItemInfo[]
}

export default ComicPageInfo;