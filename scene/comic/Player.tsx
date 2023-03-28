import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {FlatList, Modal, View, StyleSheet, Pressable} from 'react-native';
import {LoadingContainer} from '../../component/Loading';
import {Image, ImageProps, useWindowDimensions} from 'react-native';
import {PlayerProps} from '../InfoPage';
import {BackButton} from '../../component/Button';
import {LoadingText} from '../../component/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ResizeImage: React.FC<ImageProps> = props => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const layout = useWindowDimensions();
  useEffect(() => {
    Image.getSize((props.source as any).uri, (width, height) => {
      setAspectRatio(width / height);
    });
  }, []);
  return (
    <Image
      style={{resizeMode: 'contain', width: layout.width, aspectRatio}}
      {...props}
    />
  );
};

const ComicPlayer = forwardRef<{fullScreen: () => void}, PlayerProps>(
  (
    {
      dataAvailable,
      nextDataAvailable,
      data,
      title,
      onErr,
      onBack,
      toNextSource,
      onProgress,
      defaultProgress,
      renderAnthologys,
      defaultFullscreen,
    },
    ref,
  ) => {
    const [fullscreen, setFullscreen] = useState(defaultFullscreen);
    const [controlVisible, setControlVisible] = useState(false);
    const controlVisibleRef = useRef(false); //control是否可见
    const controlTimer = useRef(undefined); //当前的计时器
    const insents = useSafeAreaInsets()

    useImperativeHandle(
      ref,
      () => ({
        fullScreen: () => setFullscreen(true),
      }),
      [],
    );

    //打开control并在一段时间之后关闭
    const openControl = () => {
      setControlVisible(true);
      controlVisibleRef.current = true;
      waitCloseControl();
    };

    //等待control消失的计时器
    const waitCloseControl: Function = () => {
      if (controlTimer.current !== undefined) {
        clearTimeout(controlTimer.current);
        controlTimer.current = undefined;
      }
      controlTimer.current = setTimeout(() => {
        setControlVisible(false);
        controlVisibleRef.current = false;
      }, 3000) as any;
    };

    //点击了视频空白区域
    const handlePress = () => {
      // setRateSheetVisible(false);
      // setAnthologySheetVisible(false);
      if (controlVisibleRef.current) {
        if (controlTimer.current !== undefined) {
          clearTimeout(controlTimer.current);
          controlTimer.current = undefined;
        }
        setControlVisible(false);
        controlVisibleRef.current = false;
      } else {
        openControl();
      }
    };
    return (
      <Modal style={{flex: 1}} statusBarTranslucent visible={fullscreen}>
        <LoadingContainer
          loading={!dataAvailable}
          containerStyle={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          style={{paddingTop: '30%'}}>
          <FlatList
            data={data}
            renderItem={({item}) => (
              <Pressable onPress={handlePress} style={{flex: 1}}>
                <ResizeImage source={{uri: item}} />
              </Pressable>
            )}
          />
        </LoadingContainer>
        {/* top bar  */}
        <View
          style={[
            styles.topBar,
            styles.bar,
            {
              display: controlVisible ? 'flex' : 'none',
              height: 60 + insents.top,
              paddingTop: insents.top
            },
          ]}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <BackButton onPress={onBack} />
            <LoadingText
              title={title}
              numberOfLines={1}
              style={{paddingLeft: 10}}
            />
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  video: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  bar: {
    width: '100%',
    height: 40,
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  topBar: {
    top: 0,
    left: 0,
  },
  bottomBar: {
    bottom: 0,
    left: 0,
  },
  fullscreenBottomBar: {
    width: '100%',
    height: 80,
    position: 'absolute',
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: 'space-around',
  },
  bottomBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  slider: {
    flex: 1,
    marginHorizontal: 15,
  },
});

export default ComicPlayer;
