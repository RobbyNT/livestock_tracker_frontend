import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FormConfig,
  FormSubmitEvent,
} from '../../../components/dynamic-form/models/dynamic-form';
import { DynamicFormComponent } from '../../../components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-join-tenant',
  templateUrl: './join-tenant.component.html',
  styleUrls: ['./join-tenant.component.css'],
  imports: [ReactiveFormsModule, DynamicFormComponent],
})
export class JoinTenantComponent implements OnInit {
  joinRanchConfig = JOIN_RANCH_CONFIG;
  isLoading = signal<boolean>(false);
  joinRanchForm!: FormGroup;

  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.buildJoinRanchForm();
    // this.buildCreateRanchForm();
  }

  ngOnInit() {}

  onJoinFormSubmit(event: FormSubmitEvent): void {
    console.log('Join form submitted:', event.formValue);
    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
    }, 2000);
  }

  onFormChange(formValue: any): void {
    console.log('Form changed:', formValue);
  }

  onFormReset(): void {
    console.log('Form reset');
  }

  /**
   * Dynamically build the Join Ranch form
   */
  private buildJoinRanchForm(): void {
    this.joinRanchForm = this.fb.group({
      invitationCode: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^[A-Z0-9]+$/), // Only uppercase letters and numbers
        ],
      ],
      ranchOwnerEmail: ['', [Validators.email]],
      userRole: ['', [Validators.required]],
    });

    // Optional: Add dynamic validation or field changes
    this.setupJoinFormDynamicBehavior();
  }

  // Form submission methods
  joinRanch(): void {
    if (this.joinRanchForm.valid) {
      this.isLoading.set(true);
      const formData = this.joinRanchForm.value;

      // Process join ranch logic
      console.log('Join Ranch Data:', formData);

      // Simulate API call
      setTimeout(() => {
        this.isLoading.set(false);
        // Handle success/error
      }, 2000);
    } else {
      this.markFormGroupTouched(this.joinRanchForm);
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

  /**
   * Add dynamic behavior to Join Ranch form
   */
  private setupJoinFormDynamicBehavior(): void {
    // Example: Auto-format invitation code to uppercase
    this.joinRanchForm
      .get('invitationCode')
      ?.valueChanges.subscribe((value) => {
        if (value && typeof value === 'string') {
          const formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (formattedValue !== value) {
            this.joinRanchForm
              .get('invitationCode')
              ?.setValue(formattedValue, { emitEvent: false });
          }
        }
      });

    // Example: Validate email format dynamically
    this.joinRanchForm
      .get('ranchOwnerEmail')
      ?.valueChanges.subscribe((email) => {
        if (email) {
          // Could add custom validation logic here
        }
      });
  }
}

export const JOIN_RANCH_CONFIG: FormConfig = {
  title: 'Join Ranch',
  description: 'Enter your invitation details',
  fields: [
    {
      key: 'invitationCode',
      type: 'text',
      label: 'Invitation Code',
      placeholder: 'Enter invitation code (e.g., ABC123DEF)',
      required: true,
      pattern: '^[A-Z0-9]+$',
      minLength: 6,
      description: 'Ask your ranch manager for the invitation code',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 0H9"/></svg>',
    },
    {
      key: 'ranchOwnerEmail',
      type: 'email',
      label: 'Ranch Owner Email',
      placeholder: 'ranch.owner@example.com',
      description: 'This helps verify the invitation (Optional)',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/></svg>',
    },
    {
      key: 'userRole',
      type: 'select',
      label: 'Your Role',
      placeholder: 'Select your role',
      required: true,
      options: [
        { value: 'manager', label: 'Ranch Manager' },
        { value: 'foreman', label: 'Foreman' },
        { value: 'worker', label: 'Ranch Hand' },
        { value: 'veterinarian', label: 'Veterinarian' },
        { value: 'family', label: 'Family Member' },
        { value: 'other', label: 'Other' },
      ],
    },
  ],
  submitButtonText: 'Join Ranch',
  submitButtonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  layout: 'vertical',
};
