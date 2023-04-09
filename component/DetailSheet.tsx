import {Text, Image} from '@rneui/themed';
import {StyleSheet, View, ScrollView} from 'react-native';
import {InfoText, RateText, SubTitleBold, Title} from './Text';
import {Tag} from './Tag';
import {CloseButton} from './Button';
import {FlatList} from 'react-native-gesture-handler';
import InfoPageInfo from '../type/PageInfo/InfoPageInfo';

type detailSheetProps = {
  height: number;
  top: number;
  pageInfo: InfoPageInfo | undefined;
  visible: boolean;
  onPress: () => void;
};

const DetailSheet = ({
  height,
  top,
  pageInfo,
  visible,
  onPress,
}: detailSheetProps) => {
  return !visible ? (
    <></>
  ) : (
    <View style={[styles.container, {height: height, top: top}]}>
      <View style={styles.headerRow}>
        <SubTitleBold title="详情" />
        <CloseButton onPress={onPress} />
      </View>
      <ScrollView>
        <View style={styles.imageRow}>
          <Image
            loadingIndicatorSource={{
              uri: 'https://s1.hdslb.com/bfs/static/laputa-home/client/assets/load-error.685235d2.png',
            }}
            containerStyle={styles.imageContainer}
            source={{uri: pageInfo?.img}}
          />
          <View style={styles.titleContainer}>
            <Title title={pageInfo?.title} />
            <View>
              <InfoText title={pageInfo?.produce} />
              <InfoText title={pageInfo?.state} />
            </View>
          </View>
          <View style={styles.rateContainer}>
            <RateText title="9.7" />
          </View>
        </View>
        <View style={styles.nameRow}>
          <Text style={styles.nameRowText}>别名</Text>
          <Text style={{flex: 1}}>{pageInfo?.alias}</Text>
        </View>
        <View style={styles.typeRow}>
          <Text style={styles.nameRowText}>风格</Text>
          <FlatList
            horizontal
            data={pageInfo?.type}
            renderItem={({item}) => (
              <Tag
                text={item.title}
                key={item.id}
                style={styles.buttonContainer}
              />
            )}
          />
        </View>
        <View style={styles.produceRow}>
          <Title title="制作信息" style={styles.produceTitle} />
          <InfoText numberOfLines={-1} title={pageInfo?.author} />
        </View>
        <View style={styles.infoRow}>
          <Title title="简介" style={styles.produceTitle} />
          <InfoText
            numberOfLines={-1}
            title={pageInfo?.info}
            style={{paddingHorizontal: 10}}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  imageRow: {
    flexDirection: 'row',
    margin: 10,
  },
  typeRow: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    margin: 10,
  },
  produceRow: {
    margin: 10,
  },
  infoRow: {
    margin: 10,
    paddingBottom: 30,
  },
  imageContainer: {
    flex: 2,
    height: 180,
    padding: 5,
    borderRadius: 10,
    backgroundColor: 'grey',
  },
  titleContainer: {
    flex: 3,
    paddingHorizontal: 5,
    justifyContent: 'space-between',
  },
  rateContainer: {
    flex: 1,
    padding: 2,
  },
  nameRowText: {
    width: 40,
  },
  typeContainer: {
    flex: 1,
  },
  buttonContainer: {
    marginHorizontal: 5,
  },
  text: {
    fontSize: 18,
  },
  text2: {
    fontSize: 16,
    color: 'gray',
  },
  produceTitle: {
    marginVertical: 10,
  },
  infoTitle: {
    marginVertical: 10,
  },
});

export {DetailSheet};
