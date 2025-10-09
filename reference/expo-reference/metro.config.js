import { getDefaultConfig } from 'expo/metro-config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const config = getDefaultConfig(projectRoot);

config.resolver.sourceExts.push('cjs');

export default config;
