import { SearchInfo } from "../type/SearchInfo";
import loadScyinghuaSearchPage from "./scyinghua/search";
import loadYinghuacdSearchPage from "./yinghuacd/search";
import * as scyinghuaVideo from "./scyinghua/video";
import * as yinghuacdVideo from "./yinghuacd/video";


export default {
    yinghuacd: {
        search: loadYinghuacdSearchPage,
        video: yinghuacdVideo.default,
        videoSrc: yinghuacdVideo.loadVideoSrc
    },
    scyinghua:{
        search: loadScyinghuaSearchPage,
        video: scyinghuaVideo.default,
        videoSrc: scyinghuaVideo.loadVideoSrc
    }
}

type loadSearchPage = (text: string, callback: (_results: SearchInfo[])=>void)=>void

export type {
    loadSearchPage,
}