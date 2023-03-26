import {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import Container from '../../component/Container';
import api from '../../api';
import ResizeImage from './ResizeImage';

const ComicPage: React.FC<{}> = () => {
  const [imgs, setImgs] = useState<string[]>([]);
  const onRefresh = () => {
    const loadComicSrc = api.Comic.biquge.comicSrc!;
    loadComicSrc('https://www.biqug.org/index.php/chapter/1508887', imgs => {
      setImgs(imgs);
    });
  };
  useEffect(onRefresh, []);
  return (
    <Container>
      <FlatList
        data={imgs}
        renderItem={({item}) => (
          <ResizeImage
            source={{uri: item}}
          />
        )}
      />
    </Container>
  );
};

export default ComicPage;
