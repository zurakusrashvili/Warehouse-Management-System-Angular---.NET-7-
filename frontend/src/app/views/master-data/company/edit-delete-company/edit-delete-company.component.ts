import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// import { Company } from '@app/_shared/models/master-data/company.model';
// import { CompanyService } from '@app/_shared/services/company.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-edit-delete-company',
  templateUrl: './edit-delete-company.component.html',
  styleUrls: ['./edit-delete-company.component.scss']
})
export class EditDeleteCompanyComponent implements OnInit {
  
  // editCompanyForm: FormGroup = new FormGroup({});
  // submitted = false;
  // formErrors: any;
  // formControls!: string[];
  // companyId:number = 0;
  // company!: Company;
  // errorMessages: string[] = [];
  // editPage: boolean = true;
  // colorButton: string = '';

  // // toastr
  // toastrColor: string = '';
  // position = 'top-end';
  // visible = false;


  // constructor(
  //   private formBuilder: FormBuilder,
  //   public validationFormsService: ValidationFormsService,
  //   private companyService: CompanyService,
  //   private router: Router,
  //   private activatedRoute: ActivatedRoute
  // ) {
  //   this.formErrors = this.validationFormsService.errorMessages;
  // }
  ngOnInit(): void {
    // this.activatedRoute.paramMap.subscribe((paramMap) => {
    //   this.companyId = Number(paramMap.get('id'));
    //   this.companyService.getCompany(this.companyId).subscribe({
    //     next: (response: any) => {
    //       this.company = response.result;
    //       this.buildForm();
    //     },
    //     error: (error: any) => {
    //       console.log(error);
    //     },
    //   });
    // });

    // let title = this.activatedRoute.snapshot.data['title'];
    // debugger;
    // if (title == 'Delete Product Category') {
    //   this.editPage = false;
    //   this.colorButton = 'danger';
    // } else {
    //   this.editPage = true;
    //   this.colorButton = 'success';
    // }
  }

  // buildForm() {
  //   this.editCompanyForm = this.formBuilder.group({
  //     id: [this.company.id],
  //     name: [this.company.name, [Validators.required]],
  //     description: [this.company.description, [Validators.required]],

  //   });
  //   this.formControls = Object.keys(this.editCompanyForm.controls);

  //   //false for delete page
  //   if (this.editPage == false) {
  //     this.editCompanyForm.get('name')?.disable();
  //     this.editCompanyForm.get('description')?.disable();

  //   }
  // }

  // onReset() {
  //   this.submitted = false;
  //   this.editCompanyForm.reset();
  // }

  // onValidate() {
  //   this.submitted = true;

  //   // stop here if form is invalid
  //   return this.editCompanyForm.status === 'VALID';
  // }

  // onSubmit() {
  //   // console.warn(this.onValidate(), this.editCompanyForm.value);
  //   this.submitted = true;
  //   if (this.onValidate()) {
  //     // TODO: Submit form value
  //     console.log(this.editCompanyForm.value);

  //     if (this.editPage) {
  //       //Edit page
  //       this.companyService
  //         .updateCompany(this.editCompanyForm.value)
  //         .subscribe({
  //           next: (response: any) => {
  //             debugger;
  //             this.toastrColor = 'success';
  //             this.errorMessages.push('Successfully edited the company');
  //             this.router.navigateByUrl('/master-data/companies');
  //           },
  //           error: (error: any) => {
  //             this.toastrColor = 'danger';
  //             if (error.error.errors) {
  //               this.errorMessages = error.error.errors;
  //             } else {
  //               this.errorMessages.push(error.error);
  //             }
  //           },
  //         });
  //     }

  //     // Delete Page
  //     else {
  //       this.companyService
  //         .deleteCompany(this.editCompanyForm.value)
  //         .subscribe({
  //           next: (response: any) => {
  //             this.toastrColor = 'success';
  //             this.errorMessages.push('Successfully deleted the company');
  //             // this.router.navigateByUrl('/master-data/companys');
  //           },
  //           error: (error: any) => {
  //             this.toastrColor = 'danger';
  //             if (error.error.errors) {
  //               this.errorMessages = error.error.errors;
  //             } else {
  //               this.errorMessages.push(error.error);
  //             }
  //           },
  //         });
  //     }
  //   }
  // }
}
