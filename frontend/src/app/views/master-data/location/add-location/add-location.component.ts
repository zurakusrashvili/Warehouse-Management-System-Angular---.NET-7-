import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Stand } from '@app/_shared/models/master-data/Stand.model';
import { Warehouse } from '@app/_shared/models/master-data/warehouse.model';
import { LocationService } from '@app/_shared/services/location.service';
import { StandService } from '@app/_shared/services/stand.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { WarehouseService } from '@app/_shared/services/warehouse.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent {
  addLocationForm!: FormGroup;
  stands: Stand[] = []
  filteredStands: Stand[] = []
  submitted = false;
  formErrors: any;
  warehouses!: Warehouse[];
  formControls!: string[];
  messages: string[] = [];

  // toastr
  toastrColor: string = '';
  position = 'top-end';
  visible = false;

  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private standService: StandService,
    private locationService: LocationService,
    private warehouseService: WarehouseService,
    private router: Router
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.createForm();
    this.getAllStands();
  }

  createForm() {
    this.addLocationForm = this.formBuilder.group({
      warehouseId: ['', [Validators.required]],
      standId: ['', [Validators.required]],
      shelfNumber: ['', [Validators.required]],
      placeNumber: ['', [Validators.required]],
    });
    this.formControls = Object.keys(this.addLocationForm.controls);
    this.addLocationForm.get('warehouseId')!.valueChanges.subscribe(selectedId => {
      this.filterStands(selectedId);
    });
    this.getAllWarehouses();
  }

  filterStands(selectedId: any) {
    // Assuming your subcategory model has a property that links to the category, e.g., categoryId
    this.filteredStands = this.stands.filter(s => s.warehouseId === selectedId);
  }

  getAllStands() {
    this.standService.getAllStands().subscribe({
      next: (response: any) => {
        this.stands = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getAllWarehouses() {
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
    this.addLocationForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.addLocationForm.status === 'VALID';
    console.log(this.addLocationForm);
  }

  onSubmit() {
    console.warn(this.onValidate(), this.addLocationForm.value);
    if (this.onValidate()) {
      // TODO: Submit form value
      console.warn(this.addLocationForm.value);
      this.locationService.createLocation(
        this.addLocationForm.value
      ).subscribe({
        next: (response: any) => {
          if (response.isSuccess == true || response.statusCode == 201) {
            // alert('SUCCESS!');
            this.router
              .navigateByUrl('/master-data/locations')
              .then(() => {
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
