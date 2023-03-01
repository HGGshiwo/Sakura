import { RecommandInfo } from "./RecommandInfo";
import { Section } from "./Section";

interface AnimePageInfo {
  carousels: RecommandInfo[],
  dailys: RecommandInfo[][], //第一个维度是每周的第几天
  sections: Section[],
}