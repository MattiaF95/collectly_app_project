import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.collectly.app',
  appName: 'Collectly',
  webDir: 'dist/collectly/browser',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3498db',
    },
    BarcodeScanner: {
      // Configurazione scanner
    },
  },
};

export default config;
