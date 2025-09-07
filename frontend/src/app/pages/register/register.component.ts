import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthHelperService } from '../../services/auth-helper.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'], 
  imports: [NgIf, ReactiveFormsModule]
})
export class RegisterComponent implements OnInit {
  private authHelperService = inject(AuthHelperService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  registerFormGroup: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/home';

  constructor() {
    this.registerFormGroup = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s'-]+$/)
        ]
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z\s'-]+$/)
        ]
      ],
      emailAddress: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.email
        ]
      ],
      phoneNumber: [
        '',
        [
          Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50),
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50),
        ]
      ],
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value !== confirmPassword.value ? { 'passwordMismatch': true } : null;
  }

  ngOnInit() {
    // Get return URL from route parameters or default to '/home'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    
    // Check if user is already logged in
    if (this.authHelperService.user()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  register() {
    if (this.registerFormGroup.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { firstName, lastName, emailAddress, phoneNumber } = this.registerFormGroup.value;
      
      // Call the register method with the required parameters
      this.authHelperService
        .register(firstName, lastName, emailAddress, phoneNumber || '')
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            this.isLoading = false;
            // You might want to redirect to login page or auto-login
            this.router.navigate(['/login']);
            // Or if auto-login after registration:
            // this.router.navigate([this.returnUrl]);
          },
          error: (error) => {
            console.error('Registration failed:', error);
            this.isLoading = false;
            
            // Handle different error scenarios
            if (error.status === 409) {
              this.errorMessage = 'An account with this email already exists';
            } else if (error.status === 400) {
              this.errorMessage = 'Invalid registration data. Please check your inputs.';
            } else if (error.status === 0) {
              this.errorMessage = 'Unable to connect to server. Please try again.';
            } else {
              this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
            }
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
      console.log('Form is invalid');
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.registerFormGroup.controls).forEach(key => {
      const control = this.registerFormGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for template
  get firstNameErrors() {
    const control = this.registerFormGroup.get('firstName');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'First name is required';
      if (control.errors['maxlength']) return 'First name must not exceed 50 characters';
      if (control.errors['pattern']) return 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return null;
  }

  get lastNameErrors() {
    const control = this.registerFormGroup.get('lastName');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Last name is required';
      if (control.errors['maxlength']) return 'Last name must not exceed 50 characters';
      if (control.errors['pattern']) return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return null;
  }

  get emailErrors() {
    const control = this.registerFormGroup.get('emailAddress');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Email address is required';
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['maxlength']) return 'Email address must not exceed 100 characters';
    }
    return null;
  }

  get phoneNumberErrors() {
    const control = this.registerFormGroup.get('phoneNumber');
    if (control?.errors && control.touched) {
      if (control.errors['pattern']) return 'Please enter a valid phone number';
    }
    return null;
  }

  get passwordErrors() {
    const control = this.registerFormGroup.get('password');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Password is required';
      if (control.errors['minlength']) return 'Password must be at least 6 characters';
      if (control.errors['maxlength']) return 'Password must not exceed 50 characters';
    }
    return null;
  }

  get confirmPasswordErrors() {
    const control = this.registerFormGroup.get('confirmPassword');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Please confirm your password';
      if (control.errors['minlength']) return 'Password must be at least 6 characters';
      if (control.errors['maxlength']) return 'Password must not exceed 50 characters';
    }
    
    // Check for password mismatch at form level
    if (this.registerFormGroup.errors?.['passwordMismatch'] && control?.touched) {
      return 'Passwords do not match';
    }
    
    return null;
  }

  clearError() {
    this.errorMessage = '';
  }
}