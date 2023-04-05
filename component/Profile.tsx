import {faQq, faWeixin} from '@fortawesome/free-brands-svg-icons';
import {
  faThumbsUp,
  faCloudArrowDown,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import {Divider} from '@rneui/base';
import {FlatList, View, Pressable} from 'react-native';
import {apiName} from '../api/Comic/biquege';
import {TabName, VideoPageProps, targets} from '../route';
import {FollowButton, TextButton} from './Button';
import EndLine from './EndLine';
import {V1RecommandInfoItem} from './ListItem';
import {ListTitleLine} from './ListTitleLine';
import {LoadingContainer} from './Loading';
import {Title, InfoText, SubTitle, RateText} from './Text';
import TextIconButton from './ToolBar';
import InfoSub from '../type/InfoSub';
import {ListItemInfo} from '../type/ListItemInfo';
import RecommandInfo from '../type/RecommandInfo';
import {ReactNode, useCallback, useEffect, useState} from 'react';
import {UpdateMode} from 'realm';
import Follow from '../models/Follow';
import alert from './Toast';
import Context from '../models';
import { useNavigation } from '@react-navigation/native';
const {useRealm} = Context;
const Profile: React.FC<{
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  title: string;
  infoSub: InfoSub;
  relatives: ListItemInfo[];
  recommands: RecommandInfo[];
  url: string;
  tabName: TabName;
  setDetailSheetVisible: (data: boolean) => void;
  setAnthologySheetVisible: (data: boolean) => void;
  renderAnthologys: () => ReactNode;
}> = ({
  loading,
  refreshing,
  onRefresh,
  title,
  infoSub,
  relatives,
  url,
  tabName,
  setDetailSheetVisible,
  setAnthologySheetVisible,
  renderAnthologys,
  recommands,
}) => {
  const realm = useRealm();
  const [followed, setFollowed] = useState(false); //是否追番
  //点击追番按钮的回调函数
  const handlePressFollowed = useCallback(() => {
    setFollowed(!followed);
    realm.write(() => {
      realm.create(
        Follow,
        {
          href: url,
          following: !followed,
          tabName,
        },
        UpdateMode.Modified,
      );
    });
    alert(`${!followed ? '' : '取消'}追番成功`);
  }, []);
  const navigation = useNavigation<VideoPageProps['navigation']>();
  const onPressRecommand = (item: RecommandInfo) => {
    navigation.push(targets[tabName] as any, {url: item.href, apiName});
  };
  useEffect(() => {
    //查看数据库看是否追番
    const _follow = realm.objectForPrimaryKey(Follow, url);
    setFollowed(!!_follow && _follow!.following);
  }, []);
  return (
    <LoadingContainer
      loading={loading}
      style={{paddingTop: 40}}
      backgroundColor="grey"
      color="grey"
      text="加载中...">
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <>
            <View style={{padding: 10, width: '100%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Title style={{width: '70%'}} title={title} />
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
                  title={infoSub.author}
                />
                <TextButton
                  title={'详情'}
                  onPress={() => setDetailSheetVisible(true)}
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
                buttonText={infoSub!.state}
                onPress={() => setAnthologySheetVisible(true)}
              />
              {relatives.length == 0 ? null : (
                <FlatList
                  horizontal={true}
                  data={relatives}
                  renderItem={({item}) => (
                    <Pressable
                      onPress={() =>
                        navigation.push(targets[tabName] as any, {
                          url: item.data,
                          apiName,
                        })
                      }>
                      <SubTitle style={{padding: 12}} title={item.title} />
                    </Pressable>
                  )}
                  keyExtractor={item => `${item.id}`}
                />
              )}
              {renderAnthologys()}
            </View>
            <Divider />
          </>
        }
        data={recommands}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({item, index}) => (
          <V1RecommandInfoItem
            index={index}
            item={item}
            onPress={onPressRecommand}>
            <RateText title="9.7" />
          </V1RecommandInfoItem>
        )}
        keyExtractor={item => `${item.href}`}
        ListFooterComponent={() => <EndLine />}
      />
    </LoadingContainer>
  );
};

export default Profile;
