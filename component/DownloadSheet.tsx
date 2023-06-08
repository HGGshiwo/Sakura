import {Text} from '@rneui/themed';
import {Pressable, StyleSheet, View} from 'react-native';
import {InfoText, SubInfoText, SubTitle, SubTitleBold} from './Text';
import {useContext, useEffect, useState} from 'react';
import {CloseButton} from './Button';
import {FlatList} from 'react-native-gesture-handler';
import ListItemInfo from '../type/ListItemInfo';
import Context from '../models';
import Download from '../models/SectionDb';
import alert from './Toast';
import {DownloadSectionPageProps, TabName} from '../route';
import {DownloadContext} from '../context/DownloadContext';
import {faCircleCheck, faCircleDown} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ApiContext} from '../context/ApiContext';
import DownloadDb from '../models/SectionDb';
import DownloadItem from '../type/Download/DownloadItem';
import Episode from '../type/Download/Episode';
import SectionDb from '../models/SectionDb';

const {useRealm, useQuery, useObject} = Context;

type anthologySheetProps = {
  height: number;
  top: number;
  state: string | undefined;
  visible: boolean;
  onClose: () => void;
  listItems: Episode[] | undefined;
  infoUrl: string;
  tabName: TabName;
  apiName: string;
  title: string | undefined;
};

const DownloadSheet = ({
  height,
  top,
  state,
  visible,
  onClose,
  infoUrl,
  tabName,
  apiName,
  title,
}: anthologySheetProps) => {
  const realm = useRealm();
  const {download} = useContext(DownloadContext);
  const [items, setItems] = useState<Episode[]>([]);
  const navigation = useNavigation<DownloadSectionPageProps['navigation']>();
  const {api} = useContext(ApiContext);
  const section = useObject(SectionDb, infoUrl)!

  useEffect(() => {
    setItems(section.episodes)
  }, [section.episodes]);

  const handlePressItem = (item: Episode) => {
    //是否已经下载过了
    if (item.start) {
      alert(`该集已${item.finish ? '下载完成' : '在下载队列中'}!`);
      return;
    }
    const _item = section.episodes.find(obj=>obj.taskUrl==item.taskUrl)!
    realm.write(()=>{
      _item.start = true
    })
    getPlayerData(item);
  };

  //获取player的数据源
  const getPlayerData = (item: Episode, _times?: number) => {
    let times = _times === undefined ? 3 : _times; //默认尝试3次
    const loadPlayerSrc = api[tabName][apiName].pages.player!;
    if (times > 0) {
      // debugger;
      loadPlayerSrc(
        item.taskUrl,
        (data: any) => {
          alert(`开始下载 ${title} ${item.title}`);
          download(item.taskUrl, infoUrl, data.uri, `${title} ${item.title}`);
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

  const checkDownload = () => {
    navigation.navigate('DownloadSection', {tabName});
  };

  return !visible ? (
    <></>
  ) : (
    <View style={{...styles.container, height, top}}>
      <View style={styles.headerRow}>
        <SubTitleBold title="下载" />
        <CloseButton onPress={onClose} />
      </View>
      <View style={styles.stateRow}>
        <Text style={styles.text2}>{state}</Text>
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
