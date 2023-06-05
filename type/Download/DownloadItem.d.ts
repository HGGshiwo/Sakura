//在info page显示的时候使用
import ListItemInfo from "../ListItemInfo";
type DownloadState = 'finish' | 'run' | 'ready';
type DownloadItem = ListItemInfo<string> & { state: DownloadState };

export default DownloadItem;
export { DownloadState }