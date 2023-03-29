import * as React from 'react';
import {View, Dimensions, useWindowDimensions} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import RecommandInfo from '../../type/RecommandInfo';
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
  onPress: (item: RecommandInfo) => void;
};

const ParallaxCarousel: React.FC<parallaxCarouselProps> = ({
  carousels,
  onPress,
}) => {
  const progressValue = useSharedValue<number>(0);
  const layout = useWindowDimensions();

  type renderItemProps = {item: RecommandInfo};

  return (
    <View
      style={{
        alignItems: 'center',
        padding: 10,
        // backgroundColor: 'red'
      }}>
      <Carousel
        vertical={false}
        width={layout.width - 20}
        height={180}
        style={{
          width: layout.width - 20,
        }}
        loop
        pagingEnabled={true}
        snapEnabled={true}
        autoPlay={true}
        autoPlayInterval={1500}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        // mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        data={carousels}
        renderItem={({item}: renderItemProps) => {
          return <SBItem onPress={onPress} pretty item={item} />;
        }}
      />
      {!!progressValue && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 10 * carousels.length,
            alignSelf: 'center',
            position: 'absolute',
            bottom: 15,
            right: 30,
          }}>
          {carousels.map((carousel, index) => {
            return (
              <PaginationItem
                backgroundColor={'white'}
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
  const width = 5;

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
        backgroundColor: 'rgba(244,244,244,0.5)',
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
