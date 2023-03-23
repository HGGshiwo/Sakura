import { SearchInfo } from "../type/SearchInfo";
import loadScyinghuaSearchPage from "./scyinghua/search";
import loadYinghuacdSearchPage from "./yinghuacd/search";
import * as scyinghuaVideo from "./scyinghua/video";
import * as yinghuacdVideo from "./yinghuacd/video";
import loadScyinghuaHomePage from "./scyinghua/home";
import loadYinghuacdHomePage from "./yinghuacd/home";
import VideoPageInfo from "../type/VideoPageInfo";
import { Section } from "../type/Section";
import { RecommandInfo } from "../type/RecommandInfo";

const api: Record<string, { search: loadSearchPage, video: loadVideoPage, videoSrc: loadVideoSrc, home: loadHomePage }> = {
    yinghuacd: {
        search: loadYinghuacdSearchPage,
        video: yinghuacdVideo.default,
        videoSrc: yinghuacdVideo.loadVideoSrc,
        home: loadYinghuacdHomePage
    },
    scyinghua: {
        search: loadScyinghuaSearchPage,
        video: scyinghuaVideo.default,
        videoSrc: scyinghuaVideo.loadVideoSrc,
        home: loadScyinghuaHomePage,
    }
}

export default api;

type loadSearchPage = (text: string, callback: (_results: SearchInfo[]) => void) => void
type loadVideoPage = (url: string, callback: (data: VideoPageInfo) => void) => void;
type loadVideoSrc = (url: string, callback: (state: boolean, src?: string, type?: string) => void) => void;
type loadHomePage = (_afterLoad: (carousels: RecommandInfo[], sections: Section[]) => void, _afterErr?: (err: string) => void) => void;
export type {
    loadSearchPage,
}