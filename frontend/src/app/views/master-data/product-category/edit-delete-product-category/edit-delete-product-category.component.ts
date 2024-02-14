import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductCategory } from '@app/_shared/models/master-data/product-category.model';
import { ProductCategoryService } from '@app/_shared/services/product-category.service';

import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { environment } from '@environment/environment.development';

@Component({
  selector: 'app-edit-delete-product-category',
  templateUrl: './edit-delete-product-category.component.html',
  styleUrls: ['./edit-delete-product-category.component.scss'],
})
export class EditDeleteProductCategoryComponent implements OnInit {
  imageBaseUrl = environment.appUrl + '/resources/';

  editProductCategoryForm: FormGroup = new FormGroup({});
  submitted = false;
  formErrors: any;
  formControls!: string[];
  productCategoryId: number = 0;
  productCategory!: ProductCategory;
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
    private productCategoryService: ProductCategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.productCategoryId = Number(paramMap.get('id'));
      this.productCategoryService
        .getProductCategory(this.productCategoryId)
        .subscribe({
          next: (response: any) => {
            this.productCategory = response.result;
            this.buildForm();
          },
          error: (error: any) => {
            console.log(error);
          },
        });
    });

    let title = this.activatedRoute.snapshot.data['title'];
    debugger;
    if (title == 'Delete Product Category') {
      this.editPage = false;
      this.colorButton = 'danger';
    } else {
      this.editPage = true;
      this.colorButton = 'success';
    }
  }

  buildForm() {
    this.editProductCategoryForm = this.formBuilder.group({
      id: [this.productCategory.id],
      name: [this.productCategory.name, [Validators.required]],
      description: [this.productCategory.description, [Validators.required]],
    });
    this.formControls = Object.keys(this.editProductCategoryForm.controls);

    //false for delete page
    if (this.editPage == false) {
      this.editProductCategoryForm.get('name')?.disable();
      this.editProductCategoryForm.get('description')?.disable();
    }
  }

  onReset() {
    this.submitted = false;
    this.editProductCategoryForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.editProductCategoryForm.status === 'VALID';
  }

  onSubmit() {
    // console.warn(this.onValidate(), this.editProductCategoryForm.value);
    this.submitted = true;
    if (this.onValidate()) {
      // TODO: Submit form value
      console.log(this.editProductCategoryForm.value);

      if (this.editPage) {
        //Edit page
        this.productCategoryService
          .updateProductCategory(this.editProductCategoryForm.value)
          .subscribe({
            next: (response: any) => {
              debugger;
              this.toastrColor = 'success';
              this.errorMessages.push(
                'Successfully edited the productCategory'
              );
              this.router.navigateByUrl('/master-data/product-categories');
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
        this.productCategoryService
          .deleteProductCategory(this.editProductCategoryForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.errorMessages.push(
                'Successfully deleted the productCategory'
              );
              this.router.navigateByUrl('/master-data/product-categories');
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
