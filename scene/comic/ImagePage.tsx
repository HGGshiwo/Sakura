import {useRoute} from '@react-navigation/native';
import {ComicPageProps} from '../../type/route';
import InfoPage from '../InfoPage';
import ComicPlayer from './Player';
import {useWindowDimensions, Image, View} from 'react-native';
import {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ImagePage: React.FC<{}> = () => {
  const route = useRoute<ComicPageProps['route']>();
  const insets = useSafeAreaInsets();
  const {url} = route.params;
  const layout = useWindowDimensions();
  const height = layout.width * 0.56 + insets.top;

  return (
    <InfoPage
      autoFullscreen
      tabName="Comic"
      apiName="biquge"
      topStyle={{height, width: layout.width}}
      url={url}
      renderTitleImg={url =>
        url === '' ? (
          <View
            style={{width: layout.width, height, backgroundColor: 'grey'}}
          />
        ) : (
          <Image
            style={{width: layout.width, height, alignSelf: 'center'}}
            source={{uri: url}}
          />
        )
      }
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
      }) => (
        <ComicPlayer
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
        />
      )}
    />
  );
};

export default ImagePage;
