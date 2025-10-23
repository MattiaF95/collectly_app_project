import { Injectable } from '@angular/core';
import {
  BarcodeScanner,
  BarcodeFormat,
} from '@capacitor-mlkit/barcode-scanning';

@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  async scan(): Promise<string | null> {
    try {
      // Verifica se il barcode scanner è supportato
      const isSupported = await this.isSupported();

      if (!isSupported) {
        console.log(
          '📱 Barcode scanner non disponibile su browser, uso input manuale'
        );
        return this.manualInput();
      }

      // Verifica permessi
      const hasPermission = await this.checkPermissions();

      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) {
          console.log('⛔ Permessi camera negati');
          return this.manualInput();
        }
      }

      // Scansiona barcode
      const result = await BarcodeScanner.scan({
        formats: [
          BarcodeFormat.Ean8,
          BarcodeFormat.Ean13,
          BarcodeFormat.UpcA,
          BarcodeFormat.UpcE,
          BarcodeFormat.Code39,
          BarcodeFormat.Code128,
          BarcodeFormat.QrCode,
        ],
      });

      if (result.barcodes && result.barcodes.length > 0) {
        return result.barcodes[0].displayValue || result.barcodes[0].rawValue;
      }

      return null;
    } catch (error: any) {
      console.warn('Errore scanner barcode:', error);

      // Fallback automatico a input manuale
      return this.manualInput();
    }
  }

  async isSupported(): Promise<boolean> {
    try {
      const result = await BarcodeScanner.isSupported();
      return result.supported;
    } catch {
      return false;
    }
  }

  async checkPermissions(): Promise<boolean> {
    try {
      const { camera } = await BarcodeScanner.checkPermissions();
      return camera === 'granted';
    } catch {
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { camera } = await BarcodeScanner.requestPermissions();
      return camera === 'granted';
    } catch {
      return false;
    }
  }

  // Input manuale come fallback
  private manualInput(): Promise<string | null> {
    return new Promise((resolve) => {
      const code = prompt(
        '📷 Scanner fotocamera non disponibile.\n\nInserisci il codice a barre manualmente:'
      );
      resolve(code || null);
    });
  }
}
