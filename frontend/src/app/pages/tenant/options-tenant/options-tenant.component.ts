import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { JoinTenantComponent } from '../join-tenant/join-tenant.component';
import { NewTenantComponent } from '../new-tenant/new-tenant.component';

@Component({
  selector: 'app-options-tenant',
  templateUrl: './options-tenant.component.html',
  styleUrls: ['./options-tenant.component.css'],
  imports: [ReactiveFormsModule, JoinTenantComponent, NewTenantComponent],
})
export class TenantOptions implements OnInit {
  // Form instances
  joinRanchForm!: FormGroup;
  createRanchForm!: FormGroup;

  // UI state variables
  showJoinForm = false;
  showCreateForm = false;
  showSelection = true;
  selectionStep = 1;
  loading = false;

  constructor(private fb: FormBuilder) {
    // Build both forms in constructor
  }

  ngOnInit(): void {
    // Any additional initialization
  }

  selectJoinRanch() {
    this.showJoinForm = true;
    this.showSelection = false;
    this.selectionStep = 2;
  }
  selectCreateRanch() {
    this.showCreateForm = true;
    this.showSelection = false;
    this.selectionStep = 2;
  }

  back() {
    this.showJoinForm = false;
    this.showCreateForm = false;
    this.showSelection = true;
    this.selectionStep = 1;
  }
}
