// Custom AppEntry para monorepo
// Garante que o Expo use nosso index.js

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);

