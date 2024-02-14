import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCategoryService } from '@app/_shared/services/product-category.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-add-product-category',
  templateUrl: './add-product-category.component.html',
  styleUrls: ['./add-product-category.component.scss'],
})
export class AddProductCategoryComponent {
  addProductCategoryForm!: FormGroup;
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
    private router: Router
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.createForm();
  }

  createForm() {
    this.addProductCategoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
    });
    this.formControls = Object.keys(this.addProductCategoryForm.controls);
  }

  onReset() {
    this.submitted = false;
    this.addProductCategoryForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.addProductCategoryForm.status === 'VALID';
    console.log(this.addProductCategoryForm);
  }

  onSubmit() {
    console.warn(this.onValidate(), this.addProductCategoryForm.value);
    if (this.onValidate()) {
      // TODO: Submit form value
      console.warn(this.addProductCategoryForm.value);
      debugger;
      this.productCategoryService.createProductCategory(
        this.addProductCategoryForm.value
      ).subscribe({
        next: (response: any) => {
          if (response.isSuccess == true || response.statusCode == 201) {
            // alert('SUCCESS!');
            this.router
              .navigateByUrl('/master-data/product-categories')
              .then(() => {
                debugger;
                this.toastrColor = 'success';
                this.messages.push('Successfully added the ProductCategory');
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
