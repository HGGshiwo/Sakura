//在info page显示的时候使用
import ListItemInfo from "../ListItemInfo";
type DownloadItem = ListItemInfo<string> & { start: boolean, finish: boolean };

export default DownloadItem;