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
};

type VideoPageProps = NativeStackScreenProps<RootStackParamList, 'Video'>;
type SearchPageProps = NativeStackScreenProps<RootStackParamList, 'Search'>;
type AnimePageProps = NativeStackScreenProps<RootStackParamList, 'Anime'>;
type AnimeHomeProps = NativeStackScreenProps<RootStackParamList, 'AnimeHome'>;
type AnimeOtherProps = NativeStackScreenProps<RootStackParamList, 'AnimeOther'>;
type CategoryPageProps = NativeStackScreenProps<RootStackParamList, 'Category'>;
type IndexPageProps = NativeStackScreenProps<RootStackParamList, 'Index'>;
type UserPageProps = NativeStackScreenProps<RootStackParamList, 'User'>;

export type {
    VideoPageProps,
    SearchPageProps,
    AnimePageProps,
    AnimeHomeProps,
    AnimeOtherProps,
    CategoryPageProps,
    IndexPageProps,
    UserPageProps,
};