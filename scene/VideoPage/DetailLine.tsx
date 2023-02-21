import {InfoSub} from '../../type/InfoSub';
import {Button, Text, Image, BottomSheet, AirbnbRating} from '@rneui/themed';
import {StyleSheet, View, ScrollView} from 'react-native';

type detailLineProps = {
  height: number;
  top: number;
  title: string;
  src: string;
  infoSub: InfoSub;
  info: string;
  visible: boolean;
  onPress: (event: any) => void;
};

const DetailLine = ({
  height,
  top,
  title,
  src,
  infoSub,
  info,
  visible,
  onPress,
}: detailLineProps) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      height,
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
      margin: 5,
    },
    titleContainer: {
      flex: 3,
      margin: 5,
      justifyContent: 'space-between',
    },
    rateContainer: {
      flex: 1,
    },
    nameRowText: {
      width: 100,
    },
    typeContainer: {
      flexDirection: 'row',
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
			color: 'gray'
    },
		produceTitle: {
			marginVertical: 10
		},
		infoTitle: {
			marginVertical: 10
		},
		rateTitle:{
			color: 'orange',
			fontSize: 25,
			fontWeight:'bold'
		}
  });

  return (
    <BottomSheet isVisible={visible}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.text}>详情</Text>
          <Button type="clear" title={`x`} onPress={onPress} />
        </View>
				<ScrollView>
        <View style={styles.imageRow}>
          <Image containerStyle={styles.imageContainer} source={{uri: src}} />
          <View style={styles.titleContainer}>
            <Text h4>{title}</Text>
            <View>
              <Text style={styles.text2}>{infoSub.produce}</Text>
              <Text style={styles.text2}>{infoSub.state}</Text>
            </View>
          </View>
          <View style={styles.rateContainer}>
            <Text style={styles.rateTitle}>9.7</Text>
						<AirbnbRating size={10}  showRating={false}/>
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
                <Button
                  containerStyle={styles.buttonContainer}
                  title={type}
                  key={index}
									size='sm'
                />
              );
            })}
          </View>
        </View>
				<View style={styles.produceRow}>
					<Text style={styles.produceTitle} h4>制作信息</Text>
          <Text>{infoSub.author}</Text>
        </View>
        <View style={styles.infoRow}>
					<Text style={styles.produceTitle} h4>简介</Text>
          <Text>{info}</Text>
        </View>
				</ScrollView>
      </View>
    </BottomSheet>
  );
};

export {DetailLine};
export type {detailLineProps};
