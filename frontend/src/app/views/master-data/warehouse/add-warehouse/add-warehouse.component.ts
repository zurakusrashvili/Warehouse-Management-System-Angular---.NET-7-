import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Warehouse } from '@app/_shared/models/master-data/warehouse.model';
import { WarehouseService } from '@app/_shared/services/warehouse.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-add-warehouse',
  templateUrl: './add-warehouse.component.html',
  styleUrls: ['./add-warehouse.component.scss']
})
export class AddWarehouseComponent {
  addWarehouseForm: FormGroup = new FormGroup({});
  submitted = false;
  formErrors: any;
  formControls!: string[];
  warehouseId: number = 0;
  warehouse!: Warehouse;
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
    private warehouseService: WarehouseService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
  }
  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.addWarehouseForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required]      
    });
    this.formControls = Object.keys(this.addWarehouseForm.controls);
  }

  onReset() {
    this.submitted = false;
    this.addWarehouseForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.addWarehouseForm.status === 'VALID';
  }

  onSubmit() {
    this.errorMessages = [];
    // console.warn(this.onValidate(), this.addWarehouseForm.value);

    if (this.onValidate()) {
      // TODO: Submit form value
      console.log(this.addWarehouseForm.value);
      this.warehouseService
        .createWarehouse(this.addWarehouseForm.value)
        .subscribe({
          next: (response: any) => {
            this.visible = true;
            this.toastrColor = 'success';
            this.errorMessages.push('Successfully created the warehouse');
            this.router.navigateByUrl('/master-data/warehouses');
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
