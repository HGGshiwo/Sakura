import { RecommandInfo } from "../RecommandInfo";
import { DailyInfo } from '../DailyInfo'
import { Section } from "../Section";

interface AnimePageInfo {
  carousels: RecommandInfo[],
  dailys?: DailyInfo[][], //第一个维度是每周的第几天
  rankings: RecommandInfo[], //动画排行榜
  sections: Section[],
}