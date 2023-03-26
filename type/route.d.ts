import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
    TabPage: {tabName: 'Comic'|'Novel'|'Anime'};
    Anime: undefined;
    Video: { url: string };
    Search: {tabName: 'Comic'|'Novel'|'Anime'};
    MainPage: {tabName: 'Comic'|'Novel'|'Anime'};
    AnimeOther: undefined;
    Category: { url: string; title: string };
    Tab: undefined;
    Index: { url: string, title: string };
    User: undefined;
    History: undefined;
    Follow: undefined;
    NoParam: undefined; //不会进入，只会跳出
    Ranking: undefined;
    Schedule: undefined;
};
type TabPageProps = NativeStackScreenProps<RootStackParamList, 'TabPage'>;
type VideoPageProps = NativeStackScreenProps<RootStackParamList, 'Video'>;
type SearchPageProps = NativeStackScreenProps<RootStackParamList, 'Search'>;
type AnimePageProps = NativeStackScreenProps<RootStackParamList, 'Anime'>;
type MainPageProps = NativeStackScreenProps<RootStackParamList, 'MainPage'>;
type AnimeOtherProps = NativeStackScreenProps<RootStackParamList, 'AnimeOther'>;
type CategoryPageProps = NativeStackScreenProps<RootStackParamList, 'Category'>;
type IndexPageProps = NativeStackScreenProps<RootStackParamList, 'Index'>;
type UserPageProps = NativeStackScreenProps<RootStackParamList, 'User'>;
type FollowPageProps = NativeStackScreenProps<RootStackParamList, 'Follow'>;
type HistoryPageProps = NativeStackScreenProps<RootStackParamList, 'History'>;
type NoParamProps = NativeStackScreenProps<RootStackParamList, 'NoParam'>;
export type {
  TabPageProps,
  VideoPageProps,
  SearchPageProps,
  AnimePageProps,
  MainPageProps,
  AnimeOtherProps,
  CategoryPageProps,
  IndexPageProps,
  UserPageProps,
  FollowPageProps,
  NoParamProps, 
  HistoryPageProps,
};