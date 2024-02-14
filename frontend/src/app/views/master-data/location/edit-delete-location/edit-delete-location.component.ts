import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Stand } from '@app/_shared/models/master-data/Stand.model';
import { Location } from '@app/_shared/models/master-data/location.model';
import { LocationService } from '@app/_shared/services/location.service';
import { StandService } from '@app/_shared/services/stand.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { environment } from '@environment/environment.development';

@Component({
  selector: 'app-edit-delete-location',
  templateUrl: './edit-delete-location.component.html',
  styleUrls: ['./edit-delete-location.component.scss']
})
export class EditDeleteLocationComponent {

  imageBaseUrl = environment.appUrl + '/resources/';

  editLocationForm: FormGroup = new FormGroup({});
  submitted = false;
  formErrors: any;
  formControls!: string[];
  locationId: number = 0;
  location!: Location;
  stand!: Stand;
  errorMessages: string[] = [];
  editPage: boolean = true;
  colorButton: string = '';
  stands: Stand[] = [];

  // toastr
  toastrColor: string = '';
  position = 'top-end';
  visible = false;

  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private standService: StandService,
    private locationService: LocationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.getAllStands();
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.locationId = Number(paramMap.get('id'));
      this.locationService
        .getLocation(this.locationId)
        .subscribe({
          next: (response: any) => {
            this.location = response.result;
            this.buildForm();
          },
          error: (error: any) => {
            console.log(error);
          },
        });
    });

    let title = this.activatedRoute.snapshot.data['title'];
    
    if (title == 'Delete Location') {
      this.editPage = false;
      this.colorButton = 'danger';
    } else {
      this.editPage = true;
      this.colorButton = 'success';
    }
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

  buildForm() {
    this.editLocationForm = this.formBuilder.group({
      id: [this.location.id],
      standId: [this.stand, [Validators.required]],
      shelfNumber: [this.location.shelfNumber, [Validators.required]],
      placeNumber: [this.location.placeNumber, [Validators.required]],
    });
    this.formControls = Object.keys(this.editLocationForm.controls);

    //false for delete page
    if (this.editPage == false) {
      this.editLocationForm.get('standId')?.disable();
      this.editLocationForm.get('locationName')?.disable();
    }
  }

  onReset() {
    this.submitted = false;
    this.editLocationForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.editLocationForm.status === 'VALID';
  }

  onSubmit() {
    // console.warn(this.onValidate(), this.editLocationForm.value);
    this.submitted = true;
    if (this.onValidate()) {
      // TODO: Submit form valueF
      console.log(this.editLocationForm.value);

      if (this.editPage) {
        //Edit page
        this.locationService
          .updateLocation(this.editLocationForm.value)
          .subscribe({
            next: (response: any) => {
              
              this.toastrColor = 'success';
              this.errorMessages.push(
                'Successfully edited the location'
              );
              this.router.navigateByUrl('/master-data/locations');
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
        this.locationService
          .deleteLocation(this.editLocationForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.errorMessages.push(
                'Successfully deleted the location'
              );
              this.router.navigateByUrl('/master-data/locations');
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
