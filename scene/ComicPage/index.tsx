import {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import Container from '../../component/Container';
import api from '../../api';
import ResizeImage from './ResizeImage';
import {useRoute} from '@react-navigation/native';
import {ComicPageProps} from '../../type/route';

const ComicPage: React.FC<{}> = () => {
  const [imgs, setImgs] = useState<string[]>([]);
  const route = useRoute<ComicPageProps['route']>();
  const {url} = route.params;
  const onRefresh = () => {
    const loadComicSrc = api.Comic.biquge.comicSrc!;
    loadComicSrc(url, imgs => {
      setImgs(imgs);
    });
  };
  useEffect(onRefresh, []);
  return (
    <Container>
      <FlatList
        data={imgs}
        renderItem={({item}) => <ResizeImage source={{uri: item}} />}
      />
    </Container>
  );
};

export default ComicPage;
