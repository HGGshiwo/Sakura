import {useEffect, useRef, useState} from 'react';
import {View, FlatList} from 'react-native';
import {SearchBar} from '../../component/SearchBar';
import {InfoText} from '../../component/Text';
import {Divider} from '@rneui/themed';
import {SearchInfo} from '../../type/SearchInfo';
import {V1SearchInfoItem} from '../../component/ListItem';
import HeadBar from '../../component/HeadBar';
import {LoadingContainer} from '../../component/Loading';
import {useNavigation} from '@react-navigation/native';
import {SearchPageProps} from '../../type/route';
import Container from '../../component/Container';
import loadPage from '../../api/yinghuacd/search';
import {FollowButton, RoundButton} from '../../component/Button';
import Context from '../../models';
import Anime from '../../models/Anime';
import {UpdateMode} from 'realm';
import Follow from '../../models/Follow';
import Toast from 'react-native-root-toast';

const {useRealm} = Context;

interface Props {}

const SearchPage: React.FC<Props> = () => {
  const [results, setResults] = useState<SearchInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [follows, setFollows] = useState<boolean[]>([]); //是否追番

  const navigation = useNavigation<SearchPageProps['navigation']>();
  const realm = useRealm();

  const onChangeText = (text: string) => {
    setLoading(true);
    loadPage(text, _results => {
      setResults(_results);
      const _follows = _results.map(_result => {
        const follow = realm.objectForPrimaryKey(Follow, _result.href);
        return !!follow && follow.following;
      });
      setFollows(_follows);
      setLoading(false);
    });
  };

  const onPress = (item: SearchInfo, index: number) => {
    //更新番剧数据库
    realm.write(() => {
      realm.create(
        Anime,
        {
          href: item.href,
          img: item.img,
          state: item.state,
          title: item.title,
        },
        UpdateMode.Modified,
      );
    });
    //更新追番记录
    realm.write(() => {
      realm.create(
        Follow,
        {
          href: item.href,
          following: !follows[index],
        },
        UpdateMode.Modified,
      );
    });
    const _follows = [...follows];
    _follows[index] = !_follows[index];
    setFollows([..._follows]);

    Toast.show(`${!follows![index] ? '' : '取消'}追番成功`, {
      backgroundColor: 'rgba(0,0,0,0.5)',
      textStyle: {fontSize: 14},
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };

  return (
    <Container>
      <HeadBar
        onPress={() => {
          navigation.navigate('Anime');
        }}>
        <SearchBar
          style={{marginLeft: 10}}
          loading={loading}
          onChangeText={onChangeText}
          autoFocus={true}
        />
      </HeadBar>

      <LoadingContainer loading={loading}>
        <FlatList
          contentContainerStyle={{paddingHorizontal: 15}}
          ItemSeparatorComponent={() => {
            return <Divider />;
          }}
          keyExtractor={item => `${item.id}`}
          data={results}
          renderItem={({item, index}) => {
            return (
              <V1SearchInfoItem
                item={item}
                index={index}
                onPress={() => {
                  navigation.navigate('Video', {url: item.href});
                }}>
                <RoundButton style={{marginVertical: 20}} text="立即观看" />
                <FollowButton
                  onPress={() => onPress(item, index)}
                  followed={follows![index]}
                />
              </V1SearchInfoItem>
            );
          }}
          ListEmptyComponent={() => (
            <View style={{width: '100%', alignItems: 'center'}}>
              <InfoText title="找不到结果" />
            </View>
          )}
        />
      </LoadingContainer>
    </Container>
  );
};

export default SearchPage;
