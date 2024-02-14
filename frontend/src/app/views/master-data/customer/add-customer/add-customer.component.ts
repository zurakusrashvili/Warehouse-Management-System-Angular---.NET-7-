import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '@app/_shared/models/master-data/customer.model';
import { CustomerService } from '@app/_shared/services/customer.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
  addCustomerForm: FormGroup = new FormGroup({});
  submitted = false;
  formErrors: any;
  formControls!: string[];
  customerId: number = 0;
  customer!: Customer;
  errorMessages: string[] = [];
  editPage: boolean = true;
  colorButton: string = '';

  // toastr
  toastrColor: string = '';
  position = 'top-end';
  visible = false;

  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private customerService: CustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
  }
  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.addCustomerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required]      
    });
    this.formControls = Object.keys(this.addCustomerForm.controls);
  }

  onReset() {
    this.submitted = false;
    this.addCustomerForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.addCustomerForm.status === 'VALID';
  }

  onSubmit() {
    this.errorMessages = [];
    // console.warn(this.onValidate(), this.addCustomerForm.value);

    if (this.onValidate()) {
      // TODO: Submit form value
      console.log(this.addCustomerForm.value);
      this.customerService
        .createCustomer(this.addCustomerForm.value)
        .subscribe({
          next: (response: any) => {
            this.visible = true;
            this.toastrColor = 'success';
            this.errorMessages.push('Successfully created the customer');
            this.router.navigateByUrl('/master-data/customers');
          },
          error: (error: any) => {
            this.toastrColor = 'danger';
            this.visible = true;
            if (error.error.CustomError) {
              this.errorMessages.push(error.error.CustomError);
            } else {
              if (error.error.errors) {
                this.errorMessages = error.error.errors;
              } else {
                this.errorMessages.push(error.error);
              }
            }
          },
        });
    }
  }
}
