class Agent {
    constructor(url: string);
    load(): void;
    loadVideoSrc(url:string, callback: Function):void
    afterLoadTitle(callback: Function): void;
    afterLoadInfo(callback: Function): void
    afterLoadInfoSub(callback: Function): void
    afterLoadSources(callback: Function): void
    afterLoadRelatives(callback: Function): void
    afterLoadRecommands(callback: Function): void
    afterLoadImgSrc(callback: Function):void
    
}

export { Agent }