import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Supplier } from '@app/_shared/models/master-data/supplier.model';
import { SupplierService } from '@app/_shared/services/supplier.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-edit-delete-supplier',
  templateUrl: './edit-delete-supplier.component.html',
  styleUrls: ['./edit-delete-supplier.component.scss']
})
export class EditDeleteSupplierComponent {
  editSupplierForm: FormGroup = new FormGroup({});
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
      this.supplierService.getSupplier(this.supplierId).subscribe({
        next: (response: any) => {
          this.supplier = response.result;
          this.buildForm();
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    });

    let title = this.activatedRoute.snapshot.data['title'];
    
    if (title == 'Delete Supplier') {
      this.editPage = false;
      this.colorButton = 'danger';
    } else {
      this.editPage = true;
      this.colorButton = 'success';
    }
  }

  buildForm() {
    this.editSupplierForm = this.formBuilder.group({
      id: [this.supplier.id],
      name: [this.supplier.name, [Validators.required]],
      address: [this.supplier.address, [Validators.required]],
      phoneNumber: [this.supplier.phoneNumber],
    });
    this.formControls = Object.keys(this.editSupplierForm.controls);

    //false for delete page
    if (this.editPage == false) {
      this.editSupplierForm.get('name')?.disable();
      this.editSupplierForm.get('address')?.disable();
      this.editSupplierForm.get('phoneNumber')?.disable();
    }
  }

  onReset() {
    this.submitted = false;
    this.editSupplierForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.editSupplierForm.status === 'VALID';
  }

  onSubmit() {
    // console.warn(this.onValidate(), this.editSupplierForm.value);
    this.submitted = true;
    if (this.onValidate()) {
      // TODO: Submit form value
      console.log(this.editSupplierForm.value);

      if (this.editPage) {
        //Edit page
        this.supplierService
          .updateSupplier(this.editSupplierForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.errorMessages.push('Successfully edited the supplier');
              this.router.navigateByUrl('/master-data/suppliers');
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
        this.supplierService
          .deleteSupplier(this.editSupplierForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.errorMessages.push('Successfully deleted the supplier');
              this.router.navigateByUrl('/master-data/suppliers');
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
