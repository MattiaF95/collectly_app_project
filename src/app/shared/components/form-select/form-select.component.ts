import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true,
    },
  ],

  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.scss',
})
export class FormSelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = '';
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = false;
  @Input() appearance: 'fill' | 'outline' = 'outline';

  value: any = this.multiple ? [] : null;
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
