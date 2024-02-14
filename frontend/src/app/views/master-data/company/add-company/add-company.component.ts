import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent {
  addCompanyForm!: FormGroup;
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
    private router: Router
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.createForm();
  }

  createForm() {
    this.addCompanyForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.formControls = Object.keys(this.addCompanyForm.controls);
  }

  onReset() {
    this.submitted = false;
    this.addCompanyForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.addCompanyForm.status === 'VALID';
    console.log(this.addCompanyForm);
  }

  onSubmit() {
    console.warn(this.onValidate(), this.addCompanyForm.value);
    if (this.onValidate()) {
      // TODO: Submit form value
      console.warn(this.addCompanyForm.value);
      debugger;
    //   this.companyService.createCompany(
    //     this.addCompanyForm.value
    //   ).subscribe({
    //     next: (response: any) => {
    //       if (response.isSuccess == true || response.statusCode == 201) {
    //         // alert('SUCCESS!');
    //         this.router
    //           .navigateByUrl('/master-data/companies')
    //           .then(() => {
    //             debugger;
    //             this.toastrColor = 'success';
    //             this.messages.push('Successfully added the Company');
    //             this.visible = true;
    //           });
    //       }
    //     },
    //     error: (error: any) => {
    //       this.toastrColor = 'danger';
    //       this.visible = true;
    //       if (error.error.CustomError) {
    //         this.messages.push(error.error.CustomError);
    //       } else {
    //         if (error.error.errors) {
    //           this.messages = error.error.errors;
    //         } else {
    //           this.messages.push(error.error);
    //         }
    //       }
    //     },
    //   });
    }
  }
}
