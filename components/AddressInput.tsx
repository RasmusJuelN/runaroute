import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Type for a suggestion returned from the Nominatim (openstreetmap) API
type Suggestion = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

// Props for the AddressInput component
type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSelectSuggestion?: (suggestion: Suggestion) => void;
  style?: object;
};

export default function AddressInput({ value, onChangeText, placeholder, onSelectSuggestion }: Props) {
  // State for fetched suggestions
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  // State to control dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);
  // Ref to control focus/blur of the input
  const inputRef = useRef<TextInput>(null);

  // Effect: Fetch address suggestions when input value changes
  useEffect(() => {
    const trimmedValue = value.trim();
    // If input is too short, clear suggestions and hide dropdown
    if (trimmedValue.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    // Debounce API call by 600ms
    const timeout = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmedValue)}`, {
        headers: {
          'User-Agent': 'runaroute-app/1.0 (runaroute@email.com)', // Required by Nominatim
          'Accept-Language': 'en', // Optional: set language
        },
      })
        .then(res => res.json())
        .then(data => {
          setSuggestions(data);
          setShowDropdown(true);
        })
        .catch(err => {
          setSuggestions([]);
          setShowDropdown(false);
        });
    }, 600);
    // Cleanup: clear timeout if value changes before debounce finishes
    return () => clearTimeout(timeout);
  }, [value]);

  // Handler: When a suggestion is selected
  const handleSelect = (suggestion: Suggestion) => {
    onChangeText(''); 
    setShowDropdown(false); 
    setSuggestions([]);
    inputRef.current?.blur(); // Unfocus input
    // If onSelectSuggestion exists, Pass selected suggestion up (callback)
    onSelectSuggestion && onSelectSuggestion(suggestion); 
  };

  return (
    <View style={styles.container}>
      {/* Address input field */}
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || "Enter address (optional)"}
        autoCorrect={false}
        autoCapitalize="none"
        selectTextOnFocus={true}
      />
      {/* Dropdown with suggestions */}
      {showDropdown && suggestions.length > 0 && (
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

// Styles for the component
const styles = StyleSheet.create({
  container: {
    padding: 2,
    backgroundColor: '#fff',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 10,
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