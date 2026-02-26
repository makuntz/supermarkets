// Tela de favoritos
// Placeholder - UI será implementada depois

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>
      <Text style={styles.placeholder}>
        Seus produtos favoritos aparecerão aqui
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

