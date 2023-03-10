import {useNavigation} from '@react-navigation/native';
import {Divider} from '@rneui/themed';
import {FlatList, View, useWindowDimensions} from 'react-native';
import {UpdateMode} from 'realm';
import {V1RecommandInfoItem} from '../../../component/ListItem';
import {ListTitleLine} from '../../../component/ListTitleLine';
import {LoadingContainer} from '../../../component/Loading';
import {RateText} from '../../../component/Text';
import Follow from '../../../models/Follow';
import {InfoSub} from '../../../type/InfoSub';
import {ListItemInfo} from '../../../type/ListItemInfo';
import {RecommandInfo} from '../../../type/RecommandInfo';
import {VideoPageProps} from '../../../type/route';
import {DetailButtonLine} from './DetailButtonLine';
import {RelaviteLine} from './RelaviteLine';
import {TitleLine} from './TitleLine';
const {useRealm} = Context;
import Context from '../../../models';
import {ReactNode, useEffect, useState} from 'react';
import EndLine from '../../../component/EndLine';
import Toast from 'react-native-root-toast';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCloudArrowDown, faFileDownload, faShare } from '@fortawesome/free-solid-svg-icons';
import ToolBar from '../../../component/ToolBar';

type Props = {
  url: string;
  title: string;
  imgUrl: string;
  infoSub: InfoSub;
  info: string;
  relatives: ListItemInfo[];
  recommands: RecommandInfo[];
  refreshing: boolean;
  setDetailSheetVisible: (visible: boolean) => void;
  setAnthologySheetVisible: (visible: boolean) => void;
  children: ReactNode;
  onRefresh: () => void;
};

const Profile: React.FC<Props> = ({
  url,
  title,
  infoSub,
  relatives,
  recommands,
  refreshing,
  setDetailSheetVisible,
  setAnthologySheetVisible,
  children,
  onRefresh,
}) => {
  //数据相关
  const layout = useWindowDimensions();
  const realm = useRealm();
  const navigation = useNavigation<VideoPageProps['navigation']>();
  const [followed, setFollowed] = useState(false); //是否追番

  useEffect(() => {
    //查看数据库看是否追番
    const _follow = realm.objectForPrimaryKey(Follow, url);
    setFollowed(!!_follow && _follow!.following);
  }, []);

  const onPressRecommand = (item: RecommandInfo) => {
    navigation.push('Video', {url: item.href});
  };

  //点击追番按钮的回调函数
  const handlePressFollowed = () => {
    setFollowed(!followed);
    realm.write(() => {
      realm.create(
        Follow,
        {
          href: url,
          following: !followed,
        },
        UpdateMode.Modified,
      );
    });
    Toast.show(`${!followed ? '' : '取消'}追番成功`, {
      backgroundColor: 'rgba(0,0,0,0.5)',
      textStyle:{fontSize: 14},
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };

  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListHeaderComponent={
        <>
          <View style={{padding: 10, width: layout.width}}>
            <TitleLine
              title={title}
              onPress={handlePressFollowed}
              followed={followed}
            />
            <DetailButtonLine
              author={infoSub.author}
              onPress={() => setDetailSheetVisible(true)}
            />
            <ToolBar />
            <ListTitleLine
              title={'选集'}
              buttonText={infoSub?.state}
              onPress={() => setAnthologySheetVisible(true)}
            />
            {relatives.length == 0 ? null : (
              <RelaviteLine relatives={relatives} />
            )}
            {children}
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
  );
};

export default Profile;
