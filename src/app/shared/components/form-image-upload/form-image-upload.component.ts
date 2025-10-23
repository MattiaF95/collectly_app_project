import { Component, Input, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-form-image-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormImageUploadComponent),
      multi: true,
    },
  ],
  templateUrl: './form-image-upload.component.html',
  styleUrl: './form-image-upload.component.scss',
})
export class FormImageUploadComponent implements ControlValueAccessor {
  private http = inject(HttpClient);

  @Input() label: string = 'Immagini';
  @Input() hint: string = '';
  @Input() maxImages: number = 10;

  images: string[] = [];
  uploading = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: string[]): void {
    this.images = value || [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  async onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = this.maxImages - this.images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    this.uploading = true;

    try {
      const formData = new FormData();
      filesToUpload.forEach((file) => {
        formData.append('images', file);
      });

      const response = await this.http
        .post<any>(`${environment.apiUrl}/upload`, formData)
        .toPromise();

      const newImages = response.images.map((img: any) => img.original);
      this.images = [...this.images, ...newImages];
      this.onChange(this.images);
    } catch (error) {
      console.error('Errore upload immagini:', error);
      alert('Errore durante il caricamento delle immagini');
    } finally {
      this.uploading = false;
      event.target.value = '';
    }
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
    this.onChange(this.images);
  }
}
