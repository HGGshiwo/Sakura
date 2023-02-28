import {faMagnifyingGlass, faSpinner} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Pressable, View, TextInput, Text, StyleSheet} from 'react-native';
import {useState} from 'react';

interface Props {
  isButton?: boolean;
  placeholder?: string;
  onPress?: () => void;
  autoFocus?: boolean;
  onChangeText?: (text: string) => void;
  loading?: boolean;
}

const SearchBar: React.FC<Props> = ({
  isButton = false,
  placeholder,
  onPress,
  autoFocus = false,
  onChangeText,
  loading = false,
}) => {
  const [searchValue, setSearchValue] = useState('');
  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <FontAwesomeIcon
          color="lightgrey"
          icon={loading ? faSpinner : faMagnifyingGlass}
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
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export {SearchBar};
