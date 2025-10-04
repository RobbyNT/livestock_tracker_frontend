// dynamic-form.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormConfig, FormSubmitEvent, FormFieldConfig } from './models/dynamic-form';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html',
  imports: [ReactiveFormsModule]
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @Input() config!: FormConfig;
  @Input() isSubmitting = false;
  @Output() formSubmit = new EventEmitter<FormSubmitEvent>();
  @Output() formChange = new EventEmitter<any>();
  @Output() formReset = new EventEmitter<void>();

  dynamicForm!: FormGroup;
  visibleFields: FormFieldConfig[] = [];
  private formSubscription?: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.updateVisibleFields();
    this.subscribeToFormChanges();
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

  private buildForm(): void {
    const group: { [key: string]: FormControl } = {};

    this.config.fields.forEach(field => {
      const validators = this.buildValidators(field);
      const control = new FormControl({
        value: field.defaultValue ?? '',
        disabled: field.disabled ?? false
      }, validators);

      group[field.key] = control;
    });

    this.dynamicForm = this.fb.group(group);
  }

  private buildValidators(field: FormFieldConfig): any[] {
    const validators: any[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.type === 'email') {
      validators.push(Validators.email);
    }

    if (field.minLength) {
      validators.push(Validators.minLength(field.minLength));
    }

    if (field.maxLength) {
      validators.push(Validators.maxLength(field.maxLength));
    }

    if (field.min !== undefined) {
      validators.push(Validators.min(field.min));
    }

    if (field.max !== undefined) {
      validators.push(Validators.max(field.max));
    }

    if (field.pattern) {
      validators.push(Validators.pattern(field.pattern));
    }

    if (field.customValidators) {
      validators.push(...field.customValidators);
    }

    return validators;
  }

  private subscribeToFormChanges(): void {
    this.formSubscription = this.dynamicForm.valueChanges.subscribe(value => {
      this.updateVisibleFields();
      this.updateDisabledFields();
      this.formChange.emit(value);
    });
  }

  private updateVisibleFields(): void {
    const formValue = this.dynamicForm.value;
    this.visibleFields = this.config.fields.filter(field => 
      !field.showIf || field.showIf(formValue)
    );
  }

  private updateDisabledFields(): void {
    const formValue = this.dynamicForm.value;
    this.config.fields.forEach(field => {
      const control = this.dynamicForm.get(field.key);
      if (control && field.disableIf) {
        if (field.disableIf(formValue)) {
          control.disable();
        } else {
          control.enable();
        }
      }
    });
  }

  shouldShowField(field: FormFieldConfig): boolean {
    const formValue = this.dynamicForm.value;
    return !field.showIf || field.showIf(formValue);
  }

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      this.formSubmit.emit({
        formValue: this.dynamicForm.value,
        isValid: this.dynamicForm.valid,
        form: this.dynamicForm
      });
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  onReset(): void {
    this.dynamicForm.reset();
    this.config.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        this.dynamicForm.get(field.key)?.setValue(field.defaultValue);
      }
    });
    this.formReset.emit();
  }

  onFileChange(event: any, fieldKey: string): void {
    const file = event.target.files[0];
    this.dynamicForm.get(fieldKey)?.setValue(file);
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.dynamicForm.controls).forEach(key => {
      this.dynamicForm.get(key)?.markAsTouched();
    });
  }

  hasError(fieldKey: string): boolean {
    const control = this.dynamicForm.get(fieldKey);
    return !!(control && control.errors && (control.dirty || control.touched));
  }

  getFieldErrorMessage(field: FormFieldConfig): string {
    const control = this.dynamicForm.get(field.key);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return `${field.label} is required`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters required`;
    if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;
    if (errors['pattern']) return `Invalid ${field.label.toLowerCase()} format`;

    return 'Invalid input';
  }

  trackByFieldKey(index: number, field: FormFieldConfig): string {
    return field.key;
  }

  // Styling methods
  getFormLayoutClass(): string {
    const layout = this.config.layout || 'vertical';
    const columns = this.config.columns || 1;

    switch (layout) {
      case 'grid':
        return `grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-${columns}`;
      case 'horizontal':
        return 'space-y-0 space-x-4 flex flex-wrap items-end';
      default:
        return 'space-y-4 md:space-y-6';
    }
  }

  getFieldContainerClass(field: FormFieldConfig): string {
    let baseClass = field.containerClass || '';
    
    if (this.config.layout === 'grid') {
      switch (field.width) {
        case 'half': return `${baseClass} md:col-span-${Math.floor((this.config.columns || 2) / 2)}`;
        case 'third': return `${baseClass} md:col-span-1`;
        case 'quarter': return `${baseClass} md:col-span-1`;
        default: return `${baseClass} md:col-span-full`;
      }
    }

    return baseClass;
  }

  getFieldLabelClass(field: FormFieldConfig): string {
    return field.labelClass || 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2';
  }

  getInputClass(field: FormFieldConfig): string {
    const baseClass = 'block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm text-gray-900 dark:text-gray-100';
    const paddingClass = field.icon || field.prefix ? 'pl-10' : '';
    const suffixPaddingClass = field.suffix ? 'pr-10' : '';
    const errorClass = this.hasError(field.key) ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '';
    
    return `${baseClass} ${paddingClass} ${suffixPaddingClass} ${errorClass} ${field.inputClass || ''}`;
  }

  getFieldErrorClass(field: FormFieldConfig): string {
    return field.errorClass || 'mt-1 text-sm text-red-600 dark:text-red-400';
  }

  getSubmitButtonClass(): string {
    const baseClass = 'flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';
    const defaultClass = 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed';
    
    return `${baseClass} ${this.config.submitButtonClass || defaultClass}`;
  }
}

// Example usage configurations
export const RANCH_INFO_CONFIG: FormConfig = {
  title: 'Ranch Information',
  description: 'Tell us about your ranch operation',
  layout: 'vertical',
  fields: [
    {
      key: 'ranchName',
      type: 'text',
      label: 'Ranch Name',
      placeholder: 'e.g., Sunset Valley Ranch',
      required: true,
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>'
    },
    {
      key: 'city',
      type: 'text',
      label: 'City',
      placeholder: 'Oklahoma City',
      required: true,
      width: 'half'
    },
    {
      key: 'state',
      type: 'select',
      label: 'State',
      required: true,
      width: 'half',
      options: [
        { value: 'AL', label: 'Alabama' },
        { value: 'OK', label: 'Oklahoma' },
        { value: 'TX', label: 'Texas' },
        { value: 'KS', label: 'Kansas' }
      ]
    },
    {
      key: 'acreage',
      type: 'number',
      label: 'Total Acreage',
      placeholder: '1247',
      min: 1,
      width: 'half'
    },
    {
      key: 'ranchType',
      type: 'select',
      label: 'Ranch Type',
      required: true,
      width: 'half',
      options: [
        { value: 'cattle', label: 'Cattle Ranch' },
        { value: 'mixed', label: 'Mixed Livestock' },
        { value: 'horse', label: 'Horse Ranch' },
        { value: 'sheep', label: 'Sheep Ranch' },
        { value: 'goat', label: 'Goat Ranch' },
        { value: 'poultry', label: 'Poultry Farm' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      key: 'livestockCattle',
      type: 'checkbox',
      label: 'Cattle',
      showIf: (formValue) => formValue.ranchType === 'cattle' || formValue.ranchType === 'mixed'
    },
    {
      key: 'livestockHorses',
      type: 'checkbox',
      label: 'Horses',
      showIf: (formValue) => formValue.ranchType === 'horse' || formValue.ranchType === 'mixed'
    },
    {
      key: 'experienceLevel',
      type: 'radio',
      label: 'Experience Level',
      required: true,
      options: [
        { value: 'beginner', label: 'Beginner (0-2 years)' },
        { value: 'intermediate', label: 'Intermediate (3-10 years)' },
        { value: 'experienced', label: 'Experienced (10+ years)' },
        { value: 'expert', label: 'Expert/Professional' }
      ]
    },
    {
      key: 'description',
      type: 'textarea',
      label: 'Ranch Description',
      placeholder: 'Tell us about your ranch operation, goals, or anything else you\'d like us to know...',
      rows: 3,
      maxLength: 500
    }
  ],
  submitButtonText: 'Complete Setup',
  showResetButton: true,
  columns: 2
};