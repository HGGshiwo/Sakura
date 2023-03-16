import {faMagnifyingGlass, faSpinner} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Pressable, View, TextInput, Text, StyleSheet} from 'react-native';
import {useState} from 'react';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

interface Props {
  isButton?: boolean;
  placeholder?: string;
  onPress?: () => void;
  autoFocus?: boolean;
  onChangeText?: (text: string) => void;
  loading?: boolean;
  style?: ViewStyle;
}

const SearchBar: React.FC<Props> = ({
  isButton = false,
  placeholder,
  onPress,
  autoFocus = false,
  onChangeText,
  loading = false,
  style={}
}) => {
  const [searchValue, setSearchValue] = useState('');
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, style]}>
        <FontAwesomeIcon
          color="lightgrey"
          icon={faMagnifyingGlass}
        />
        {isButton ? (
          <Text style={{paddingLeft: 10}}>{placeholder}</Text>
        ) : (
          <TextInput
            autoFocus={autoFocus}
            style={{flex: 1, color: 'black', paddingLeft: 10}}
            placeholder={placeholder}
            value={searchValue}
            onChangeText={text => setSearchValue(text)}
            onBlur={() => {
              onChangeText ? onChangeText(searchValue) : null;
            }}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 300,
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
