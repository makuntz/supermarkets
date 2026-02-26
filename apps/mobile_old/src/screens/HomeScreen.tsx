// Tela inicial: busca de produtos
// Placeholder - UI será implementada depois

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useSearchStore } from '../store/searchStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { query, setQuery } = useSearchStore();
  const [localQuery, setLocalQuery] = useState('');

  const handleSearch = () => {
    setQuery(localQuery);
    if (localQuery.trim()) {
      navigation.navigate('SearchResults', { query: localQuery });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comparador de Preços</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar produto (ex: arroz 5kg)"
        value={localQuery}
        onChangeText={setLocalQuery}
        onSubmitEditing={handleSearch}
      />
      <Button title="Buscar" onPress={handleSearch} />
      <View style={styles.testButton}>
        <Button
          title="Teste: Buscar 'arroz'"
          onPress={() => {
            navigation.navigate('SearchResults', { query: 'arroz' });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  testButton: {
    marginTop: 16,
  },
});

