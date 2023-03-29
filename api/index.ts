import { SearchInfo } from "../type/SearchInfo";
import InfoPageInfo from "../type/PageInfo/InfoPageInfo";
import { Section } from "../type/Section";
import  RecommandInfo  from "../type/RecommandInfo";
import * as Comic from "./Comic";
import * as Anime from './Anime';
import * as Novel from './Novel';

import ComicPageInfo from "../type/PageInfo/ComicPageinfo";

const api: Record<string, Record<string, {
    search: loadSearchPage,
    info?: loadInfoPage,
    player?: loadPlayerData,
    home: loadHomePage,
    all?: loadAllPage,
}>> = {
    Comic,
    Anime,
    Novel,
}

export default api;

type loadSearchPage = (text: string, callback: (_results: SearchInfo[]) => void) => void
type loadInfoPage = (url: string, callback: (data: InfoPageInfo) => void) => void;
type loadPlayerData = (url: string, callback: (state: boolean, data: any) => void) => void;
type loadHomePage = (_afterLoad: (carousels: RecommandInfo[], sections: Section[]) => void, _afterErr?: (err: string) => void) => void;
type loadComicSrc = (url: string, callback: (data: string[]) => void) => void;
type loadComicPage = (url: string, callback:(data: ComicPageInfo)=>void)=>void;
type loadAllPage = (url: string, callback: (data: RecommandInfo[])=>void)=>void;
export type {
    loadSearchPage,
    loadInfoPage,
    loadPlayerData,
    loadHomePage,
    loadComicSrc,
    loadComicPage,
    loadAllPage,
}