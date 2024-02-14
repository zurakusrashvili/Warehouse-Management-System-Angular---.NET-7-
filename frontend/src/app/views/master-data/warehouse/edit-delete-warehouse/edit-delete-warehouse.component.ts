import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Warehouse } from '@app/_shared/models/master-data/warehouse.model';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { WarehouseService } from '@app/_shared/services/warehouse.service';

@Component({
  selector: 'app-edit-delete-warehouse',
  templateUrl: './edit-delete-warehouse.component.html',
  styleUrls: ['./edit-delete-warehouse.component.scss']
})
export class EditDeleteWarehouseComponent {
  editWarehouseForm: FormGroup = new FormGroup({});
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
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.warehouseId = Number(paramMap.get('id'));
      this.warehouseService.getWarehouse(this.warehouseId).subscribe({
        next: (response: any) => {
          this.warehouse = response.result;
          this.buildForm();
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    });

    let title = this.activatedRoute.snapshot.data['title'];
    
    if (title == 'Delete Warehouse') {
      this.editPage = false;
      this.colorButton = 'danger';
    } else {
      this.editPage = true;
      this.colorButton = 'success';
    }
  }

  buildForm() {
    this.editWarehouseForm = this.formBuilder.group({
      id: [this.warehouse.id],
      name: [this.warehouse.name, [Validators.required]],
      address: [this.warehouse.address, [Validators.required]],
      phoneNumber: [this.warehouse.phoneNumber],
    });
    this.formControls = Object.keys(this.editWarehouseForm.controls);

    //false for delete page
    if (this.editPage == false) {
      this.editWarehouseForm.get('name')?.disable();
      this.editWarehouseForm.get('address')?.disable();
      this.editWarehouseForm.get('phoneNumber')?.disable();
    }
  }

  onReset() {
    this.submitted = false;
    this.editWarehouseForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.editWarehouseForm.status === 'VALID';
  }

  onSubmit() {
    // console.warn(this.onValidate(), this.editWarehouseForm.value);
    this.submitted = true;
    if (this.onValidate()) {
      // TODO: Submit form value
      console.log(this.editWarehouseForm.value);

      if (this.editPage) {
        //Edit page
        this.warehouseService
          .updateWarehouse(this.editWarehouseForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.errorMessages.push('Successfully edited the warehouse');
              this.router.navigateByUrl('/master-data/warehouses');
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
        this.warehouseService
          .deleteWarehouse(this.editWarehouseForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.errorMessages.push('Successfully deleted the warehouse');
              this.router.navigateByUrl('/master-data/warehouses');
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
