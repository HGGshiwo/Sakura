import {faClose, faMagnifyingGlass, faSpinner} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Pressable, View, TextInput, Text, StyleSheet} from 'react-native';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

interface Props {
  isButton?: boolean;
  placeholder?: string;
  onPress?: () => void;
  autoFocus?: boolean;
  onChangeText?: (text: string) => void;
  loading?: boolean;
  style?: ViewStyle;
  searchValue?: string;
  onClose?:()=>void;
}

const SearchBar: React.FC<Props> = ({
  isButton = false,
  placeholder,
  onPress,
  searchValue,
  autoFocus = false,
  onChangeText,
  loading = false,
  onClose,
  style,
}) => {
  return (
    <Pressable style={{flex: 1}} onPress={onPress}>
      <View style={[styles.container, style]}>
        <FontAwesomeIcon color="grey" icon={faMagnifyingGlass} />
        {isButton ? (
          <Text style={{paddingLeft: 10}}>{placeholder}</Text>
        ) : (
          <>
            <TextInput
              autoFocus={autoFocus}
              style={{flex: 1, color: 'black', paddingLeft: 10}}
              placeholder={placeholder}
              value={searchValue}
              onChangeText={onChangeText}
            />
            <Pressable onPress={onClose}>
              <FontAwesomeIcon color="grey" icon={faClose}/>
            </Pressable>
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    // width: 300,
    flex: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
    margin: 10,
    backgroundColor: '#f7f8f9',
    color: 'black',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export {SearchBar};
