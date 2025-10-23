import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BarcodeService } from '../../../core/services/barcode.service';

@Component({
  selector: 'app-barcode-scanner',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="scanner-dialog">
      <h2 mat-dialog-title>Scansiona Barcode</h2>

      <mat-dialog-content>
        <div class="scanner-info">
          <mat-icon>qr_code_scanner</mat-icon>
          <p>Inquadra il codice a barre con la fotocamera</p>
          <p class="scanner-result" *ngIf="scannedCode">
            Codice rilevato: <strong>{{ scannedCode }}</strong>
          </p>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions class="actions-end">
        <button mat-button (click)="close()">Annulla</button>
        <button
          mat-raised-button
          color="primary"
          (click)="startScan()"
          [disabled]="scanning"
        >
          <mat-icon>camera</mat-icon>
          {{ scanning ? 'Scansione in corso...' : 'Avvia Scanner' }}
        </button>
        <button
          mat-raised-button
          color="accent"
          (click)="confirm()"
          [disabled]="!scannedCode"
        >
          Conferma
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .scanner-dialog {
        min-width: 300px;
      }

      .scanner-info {
        text-align: center;
        padding: 2rem;

        mat-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          color: #3498db;
        }

        p {
          margin: 1rem 0;
          color: #666;
        }

        .scanner-result {
          padding: 1rem;
          background: #e8f5e9;
          border-radius: 8px;
          color: #2e7d32;
        }

        .dialog-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid #e0e0e0;
        }
      }
    `,
  ],
})
export class BarcodeScannerComponent {
  private barcodeService = inject(BarcodeService);
  private dialogRef = inject(MatDialogRef<BarcodeScannerComponent>);

  scanning = false;
  scannedCode: string | null = null;

  async startScan() {
    try {
      this.scanning = true;
      const code = await this.barcodeService.scan();

      if (code) {
        this.scannedCode = code;
      }
    } catch (error) {
      console.error('Errore scansione:', error);
      alert('Errore durante la scansione del barcode');
    } finally {
      this.scanning = false;
    }
  }

  confirm() {
    if (this.scannedCode) {
      this.dialogRef.close(this.scannedCode);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
