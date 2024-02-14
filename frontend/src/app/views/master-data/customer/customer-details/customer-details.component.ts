import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '@app/_shared/models/master-data/customer.model';
import { CustomerService } from '@app/_shared/services/customer.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent {
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
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.customerId = Number(paramMap.get('id'));
      this.customerService
        .getCustomer(this.customerId)
        .subscribe({
          next: (response: any) => {
            this.customer = response.result;
            this.buildForm();
          },
          error: (error: any) => {
            console.log(error);
          },
        });
    });
  }

  buildForm() {
    this.addCustomerForm = this.formBuilder.group({
      name: [this.customer.name, [Validators.required]],
      address: [this.customer.address, Validators.required],
      phoneNumber: [this.customer.phoneNumber, Validators.required]      
    });
    this.formControls = Object.keys(this.addCustomerForm.controls);

    this.addCustomerForm.get('name')?.disable();
    this.addCustomerForm.get('address')?.disable();
    this.addCustomerForm.get('phoneNumber')?.disable();
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



}
