class Vp {
    constructor(url: string);
    title: string;
    episode: string;
    src: string;
    load(callback: Function): void;
}

export { Vp }