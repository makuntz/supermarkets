// Tela de resultados da busca
// Placeholder - UI será implementada depois

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useSearchStore } from '../store/searchStore';

type SearchResultsRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;

export function SearchResultsScreen() {
  const route = useRoute<SearchResultsRouteProp>();
  const { query } = route.params;
  const { results, isLoading, error } = useSearchStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultados para: "{query}"</Text>
      {isLoading && <Text>Carregando...</Text>}
      {error && <Text style={styles.error}>Erro: {error}</Text>}
      {!isLoading && !error && (
        <Text style={styles.empty}>
          {results.length === 0 ? 'Nenhum resultado encontrado' : `${results.length} resultados`}
        </Text>
      )}
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
});

