import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/_shared/services/auth.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm!: FormGroup;
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
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.formControls = Object.keys(this.registerForm.controls);
  }
  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.registerForm.status === 'VALID';
    console.log(this.registerForm);
  }

  onSubmit() {
    console.warn(this.onValidate(), this.registerForm.value);
    if (this.onValidate()) {
      // TODO: Submit form value
      console.warn(this.registerForm.value);
      this.authService.register(
        this.registerForm.value
      ).subscribe({
        next: (response: any) => {
            this.router
              .navigateByUrl('/login')
              .then(() => {
                this.toastrColor = 'success';
                this.messages.push('Successfully Created Account!!!');
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
