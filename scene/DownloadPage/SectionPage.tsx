import {useNavigation, useRoute} from '@react-navigation/native';
import {View, Pressable, StyleSheet} from 'react-native';
import {Divider} from '@rneui/themed';
import Container from '../../component/Container';
import HeadBar from '../../component/HeadBar';
import {InfoText, SubInfoText, SubTitleBold} from '../../component/Text';
import {DownloadSectionPageProps} from '../../route';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {V1RecmdInfoItem} from '../../component/ListItem';
import Context from '../../models';
import {useContext, useEffect, useRef, useState} from 'react';
import Dialog from 'react-native-dialog';
import DownloadDb from '../../models/SectionDb';
import RecommandInfo from '../../type/RecmdInfo';
import EndLine from '../../component/EndLine';
import {SwipeListView} from 'react-native-swipe-list-view';
import {targets} from '../../route';
import {ThemeContext} from '../../context/ThemeContext';
import SectionInfo from '../../type/Download/SectionInfo';
import {faYoutube} from '@fortawesome/free-brands-svg-icons';
import RecmdInfo from '../../type/RecmdInfo';
import SectionDb from '../../models/SectionDb';

const {useRealm, useQuery} = Context;

const DownloadPage: React.FC<{}> = () => {
  const route = useRoute<DownloadSectionPageProps['route']>();
  const {tabName} = route.params;
  const navigation = useNavigation<DownloadSectionPageProps['navigation']>();
  const [dialogVisible, setDialogVisible] = useState(false);
  const curItem = useRef<RecommandInfo & SectionInfo>();
  const realm = useRealm();
  const [sections, setSections] = useState<(SectionInfo & RecmdInfo)[]>([]);
  const {DialogStyle} = useContext(ThemeContext).theme;
  const _downloads = useQuery<DownloadDb>(DownloadDb);

  useEffect(() => {
    let sections = [..._downloads]
      .reverse()
      .map(_download => {
        const _animes = realm.objectForPrimaryKey(
          SectionDb,
          _download.infoUrl,
        )!;
        return {
          downloadNum: _download.episodes.filter(obj => obj.start).length,
          ..._animes.toRecmdInfo(),
        };
      })
      .filter(download => download.tabName === tabName);
    setSections(sections);
  }, [_downloads]);

  const onDelete = (item: RecommandInfo & SectionInfo) => {
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
        <View style={styles.header}>
          <SubTitleBold title="下载管理" />
          <Pressable>
            <FontAwesomeIcon icon={faMagnifyingGlass} color="grey" />
          </Pressable>
        </View>
      </HeadBar>
      <Divider />
      <SwipeListView
        data={sections}
        keyExtractor={item => item.infoUrl}
        renderItem={({item, index}) => (
          <V1RecmdInfoItem
            onPress={() =>
              navigation.navigate('DownloadDetail', {infoUrl: item.infoUrl})
            }
            item={item}
            imgVerticle={true}
            index={index}>
            <View style={styles.container}>
              <FontAwesomeIcon icon={faYoutube} size={20} color="grey" />
              <SubInfoText title={`${item.downloadNum}`} />
            </View>
          </V1RecmdInfoItem>
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
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
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
  container: {
    flexDirection: 'row',
    height: '100%',
    width: 30,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
});

export default DownloadPage;
