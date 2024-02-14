import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Stand } from '@app/_shared/models/master-data/Stand.model';
import { Warehouse } from '@app/_shared/models/master-data/warehouse.model';
import { StandService } from '@app/_shared/services/stand.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { WarehouseService } from '@app/_shared/services/warehouse.service';
import { environment } from '@environment/environment.development';

@Component({
  selector: 'app-edit-delete-stand',
  templateUrl: './edit-delete-stand.component.html',
  styleUrls: ['./edit-delete-stand.component.scss']
})
export class EditDeleteStandComponent {

  imageBaseUrl = environment.appUrl + '/resources/';

  editStandForm: FormGroup = new FormGroup({});
  submitted = false;
  formErrors: any;
  formControls!: string[];
  standId: number = 0;
  stand!: Stand;
  warehouse!: Warehouse;
  errorMessages: string[] = [];
  editPage: boolean = true;
  colorButton: string = '';
  warehouses: Warehouse[] = [];

  // toastr
  toastrColor: string = '';
  position = 'top-end';
  visible = false;

  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private warehouseService: WarehouseService,
    private standService: StandService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.getAllWarehouses();
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.standId = Number(paramMap.get('id'));
      this.standService
        .getStand(this.standId)
        .subscribe({
          next: (response: any) => {
            this.stand = response.result;
            this.buildForm();
          },
          error: (error: any) => {
            console.log(error);
          },
        });
    });

    let title = this.activatedRoute.snapshot.data['title'];
    
    if (title == 'Delete Stand') {
      this.editPage = false;
      this.colorButton = 'danger';
    } else {
      this.editPage = true;
      this.colorButton = 'success';
    }
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

  buildForm() {
    this.editStandForm = this.formBuilder.group({
      id: [this.stand.id],
      warehouseId: [this.warehouse, [Validators.required]],
      standName: [this.stand.standName, [Validators.required]],
    });
    this.formControls = Object.keys(this.editStandForm.controls);

    //false for delete page
    if (this.editPage == false) {
      this.editStandForm.get('warehouseId')?.disable();
      this.editStandForm.get('standName')?.disable();
    }
  }

  onReset() {
    this.submitted = false;
    this.editStandForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.editStandForm.status === 'VALID';
  }

  onSubmit() {
    // console.warn(this.onValidate(), this.editStandForm.value);
    this.submitted = true;
    if (this.onValidate()) {
      // TODO: Submit form value
      console.log(this.editStandForm.value);

      if (this.editPage) {
        //Edit page
        this.standService
          .updateStand(this.editStandForm.value)
          .subscribe({
            next: (response: any) => {
              
              this.toastrColor = 'success';
              this.errorMessages.push(
                'Successfully edited the stand'
              );
              this.router.navigateByUrl('/master-data/stands');
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
        this.standService
          .deleteStand(this.editStandForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.errorMessages.push(
                'Successfully deleted the stand'
              );
              this.router.navigateByUrl('/master-data/stands');
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
