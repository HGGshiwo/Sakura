interface PlayerProps {
    ref?: RefObject<any>; // 播放器的ref
    dataAvailable: boolean; //数据源是否解析成功
    defaultFullscreen?: boolean; //是否全屏
    nextDataAvailable: boolean; //是否有下一个数据源
    data: any; //数据源，video要求指定type
    title: string; //播放器显示的标题
    onErr: Function; //数据加载错误
    onBack: () => void; //返回
    toNextSource: () => void; //加载下一个数据源
    onProgress: (progress: number, perProgress: number) => void; //进度更新时调用
    defaultProgress: number; //初始的进度
    renderAnthologys: (
        visible: boolean,
        setVisible: (visible: boolean) => void,
    ) => ReactNode; //如何渲染选集列表
    showPanel: () => void; //展示profile panel
    hidePanel: () => void;
    playerHeight: number; //player高度
    flashData?: boolean; //是否需要删除之前缓存的数据
}

export default PlayerProps