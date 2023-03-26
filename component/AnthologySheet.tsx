import {Text} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import {SubTitleBold} from './Text';
import { ReactNode } from 'react';
import { CloseButton } from './Button';

type anthologySheetProps = {
  height: number;
  top: number;
  state: string;
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

const AnthologySheet = ({
  height,
  top,
  state,
  visible,
  onClose,
  children,
}: anthologySheetProps) => {

  return !visible ? (
    <></>
  ) : (
    <View style={{...styles.container, height, top}}>
      <View style={styles.headerRow}>
        <SubTitleBold title="选集" />
        <CloseButton onPress={onClose}/>
      </View>
      <View style={styles.stateRow}>
        <Text style={styles.text2}>{state}</Text>
      </View>
      {children}
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
