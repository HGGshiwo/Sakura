import {Button, Image} from '@rneui/themed';
import {
  View,
  StyleSheet,
  SectionList,
  Pressable,
  ImageBackground,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import {Agent} from '../../api/yinghuacd/HomeAgent';
import {SearchBar} from '@rneui/themed';
import {RecommandInfo} from '../../type/RecommandInfo';
import {ParallaxCarousel} from './ParallaxCarousel';
import {NavBar} from './NavBar';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClose, faSearch} from '@fortawesome/free-solid-svg-icons';
import {InfoText, SubTitleBold} from '../../component/Text';
import {TextButton} from '../../component/TextButton';
import {width} from '@fortawesome/free-solid-svg-icons/faPlay';

interface Props {
  navigation: any;
}

const HomePage: React.FC<Props> = ({navigation}) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [carousels, setCarousels] = useState<RecommandInfo[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    const agent = new Agent();
    agent.afterLoadCarousels(setCarousels);
    agent.afterLoadSections(setSections);
    agent.load();
  }, []);

  interface ItemProps {
    recent: RecommandInfo;
    index: number;
    section: any;
  }

  interface SubItemProps {
    recent: RecommandInfo;
    index: number;
  }

  const Item: React.FC<ItemProps> = ({recent, index, section}) => {
    console.log(index);
    if (index % 2 === 1) return <></>;

    const SubItem: React.FC<SubItemProps> = ({index, recent}) => {
      return (
        <View style={styles.infoContainer}>
          <Pressable
            onPress={() => {
              navigation.push('video', {url: recent.href});
            }}
            key={index}>
            <ImageBackground
              style={styles.imgContainer}
              imageStyle={styles.image}
              source={{uri: recent.img}}>
              <InfoText style={styles.imgText} title={recent.state} />
            </ImageBackground>
          </Pressable>
          <InfoText title={recent.title} />
        </View>
      );
    };
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <SubItem index={index} recent={recent} />
        {index + 1 === section.data.length ? (
          <View style={styles.infoContainer}></View>
        ) : (
          <SubItem index={index + 1} recent={section.data[index + 1]} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        platform="ios"
        cancelButtonTitle={'搜索'}
        showCancel={false}
        onCancel={() => {}}
        value={searchValue}
        onChangeText={setSearchValue}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.inputContainer}
        searchIcon={<FontAwesomeIcon icon={faSearch} />}
        clearIcon={<FontAwesomeIcon icon={faClose} />}
        cancelButtonProps={{color: 'deeppink'}}
      />
      <SectionList
        ListHeaderComponent={
          <>
            <ParallaxCarousel carousels={carousels} />
            <NavBar navigation={navigation} />
          </>
        }
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderItem={({item, index, section}) => (
          <Item recent={item} index={index} section={section} />
        )}
        renderSectionHeader={({section: {title}}) => (
          <View style={styles.titleRow}>
            <SubTitleBold title={title} />
            <TextButton title="更多" onPress={() => {}} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    // borderRadius: 20,
  },
  infoContainer: {
    flex: 1,
    margin: 10,
    height: 140,
    justifyContent: 'flex-start',
    // backgroundColor: 'green',
  },
  imgContainer: {
    justifyContent: 'center',
    resizeMode: 'cover',
    height: 100,
    // backgroundColor: 'red',
  },
  imgText: {
    bottom: 2,
    right: 2,
    position: 'absolute',
    color: 'white',
    backgroundColor: '#rgba(0,0,0,0.5)',
  },
  titleRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  image: {
    borderRadius: 5,
  },
});

export default HomePage;
