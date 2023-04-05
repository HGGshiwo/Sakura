import {Text} from '@rneui/themed';
import {Pressable, StyleSheet, View} from 'react-native';
import {SubTitle, SubTitleBold} from './Text';
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
  state: string;
  visible: boolean;
  onClose: () => void;
  data: ListItemInfo[];
};
import Context from '../models';
import Download from '../models/Download';
import {UpdateMode} from 'realm';
import alert from './Toast';
const {useRealm} = Context;

const DownloadSheet = ({
  height,
  top,
  state,
  visible,
  onClose,
  data,
}: anthologySheetProps) => {
  const realm = useRealm();
  
  const handlePressItem = (item: ListItemInfo) => {
    //是否已经下载过了
    let taskRecord = realm.objectForPrimaryKey(Download, item.data)!;
    if (!!taskRecord) {
      alert('该集已下载!');
      return;
    }
    //是否已经在下载了?
    RNBackgroundDownloader.checkForExistingDownloads().then(lostTasks => {
      let lostTask = lostTasks.find(task => task.id === item.data);
      if (!!lostTask) {
        alert('该集已在下载队列!');
        lostTask.done(() => {
          realm.create(
            Download,
            {
              href: item.data,
              destination: `${RNBackgroundDownloader.directories.documents}/${item.title}_${item.id}`,
              tabName: 'Anime',
            },
            UpdateMode.Modified,
          );
        });
      } else {
        //开始下载
        download({
          id: `${item.title}_${item.id}`,
          url: item.data,
          destination: `${RNBackgroundDownloader.directories.documents}/${item.title}_${item.id}`,
        }).done(() => {
          realm.create(
            Download,
            {
              href: item.data,
              destination: `${RNBackgroundDownloader.directories.documents}/${item.title}_${item.id}`,
              tabName: 'Anime',
            },
            UpdateMode.Modified,
          );
          alert(`${item.title} ${item.id}下载完成!`)
        });
      }
    });
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
    backgroundColor: '#e7e8e9',
    flex: 1,
    height: 75,
    margin: 10,
    padding: 10,
    borderRadius: 10,
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
