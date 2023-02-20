class Agent {
    constructor(url: string);
    load(): void;
    afterLoadTitle(callback: Function): void;
    afterLoadInfo(callback: Function): void
    afterLoadInfoSub(callback: Function): void
    afterLoadPlayList(callback: Function): void
}

export { Agent }