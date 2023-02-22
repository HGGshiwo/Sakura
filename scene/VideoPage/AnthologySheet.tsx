import {Button, Text, BottomSheet} from '@rneui/themed';
import {StyleSheet, View, ScrollView} from 'react-native';
import {ListItemInfo} from '../../type/ListItemInfo';

type anthologySheetProps = {
  height: number;
  top: number;
  anthologys: ListItemInfo[];
  state: string;
  visible: boolean;
  onPress: (event: any) => void;
};

const AnthologySheet = ({
  height,
  top,
  anthologys,
  state,
  visible,
  onPress,
}: anthologySheetProps) => {
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
      backgroundColor: 'gainsboro',
      flex: 1,
      height: 75,
      marginHorizontal: 10,
      padding: 10,
    },
    text: {
      fontSize: 18,
    },
    text2: {
      fontSize: 16,
      color: 'gray',
    },
  });

  return (
    <BottomSheet isVisible={visible}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.text}>详情</Text>
          <Button type="clear" title={`x`} onPress={onPress} />
        </View>
        <View style={styles.stateRow}>
          <Text style={styles.text2}>{state}</Text>
        </View>
        <ScrollView>
          <View style={styles.rowContainer}>
            {anthologys.length == 0 ? (
              <View style={styles.emptyRow}>
                <Text>暂无数据</Text>
              </View>
            ) : (
              anthologys.map((anthology, index) => {
                return index % 2 == 0 ? (
                  <View style={styles.boxRow} key={anthology.id}>
                    <View style={styles.itemContainer}>
                      <Text>{anthology.title}</Text>
                    </View>
                    {index + 1 < anthologys.length ? (
                      <View style={styles.itemContainer}>
                        <Text>{anthologys[index + 1].title}</Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          ...styles.itemContainer,
                          backgroundColor: 'white',
                        }}
                      />
                    )}
                  </View>
                ) : null;
              })
            )}
          </View>
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

export {AnthologySheet};
