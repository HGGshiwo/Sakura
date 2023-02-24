import {Button} from '@rneui/themed';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Agent} from '../../api/yinghuacd/HomeAgent';
import {RecommandInfo} from '../../type/RecommandInfo';
import {ParallaxCarousel} from './ParallaxCarousel';
import { Bar } from './Bar';


interface Props {
	navigation: any;
}

const HomePage: React.FC<Props> = ({navigation}) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [carousels, setCarousels] = useState<RecommandInfo[]>([]);

  useEffect(() => {
    const agent = new Agent();
    const {width} = Dimensions.get('window');
		console.log(width)
    setWindowWidth(width);
    agent.afterLoadCarousels(setCarousels);

		agent.load()
  }, []);

	const styles = StyleSheet.create({
		barContainer:{
			flexDirection: 'row'
		},
		container: {
			flex: 1
		}
	})

  return (
    <View style={styles.container}>
      <ParallaxCarousel carousels={carousels} width={windowWidth} />
			<Bar navigation={navigation}/>
    </View>
  );
};

export default HomePage;
