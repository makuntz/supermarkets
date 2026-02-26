// Store Zustand para estado de busca
// Escolha: Zustand é mais simples que React Query para este caso inicial,
// permite estado local reativo sem overhead de cache complexo.
// Podemos migrar para React Query depois se precisar de cache avançado.

import { create } from 'zustand';

interface SearchState {
  query: string;
  results: unknown[]; // ProductSearchResult[] quando tipos estiverem prontos
  isLoading: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  setResults: (results: unknown[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  query: '',
  results: [],
  isLoading: false,
  error: null,
};

export const useSearchStore = create<SearchState>((set) => ({
  ...initialState,
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set(initialState),
}));

