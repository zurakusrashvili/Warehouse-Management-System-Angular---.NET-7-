import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Supplier } from '@app/_shared/models/master-data/supplier.model';
import { SupplierService } from '@app/_shared/services/supplier.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.scss']
})
export class SupplierDetailsComponent {
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
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.supplierId = Number(paramMap.get('id'));
      this.supplierService
        .getSupplier(this.supplierId)
        .subscribe({
          next: (response: any) => {
            this.supplier = response.result;
            this.buildForm();
          },
          error: (error: any) => {
            console.log(error);
          },
        });
    });
  }

  buildForm() {
    this.addSupplierForm = this.formBuilder.group({
      name: [this.supplier.name, [Validators.required]],
      address: [this.supplier.address, Validators.required],
      phoneNumber: [this.supplier.phoneNumber, Validators.required]      
    });
    this.formControls = Object.keys(this.addSupplierForm.controls);

    this.addSupplierForm.get('name')?.disable();
    this.addSupplierForm.get('address')?.disable();
    this.addSupplierForm.get('phoneNumber')?.disable();
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


}
