import { AbstractControl, FormGroup } from "@angular/forms";

interface ValidatorConfig {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message?: string;
}


export interface FormFieldConfig {
  key: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'time' | 'file';
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  defaultValue?: any;
  
  // Field-specific options
  options?: Array<{ value: any; label: string; disabled?: boolean }>; // For select/radio
  multiple?: boolean; // For select
  rows?: number; // For textarea
  min?: number; // For number/date
  max?: number; // For number/date
  step?: number; // For number
  pattern?: string; // For text validation
  maxLength?: number;
  minLength?: number;
  accept?: string; // For file inputs
  
  // Styling and layout
  containerClass?: string;
  labelClass?: string;
  inputClass?: string;
  errorClass?: string;
  width?: 'full' | 'half' | 'third' | 'quarter';
  
  // Conditional logic
  showIf?: (formValue: any) => boolean;
  disableIf?: (formValue: any) => boolean;
  
  // Custom validation
  customValidators?: Array<(control: AbstractControl) => {[key: string]: any} | null>;
  
  // Icons and visual elements
  icon?: string; // SVG string or icon class
  prefix?: string;
  suffix?: string;
}

export interface FormConfig {
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
  submitButtonText?: string;
  submitButtonClass?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
  containerClass?: string;
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: number; // For grid layout
}

export interface FormSubmitEvent {
  formValue: any;
  isValid: boolean;
  form: FormGroup;
}