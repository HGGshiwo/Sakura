//在管理界面显示的时候使用
import RecmdInfo from "../RecmdInfo";

type DownloadItemInfo = RecmdInfo & { progress: number; taskUrl: string}
export default DownloadItemInfo;