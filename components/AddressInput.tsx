import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Suggestion = {
    place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSelectSuggestion?: (suggestion: Suggestion) => void;
  style?: object;
};

export default function AddressInput({ value, onChangeText, placeholder, onSelectSuggestion }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<TextInput>(null); // 1. Create ref

  useEffect(() => {
  
    const trimmedValue = value.trim();
  console.log('Input value:', value, 'Trimmed:', trimmedValue, 'Length:', trimmedValue.length);
  if (trimmedValue.length < 3) {
    setSuggestions([]);
    setShowDropdown(false);
    return;
  }
    const timeout = setTimeout(() => {
  console.log('Fetching...');
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmedValue)}`, {
    headers: {
      'User-Agent': 'runaroute-app/1.0 (runaroute@email.com)', // Use your app name/email
      'Accept-Language': 'en', // Optional: set language
    },
  })
    .then(res => res.json())
    .then(data => {
      console.log('Nominatim suggestions:', data);
      setSuggestions(data);
      setShowDropdown(true);
    })
    .catch(err => {
      console.error('Error fetching suggestions:', err);
      setSuggestions([]);
      setShowDropdown(false);
    });
}, 600);
    return () => clearTimeout(timeout);
    
  }, [value]);

  const handleSelect = (suggestion: Suggestion) => {
    onChangeText(''); // Clear the input field
    setShowDropdown(false);
    setSuggestions([]);
    inputRef.current?.blur(); // 2. Unfocus the input
    onSelectSuggestion && onSelectSuggestion(suggestion);
  };

  return (
    <View style={styles.container}>
      <TextInput
      ref={inputRef} // 3. Attach ref
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || "Enter address (optional)"}
        autoCorrect={false}
        autoCapitalize="none"
         selectTextOnFocus={true}
      />
      {showDropdown && suggestions.length > 0 && (
        console.log('Rendering suggestions:', suggestions),
        <View style={styles.dropdown}>
          <FlatList
            data={suggestions}
            keyExtractor={item => item.place_id?.toString() || item.display_name}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)} style={styles.suggestion}>
                <Text>{item.display_name}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
    padding: 2,
    backgroundColor: '#fff',
    marginLeft:10,
    marginRight:10,
    marginTop:10,
    borderRadius:10,
    borderColor: '#f0735a',
    borderWidth: 2
  },
  input: {
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
    backgroundColor: '#f9f9f9',
  },
  dropdown: {
    position: 'absolute',
    top: 46,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f0735a',
    borderRadius: 10,
    maxHeight: 250,
    zIndex: 100,
    elevation: 3,
    
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2d3cd',
    
  },
});