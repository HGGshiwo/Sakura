import {useEffect, useState} from 'react';
import {Image, ImageProps, useWindowDimensions} from 'react-native';

const ResizeImage: React.FC<ImageProps> = props => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const layout = useWindowDimensions();
  useEffect(() => {
    Image.getSize((props.source as any).uri, (width, height) => {
      setAspectRatio(width / height);
    });
  }, []);
  const style = props.style;
  delete props.style;
  return (
    <Image
      {...props}
      style={[{resizeMode: 'contain', width: layout.width, aspectRatio}, style]}
    />
  );
};

export default ResizeImage;
