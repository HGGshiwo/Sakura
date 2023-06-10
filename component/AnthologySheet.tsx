import {Text} from '@rneui/themed';
import {Pressable, StyleSheet, View} from 'react-native';
import {SubTitle, SubTitleBold} from './Text';
import {ReactNode} from 'react';
import {CloseButton} from './Button';
import {useStore} from '../scene/InfoPage';
import {FlatGrid} from './Grid';
import useTheme from '../zustand/Theme';

const AnthologySheet: React.FC<{}> = () => {
  const {
    playerHeight,
    sheetHeight,
    update,
    pageInfo,
    episode,
    changeEpisode,
  } = useStore();

  const {PlayerStyle} = useTheme().theme;
  const {textColor, playerTextColor, indicatorColor} = PlayerStyle;
  return (
    <View style={{...styles.container, height: sheetHeight, top: playerHeight}}>
      <View style={styles.headerRow}>
        <SubTitleBold title="选集" />
        <CloseButton onPress={() => update({episodeSheetVisible: false})} />
      </View>
      <View style={styles.stateRow}>
        <Text style={styles.text2}>{pageInfo?.state}</Text>
      </View>
      <FlatGrid
        contentContainerStyle={{paddingBottom: 50}}
        numColumns={2}
        data={pageInfo?.episodes}
        renderItem={({index, item}) => (
          <Pressable
            style={{flex: 1}}
            onPress={() => {
              update({flashData: true});
              changeEpisode(index);
            }}
            key={index}>
            <View style={styles.itemContainer}>
              <SubTitle
                title={item.title}
                style={{
                  color: textColor(item.taskUrl === episode?.taskUrl),
                }}
              />
            </View>
          </Pressable>
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
    margin: 5,
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
