import {useNavigation} from '@react-navigation/native';
import {View, Pressable} from 'react-native';
import {Divider} from '@rneui/themed';
import Container from '../../component/Container';
import HeadBar from '../../component/HeadBar';
import {SubTitleBold} from '../../component/Text';
import {HistoryPageProps} from '../../type/route';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {FlatList} from 'react-native-gesture-handler';
import {V1RecommandInfoItem} from '../../component/ListItem';
import Context from '../../models';
import {useContext, useEffect, useRef, useState} from 'react';
import Anime from '../../models/Anime';
import Dialog from 'react-native-dialog';
import Follow from '../../models/Follow';
import {RecommandInfo} from '../../type/RecommandInfo';
import {UpdateMode} from 'realm';
import EndLine from '../../component/EndLine';
import {RoundButton} from '../../component/Button';
import alert from '../../component/Toast';
import ThemeContext from '../../theme';

const {useRealm, useQuery} = Context;

const FollowPage: React.FC<{}> = () => {
  const navigation = useNavigation<HistoryPageProps['navigation']>();
  const _follows = useQuery<Follow>(Follow);
  const [dialogVisible, setDialogVisible] = useState(false);
  const curItem = useRef<RecommandInfo>();
  const realm = useRealm();
  const [follows, setFollows] = useState<RecommandInfo[]>([]);
  const {DialogStyle} = useContext(ThemeContext).theme
  useEffect(() => {
    let follows = [..._follows]
      .filter(follow => follow.following)
      .reverse()
      .map(_follow => {
        const _animes = realm.objectForPrimaryKey(Anime, _follow.href);
        return {
          href: _follow.href,
          img: _animes!.img,
          title: _animes!.title,
          state: _animes!.state,
        };
      });
    setFollows(follows);
  }, [_follows]);

  const onDelete = (item: RecommandInfo) => {
    curItem.current = item;
    setDialogVisible(true);
  };

  const onOK = () => {
    const item = curItem.current;
    realm.write(() => {
      realm.create(
        Follow,
        {
          href: item!.href,
          following: false,
        },
        UpdateMode.Modified,
      );
    });
    setDialogVisible(false);
    alert('取消追番成功')
  };

  return (
    <Container>
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Description>{'确定取消追番吗?'}</Dialog.Description>
        <Dialog.Button
          color={DialogStyle.textColor}
          label="取消"
          onPress={() => setDialogVisible(false)}
        />
        <Dialog.Button
          color={DialogStyle.textColor}
          label="好的"
          onPress={onOK}
        />
      </Dialog.Container>
      <HeadBar
        onPress={() => {
          navigation.navigate('Tab');
        }}
        style={{paddingVertical: 20}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <SubTitleBold title="追番" />
          <Pressable>
            <FontAwesomeIcon icon={faMagnifyingGlass} color="grey" />
          </Pressable>
        </View>
      </HeadBar>
      <Divider />
      <FlatList
        data={follows}
        renderItem={({item, index}) => (
          <V1RecommandInfoItem
            onPress={() => navigation.navigate('Video', {url: item.href})}
            item={item}
            imgVerticle={true}
            index={index}>
            <RoundButton style={{marginRight: 20}} text="立即观看" />
            <Pressable onPress={() => onDelete(item)}>
              <RoundButton
                style={{marginVertical: 20, marginRight: 20}}
                text="取消追番"
              />
            </Pressable>
          </V1RecommandInfoItem>
        )}
        ItemSeparatorComponent={() => <Divider />}
        ListFooterComponent={
          <>
            <Divider />
            <EndLine />
          </>
        }
      />
    </Container>
  );
};

export default FollowPage;
