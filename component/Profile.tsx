import {faQq, faWeixin} from '@fortawesome/free-brands-svg-icons';
import {
  faThumbsUp,
  faCloudArrowDown,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import {Divider} from '@rneui/base';
import {FlatList, View, Pressable, StyleSheet} from 'react-native';
import {TabName, InfoPageProps, targets} from '../route';
import {FollowButton, TextButton} from './Button';
import EndLine from './EndLine';
import {V1RecmdInfoItem} from './ListItem';
import {ListTitleLine} from './ListTitleLine';
import {LoadingContainer} from './Loading';
import {Title, InfoText, SubTitle, RateText} from './Text';
import TextIconButton from './ToolBar';
import RecmdInfo from '../type/RecmdInfo';
import {ReactNode, createRef, useCallback, useEffect, useState} from 'react';
import Follow from '../models/FollowDb';
import alert from './Toast';
import Context from '../models';
import {useNavigation} from '@react-navigation/native';
import Section from '../type/Download/Section';
import {useStore} from '../scene/InfoPage';
import Episode from '../type/Download/Episode';
import useTheme from '../zustand/Theme';
const {useRealm} = Context;
const Profile: React.FC<{}> = () => {
  const realm = useRealm();
  const [followed, setFollowed] = useState(false); //是否追番
  const {pageLoading, refreshing, pageInfo, update, changeEpisode, episode} =
    useStore();
  const ProfileAnthologyListRef = createRef<FlatList<Episode>>();
  const {PlayerStyle} = useTheme().theme;
  const {textColor, playerTextColor, indicatorColor} = PlayerStyle;
  //点击追番按钮的回调函数
  const handlePressFollowed = useCallback(() => {
    setFollowed(!followed);
    Follow.update(realm, pageInfo!.infoUrl, !followed);
    alert(`${!followed ? '' : '取消'}追番成功`);
  }, [followed]);

  const navigation = useNavigation<InfoPageProps['navigation']>();

  const onPressRecmd = (item: RecmdInfo) => {
    navigation.push('Info', {
      infoUrl: item.infoUrl,
      apiName: item.apiName,
      tabName: pageInfo!.tabName,
    });
  };

  useEffect(() => {
    //查看数据库看是否追番
    if (!!pageInfo) {
      const _follow = realm.objectForPrimaryKey(Follow, pageInfo!.infoUrl);
      setFollowed(!!_follow && _follow!.following);
    }
  }, [pageInfo]);

  useEffect(() => {
    if (ProfileAnthologyListRef.current) {
      ProfileAnthologyListRef.current!.scrollToIndex({
        index: pageInfo!.episodes.findIndex(
          obj => obj.taskUrl === episode!.taskUrl,
        ),
      });
    }
  }, [episode]);

  return (
    <LoadingContainer
      loading={pageLoading}
      style={{paddingTop: 40}}
      backgroundColor="grey"
      color="grey"
      text="加载中...">
      <FlatList
        refreshing={refreshing}
        onRefresh={() => {}}
        ListHeaderComponent={
          <>
            <View style={{padding: 10, width: '100%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Title style={{width: '70%'}} title={pageInfo?.title} />
                <FollowButton
                  onPress={handlePressFollowed}
                  followed={followed}
                />
              </View>
              {/* author和详情栏 */}
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <InfoText
                  style={{paddingTop: 2, color: 'gray', flex: 1}}
                  title={pageInfo?.author}
                />
                <TextButton
                  title={'详情'}
                  onPress={() => update({detailSheetVisible: true})}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  padding: 10,
                  paddingHorizontal: 20,
                }}>
                <TextIconButton title="点赞" icon={faThumbsUp} />
                <TextIconButton
                  style={{marginLeft: 40}}
                  title="下载"
                  onPress={() => update({downloadSheetVisible: true})}
                  icon={faCloudArrowDown}
                />
                <TextIconButton
                  style={{marginLeft: 40}}
                  title="分享"
                  icon={faQq}
                />
                <TextIconButton
                  style={{marginLeft: 40}}
                  title="分享"
                  icon={faWeixin}
                />
                <TextIconButton
                  style={{marginLeft: 40}}
                  title="分享"
                  icon={faShare}
                />
              </View>
              <ListTitleLine
                title={'选集'}
                buttonText={pageInfo?.state}
                onPress={() => update({episodeSheetVisible: true})}
              />
              {pageInfo?.relatives.length == 0 ? null : (
                <FlatList
                  horizontal={true}
                  data={pageInfo?.relatives}
                  renderItem={({item}) => (
                    <Pressable
                      onPress={() =>
                        navigation.push("Info", {
                          infoUrl: item.data.url,
                          apiName: item.data.apiName,
                          tabName: pageInfo!.tabName
                        })
                      }>
                      <SubTitle style={{padding: 12}} title={item.title} />
                    </Pressable>
                  )}
                  keyExtractor={item => `${item.id}`}
                />
              )}
              <FlatList
                ref={ProfileAnthologyListRef}
                getItemLayout={(item, index) => ({
                  length: 170,
                  offset: 170 * index,
                  index,
                })}
                style={{marginBottom: 20}}
                horizontal={true}
                data={pageInfo?.episodes}
                renderItem={({item, index}) => (
                  <Pressable
                    onPress={() => {
                      update({flashData: true});
                      changeEpisode(index);
                    }}>
                    <View style={styles.itemContainer2}>
                      <SubTitle
                        title={item.title}
                        style={{
                          color: textColor(item.taskUrl === episode?.taskUrl),
                        }}
                      />
                    </View>
                  </Pressable>
                )}
              />
            </View>
            <Divider />
          </>
        }
        data={pageInfo?.recommands}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({item, index}) => (
          <V1RecmdInfoItem index={index} item={item} onPress={onPressRecmd}>
            <RateText title="9.7" />
          </V1RecmdInfoItem>
        )}
        keyExtractor={item => `${item.infoUrl}`}
        ListFooterComponent={() => <EndLine />}
      />
    </LoadingContainer>
  );
};
const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    height: 40,
    padding: 10,
    margin: 5,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
  },
  listContainer: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,1)',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    right: 0,
    bottom: 0,
  },
  itemContainer: {
    backgroundColor: '#f1f2f3',
    flex: 1,
    height: 75,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
  },
  itemContainer2: {
    backgroundColor: '#f1f2f3',
    width: 150,
    height: 70,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
  },
});
export default Profile;
