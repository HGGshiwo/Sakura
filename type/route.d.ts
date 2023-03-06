import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
    Anime: undefined;
    Video: { url: string };
    Search: undefined;
    AnimeHome: undefined;
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

type VideoPageProps = NativeStackScreenProps<RootStackParamList, 'Video'>;
type SearchPageProps = NativeStackScreenProps<RootStackParamList, 'Search'>;
type AnimePageProps = NativeStackScreenProps<RootStackParamList, 'Anime'>;
type AnimeHomeProps = NativeStackScreenProps<RootStackParamList, 'AnimeHome'>;
type AnimeOtherProps = NativeStackScreenProps<RootStackParamList, 'AnimeOther'>;
type CategoryPageProps = NativeStackScreenProps<RootStackParamList, 'Category'>;
type IndexPageProps = NativeStackScreenProps<RootStackParamList, 'Index'>;
type UserPageProps = NativeStackScreenProps<RootStackParamList, 'User'>;
type FollowPageProps = NativeStackScreenProps<RootStackParamList, 'Follow'>;
type HistoryPageProps = NativeStackScreenProps<RootStackParamList, 'History'>;
type NoParamProps = NativeStackScreenProps<RootStackParamList, 'NoParam'>;
export type {
  VideoPageProps,
  SearchPageProps,
  AnimePageProps,
  AnimeHomeProps,
  AnimeOtherProps,
  CategoryPageProps,
  IndexPageProps,
  UserPageProps,
  FollowPageProps,
  NoParamProps, 
  HistoryPageProps,
};