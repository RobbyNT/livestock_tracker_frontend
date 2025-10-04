import { Component, inject, OnInit } from '@angular/core';
import { AuthHelperService } from '../../services/auth-helper.service';
import { take } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class LoginComponent implements OnInit {
  private authHelperService = inject(AuthHelperService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  loginFormGroup: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/home';

  constructor() {
    this.loginFormGroup = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
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
    });
  }

  async ngOnInit() {
    // Get return URL from route parameters or default to '/home'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

    // Check if user is already logged in
    if (this.authHelperService.user()) {
      await this.router.navigate([this.returnUrl]);
    }
  }

  authZeroLogin() {
    this.authHelperService.authZeroLogin().pipe(take(1)).subscribe();
  }

  login() {
    if (this.loginFormGroup.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const { username, password } = this.loginFormGroup.value;

      this.authHelperService
        .login(username, password)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            console.log('Login successful:', response);
            this.isLoading = false;
            this.router.navigate([this.returnUrl]);
          },
          error: (error) => {
            console.error('Login failed:', error);
            this.isLoading = false;

            // Handle different error scenarios
            if (error.status === 401) {
              this.errorMessage = 'Invalid username or password';
            } else if (error.status === 0) {
              this.errorMessage = 'Unable to connect to server. Please try again.';
            } else {
              this.errorMessage = error.error?.message || 'Login failed. Please try again.';
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
    Object.keys(this.loginFormGroup.controls).forEach(key => {
      const control = this.loginFormGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for template
  get usernameErrors() {
    const control = this.loginFormGroup.get('username');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Username is required';
      if (control.errors['minlength']) return 'Username must be at least 3 characters';
      if (control.errors['maxlength']) return 'Username must not exceed 30 characters';
    }
    return null;
  }

  get passwordErrors() {
    const control = this.loginFormGroup.get('password');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Password is required';
      if (control.errors['minlength']) return 'Password must be at least 6 characters';
      if (control.errors['maxlength']) return 'Password must not exceed 50 characters';
    }
    return null;
  }

  clearError() {
    this.errorMessage = '';
  }
}
