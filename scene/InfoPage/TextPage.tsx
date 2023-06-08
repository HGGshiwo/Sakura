import {useRoute} from '@react-navigation/native';
import InfoPage from './InfoPage';
import TextPlayer from '../../component/TextPlayer';
import {useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextPageProps} from '../../route';

const TextPage: React.FC<{}> = () => {
  const route = useRoute<TextPageProps['route']>();
  const insets = useSafeAreaInsets();
  const {url, apiName} = route.params;
  const layout = useWindowDimensions();
  const height = layout.width * 0.56 + insets.top;

  return (
    <InfoPage
      autoFullscreen
      allowDragging
      tabName="Novel"
      apiName={apiName}
      playerHeight={height}
      infoUrl={url}
      renderPlayer={({
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
        ref,
        showPanel,
        playerHeight,
        hidePanel,
        flashData,
      }) => (
        <TextPlayer
          showPanel={showPanel}
          playerHeight={playerHeight}
          ref={ref}
          onBack={onBack}
          toNextSource={toNextSource}
          onProgress={onProgress}
          defaultProgress={defaultProgress}
          renderAnthologys={renderAnthologys}
          dataAvailable={dataAvailable}
          nextDataAvailable={nextDataAvailable}
          title={title}
          onErr={onErr}
          data={data}
          hidePanel={hidePanel}
          flashData={flashData}
        />
      )}
    />
  );
};

export default TextPage;
