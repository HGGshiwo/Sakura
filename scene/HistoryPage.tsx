import {useNavigation, useRoute} from '@react-navigation/native';
import {View, Pressable, StyleSheet} from 'react-native';
import {Divider} from '@rneui/themed';
import Container from '../component/Container';
import HeadBar from '../component/HeadBar';
import {SubInfoText, SubTitleBold} from '../component/Text';
import {HistoryPageProps} from '../route';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {V1HistoryInfoItem} from '../component/ListItem';
import Context from '../models';
import History from '../models/HistoryDb';
import {useContext, useEffect, useRef, useState} from 'react';
import HistoryInfo from '../type/HistoryInfo';
import Dialog from 'react-native-dialog';
import EndLine from '../component/EndLine';
import alert from '../component/Toast';
import {SwipeListView} from 'react-native-swipe-list-view';
import RecmdInfo from '../type/RecmdInfo';
import SectionDb from '../models/SectionDb';
import useTheme from '../zustand/Theme';

const {useRealm, useQuery} = Context;
const targets = {
  Anime: 'Video',
  Comic: 'Image',
  Novel: 'Text',
};
const HistoryPage: React.FC<{}> = () => {
  const route = useRoute<HistoryPageProps['route']>();
  const {tabName} = route.params;
  const navigation = useNavigation<HistoryPageProps['navigation']>();
  const _historys = useQuery<History>(History);
  const [dialogVisible, setDialogVisible] = useState(false);
  const curItem = useRef<HistoryInfo & RecmdInfo>();
  const realm = useRealm();
  const [historys, setHistorys] = useState<(HistoryInfo & RecmdInfo)[]>([]);
  const {DialogStyle} = useTheme().theme;

  useEffect(() => {
    let historys = [..._historys.sorted('time', true)]
      .map(_history => {
        const _animes = realm.objectForPrimaryKey(
          SectionDb,
          _history.infoUrl,
        )!;
        return {
          ..._history.extract(),
          ..._animes.toRecmdInfo(),
        };
      })
      .filter(history => history.tabName === tabName);
    setHistorys(historys);
  }, [_historys]);

  const onDelete = (item: HistoryInfo & RecmdInfo) => {
    curItem.current = item;
    setDialogVisible(true);
  };

  const onOK = () => {
    const item = curItem.current;
    setDialogVisible(false);
    realm.write(() => {
      const history = realm.objectForPrimaryKey(History, item!.infoUrl);
      realm.delete(history);
    });
    alert('删除成功');
  };

  return (
    <Container>
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Description>{'确定删除吗?'}</Dialog.Description>
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
          <SubTitleBold title="历史记录" />
          <Pressable>
            <FontAwesomeIcon icon={faMagnifyingGlass} color="grey" />
          </Pressable>
        </View>
      </HeadBar>
      <Divider />
      <SwipeListView
        data={historys}
        keyExtractor={item => item.infoUrl}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({item, index}) => (
          <V1HistoryInfoItem
            item={item}
            index={index}
            onPress={() =>
              navigation.navigate(targets[tabName] as any, {
                url: item.infoUrl,
                apiName: item.apiName,
              })
            }
          />
        )}
        rightOpenValue={-75}
        renderHiddenItem={({item, index}, rowMap) => (
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Pressable style={styles.hiddenRow} onPress={() => onDelete(item)}>
              <SubInfoText title="删除历史" style={{color: 'white'}} />
            </Pressable>
          </View>
        )}
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

export default HistoryPage;
