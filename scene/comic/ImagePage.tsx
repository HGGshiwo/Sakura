import {useRoute} from '@react-navigation/native';
import {ComicPageProps} from '../../type/route';
import InfoPage from '../InfoPage';
import ComicPlayer from './Player';
import {useWindowDimensions, Image} from 'react-native';
import { useEffect, useState } from 'react';

const ImagePage: React.FC<{}> = () => {
  const route = useRoute<ComicPageProps['route']>();
  const {url} = route.params;
  const layout = useWindowDimensions();
  const height = layout.width*0.56

  return (
    <InfoPage
      tabName='Comic'
      apiName='biquge'
      topStyle={{height, width: layout.width}}
      url={url}
      renderTitleImg={url => (<Image style={{width: layout.width, height, alignSelf:'center'}} source={{uri: url}} />)}
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
      }) => (
        <ComicPlayer
          onBack = {onBack}
          toNextSource={toNextSource}
          onProgress={onProgress} 
          defaultProgress={defaultProgress}
          renderAnthologys = {renderAnthologys}
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
