import React, {} from 'react';
import {Player} from './Player';
import {useRoute} from '@react-navigation/native';
import {VideoPageProps} from '../../route';
import Container from '../../component/Container';
import InfoPage from '../InfoPage';
import { useWindowDimensions } from 'react-native';


const VideoPage: React.FC<{}> = () => {
  const route = useRoute<VideoPageProps['route']>()
  const {url, apiName} = route.params
  const layout = useWindowDimensions()
  return (
    <Container>
      <InfoPage
        allowDragging={false}
        tabName='Anime'
        apiName={apiName}
        playerHeight={layout.width*0.56}
        url={url}
        renderPlayer={({
          title,
          onBack,
          data,
          dataAvailable,
          nextDataAvailable,
          onErr,
          toNextSource,
          onProgress,
          defaultProgress,
          renderAnthologys,
          showPanel,
          hidePanel,
          playerHeight
        }) => (
          <Player
            dataAvailable={dataAvailable}
            nextDataAvailable={nextDataAvailable}
            title={title}
            onBack={onBack}
            data={data}
            onErr={onErr}
            toNextSource={toNextSource}
            onProgress={onProgress}
            defaultProgress={defaultProgress}
            renderAnthologys={renderAnthologys}
            showPanel={showPanel}
            hidePanel={hidePanel}
            playerHeight={playerHeight}
          />
        )}
      />
    </Container>
  );
};

export default VideoPage;
