import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Warehouse } from '@app/_shared/models/master-data/warehouse.model';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { WarehouseService } from '@app/_shared/services/warehouse.service';
import { StandService } from '@app/_shared/services/stand.service';

@Component({
  selector: 'app-add-stand',
  templateUrl: './add-stand.component.html',
  styleUrls: ['./add-stand.component.scss']
})
export class AddStandComponent {
  addStandForm!: FormGroup;
  warehouses: Warehouse[] = []
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
    private warehouseService: WarehouseService,
    private standService: StandService,
    private router: Router
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.createForm();
    this.getAllProductCategories();
  }

  createForm() {
    this.addStandForm = this.formBuilder.group({
      warehouseId: ['', [Validators.required]],
      standName: ['', [Validators.required]],
    });
    this.formControls = Object.keys(this.addStandForm.controls);
  }

  getAllProductCategories() {
    this.warehouseService.getAllWarehouses().subscribe({
      next: (response: any) => {
        this.warehouses = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  onReset() {
    this.submitted = false;
    this.addStandForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.addStandForm.status === 'VALID';
    console.log(this.addStandForm);
  }

  onSubmit() {
    console.warn(this.onValidate(), this.addStandForm.value);
    if (this.onValidate()) {
      // TODO: Submit form value
      console.warn(this.addStandForm.value);
      debugger;
      this.standService.createStand(
        this.addStandForm.value
      ).subscribe({
        next: (response: any) => {
          if (response.isSuccess == true || response.statusCode == 201) {
            // alert('SUCCESS!');
            this.router
              .navigateByUrl('/master-data/stands')
              .then(() => {
                debugger;
                this.toastrColor = 'success';
                this.messages.push('Successfully added the Stand');
                this.visible = true;
              });
          }
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
