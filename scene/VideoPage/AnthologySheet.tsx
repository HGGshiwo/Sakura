import {Button, Text, BottomSheet, Tab, TabView} from '@rneui/themed';
import {StyleSheet, View, ScrollView} from 'react-native';
import {useState} from 'react';
import {PlayList} from '../../type/PlayList';
import {Source} from '../../type/Source';

type anthologySheetProps = {
  height: number;
  top: number;
  playList: PlayList;
  sources: Source[];
  state: string;
  visible: boolean;
  defaultActive: number;
  onPress: (event: any) => void;
};

const AnthologySheet = ({
  height,
  top,
  playList,
  sources,
  state,
  visible,
  defaultActive,
  onPress,
}: anthologySheetProps) => {
  const [index, setIndex] = useState(defaultActive);

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
    stateRow:{
      padding: 10
    },
    emptyRow:{
      padding: 20
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
        <Tab scrollable value={index} onChange={setIndex}>
          {sources.map(source => {
            return <Tab.Item title={source.title} key={source.id} />;
          })}
        </Tab>
        <View style={styles.stateRow}>
          <Text style={styles.text2}>{state}</Text>
        </View>
        <TabView value={index} onChange={setIndex}>
          {sources.map(source => {
            return (
              <TabView.Item key={source.id}>
                <ScrollView>
                  <View style={styles.rowContainer}>
                    {playList[source.title as keyof PlayList].length == 0 ? (
                      <View style={styles.emptyRow}>
                        <Text>暂无数据</Text>
                      </View>
                    ) : (
                      playList[source.title as keyof PlayList].map(
                        (as, index) => {
                          return index % 2 == 0 ? (
                            <View style={styles.boxRow}>
                              <View style={styles.itemContainer}>
                                <Text>{as.title}</Text>
                              </View>
                              {index + 1 <=
                              playList[source.title as keyof PlayList]
                                .length ? (
                                <View style={styles.itemContainer}>
                                  <Text>
                                    {
                                      playList[source.title as keyof PlayList][
                                        index + 1
                                      ].title
                                    }
                                  </Text>
                                </View>
                              ) : (
                                <></>
                              )}
                            </View>
                          ) : (
                            <></>
                          );
                        },
                      )
                    )}
                  </View>
                </ScrollView>
              </TabView.Item>
            );
          })}
        </TabView>
      </View>
    </BottomSheet>
  );
};

export {AnthologySheet};
