import RecmdInfo from "../RecmdInfo";
import { DailyInfo } from '../DailyInfo'
import { Section } from "../Section";
import { Route } from "react-native-tab-view";

interface HomePageInfo {
  carousels: RecmdInfo[],
  sections: Section[],
}

export default HomePageInfo;