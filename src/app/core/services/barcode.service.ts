import { Injectable } from '@angular/core';
import {
  BarcodeScanner,
  BarcodeFormat,
} from '@capacitor-mlkit/barcode-scanning';
import { Platform } from '@angular/cdk/platform';

@Injectable({ providedIn: 'root' })
export class BarcodeService {
  async checkPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.checkPermissions();
    return camera === 'granted';
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted';
  }

  async scan(): Promise<string | null> {
    try {
      // Verifica permessi
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) {
          throw new Error('Permessi fotocamera negati');
        }
      }

      // Avvia scanner
      const result = await BarcodeScanner.scan({
        formats: [
          BarcodeFormat.Ean13,
          BarcodeFormat.Ean8,
          BarcodeFormat.Upc,
          BarcodeFormat.Code39,
          BarcodeFormat.Code128,
          BarcodeFormat.QrCode,
        ],
      });

      if (result.barcodes && result.barcodes.length > 0) {
        return result.barcodes[0].rawValue;
      }

      return null;
    } catch (error) {
      console.error('Errore scanner barcode:', error);
      throw error;
    }
  }

  async isSupported(): Promise<boolean> {
    const result = await BarcodeScanner.isSupported();
    return result.supported;
  }

  async installGoogleBarcodeScannerModule(): Promise<void> {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }
}
