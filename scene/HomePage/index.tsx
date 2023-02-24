import {Button} from '@rneui/themed';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Agent} from '../../api/yinghuacd/HomeAgent';
import {SearchBar} from '@rneui/themed';
import {RecommandInfo} from '../../type/RecommandInfo';
import {ParallaxCarousel} from './ParallaxCarousel';
import {Bar} from './Bar';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCancel, faClose, faSearch} from '@fortawesome/free-solid-svg-icons';

interface Props {
  navigation: any;
}

const HomePage: React.FC<Props> = ({navigation}) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [carousels, setCarousels] = useState<RecommandInfo[]>([]);
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const agent = new Agent();
    agent.afterLoadCarousels(setCarousels);

    agent.load();
  }, []);

  return (
    <View style={styles.container}>
      <SearchBar
        platform="ios"
        cancelButtonTitle = {'搜索'}
        showCancel = {false}
        onCancel={()=>{}}
        value={searchValue}
        onChangeText={setSearchValue}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.inputContainer}
        searchIcon={<FontAwesomeIcon icon={faSearch} />}
        clearIcon={<FontAwesomeIcon icon={faClose} />}
        cancelButtonProps = {{color: 'deeppink'}}
      />
      <ParallaxCarousel carousels={carousels} />
      <Bar navigation={navigation} />
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
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    // borderRadius: 20,
  },
});

export default HomePage;
