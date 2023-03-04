import {useNavigation} from '@react-navigation/native';
import {View, Pressable} from 'react-native';
import {Divider} from '@rneui/themed';
import Container from '../../component/Container';
import HeadBar from '../../component/HeadBar';
import {InfoText, SubTitleBold} from '../../component/Text';
import {HistoryPageProps} from '../../type/route';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {FlatList} from 'react-native-gesture-handler';
import {V1RecommandInfoItem} from '../../component/ListItem';
import Context from '../../models';
import {useEffect, useRef, useState} from 'react';
import Anime from '../../models/Anime';
import Dialog, {
  DialogContent,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
import Follow from '../../models/Follow';
import {RecommandInfo} from '../../type/RecommandInfo';
import {UpdateMode} from 'realm';
import EndLine from '../../component/EndLine';

const {useRealm, useQuery} = Context;

const FollowPage: React.FC<{}> = () => {
  const navigation = useNavigation<HistoryPageProps['navigation']>();
  const _follows = useQuery<Follow>(Follow);
  const [dialogVisible, setDialogVisible] = useState(false);
  const curItem = useRef<RecommandInfo>();
  const realm = useRealm();
  const [follows, setFollows] = useState<RecommandInfo[]>([]);

  useEffect(() => {
    let follows = [..._follows]
      .reverse()
      .filter(follow => follow.following)
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
  };

  return (
    <Container>
      <Dialog
        visible={dialogVisible}
        width={0.8}
        footer={
          <DialogFooter>
            <DialogButton
              textStyle={{fontSize: 14, color: 'deeppink'}}
              text="取消"
              onPress={() => setDialogVisible(false)}
            />
            <DialogButton
              textStyle={{fontSize: 14, color: 'deeppink'}}
              text="好的"
              onPress={onOK}
            />
          </DialogFooter>
        }>
        <DialogContent>
          <InfoText
            style={{alignSelf: 'center', paddingTop: 20}}
            title="确定删除吗?"
          />
        </DialogContent>
      </Dialog>
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
            item={item}
            imgVerticle={true}
            index={index}
            onPress={() => navigation.navigate('Video', {url: item.href})}
            onDelete={onDelete}
          />
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
