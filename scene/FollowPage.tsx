import {useNavigation, useRoute} from '@react-navigation/native';
import {View, Pressable, StyleSheet} from 'react-native';
import {Divider} from '@rneui/themed';
import Container from '../component/Container';
import HeadBar from '../component/HeadBar';
import {SubInfoText, SubTitleBold} from '../component/Text';
import {FollowPageProps} from '../route';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {V1RecmdInfoItem} from '../component/ListItem';
import Context from '../models';
import {useContext, useEffect, useRef, useState} from 'react';
import Dialog from 'react-native-dialog';
import Follow from '../models/FollowDb';
import RecmdInfo from '../type/RecmdInfo';
import EndLine from '../component/EndLine';
import {SwipeListView} from 'react-native-swipe-list-view';
import alert from '../component/Toast';
import {targets} from '../route';
import FollowDb from '../models/FollowDb';
import SectionDb from '../models/SectionDb';
import useTheme from '../zustand/Theme';

const {useRealm, useQuery} = Context;

type FollowItem = RecmdInfo & {following: boolean};

const FollowPage: React.FC<{}> = () => {
  const route = useRoute<FollowPageProps['route']>();
  const {tabName} = route.params;
  const navigation = useNavigation<FollowPageProps['navigation']>();
  const _follows = useQuery<Follow>(Follow);
  const [dialogVisible, setDialogVisible] = useState(false);
  const curItem = useRef<FollowItem>();
  const realm = useRealm();
  const [follows, setFollows] = useState<FollowItem[]>([]);
  const {DialogStyle} = useTheme().theme;
  useEffect(() => {
    let follows = [..._follows]
      .filter(follow => follow.following)
      .reverse()
      .map(_follow => {
        const _animes = realm.objectForPrimaryKey(
          SectionDb,
          _follow.infoUrl,
        )!;
        return {..._animes.toRecmdInfo(), following: _follow.following};
      })
      .filter(follow => follow.tabName === tabName);
    setFollows(follows);
  }, [_follows]);

  const onDelete = (item: FollowItem) => {
    curItem.current = item;
    setDialogVisible(true);
  };

  const onOK = () => {
    const item = curItem.current!;
    FollowDb.update(realm, item.infoUrl, false);
    setDialogVisible(false);
    alert('取消追番成功');
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
        onPress={() => navigation.goBack()}
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
      <SwipeListView
        data={follows}
        keyExtractor={item => item.infoUrl}
        renderItem={({item, index}) => (
          <V1RecmdInfoItem
            onPress={() =>
              navigation.navigate(targets[tabName] as any, {
                url: item.infoUrl,
                apiName: item.apiName,
              })
            }
            item={item}
            imgVerticle={true}
            index={index}
          />
        )}
        renderHiddenItem={({item, index}, rowMap) => (
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Pressable style={styles.hiddenRow} onPress={() => onDelete(item)}>
              <SubInfoText title="取消追番" style={{color: 'white'}} />
            </Pressable>
          </View>
        )}
        rightOpenValue={-75}
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

const styles = StyleSheet.create({
  hiddenRow: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'red',
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
  },
});

export default FollowPage;
