import {Text} from '@rneui/themed';
import {Pressable, StyleSheet, View} from 'react-native';
import {InfoText, SubInfoText, SubTitle, SubTitleBold} from './Text';
import {useContext, useEffect, useState} from 'react';
import {CloseButton} from './Button';
import {FlatList} from 'react-native-gesture-handler';
import Context from '../models';
import alert from './Toast';
import {DownloadSectionPageProps} from '../route';
import {faCircleCheck, faCircleDown} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useNavigation} from '@react-navigation/native';
import Episode from '../type/Download/Episode';
import SectionDb from '../models/SectionDb';
import {useStore} from '../scene/InfoPage';
import useDownload from '../zustand/Download';
import useApi from '../zustand/Api';

const {useRealm, useQuery, useObject} = Context;

const DownloadSheet: React.FC<{}> = () => {
  const {pageInfo, sheetHeight, playerHeight, update} = useStore();

  const realm = useRealm();
  const {download} = useDownload();
  const [items, setItems] = useState<Episode[]>([]);
  const navigation = useNavigation<DownloadSectionPageProps['navigation']>();
  const {infoUrl, episode} = useStore();
  const section = useObject(SectionDb, infoUrl!)!;
  const {downloadDone} = useStore();
  const {api} = useApi();

  useEffect(() => {
    setItems(section?.episodes);
  }, [section?.episodes]);

  //获取player的数据源
  const getPlayerData = (item: Episode, _times?: number) => {
    if (!!item.playerSrc) {
      alert(`开始下载 ${pageInfo!.title} ${item.title}`);
      const m3u8Url = JSON.parse(item!.playerSrc).uri;
      download(
        item.taskUrl,
        pageInfo!.infoUrl,
        m3u8Url,
        `${pageInfo!.title} ${item.title}`,
        realm,
        downloadDone,
      );
      return;
    }
    let times = _times === undefined ? 3 : _times; //默认尝试3次
    const loadPlayerSrc =
      api[pageInfo!.tabName][pageInfo!.apiName].pages.player!;
    if (times > 0) {
      loadPlayerSrc(
        item.taskUrl,
        (data: any) => {
          alert(`开始下载 ${pageInfo!.title} ${item.title}`);
          download(
            item.taskUrl,
            pageInfo!.infoUrl,
            data.uri,
            `${pageInfo!.title} ${item.title}`,
            realm,
            downloadDone,
          );
        },
        (err: string) => {
          console.log(err, '下一次尝试开始');
          getPlayerData(item, times - 1);
        },
      );
    } else {
      alert('无法获取到播放地址...');
    }
  };

  const handlePressItem = (item: Episode) => {
    //是否已经下载过了
    if (item.start) {
      alert(`该集已${item.finish ? '下载完成' : '在下载队列中'}!`);
      return;
    }
    const _item = section.episodes.find(obj => obj.taskUrl == item.taskUrl)!;
    realm.write(() => {
      _item.start = true;
    });
    getPlayerData(_item, 3);
  };

  const checkDownload = () => {
    navigation.navigate('DownloadSection', {tabName: pageInfo!.tabName});
  };

  return (
    <>
      <View
        style={{...styles.container, height: sheetHeight, top: playerHeight}}>
        <View style={styles.headerRow}>
          <SubTitleBold title="下载" />
          <CloseButton onPress={() => update({downloadSheetVisible: false})} />
        </View>
        <View style={styles.stateRow}>
          <Text style={styles.text2}>{pageInfo?.state}</Text>
        </View>
        <FlatList
          contentContainerStyle={{paddingBottom: 50}}
          data={items}
          renderItem={({index, item}) => (
            <Pressable
              style={{flex: 1}}
              onPress={() => {
                handlePressItem(item);
              }}
              key={index}>
              <View style={styles.itemContainer}>
                <SubTitle title={item.title} />
                {!item.start ? (
                  <></>
                ) : (
                  <FontAwesomeIcon
                    size={20}
                    color={item.finish ? 'limegreen' : 'deepskyblue'}
                    icon={item.finish ? faCircleCheck : faCircleDown}
                  />
                )}
              </View>
            </Pressable>
          )}
        />
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            padding: 10,
            justifyContent: 'space-between',
            borderTopWidth: 1,
            borderColor: 'lightgrey',
          }}>
          <InfoText
            style={{paddingHorizontal: 20, paddingVertical: 10}}
            title="缓存全部"
          />
          <InfoText
            style={{paddingHorizontal: 20, paddingVertical: 10}}
            title="查看缓存"
            onPress={checkDownload}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            backgroundColor: '#f1f2f3',
            justifyContent: 'center',
          }}>
          <SubInfoText
            style={{fontSize: 11, padding: 5}}
            title={`已使用空间${`0`}B, 可使用空间${`22.4G`}B`}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    position: 'absolute',
    elevation: 1,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  stateRow: {
    padding: 10,
  },
  emptyRow: {
    padding: 20,
  },
  rowContainer: {
    paddingBottom: 50,
  },
  itemContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'lightgrey',
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
  },
  text2: {
    fontSize: 16,
    color: 'gray',
  },
  active: {
    color: 'deeppink',
  },
});

export default DownloadSheet;
