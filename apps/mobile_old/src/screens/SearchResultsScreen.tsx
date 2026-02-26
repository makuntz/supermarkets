// Tela de resultados da busca
// Placeholder - UI será implementada depois

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useSearchStore } from '../store/searchStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type SearchResultsRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;

export function SearchResultsScreen() {
  const route = useRoute<SearchResultsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { query } = route.params;
  const { results, isLoading, error } = useSearchStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultados para: "{query}"</Text>
      {isLoading ? (
        <Text style={styles.empty}>Carregando...</Text>
      ) : error ? (
        <Text style={styles.error}>Erro: {error}</Text>
      ) : (
        <Text style={styles.empty}>
          {results.length === 0 ? 'Nenhum resultado encontrado' : `${results.length} resultados`}
        </Text>
      )}
      <View style={styles.testButton}>
        <Button
          title="Teste: Ver produto ID '1'"
          onPress={() => {
            navigation.navigate('ProductDetail', { productId: '1' });
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginTop: 16,
  },
  empty: {
    marginTop: 16,
    color: '#666',
  },
  testButton: {
    marginTop: 20,
  },
});

