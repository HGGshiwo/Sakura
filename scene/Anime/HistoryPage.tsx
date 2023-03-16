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
import {V1HistoryInfoItem} from '../../component/ListItem';
import Context from '../../models';
import History from '../../models/History';
import {useContext, useEffect, useRef, useState} from 'react';
import Anime from '../../models/Anime';
import HistoryInfo from '../../type/HistoryInfo';
import Dialog from 'react-native-dialog';
import EndLine from '../../component/EndLine';
import {faTrashCan} from '@fortawesome/free-regular-svg-icons';
import alert from '../../component/Toast';
import ThemeContext from '../../theme';

const {useRealm, useQuery} = Context;

const HistoryPage: React.FC<{}> = () => {
  const navigation = useNavigation<HistoryPageProps['navigation']>();
  const _historys = useQuery<History>(History);
  const [dialogVisible, setDialogVisible] = useState(false);
  const curItem = useRef<HistoryInfo>();
  const realm = useRealm();
  const [historys, setHistorys] = useState<HistoryInfo[]>([]);
  const {DialogStyle} = useContext(ThemeContext).theme

  useEffect(() => {
    let historys = [..._historys.sorted('time', true)].map(_history => {
      const _animes = realm.objectForPrimaryKey(Anime, _history.href);
      return {
        href: _history.href,
        progress: _history.progress,
        progressPer: _history.progressPer,
        anthologyIndex: _history.anthologyIndex,
        anthologyTitle: _history.anthologyTitle,
        time: _history.time,
        img: _animes!.img,
        title: _animes!.title,
        state: _animes!.state,
      };
    });
    setHistorys(historys);
  }, [_historys]);

  const onDelete = (item: HistoryInfo) => {
    curItem.current = item;
    setDialogVisible(true);
  };

  const onOK = () => {
    const item = curItem.current;
    setDialogVisible(false);
    realm.write(() => {
      const history = realm.objectForPrimaryKey(History, item!.href);
      realm.delete(history);
    });
    alert('删除成功')
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
          <SubTitleBold title="历史记录" />
          <Pressable>
            <FontAwesomeIcon icon={faMagnifyingGlass} color="grey" />
          </Pressable>
        </View>
      </HeadBar>
      <Divider />
      <FlatList
        data={historys}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({item, index}) => (
          <V1HistoryInfoItem
            item={item}
            index={index}
            onPress={() => navigation.navigate('Video', {url: item.href})}>
            <Pressable onPress={() => onDelete(item)}>
              <FontAwesomeIcon color="grey" icon={faTrashCan} />
            </Pressable>
          </V1HistoryInfoItem>
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

export default HistoryPage;
