// Polyfill para Node/Metro que não tem Array.prototype.toReversed
if (!Array.prototype.toReversed) {
    Object.defineProperty(Array.prototype, 'toReversed', {
      value: function toReversed() {
        return [...this].reverse();
      },
      configurable: true,
      writable: true,
    });
  }
  
  const { getDefaultConfig } = require('expo/metro-config');
  const path = require('path');
  
  const projectRoot = __dirname;
  const workspaceRoot = path.resolve(projectRoot, '../..');
  
  const config = getDefaultConfig(projectRoot);
  config.watchFolders = [workspaceRoot];
  config.resolver.disableHierarchicalLookup = true;
  
  module.exports = config;

