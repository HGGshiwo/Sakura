import {StyleSheet, View} from 'react-native';
import {Title} from '../../../component/Text';
import {FollowButton} from '../../../component/Button';

interface Props {
  title: string;
  followed: boolean;
  onPress: (followed: boolean) => void;
}

const TitleLine: React.FC<Props> = ({title, followed, onPress}) => {
  return (
    <View style={styles.container}>
      <Title style={{width: '70%'}} title={title} />
      <FollowButton onPress={onPress} defaultFollowed={followed}/>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
export {TitleLine};
