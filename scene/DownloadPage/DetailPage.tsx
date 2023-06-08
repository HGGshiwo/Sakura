import {useNavigation, useRoute} from '@react-navigation/native';
import {View, Pressable, StyleSheet} from 'react-native';
import {Divider} from '@rneui/themed';
import Container from '../../component/Container';
import HeadBar from '../../component/HeadBar';
import {SubInfoText, SubTitleBold} from '../../component/Text';
import {DownloadDetailPageProps} from '../../route';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {V1DownloadInfoItem} from '../../component/ListItem';
import Context from '../../models';
import {useContext, useEffect, useRef, useState} from 'react';
import Dialog from 'react-native-dialog';
import RecmdInfo from '../../type/RecmdInfo';
import EndLine from '../../component/EndLine';
import {SwipeListView} from 'react-native-swipe-list-view';
import {targets} from '../../route';
import {ThemeContext} from '../../context/ThemeContext';
import TaskDb from '../../models/EpisodeDb';
import DownloadDb from '../../models/SectionDb';
import DownloadItemInfo from '../../type/Download/DownloadItemInfo';

const {useRealm, useQuery, useObject} = Context;

const DetailPage: React.FC<{}> = () => {
  const route = useRoute<DownloadDetailPageProps['route']>();
  const {infoUrl} = route.params;
  const navigation = useNavigation<DownloadDetailPageProps['navigation']>();
  const [dialogVisible, setDialogVisible] = useState(false);
  const curItem = useRef<RecmdInfo & TaskDb>();
  const realm = useRealm();
  const [tasks, setTasks] = useState<DownloadItemInfo[]>([]);
  const {DialogStyle} = useContext(ThemeContext).theme;
  const downloadDb = useObject(DownloadDb, infoUrl)!;

  useEffect(() => {
    let tasks = [...downloadDb.episodes]
      .map(_task => {
        const _animes = realm.objectForPrimaryKey(DownloadDb, infoUrl)!;
        return {
          ..._animes.toRecmdInfo(),
          taskUrl: _task.taskUrl,
          progress: _task.progress,
          title: _task.title,
          start: _task.start,
        };
      })
      .filter(obj => obj.start);
    setTasks(tasks);
  }, [downloadDb.episodes]);

  const onDelete = (item: RecmdInfo) => {
    // curItem.current = item;
    // setDialogVisible(true);
  };

  const onOK = () => {
    const item = curItem.current;
    // realm.write(() => {
    //   realm.create(
    //     Download,
    //     {
    //       href: item!.href,
    //       Downloading: false,
    //       tabName: tabName,
    //     },
    //     UpdateMode.Modified,
    //   );
    // });
    // setDialogVisible(false);
    // alert('取消追番成功');
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
          <SubTitleBold title="下载管理" />
          <Pressable>
            <FontAwesomeIcon icon={faMagnifyingGlass} color="grey" />
          </Pressable>
        </View>
      </HeadBar>
      <Divider />
      <SwipeListView
        data={tasks}
        // keyExtractor={item => item.taskUrl}
        renderItem={({item, index}) => (
          <V1DownloadInfoItem
            onPress={() =>
              navigation.navigate(targets[item.tabName] as any, {
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
              <SubInfoText title="删除" style={{color: 'white'}} />
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

export default DetailPage;
