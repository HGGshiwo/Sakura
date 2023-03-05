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
import {ReactNode, useState} from 'react';
import EndLine from '../../../component/EndLine';

type Props = {
  url: string;
  title: string;
  imgUrl: string;
  infoSub: InfoSub;
  info: string;
  relatives: ListItemInfo[];
  recommands: RecommandInfo[];
  refreshing: boolean;
  followed: boolean;
  setDetailSheetVisible: (visible: boolean) => void;
  setAnthologySheetVisible: (visible: boolean) => void;
  children: ReactNode;
  init: () => void;
};

const Profile: React.FC<Props> = ({
  url,
  title,
  infoSub,
  relatives,
  recommands,
  refreshing,
  followed,
  setDetailSheetVisible,
  setAnthologySheetVisible,
  children,
  init,
}) => {
  //数据相关
  const layout = useWindowDimensions();
  const realm = useRealm();
  const navigation = useNavigation<VideoPageProps['navigation']>();

  const onPressRecommand = (item: RecommandInfo) => {
    navigation.push('Video', {url: item.href});
  };

  //点击追番按钮的回调函数
  const handlePressFollowed = (followed: boolean) => {
    realm.write(() => {
      realm.create(
        Follow,
        {
          href: url,
          following: followed,
        },
        UpdateMode.Modified,
      );
    });
  };

  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={() => init()}
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
