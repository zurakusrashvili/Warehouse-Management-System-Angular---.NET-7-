import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordValidator } from '@app/_shared/helpers/password.validator';
import { Customer } from '@app/_shared/models/master-data/customer.model';
import { CustomerService } from '@app/_shared/services/customer.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-edit-delete-customer',
  templateUrl: './edit-delete-customer.component.html',
  styleUrls: ['./edit-delete-customer.component.scss'],
})
export class EditDeleteCustomerComponent implements OnInit {
  editCustomerForm: FormGroup = new FormGroup({});
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
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.customerId = Number(paramMap.get('id'));
      this.customerService.getCustomer(this.customerId).subscribe({
        next: (response: any) => {
          this.customer = response.result;
          this.buildForm();
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    });

    let title = this.activatedRoute.snapshot.data['title'];
    
    if (title == 'Delete Customer') {
      this.editPage = false;
      this.colorButton = 'danger';
    } else {
      this.editPage = true;
      this.colorButton = 'success';
    }
  }

  buildForm() {
    this.editCustomerForm = this.formBuilder.group({
      id: [this.customer.id],
      name: [this.customer.name, [Validators.required]],
      address: [this.customer.address, [Validators.required]],
      phoneNumber: [this.customer.phoneNumber],
    });
    this.formControls = Object.keys(this.editCustomerForm.controls);

    //false for delete page
    if (this.editPage == false) {
      this.editCustomerForm.get('name')?.disable();
      this.editCustomerForm.get('address')?.disable();
      this.editCustomerForm.get('phoneNumber')?.disable();
    }
  }

  onReset() {
    this.submitted = false;
    this.editCustomerForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.editCustomerForm.status === 'VALID';
  }

  onSubmit() {
    // console.warn(this.onValidate(), this.editCustomerForm.value);
    this.submitted = true;
    if (this.onValidate()) {
      // TODO: Submit form value
      console.log(this.editCustomerForm.value);

      if (this.editPage) {
        //Edit page
        this.customerService
          .updateCustomer(this.editCustomerForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.errorMessages.push('Successfully edited the customer');
              this.router.navigateByUrl('/master-data/customers');
            },
            error: (error: any) => {
              this.toastrColor = 'danger';
              if (error.error.errors) {
                this.errorMessages = error.error.errors;
              } else {
                this.errorMessages.push(error.error);
              }
            },
          });
      }

      // Delete Page
      else {
        this.customerService
          .deleteCustomer(this.editCustomerForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.errorMessages.push('Successfully deleted the customer');
              this.router.navigateByUrl('/master-data/customers');
            },
            error: (error: any) => {
              this.toastrColor = 'danger';
              if (error.error.errors) {
                this.errorMessages = error.error.errors;
              } else {
                this.errorMessages.push(error.error);
              }
            },
          });
      }
    }
  }
}
