import * as scene from '../scene';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
type TabName = 'Comic' | 'Novel' | 'Anime'
const targets: Record<'Anime' | 'Comic' | 'Novel', 'Video' | 'Image' | 'Text'> = {
  Anime: 'Video',
  Comic: 'Image',
  Novel: 'Text',
};
const tabRoutes = [
  { name: 'Anime', component: scene.MainPage, initialParams: { tabName: 'Anime' } },
  { name: 'Comic', component: scene.MainPage, initialParams: { tabName: 'Comic' } },
  { name: 'Novel', component: scene.MainPage, initialParams: { tabName: 'Novel' } },
  { name: 'User', component: scene.UserPage, }
]
const routes = [
  { name: 'Tab', component: scene.TabPage },
  { name: 'Video', component: scene.VideoPage },
  { name: 'Image', component: scene.ImagePage },
  { name: 'Text', component: scene.TextPage },
  { name: 'Search', component: scene.SearchPage },
  { name: 'Category', component: scene.CategoryPage },
  { name: 'Index', component: scene.IndexPage },
  { name: 'History', component: scene.HistoryPage },
  { name: 'Follow', component: scene.FollowPage },
  { name: 'Ranking', component: scene.RankingPage },
  { name: 'Schedule', component: scene.SchedulePage },
  { name: 'DownloadDetail', component: scene.DownloadDetailPage },
  { name: "DownloadSection", component: scene.DownloadSectionPage }
];
type RootStackParamList = {
  MainPage: { tabName: TabName }; //Tab的三个页面
  TabPage: { tabName: TabName };
  Video: { url: string, apiName: string }; //Anime信息页面
  Image: { url: string, apiName: string }; //Comic信息页面
  Text: { url: string, apiName: string }; //Novel信息页面
  Search: { tabName: TabName };
  Category: { tabName: TabName, apiName: string, url: string; title: string };
  Index: { tabName: TabName, apiName: string, url: string, title: string };
  Ranking: { tabName: TabName, apiName: string };
  Schedule: { tabName: TabName, apiName: string };
  User: undefined;
  History: { tabName: TabName };
  Follow: { tabName: TabName };
  DownloadSection: { tabName: TabName };
  DownloadDetail: { infoUrl: string };
};
type TabPageProps = NativeStackScreenProps<RootStackParamList, 'TabPage'>;
type VideoPageProps = NativeStackScreenProps<RootStackParamList, 'Video'>;
type ImagePageProps = NativeStackScreenProps<RootStackParamList, 'Image'>
type TextPageProps = NativeStackScreenProps<RootStackParamList, 'Text'>
type SearchPageProps = NativeStackScreenProps<RootStackParamList, 'Search'>;
type MainPageProps = NativeStackScreenProps<RootStackParamList, 'MainPage'>;
type CategoryPageProps = NativeStackScreenProps<RootStackParamList, 'Category'>;
type IndexPageProps = NativeStackScreenProps<RootStackParamList, 'Index'>;
type UserPageProps = NativeStackScreenProps<RootStackParamList, 'User'>;
type HistoryPageProps = NativeStackScreenProps<RootStackParamList, 'History'>;
type FollowPageProps = NativeStackScreenProps<RootStackParamList, 'Follow'>
type RankingPageProps = NativeStackScreenProps<RootStackParamList, 'Ranking'>
type SchedulePageProps = NativeStackScreenProps<RootStackParamList, 'Schedule'>
type DownloadDetailPageProps = NativeStackScreenProps<RootStackParamList, 'DownloadDetail'>
type DownloadSectionPageProps = NativeStackScreenProps<RootStackParamList, 'DownloadSection'>

export type {
  TabPageProps,
  VideoPageProps, //信息页
  ImagePageProps,
  TextPageProps,
  SearchPageProps,
  MainPageProps,
  CategoryPageProps,
  IndexPageProps,
  UserPageProps,
  FollowPageProps,
  HistoryPageProps,
  RankingPageProps,
  SchedulePageProps,
  DownloadSectionPageProps,
  DownloadDetailPageProps,
  TabName,
};
export { targets, routes, tabRoutes }