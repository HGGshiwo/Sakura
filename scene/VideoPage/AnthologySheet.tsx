import {Text} from '@rneui/themed';
import {StyleSheet, View, ScrollView} from 'react-native';
import {ListItemInfo} from '../../type/ListItemInfo';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Pressable} from 'react-native';
import {faVideo, faXmark} from '@fortawesome/free-solid-svg-icons';
import {faYoutube} from '@fortawesome/free-brands-svg-icons';
import {SubTitle} from '../../component/Text';
import {DualItemRow} from '../../component/DualListItem';
import {FlatList} from 'react-native-gesture-handler';
import {Image} from 'react-native-svg';

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
  const ItemBox = (index: number, anthology: ListItemInfo) => {
    return (
      <Pressable
        style={{flex: 1}}
        onPress={() => {
          onPress(anthology);
        }}>
        <View style={styles.itemContainer}>
          <SubTitle title={anthology.title} active={index === activeIndex} />
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
        <Pressable onPress={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Pressable>
      </View>
      <View style={styles.stateRow}>
        <Text style={styles.text2}>{state}</Text>
      </View>
      <FlatList
        contentContainerStyle={styles.rowContainer}
        data={anthologys}
        renderItem={({item, index}) => (
          <DualItemRow children={ItemBox} index={index} datas={anthologys} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    position: 'absolute',
    elevation: 1,
    width: '100%'
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
    margin: 10,
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
