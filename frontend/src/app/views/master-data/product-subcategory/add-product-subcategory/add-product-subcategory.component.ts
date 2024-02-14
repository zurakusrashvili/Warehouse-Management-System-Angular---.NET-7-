import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCategory } from '@app/_shared/models/master-data/product-category.model';
import { ProductCategoryService } from '@app/_shared/services/product-category.service';
import { SubcategoryService } from '@app/_shared/services/subcategory.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-add-product-subcategory',
  templateUrl: './add-product-subcategory.component.html',
  styleUrls: ['./add-product-subcategory.component.scss']
})
export class AddProductSubcategoryComponent {
  addProductSubcategoryForm!: FormGroup;
  productCategories: ProductCategory[] = []
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
    private productCategoryService: ProductCategoryService,
    private productSubcategoryService: SubcategoryService,
    private router: Router
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.createForm();
    this.getAllProductCategories();
  }

  createForm() {
    this.addProductSubcategoryForm = this.formBuilder.group({
      productCategoryId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
    });
    this.formControls = Object.keys(this.addProductSubcategoryForm.controls);
  }

  getAllProductCategories() {
    this.productCategoryService.getAllProductCategories().subscribe({
      next: (response: any) => {
        this.productCategories = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  onReset() {
    this.submitted = false;
    this.addProductSubcategoryForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.addProductSubcategoryForm.status === 'VALID';
    console.log(this.addProductSubcategoryForm);
  }

  onSubmit() {
    console.warn(this.onValidate(), this.addProductSubcategoryForm.value);
    if (this.onValidate()) {
      // TODO: Submit form value
      console.warn(this.addProductSubcategoryForm.value);
      debugger;
      this.productSubcategoryService.createSubcategory(
        this.addProductSubcategoryForm.value
      ).subscribe({
        next: (response: any) => {
          if (response.isSuccess == true || response.statusCode == 201) {
            // alert('SUCCESS!');
            this.router
              .navigateByUrl('/master-data/product-subcategories')
              .then(() => {
                debugger;
                this.toastrColor = 'success';
                this.messages.push('Successfully added the ProductSubcategory');
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
