import {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {LoadingContainer} from '../../component/Loading';
import { Image, ImageProps, useWindowDimensions } from "react-native";
import { PlayerProps } from '../InfoPage';

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

const ComicPlayer: React.FC<PlayerProps> = ({
  dataAvailable,
  nextDataAvailable,
  data,
  title,
  onErr,
  onBack,
  toNextSource,
  onProgress,
  defaultProgress,
  renderAnthologys
}) => {

  return (
    <LoadingContainer loading={!dataAvailable} style={{paddingTop: '30%'}}>
      <FlatList
        data={data}
        renderItem={({item}) => <ResizeImage source={{uri: item}} />}
      />
    </LoadingContainer>
  );
};

export default ComicPlayer;
