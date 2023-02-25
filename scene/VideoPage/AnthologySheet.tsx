import {Text} from '@rneui/themed';
import {StyleSheet, View, ScrollView} from 'react-native';
import {ListItemInfo} from '../../type/ListItemInfo';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Pressable} from 'react-native';
import {faVideo, faXmark} from '@fortawesome/free-solid-svg-icons';
import {faYoutube} from '@fortawesome/free-brands-svg-icons';
import { SubTitle } from '../../component/Text';

type anthologySheetProps = {
  height: number;
  top: number;
  anthologys: ListItemInfo[];
  state: string;
  visible: boolean;
  onPress: (item: ListItemInfo) => void;
  onClose: () => void;
  activeIndex: number;
};

const AnthologySheet = ({
  height,
  top,
  anthologys,
  state,
  visible,
  activeIndex,
  onClose,
  onPress,
}: anthologySheetProps) => {


  type ItemBoxProps = {
    index: number;
    anthology: ListItemInfo;
  };

  const ItemBox = ({index, anthology}: ItemBoxProps) => {
    return (
      <Pressable
        style={{flex: 1}}
        onPress={() => {
          onPress(anthology);
        }}>
        <View style={styles.itemContainer}>
          <SubTitle title={anthology.title} active={index === activeIndex}/>
        </View>
      </Pressable>
    );
  };

  return !visible ? (
    <></>
  ) : (
    <View style={{...styles.container, height, top}}>
      <View style={styles.headerRow}>
        <Text style={styles.text}>详情</Text>
        <Pressable
          onPress={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Pressable>
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
                  <ItemBox index={index} anthology={anthology} />
                  {index + 1 < anthologys.length ? (
                    <ItemBox
                      index={index + 1}
                      anthology={anthologys[index + 1]}
                    />
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
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 18,
  },
  text2: {
    fontSize: 16,
    color: 'gray',
  },
  active: {
    color: 'deeppink',
  },
});

export {AnthologySheet};
