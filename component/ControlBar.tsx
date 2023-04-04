import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ReactNode} from 'react';

const ControlBar: React.FC<{
  top: boolean;
  fullscreen: boolean;
  children: ReactNode;
  show: boolean;
}> = ({top, fullscreen, children, show}) => {
  return (
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.8)']}
      start={{x: 0, y: top ? 1 : 0}}
      end={{x: 0, y: top ? 0 : 1}}
      style={[
        styles.bar,
        {
          left: 0,
          top: top ? 0 : undefined,
          bottom: !top ? 0 : undefined,
          display: show ? 'flex' : 'none',
          height: fullscreen ? 60 : 40,
        },
        fullscreen && !top ? styles.fullscreenBottomBar : null,
      ]}>
      {children}
    </LinearGradient>
  );
};

const ControlBarRow: React.FC<{children: ReactNode}> = ({children}) => (
  <View style={styles.bottomBarRow}>{children}</View>
);

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    height: 40,
    position: 'absolute',
    flexDirection: 'row',
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
  bottomBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  fullscreenBottomBar: {
    bottom: 0,
    left: 0,
    width: '100%',
    height: 80,
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: 'space-around',
  },
});

export {ControlBar, ControlBarRow};
export default ControlBar;
