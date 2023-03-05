import {Text} from '@rneui/themed';
import {StyleSheet, View, FlatList} from 'react-native';
import {ListItemInfo} from '../../../type/ListItemInfo';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Pressable} from 'react-native';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {SubTitle, SubTitleBold} from '../../../component/Text';
import MultiItemRow from '../../../component/MultiItemRow';

type anthologySheetProps = {
  height: number;
  top: number;
  anthologys: ListItemInfo[];
  state: string;
  visible: boolean;
  onPress: (index: number) => void;
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

  const ItemBox: React.FC<ItemBoxProps> = ({index, anthology}) => {
    return (
      <Pressable
        style={{flex: 1}}
        onPress={() => {
          onPress(index);
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
        <SubTitleBold title="选集" />
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
          <MultiItemRow
            numberOfItem={2}
            children={(index, info) => (
              <ItemBox index={index} anthology={info} key={index}/>
            )}
            index={index}
            datas={anthologys}
          />
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
    width: '100%',
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
  text2: {
    fontSize: 16,
    color: 'gray',
  },
  active: {
    color: 'deeppink',
  },
});

export {AnthologySheet};
