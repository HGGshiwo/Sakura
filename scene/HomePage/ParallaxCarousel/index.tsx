import {Image} from '@rneui/themed';
import * as React from 'react';
import {View, Dimensions} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import {RecommandInfo} from '../../../type/RecommandInfo';
import {SBItem} from './SBItem';
const colors = [
  '#26292E',
  '#899F9C',
  '#B3C680',
  '#5C6265',
  '#F5D399',
  '#F1F1F1',
];

type parallaxCarouselProps = {
  carousels: RecommandInfo[];
};

const ParallaxCarousel: React.FC<parallaxCarouselProps> = ({carousels}) => {

  const progressValue = useSharedValue<number>(0);
  const [windowWidth, setWindowWidth] = React.useState(100);
  React.useEffect(() => {
    const {width} = Dimensions.get('window');
    setWindowWidth(width);
  }, []);

  type renderItemProps = {item: RecommandInfo};

  return (
    <View
      style={{
        alignItems: 'center',
        padding: 10,
      }}>
      <Carousel
        vertical={false}
        width={windowWidth * 0.86}
        height={windowWidth * 0.6}
        style={{
          width: windowWidth * 0.86,
        }}
        loop
        pagingEnabled={true}
        snapEnabled={true}
        autoPlay={true}
        autoPlayInterval={1500}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        data={carousels}
        renderItem={({item}: renderItemProps) => {
          return <SBItem pretty item={item} />;
        }}
      />
      {!!progressValue && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 200,
            alignSelf: 'center',
          }}>
          {carousels.map((carousel, index) => {
            return (
              <PaginationItem
                backgroundColor={colors[index%5]}
                animValue={progressValue}
                index={index}
                key={index}
                isRotate={false}
                length={carousels.length}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const PaginationItem: React.FC<{
  index: number;
  backgroundColor: string;
  length: number;
  animValue: Animated.SharedValue<number>;
  isRotate?: boolean;
}> = props => {
  const {animValue, index, length, backgroundColor, isRotate} = props;
  const width = 10;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  }, [animValue, index, length]);
  return (
    <View
      style={{
        backgroundColor: 'rgba(0,0,0,0.1)',
        width,
        height: width,
        borderRadius: 50,
        overflow: 'hidden',
        transform: [
          {
            rotateZ: isRotate ? '90deg' : '0deg',
          },
        ],
      }}>
      <Animated.View
        style={[
          {
            borderRadius: 50,
            backgroundColor,
            flex: 1,
          },
          animStyle,
        ]}
      />
    </View>
  );
};

export {ParallaxCarousel};
