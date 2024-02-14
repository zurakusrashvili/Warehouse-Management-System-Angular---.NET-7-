import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { AuthService } from '@app/_shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];
  messages: string[] = [];

  // toastr
  toastrColor: string = '';
  position = 'top-end';
  visible = false;

  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private router: Router,
    private authService: AuthService
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.formControls = Object.keys(this.loginForm.controls);
  }
  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.loginForm.status === 'VALID';
    console.log(this.loginForm);
  }

  onSubmit() {
    console.warn(this.onValidate(), this.loginForm.value);
    if (this.onValidate()) {
      // TODO: Submit form value
      console.warn(this.loginForm.value);
      this.authService.login(
        this.loginForm.value
      ).subscribe({
        next: (response: any) => {
          this.authService.isLoggedIn = true;
            this.router
              .navigateByUrl('/dashboard')
              .then(() => {
                this.toastrColor = 'success';
                this.messages.push('Successfully Logged In');
                this.visible = true;
              });
          
        },
        error: (error: any) => {
          this.toastrColor = 'danger';
          this.visible = true;
          if (error.error.CustomError) {
            this.messages.push(error.error.CustomError);
          } else {
            if (error.error.errors) {
              this.messages = error.error.errors;
            } else {
              this.messages.push(error.error);
            }
          }
        },
      });
    }
  }
}
