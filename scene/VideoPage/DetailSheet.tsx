import {InfoSub} from '../../type/InfoSub';
import {Text, Image} from '@rneui/themed';
import {StyleSheet, View, ScrollView, Pressable} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {InfoText, RateText, SubTitleBold, Title} from '../../component/Text';
import { Tag } from '../../component/Tag';
import { CloseButton } from '../../component/CloseButton';

type detailSheetProps = {
  height: number;
  top: number;
  title: string;
  src: string;
  infoSub: InfoSub;
  info: string;
  visible: boolean;
  onPress: () => void;
};

const DetailSheet = ({
  height,
  top,
  title,
  src,
  infoSub,
  info,
  visible,
  onPress,
}: detailSheetProps) => {
  return !visible ? (
    <></>
  ) : (
    <View style={[styles.container, {height: height, top: top}]}>
      <View style={styles.headerRow}>
        <SubTitleBold title="详情" />
        <CloseButton onPress={onPress}/>
      </View>
      <ScrollView>
        <View style={styles.imageRow}>
          <Image containerStyle={styles.imageContainer} source={{uri: src}} />
          <View style={styles.titleContainer}>
            <Title title={title}/>
            <View>
              <InfoText title={infoSub.produce}/>
              <InfoText title={infoSub.state}/>
            </View>
          </View>
          <View style={styles.rateContainer}>
            <RateText title='9.7'/>
          </View>
        </View>
        <View style={styles.nameRow}>
          <Text style={styles.nameRowText}>别名</Text>
          <Text>{infoSub.alias}</Text>
        </View>
        <View style={styles.typeRow}>
          <Text style={styles.nameRowText}>风格</Text>
          <View style={styles.typeContainer}>
            {infoSub.type.map((type: string, index: number) => {
              return (
                <Tag text={type} key={index} style={styles.buttonContainer}/>
              );
            })}
          </View>
        </View>
        <View style={styles.produceRow}>
          <Title title='制作信息' style={styles.produceTitle}/>
          <InfoText title={infoSub.author}/>
        </View>
        <View style={styles.infoRow}>
        <Title title='简介' style={styles.produceTitle}/>
          <InfoText numberOfLines={-1} title={info} style={{paddingHorizontal: 10}}/>
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
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  imageRow: {
    flexDirection: 'row',
    margin: 10,
  },
  typeRow: {
    flexDirection: 'row',
    margin: 10,
    alignItems:'center',
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
    width: 50,
  },
  typeContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
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
