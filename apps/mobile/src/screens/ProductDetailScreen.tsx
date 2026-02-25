// Tela de detalhes do produto
// Placeholder - UI será implementada depois

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

export function ProductDetailScreen() {
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Produto</Text>
      <Text style={styles.id}>ID: {productId}</Text>
      <Text style={styles.placeholder}>
        Detalhes e comparação de preços serão exibidos aqui
      </Text>
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
  id: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});

