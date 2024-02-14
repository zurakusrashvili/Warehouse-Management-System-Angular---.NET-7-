import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Supplier } from '@app/_shared/models/master-data/supplier.model';
import { SupplierService } from '@app/_shared/services/supplier.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss']
})
export class AddSupplierComponent {
  addSupplierForm: FormGroup = new FormGroup({});
  submitted = false;
  formErrors: any;
  formControls!: string[];
  supplierId: number = 0;
  supplier!: Supplier;
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
    private supplierService: SupplierService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
  }
  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.addSupplierForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required]      
    });
    this.formControls = Object.keys(this.addSupplierForm.controls);
  }

  onReset() {
    this.submitted = false;
    this.addSupplierForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.addSupplierForm.status === 'VALID';
  }

  onSubmit() {
    this.errorMessages = [];
    // console.warn(this.onValidate(), this.addSupplierForm.value);

    if (this.onValidate()) {
      // TODO: Submit form value
      console.log(this.addSupplierForm.value);
      this.supplierService
        .createSupplier(this.addSupplierForm.value)
        .subscribe({
          next: (response: any) => {
            this.visible = true;
            this.toastrColor = 'success';
            this.errorMessages.push('Successfully created the supplier');
            this.router.navigateByUrl('/master-data/suppliers');
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
