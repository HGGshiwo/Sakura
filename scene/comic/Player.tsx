import {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import Container from '../../component/Container';
import api, {loadComicPage} from '../../api';
import {useRoute} from '@react-navigation/native';
import {ComicPageProps} from '../../type/route';
import {LoadingContainer} from '../../component/Loading';
import alert from '../../component/Toast';
import { Image, ImageProps, useWindowDimensions } from "react-native";

const ResizeImage :React.FC<ImageProps> = (props)=>{
  const [ aspectRatio, setAspectRatio ] = useState(1)
  const layout = useWindowDimensions()
  useEffect(()=>{
      Image.getSize((props.source as any).uri,(width, height)=>{
          setAspectRatio(width/height)
      })
  },[])
  return (<Image style={{resizeMode: 'contain', width: layout.width, aspectRatio}} {...props} />)
}

const ComicPage: React.FC<{}> = () => {
  const [imgs, setImgs] = useState<string[]>([]);
  const route = useRoute<ComicPageProps['route']>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const {url} = route.params;
  const onRefresh = () => {
    const loadComicSrc = api.Comic.biquge.comicSrc!;
    const loadPage: loadComicPage = api.Comic.biquge.comic!;
    setRefreshing(true);
    loadPage(url, ({title, sources}) => {
      loadComicSrc(sources[0].data[0], imgs => {
        setImgs(imgs);
        if (!loading) {
          alert('刷新成功');
        }
        setLoading(false);
        setRefreshing(false);
      });
    });
  };
  useEffect(onRefresh, []);
  return (
    <LoadingContainer loading={loading} style={{paddingTop: '30%'}}>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={imgs}
        renderItem={({item}) => <ResizeImage source={{uri: item}} />}
      />
    </LoadingContainer>
  );
};

export default ComicPage;
