import VideoPageInfo from "../../../type/VideoPageInfo"

class Agent {
    constructor(url: string);
    load(): void;
    loadVideoSrc(url:string, callback: Function):void
    afterLoad(callback: (data: VideoPageInfo)=>void): void
}

export { Agent }