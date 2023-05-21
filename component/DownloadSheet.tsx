import {Text} from '@rneui/themed';
import {Pressable, StyleSheet, View} from 'react-native';
import {InfoText, SubInfoText, SubTitle, SubTitleBold} from './Text';
import {useContext, useEffect, useState} from 'react';
import {CloseButton} from './Button';
import {FlatList} from 'react-native-gesture-handler';
import {ListItemInfo} from '../type/ListItemInfo';
import Context from '../models';
import Download from '../models/Download';
import alert from './Toast';
import {TabName} from '../route';
import {DownloadContext} from '../context/DownloadContext';
import {faCircleCheck, faCircleDown} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const {useRealm, useQuery, useObject} = Context;

type anthologySheetProps = {
  height: number;
  top: number;
  state: string | undefined;
  visible: boolean;
  onClose: () => void;
  data: ListItemInfo[] | undefined;
  url: string;
  tabName: TabName;
  apiName: string;
  title: string | undefined;
};

type DownloadState = 'finish' | 'run' | 'ready';
type DownloadItem = ListItemInfo & {state: DownloadState};

const DownloadSheet = ({
  height,
  top,
  state,
  visible,
  onClose,
  data,
  url,
  tabName,
  apiName,
  title,
}: anthologySheetProps) => {
  const realm = useRealm();
  const {download} = useContext(DownloadContext);
  const downloads = useQuery(Download); //数据库中下载的内容
  const [items, setItems] = useState<DownloadItem[]>([]);

  useEffect(() => {
    if (!!data) {
      setItems(
        data!.map(dataObj => {
          const downloadObj = realm.objectForPrimaryKey(Download, dataObj.data);
          const state = !downloadObj
            ? 'ready'
            : downloadObj!.finish
            ? 'finish'
            : 'run';
          return {...dataObj, state};
        }),
      );
    }
  }, [downloads, data]);

  const handlePressItem = (item: DownloadItem) => {
    console.log(downloads);
    //是否已经下载过了
    if (item.state !== 'ready') {
      alert(`该集已${item.state === 'finish' ? '下载完成' : '在下载队列中'}!`);
      return;
    }

    download(url, item.data, tabName);
    alert(`开始下载 ${title} ${item.title}`);
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
              {item.state === 'ready' ? (
                <></>
              ) : (
                <FontAwesomeIcon
                  color='gray'
                  icon={item.state === 'finish' ? faCircleCheck : faCircleDown}
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
          borderColor: "lightgrey"
        }}>
        <InfoText
          style={{paddingHorizontal: 20, paddingVertical: 10}}
          title="缓存全部"
        />
        <InfoText
          style={{paddingHorizontal: 20, paddingVertical: 10}}
          title="查看缓存"
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
    flexDirection: "row",
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
