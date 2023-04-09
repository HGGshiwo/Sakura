import {Text} from '@rneui/themed';
import {Pressable, StyleSheet, View} from 'react-native';
import {InfoText, SubInfoText, SubTitle, SubTitleBold} from './Text';
import {ReactNode} from 'react';
import {CloseButton} from './Button';
import {FlatList} from 'react-native-gesture-handler';
import {ListItemInfo} from '../type/ListItemInfo';
import {Platform} from 'react-native';
import RNBackgroundDownloader, {
  download,
  completeHandler,
} from '@kesha-antonov/react-native-background-downloader';

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
import Context from '../models';
import Download from '../models/Download';
import alert from './Toast';
import api from '../api';
import {TabName} from '../route';
const {useRealm} = Context;

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

  const handlePressItem = (item: ListItemInfo) => {
    //是否已经下载过了
    const taskId = Download.getTaskId(url, item.id);
    let taskRecord = realm.objectForPrimaryKey(Download, taskId)!;
    if (!!taskRecord && taskRecord.done) {
      alert('该集已下载!');
      return;
    }
    //是否已经在下载了?
    RNBackgroundDownloader.checkForExistingDownloads()
      .then(lostTasks => {
        let task = lostTasks.find(task => task.id === taskId);
        if (!!task) {
          alert('该集已在下载队列!');
          task.done(() => {
            realm.write(() => {
              let taskRecord = realm.objectForPrimaryKey(Download, taskId)!;
              taskRecord.done = true;
            });
            alert(`${title} ${item.title}下载完成!`);
          });
        } else {
          //开始下载
          const loadPlayerSrc = api[tabName][apiName].player!;
          loadPlayerSrc(item.data[0], (state: boolean, data: any) => {
            if (state) {
              const destination = Download.getDestination(data.src, data.type);
              download({
                id: taskId,
                url: data.src,
                destination,
              })
                .begin(({expectedBytes}) => {
                  realm.write(() => {
                    realm.create(
                      Download,
                      Download.generate(
                        url,
                        item.id,
                        tabName,
                        destination,
                        expectedBytes,
                      ),
                    );
                  });
                })
                .done(() => {
                  realm.write(() => {
                    let taskRecord = realm.objectForPrimaryKey(
                      Download,
                      taskId,
                    )!;
                    taskRecord.done = true;
                  });
                  alert(`${title} ${item.title}下载完成!`);
                });

              alert(`开始下载 ${title} ${item.title}`);

              console.log(
                `地址为: ${Download.getDestination(data.src, data.type)}`,
              );
            } else {
              alert(`${title} ${item.title}地址获取失败!`);
            }
          });
        }
      })
      .catch(err => console.log(err));
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
        data={data}
        renderItem={({index, item}) => (
          <Pressable
            style={{flex: 1}}
            onPress={() => {
              handlePressItem(item);
            }}
            key={index}>
            <View style={styles.itemContainer}>
              <SubTitle title={item.title} />
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
