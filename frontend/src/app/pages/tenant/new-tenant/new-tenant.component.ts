import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormConfig, FormFieldConfig } from '../../../components/dynamic-form/models/dynamic-form';
import { DynamicFormComponent } from "../../../components/dynamic-form/dynamic-form.component";

@Component({
  selector: 'app-new-tenant',
  templateUrl: './new-tenant.component.html',
  styleUrls: ['./new-tenant.component.css'],
  imports: [ReactiveFormsModule, DynamicFormComponent]
})
export class NewTenantComponent implements OnInit {
  createRanchConfig = RANCH_CREATION_CONFIG
  isLoading = signal<boolean>(false);
  createRanchForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }


  /**
   * Dynamically build the Create Ranch form
   */
  private buildCreateRanchForm(): void {
    this.createRanchForm = this.fb.group({
      // Basic ranch information
      ranchName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],

      // Location fields
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required]],

      // Ranch details
      acreage: ['', [Validators.min(1), Validators.max(1000000)]],
      ranchType: ['', [Validators.required]],

      // Livestock checkboxes - dynamically created
      ...this.createLivestockControls(),

      // Experience and description
      experienceLevel: ['', [Validators.required]],
      description: ['', [Validators.maxLength(500)]],
    });

    // Setup dynamic behavior
    this.setupCreateFormDynamicBehavior();
  }

  /**
   * Dynamically create livestock checkbox controls
   */
  private createLivestockControls(): { [key: string]: FormControl } {
    const livestockTypes = [
      'cattle',
      'horses',
      'sheep',
      'goats',
      'pigs',
      'poultry',
    ];
    const controls: { [key: string]: FormControl } = {};

    livestockTypes.forEach((type) => {
      controls[`livestock${this.capitalizeFirst(type)}`] = new FormControl(
        false
      );
    });

    return controls;
  }

  /**
   * Add dynamic behavior to Create Ranch form
   */
  private setupCreateFormDynamicBehavior(): void {
    // Example: When ranch type changes, adjust required livestock
    this.createRanchForm
      .get('ranchType')
      ?.valueChanges.subscribe((ranchType) => {
        this.adjustLivestockRequirements(ranchType);
      });

    // Example: Auto-validate at least one livestock type is selected
    this.addLivestockValidation();
  }

  /**
   * Adjust livestock requirements based on ranch type
   */
  private adjustLivestockRequirements(ranchType: string): void {
    // Clear previous requirements
    this.clearLivestockValidators();

    switch (ranchType) {
      case 'cattle':
        this.createRanchForm
          .get('livestockCattle')
          ?.setValidators([Validators.requiredTrue]);
        break;
      case 'horse':
        this.createRanchForm
          .get('livestockHorses')
          ?.setValidators([Validators.requiredTrue]);
        break;
      case 'mixed':
        // For mixed, require at least 2 livestock types
        this.addMinimumLivestockValidator(2);
        break;
      // Add other cases as needed
    }

    // Update validity
    this.updateLivestockValidation();
  }

  /**
   * Add validation to ensure at least one livestock type is selected
   */
  private addLivestockValidation(): void {
    const livestockControls = Object.keys(this.createRanchForm.controls)
      .filter((key) => key.startsWith('livestock'))
      .map((key) => this.createRanchForm.get(key));

    // Custom validator for at least one livestock selected
    const atLeastOneSelected = () => {
      const selected = livestockControls.some(
        (control) => control?.value === true
      );
      return selected ? null : { noLivestockSelected: true };
    };

    // Add this validator to the form group
    this.createRanchForm.setValidators(atLeastOneSelected);
  }

  /**
   * Helper method to add minimum livestock validator
   */
  private addMinimumLivestockValidator(minimum: number): void {
    const validator = () => {
      const selectedCount = Object.keys(this.createRanchForm.controls)
        .filter((key) => key.startsWith('livestock'))
        .reduce((count, key) => {
          return this.createRanchForm.get(key)?.value ? count + 1 : count;
        }, 0);

      return selectedCount >= minimum
        ? null
        : { minimumLivestock: { required: minimum, actual: selectedCount } };
    };

    this.createRanchForm.setValidators(validator);
  }

  /**
   * Clear livestock validators
   */
  private clearLivestockValidators(): void {
    Object.keys(this.createRanchForm.controls)
      .filter((key) => key.startsWith('livestock'))
      .forEach((key) => {
        this.createRanchForm.get(key)?.clearValidators();
      });
  }

  /**
   * Update livestock validation
   */
  private updateLivestockValidation(): void {
    Object.keys(this.createRanchForm.controls)
      .filter((key) => key.startsWith('livestock'))
      .forEach((key) => {
        this.createRanchForm.get(key)?.updateValueAndValidity();
      });
  }

  /**
   * Toggle form controls enabled/disabled state
   */
  // private toggleFormControls(enabled: boolean): void {
  //   if (enabled) {
  //     this.joinRanchForm.enable();
  //     this.createRanchForm.enable();
  //   } else {
  //     this.joinRanchForm.disable();
  //     this.createRanchForm.disable();
  //   }
  // }

  /**
   * Alternative: Build forms based on configuration objects
   */
  // private buildFormFromConfig(config: FormFieldConfig[]): FormGroup {
  //   const group: { [key: string]: any } = {};

  //   config.forEach((field) => {
  //     const validators = this.buildValidators(field.validators || []);
  //     group[field.name] = [field.defaultValue || '', validators];
  //   });

  //   return this.fb.group(group);
  // }

  /**
   * Build validators from configuration
   */
  // private buildValidators(validatorConfigs: ValidatorConfig[]): any[] {
  //   return validatorConfigs
  //     .map((config) => {
  //       switch (config.type) {
  //         case 'required':
  //           return Validators.required;
  //         case 'email':
  //           return Validators.email;
  //         case 'minLength':
  //           return Validators.minLength(config.value);
  //         case 'maxLength':
  //           return Validators.maxLength(config.value);
  //         case 'pattern':
  //           return Validators.pattern(config.value);
  //         default:
  //           return null;
  //       }
  //     })
  //     .filter((v) => v !== null);
  // }

  setupTenant(): void {
    if (this.createRanchForm.valid) {
      this.isLoading.set(true);
      const formData = this.createRanchForm.value;

      // Process create ranch logic
      console.log('Create Ranch Data:', formData);

      // Simulate API call
      setTimeout(() => {
        this.isLoading.set(false);
        // Handle success/error
      }, 2000);
    } else {
      this.markFormGroupTouched(this.createRanchForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private scrollToTop() {
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  // Get form errors for display
  getFieldError(form: FormGroup, fieldName: string): string | null {
    const field = form.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength'])
        return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
      if (field.errors['pattern']) return `Invalid ${fieldName} format`;
    }
    return null;
  }

}

// Example configuration objects
export const RANCH_CREATION_CONFIG: FormConfig = {
  title: 'Ranch Information',
  description: 'Tell us about your ranch operation',
  fields: [
    {
      key: 'ranchName',
      type: 'text',
      label: 'Ranch Name',
      placeholder: 'e.g., Sunset Valley Ranch',
      required: true,
      maxLength: 100,
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
      width: 'full'
    },
    {
      key: 'city',
      type: 'text',
      label: 'City',
      placeholder: 'Oklahoma City',
      required: true,
      width: 'half',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
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
        { value: 'KS', label: 'Kansas' },
        { value: 'CA', label: 'California' },
        { value: 'FL', label: 'Florida' },
        { value: 'NY', label: 'New York' }
      ]
    },
    {
      key: 'acreage',
      type: 'number',
      label: 'Total Acreage',
      placeholder: '1247',
      min: 1,
      max: 1000000,
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
      key: 'livestockTypes',
      type: 'select',
      label: 'Primary Livestock',
      multiple: true,
      description: 'Select all that apply',
      showIf: (formValue) => formValue.ranchType === 'mixed' || formValue.ranchType,
      options: [
        { value: 'cattle', label: 'Cattle' },
        { value: 'horses', label: 'Horses' },
        { value: 'sheep', label: 'Sheep' },
        { value: 'goats', label: 'Goats' },
        { value: 'pigs', label: 'Pigs' },
        { value: 'poultry', label: 'Poultry' }
      ]
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
      rows: 4,
      maxLength: 500,
      description: 'Optional - helps us customize your experience'
    }
  ],
  submitButtonText: 'Complete Setup',
  submitButtonClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  showResetButton: true,
  layout: 'grid',
  columns: 2
};