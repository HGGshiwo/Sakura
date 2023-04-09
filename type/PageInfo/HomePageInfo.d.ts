import { RecommandInfo } from "../RecommandInfo";
import { DailyInfo } from '../DailyInfo'
import { Section } from "../Section";
import { Route } from "react-native-tab-view";

interface HomePageInfo {
  carousels: RecommandInfo[],
  sections: Section[],
}

export default HomePageInfo;